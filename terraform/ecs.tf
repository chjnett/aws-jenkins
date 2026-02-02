#여러 컨테이너들이 실행되는 울타리
#ecs cluster에서 fargate를 사용하면 서버리스로 운영


resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}
#컨테이너를 어떻게 실행할지 명세서
#requires_compatibilities = ["FARGATE"]
#서버리스형태로 가상 컨테이너 운영
#container_definitions
#docker 실행 옵션
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8000  # 백엔드 앱은 항상 8000포트에서 실행 (Dockerfile CMD 참고)
          hostPort      = 8000  # AWS에서는 8000번 그대로 노출, 로컬 개발(docker-compose)에서는 8001로 매핑
        }
      ]

      # 환경변수 설정 (배포 후 수정 필수!)
      environment = [
        { name = "SUPABASE_URL", value = "https://loohzspmcmafmxachwpg.supabase.co" },
        { name = "SUPABASE_KEY", value = "sb_publishable_9bo2qkG-FpOMYhax3yw_xA_muermteP" }
        # SECRET_KEY는 FastAPI JWT용 (필요시 추가)
        # { name = "SECRET_KEY", value = "your-random-secret-key-here" }
      ]
    }
  ])
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_c.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}
#desired_count=1 항상 1개의 task 유지
#컨테이너가 죽으면 자동으로 재시작
#load_balancer>>로드 밸런서와 연결해서 외부 트래픽을 컨테이너로 전달
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_c.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.http]
}
#depends_on 로드밸런서가 생성된 후에 실행되도록
#terraform의 의존성 관리
