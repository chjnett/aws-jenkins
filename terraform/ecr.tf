# ----------------------------------------------------------------------------------------------------
# ECR (Elastic Container Registry) 설정
# Docker 이미지를 저장하는 AWS의 관리형 컨테이너 레지스트리입니다.
# Jenkins가 빌드한 이미지를 이곳에 Push(업로드)하고, ECS가 이곳에서 이미지를 Pull(다운로드)하여 실행합니다.
# ----------------------------------------------------------------------------------------------------

# 프론트엔드용 이미지 저장소
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend" # 저장소 이름 (예: energy-truck-frontend)
  image_tag_mutability = "MUTABLE"                      # 태그 덮어쓰기 허용 (latest 태그를 계속 갱신하기 위함)

  # 이미지 스캔 설정 (보안 취약점 검사)
  image_scanning_configuration {
    scan_on_push = true # 이미지가 푸시될 때마다 자동으로 취약점 스캔을 실행합니다.
  }
}

# 백엔드용 이미지 저장소
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend" # 저장소 이름 (예: energy-truck-backend)
  image_tag_mutability = "MUTABLE"                     # 태그 덮어쓰기 허용

  # 이미지 스캔 설정
  image_scanning_configuration {
    scan_on_push = true # 보안을 위해 업로드 시 자동 스캔 활성화
  }
}
