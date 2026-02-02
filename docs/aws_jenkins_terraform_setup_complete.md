# 🚀 AWS + Terraform + Jenkins 완전 정복 가이드

이 문서는 **AWS 계정 생성부터 Jenkins 자동 배포 시스템 구축**까지의 모든 과정을 단계별로 정리한 통합 가이드입니다.
이 가이드를 처음부터 끝까지 따라 하면 배포 가능한 인프라와 CI/CD 파이프라인이 완성됩니다.

---

## 🏛 Phase 1: AWS 초기 설정 (Completed)

> **상태**: 이미 완료하셨습니다. (IAM User: `terraform-deploy`)

### 핵심 요약
1.  **IAM User 생성**: `terraform-deploy`
2.  **권한 부여**: `AdministratorAccess` (모든 리소스 관리 권한)
3.  **Access Key 발급**: `AKIA...` (액세스 키 ID) 및 비밀 키 확보
4.  **CSV 파일 저장**: `new_user_credentials.csv` 보관 중

---

## 💻 Phase 2: 로컬 Terraform 환경 구성 (Completed)

> **상태**: 로컬 터미널에서 `terraform init`까지 완료했습니다.

### 1. 환경 변수 설정 (터미널)
터미널을 새로 열었다면 다시 입력해야 합니다.

```bash
export AWS_ACCESS_KEY_ID=AKIA...[본인의_키_입력]
export AWS_SECRET_ACCESS_KEY=...[본인의_시크릿_키_입력]
export AWS_REGION=ap-northeast-2
```

### 2. Terraform 초기화
```bash
cd terraform
terraform init
```
*   `Terraform has been successfully initialized!` 메시지 확인.

---

## 🏗 Phase 3: 인프라 배포 (Terraform Apply)

이제 실제로 AWS에 서버와 네트워크를 생성합니다. **반드시 순서를 지켜주세요.**

### Step 1: ECR (이미지 저장소) 먼저 생성
ECS(서버)가 뜨려면 이미지가 있어야 하고, 이미지를 올리려면 저장소(ECR)가 필요합니다.

```bash
# ECR 리소스만 타겟팅해서 먼저 생성
terraform apply -target=aws_ecr_repository.frontend -target=aws_ecr_repository.backend
```
*   `Enter a value: yes` 입력.
*   완료 후 출력(Outputs)에 나온 **ECR URL** (`12345...dkr.ecr...`)을 복사해 둡니다.

### Step 2: Docker 이미지 빌드 및 푸시 (수동)
최초 1회는 수동으로 이미지를 올려야 ECS가 실행될 때 에러가 안 납니다.

```bash
# 1. 루트 폴더로 이동
cd .. 

# 2. ECR 로그인 (AWS CLI 사용)
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com

# 3. 백엔드 빌드 & 푸시
docker build -t energy-truck-backend ./backend
docker tag energy-truck-backend:latest [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest
docker push [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest

# 4. 프론트엔드 빌드 & 푸시 (필요시 동일하게 진행)
```

### Step 3: 전체 인프라 생성 (ECS, ALB, VPC)
이미지가 올라갔으니 이제 서버를 띄웁니다.

```bash
cd terraform
terraform apply
```
*   `Enter a value: yes` 입력.
*   약 5~10분 소요됩니다.
*   완료되면 `alb_dns_name`이 출력됩니다. 이 주소가 **웹사이트 주소**입니다!

---

## 🤖 Phase 4: Jenkins CI/CD 구축 (Docker 방식)

매번 수동으로 빌드/푸시/배포하는 것은 귀찮습니다. Jenkins를 설치해 자동화합니다.

### Step 1: Jenkins 서버 띄우기 (Docker Compose)
프로젝트 루트에 있는 `docker-compose.yml`을 사용하여 Jenkins를 실행합니다.

1.  **`jenkins/.env` 파일 생성**:
    ```bash
    mkdir -p jenkins
    nano jenkins/.env
    ```
    ```env
    # jenkins/.env 내용
    AWS_ACCESS_KEY_ID=AKIA...[본인의_키]
    AWS_SECRET_ACCESS_KEY=...[본인의_시크릿_키]
    AWS_DEFAULT_REGION=ap-northeast-2
    AWS_ACCOUNT_ID=[본인의_Account_ID_숫자12자리]
    ```

2.  **Jenkins 실행**:
    ```bash
    # 루트 폴더에서
    docker-compose up -d jenkins
    ```

3.  **초기 비밀번호 확인**:
    Jenkins가 처음 켜질 때 비밀번호가 필요합니다.
    ```bash
    docker logs jenkins 2>&1 | grep "Please use the following password" -A 2
    ```
    출력된 복잡한 문자열(예: `a1b2c3d4...`)을 복사합니다.

### Step 2: Jenkins 웹 접속 및 설정
1.  브라우저에서 `http://localhost:8080` 접속.
2.  복사한 **초기 비밀번호** 입력.
3.  **Install suggested plugins** 클릭 (설치에 2~3분 소요).
4.  관리자 계정(Admin User) 생성.

### Step 3: 파이프라인 연결
1.  **새로운 작업(New Item)** 클릭.
2.  이름 입력(예: `energy-truck-deploy`) -> **Pipeline** 선택 -> OK.
3.  **Pipeline** 섹션으로 스크롤:
    *   **Definition**: `Pipeline script from SCM` 선택.
    *   **SCM**: `Git` 선택.
    *   **Repository URL**: 본인의 GitHub 저장소 주소 입력.
    *   **Script Path**: `Jenkinsfile` (기본값).
4.  **Save** 클릭.

### Step 4: 배포 테스트
1.  **Build Now** 버튼 클릭.
2.  좌측 빌드 히스토리에서 진행 상황 확인.
3.  성공하면 자동으로 Docker 빌드 -> ECR 푸시 -> ECS 업데이트가 진행됩니다!

---

## 🧹 Phase 5: 마무리 및 비용 관리 (Resource Cleanup)

프로젝트가 끝났거나 실습을 마친 후, **요금이 나가지 않도록** 리소스를 정리하는 방법입니다.

### 1️⃣ 리소스 삭제 (Terraform Destroy)
가장 깔끔하고 확실한 방법입니다. 만들었던 모든 인프라(ALB, ECS, VPC 등)를 한 번에 삭제합니다.

```bash
cd terraform
terraform destroy
```
*   `Enter a value:` 가 나오면 `yes` 입력.
*   약 5~10분 소요됩니다.
*   **주의**: ECR(이미지 저장소)에 이미지가 있으면 삭제가 안 될 수 있습니다. 그럴 땐 옵션을 추가하세요.
    *   `ecs.tf` 등의 `force_delete` 옵션이 없어서 실패한다면, AWS 콘솔에서 ECR 리포지토리를 먼저 비우고 삭제하세요.

### 2️⃣ 비용 절약 팁 (삭제하지 않고 유지할 때)
서버를 끄고 싶지만 설정은 남기고 싶을 때 사용합니다.

1.  **ECS 태스크 수 0으로 줄이기**:
    `terraform/ecs.tf` 파일에서 `desired_count`를 0으로 변경하고 `terraform apply`.
    ```hcl
    resource "aws_ecs_service" "backend" {
      # ...
      desired_count = 0  # 1 -> 0 변경
    }
    ```
    *   **효과**: Fargate 비용이 0원이 됩니다. (ALB 비용은 계속 나감)

2.  **ALB 삭제**:
    로드밸런서(ALB)는 켜놓기만 해도 시간당 요금이 발생합니다. 비용을 아끼려면 `terraform destroy`를 권장합니다.

---

## 📚 참고 문서
*   [Terraform 상세 가이드](./terraform-env-setup.md)
*   [Jenkins 상세 가이드](./jenkins-env-setup.md)
*   [전체 아키텍처 설명](./deployment_master_guide.md)
