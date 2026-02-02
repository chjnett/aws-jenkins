# 📊 시스템 모니터링 및 로그 확인 가이드

배포된 서비스(Energy Truck)의 상태를 확인하고, 에러 로그를 분석하는 방법입니다.
**AWS Web Console(웹사이트)**과 **AWS CLI(터미널)** 두 가지 방법을 모두 설명합니다.

---

## 🖥 1. AWS 웹 콘솔에서 확인하기 (GUI)

가장 직관적인 방법입니다.

### 1️⃣ 서비스 상태 확인 (서버가 살아있나?)
1.  **AWS Console** 접속 -> 검색창에 **ECS** 입력.
2.  **Clusters** -> **`energy-truck-cluster`** 클릭.
3.  **Services** 탭 확인:
    *   **Status**: `Active`여야 함.
    *   **Running tasks**: `1` (또는 설정한 개수)이어야 함. `0`이면 서버가 죽은 것입니다.

### 2️⃣ 실시간 로그 확인 (에러가 났나?)
서버가 켜지긴 했는데 사이트가 안 들어가진다면 100% 로그를 봐야 합니다.

1.  **Services** 탭에서 서비스 이름 클릭 (예: `energy-truck-backend-service`).
2.  **Logs** 탭 클릭.
3.  실시간으로 출력되는 서버 로그가 보입니다. (Python 에러, Next.js 빌드 에러 등)
    *   `Error`, `Exception`, `Faillure` 같은 단어를 찾으세요.

### 3️⃣ 로드밸런서 상태 (연결이 잘 되나?)
1.  **EC2** 검색 -> 왼쪽 메뉴 하단 **Load Balancers** 클릭.
2.  **Target Groups** 클릭.
3.  Target Group 선택 (예: `energy-truck-backend-tg`).
4.  하단 **Targets** 탭 확인.
    *   **Health Status**: **`healthy`**여야 정상입니다.
    *   `unhealthy`: 서버는 떴는데 응답을 안 하는 상태 (주로 포트 설정 문제나 코드 에러).
    *   `draining`: 서버가 내려가는 중.
    *   `initial`: 막 켜져서 검사 중.

---

## ⌨️ 2. 터미널에서 확인하기 (CLI)

개발자스럽고 빠른 방법입니다. `aws` 명령어를 사용합니다.

### 1️⃣ 로그 실시간 테일링 (추천 ⭐)
터미널에서 바로 서버 로그를 실시간으로 볼 수 있습니다. (리눅스 `tail -f`와 비슷)

```bash
# 백엔드 로그 보기 (Ctrl+C로 종료)
# 로그 그룹 이름은 보통 '/ecs/TaskDefinitionFamily이름' 입니다. 
# 정확한 그룹명은 콘솔 CloudWatch -> Log groups에서 확인 가능합니다.
# 현재 설정상 로그 그룹이 자동 생성되지 않았을 수 있으므로 확인이 필요합니다.
```

> **참고**: 현재 Terraform 코드(`ecs.tf`)에는 `awslogs` 드라이버 설정이 명시적으로 보이지 않습니다.
> Fargate는 기본적으로 로그를 CloudWatch에 남기려면 `logConfiguration` 설정이 필요합니다.
> **만약 콘솔의 Logs 탭에 " No logs found"라고 뜬다면, 아래 설정을 추가하고 다시 배포해야 로그가 보입니다.**

---

## 🛠 필수: 로그 설정 추가하기 (Terraform 수정)

현재 상태로는 로그가 안 보일 수 있습니다. `ecs.tf`를 수정하여 로그를 **CloudWatch**로 보내도록 설정해야 합니다.

### `terraform/ecs.tf` 수정 (예시)

```hcl
# 1. 로그 그룹 생성 리소스 추가
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}-backend"
  retention_in_days = 7
}

# 2. Task Definition에 logConfiguration 추가
container_definitions = jsonencode([
  {
    name  = "backend"
    # ... 기존 설정 ...
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.project_name}-backend"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }
])
```

이 설정을 적용(`terraform apply`)해야 **Logs** 탭에서 로그가 보입니다.
