# 🔄 AWS 계정 전환 가이드

**작성일**: 2026-02-01  
**목적**: 새로운 AWS 계정으로 전환하기 위한 완전한 가이드

---

## 📋 목차

1. [하드코딩된 계정 정보 위치](#하드코딩된-계정-정보-위치)
2. [새 계정 전환 준비](#새-계정-전환-준비)
3. [단계별 전환 가이드](#단계별-전환-가이드)
4. [수정해야 할 파일 목록](#수정해야-할-파일-목록)
5. [확인 및 테스트](#확인-및-테스트)

---

## 🔍 하드코딩된 계정 정보 위치

### ❌ 현재 계정 정보

```
AWS Account ID: 123456789012 (Example)
AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
IAM User: example-user
Region: ap-northeast-2 (서울)
```

### 📂 하드코딩된 위치 분석

#### 1️⃣ **실제 코드 파일** (수정 필수!)

| 파일 경로 | 하드코딩된 정보 | 중요도 | 수정 방법 |
|-----------|-----------------|---------|-----------|
| `backend/.env` | Access Key ID & Secret | 🔴 **매우 높음** | 새 키로 교체 |

**내용**:
```bash
# backend/.env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE          # ← 하드코딩!
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY  # ← 하드코딩!
AWS_DEFAULT_REGION=ap-northeast-2
```

#### 2️⃣ **Terraform 코드** (계정 정보 없음 ✅)

| 파일 경로 | 내용 | 계정 정보 |
|-----------|------|-----------|
| `terraform/variables.tf` | 변수 선언 | ✅ **없음** (region만) |
| `terraform/provider.tf` | AWS Provider 설정 | ✅ **없음** (환경 변수 사용) |
| `terraform/ecr.tf` | ECR 리포지토리 | ✅ **없음** (동적 생성) |
| `terraform/ecs.tf` | ECS 리소스 | ✅ **없음** (동적 ARN) |
| `terraform/iam.tf` | IAM 역할 | ✅ **없음** |
| `terraform/alb.tf` | Load Balancer | ✅ **없음** |
| `terraform/vpc.tf` | VPC 네트워크 | ✅ **없음** |
| `terraform/security_groups.tf` | 보안 그룹 | ✅ **없음** |

**좋은 소식!** Terraform 코드는 계정 정보가 하드코딩되어 있지 않습니다. AWS Provider가 자동으로 환경 변수나 `~/.aws/credentials`에서 인증 정보를 가져옵니다.

#### 3️⃣ **문서 파일** (참고용, 수정 선택)

| 파일 | 하드코딩 위치 | 수정 필요 |
|------|--------------|-----------|
| `docs/access_key_status_guide.md` | 예시로 계정 ID 사용 | 🟡 선택사항 |
| `docs/deployment_master_guide.md` | 플레이스홀더 `[ACCOUNT_ID]` | ✅ 괜찮음 |
| `docs/jenkins-when-to-install.md` | 플레이스홀더 `[ACCOUNT_ID]` | ✅ 괜찮음 |
| `docs/env-variables-guide.md` | 예시로 키 사용 | 🟡 선택사항 |

**문서 파일은 대부분 플레이스홀더를 사용하므로 수정 불필요합니다.**

#### 4️⃣ **로컬 설정 파일** (수정 필수!)

| 위치 | 내용 | 수정 방법 |
|------|------|-----------|
| `~/.aws/credentials` | Access Key 저장 | `aws configure` 재실행 |
| `~/.aws/config` | 기본 region 등 | `aws configure` 재실행 |

---

## 🆕 새 계정 전환 준비

### 준비 사항 체크리스트

- [ ] **새 AWS 계정 생성 완료**
  - [ ] AWS 계정 ID 확인
  - [ ] Root 사용자 또는 IAM User 생성
  - [ ] MFA 설정 (권장)

- [ ] **IAM 사용자 설정**
  - [ ] IAM User 생성 (예: `terraform-user`)
  - [ ] 필요한 권한 부여 (아래 참조)
  - [ ] Access Key 발급

- [ ] **AWS CLI 설치 확인**
  ```bash
  aws --version
  # aws-cli/1.22.34 이상
  ```

### 필요한 IAM 권한

새 계정의 IAM User에게 다음 권한이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "ecs:*",
        "ecr:*",
        "elasticloadbalancing:*",
        "iam:*",
        "logs:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    }
  ]
}
```

**또는 간단하게 AWS Managed Policy 사용**:
- `AdministratorAccess` (전체 권한, 개발/테스트용)
- 또는 개별 정책:
  - `AmazonECS_FullAccess`
  - `AmazonEC2ContainerRegistryFullAccess`
  - `AmazonVPCFullAccess`
  - `ElasticLoadBalancingFullAccess`
  - `IAMFullAccess`

---

## 🔧 단계별 전환 가이드

### Phase 1: 새 AWS 계정 설정

#### Step 1: IAM User 생성 및 Access Key 발급

**AWS Console에서**:

1. 새 계정으로 로그인
2. IAM → Users → **Create user**
3. User name: `terraform-deploy` (또는 원하는 이름)
4. **Attach policies directly**:
   - `AdministratorAccess` 선택 (또는 위 권한 조합)
5. **Create user** 클릭
6. 생성된 사용자 클릭 → **Security credentials** 탭
7. **Create access key** 클릭
8. Use case: **Command Line Interface (CLI)**
9. **Create access key** 클릭
10. ⚠️ **Access Key ID**와 **Secret Access Key** 복사 및 저장!
11. **.csv 파일 다운로드** (안전한 곳에 보관)

**저장할 정보**:
```
새 AWS Account ID: [새 계정 ID]
새 Access Key ID: AKIA[새로운키]
새 Secret Access Key: [새 시크릿 키]
Region: ap-northeast-2 (또는 원하는 리전)
```

---

### Phase 2: 로컬 환경 설정

#### Step 2: AWS CLI 재설정

```bash
# AWS CLI 설정 (새 계정 정보 입력)
aws configure

# 프롬프트:
AWS Access Key ID [****************FRMT]: AKIA[새로운키ID]
AWS Secret Access Key [****************bZK3]: [새시크릿키]
Default region name [ap-northeast-2]: ap-northeast-2
Default output format [json]: json
```

#### Step 3: 인증 확인

```bash
# 새 계정 정보 확인
aws sts get-caller-identity

# 예상 출력:
{
    "UserId": "AIDA새로운ID",
    "Account": "[새계정ID]",  # ← 새 계정 ID 확인!
    "Arn": "arn:aws:iam::[새계정ID]:user/terraform-deploy"
}
```

✅ **Account**가 새 계정 ID와 일치하면 성공!

---

### Phase 3: 코드 수정

#### Step 4: `backend/.env` 파일 수정

```bash
# backend/.env 파일 편집
nano /mnt/c/workspace2/aws_pro1/backend/.env
```

**수정 내용**:
```bash
# backend/.env (새 정보로 교체)
SUPABASE_URL=https://loohzspmcmafmxachwpg.supabase.co
SUPABASE_KEY=sb_publishable_9bo2qkG-FpOMYhax3yw_xA_muermteP

# AWS Credentials for Terraform
AWS_ACCESS_KEY_ID=AKIA[새로운키ID]              # ← 수정!
AWS_SECRET_ACCESS_KEY=[새시크릿키]                # ← 수정!
AWS_DEFAULT_REGION=ap-northeast-2
```

**또는 더 안전한 방법** (환경 변수에서 자동 가져오기):
```bash
# backend/.env에서 AWS 자격 증명 제거
# AWS CLI 설정 (~/.aws/credentials)을 사용하도록 변경

# backend/.env (권장)
SUPABASE_URL=https://loohzspmcmafmxachwpg.supabase.co
SUPABASE_KEY=sb_publishable_9bo2qkG-FpOMYhax3yw_xA_muermteP
AWS_DEFAULT_REGION=ap-northeast-2

# AWS_ACCESS_KEY_ID와 AWS_SECRET_ACCESS_KEY는 제거!
# Terraform이 자동으로 ~/.aws/credentials에서 가져옴
```

---

### Phase 4: Terraform 리소스 생성

#### Step 5: Terraform 초기화 및 계획

```bash
cd /mnt/c/workspace2/aws_pro1

# Terraform 초기화 (기존 상태 제거)
docker-compose run --rm terraform init -reconfigure

# 계획 확인 (새 계정에 생성될 리소스 확인)
docker-compose run --rm terraform plan
```

**예상 출력**:
```
Plan: 21 to add, 0 to change, 0 to destroy.
```

모든 리소스가 **새로 생성**됩니다 (기존 계정과 독립적).

#### Step 6: ECR 리포지토리 생성

```bash
# ECR 리포지토리만 먼저 생성 (Docker 이미지 푸시용)
docker-compose run --rm terraform apply -target=aws_ecr_repository.backend -target=aws_ecr_repository.frontend
```

프롬프트에서 `yes` 입력.

#### Step 7: 새 계정 ID 확인

```bash
# 새로 생성된 ECR 주소 확인
aws ecr describe-repositories --region ap-northeast-2 --query 'repositories[*].[repositoryName,repositoryUri]'

# 출력 예시:
[
  ["energy-truck-backend", "[새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend"],
  ["energy-truck-frontend", "[새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend"]
]
```

**새 계정 ID 메모**: `[새계정ID]`

---

### Phase 5: Docker 이미지 푸시

#### Step 8: ECR 로그인

```bash
# 새 계정의 ECR에 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com
```

#### Step 9: Docker 이미지 태그 및 푸시

```bash
# Backend 이미지
docker tag energy-truck-backend:latest [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest
docker push [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest

# Frontend 이미지
docker tag energy-truck-frontend:latest [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest
docker push [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest
```

---

### Phase 6: 전체 인프라 배포

#### Step 10: Terraform Apply

```bash
# 모든 리소스 생성
docker-compose run --rm terraform apply
```

프롬프트에서 `yes` 입력.

**소요 시간**: 약 3~5분

**생성되는 리소스**:
- VPC, Subnets, Internet Gateway
- Security Groups
- Application Load Balancer
- ECS Cluster, Services, Tasks
- IAM Roles
- CloudWatch Log Groups

#### Step 11: 배포 확인

```bash
# ALB DNS 주소 확인
aws elbv2 describe-load-balancers \
  --names energy-truck-alb \
  --region ap-northeast-2 \
  --query 'LoadBalancers[0].DNSName' \
  --output text

# 출력: energy-truck-alb-XXXXXXXX.ap-northeast-2.elb.amazonaws.com
```

브라우저로 접속:
```
http://energy-truck-alb-XXXXXXXX.ap-northeast-2.elb.amazonaws.com/
```

---

## 📝 수정해야 할 파일 목록

### 🔴 필수 수정

| 파일 | 수정 내용 | 명령어 |
|------|-----------|--------|
| `~/.aws/credentials` | 새 Access Key | `aws configure` |
| `backend/.env` | 새 AWS 자격 증명 | `nano backend/.env` |

### 🟡 선택 수정 (문서)

| 파일 | 내용 | 필요성 |
|------|------|--------|
| `docs/access_key_status_guide.md` | 예시 계정 ID | 낮음 (참고용) |
| `docs/env-variables-guide.md` | 예시 Access Key | 낮음 (참고용) |

### ✅ 수정 불필요

**Terraform 파일들은 모두 동적으로 계정 정보를 가져오므로 수정 불필요!**

- `terraform/*.tf` (모든 파일)
- `docker-compose.yml`
- Application 코드 (`backend/`, `energy-trading-app/`)

---

## ✅ 확인 및 테스트

### 체크리스트

#### Phase 1: 인증 확인
- [ ] `aws sts get-caller-identity`로 새 계정 ID 확인
- [ ] `~/.aws/credentials` 파일에 새 키 저장 확인

#### Phase 2: Terraform 상태
- [ ] `terraform plan` 실행 시 오류 없음
- [ ] 새 계정에 21개 리소스 생성 계획 확인

#### Phase 3: ECR 확인
- [ ] ECR 리포지토리 2개 생성 확인
- [ ] Docker 이미지 푸시 성공
- [ ] ECR Console에서 이미지 확인

#### Phase 4: 애플리케이션 배포
- [ ] ECS Cluster 생성 확인
- [ ] Frontend/Backend 서비스 실행 중 (`runningCount: 1`)
- [ ] ALB DNS 주소로 웹사이트 접속 가능

#### Phase 5: 로그 확인
```bash
# CloudWatch Logs 확인
aws logs tail /ecs/energy-truck-frontend --follow --region ap-northeast-2
aws logs tail /ecs/energy-truck-backend --follow --region ap-northeast-2
```

---

## 🔒 보안 강화 (권장)

### 1. `.env` 파일 Git에서 제외 확인

```bash
# .gitignore 확인
cat /mnt/c/workspace2/aws_pro1/.gitignore | grep .env

# 출력되어야 함:
# .env
# .env.*
```

없으면 추가:
```bash
echo -e "\n# Environment variables\n.env\n.env.*\n!.env.example" >> .gitignore
```

### 2. `.env` 파일 Git에서 제거 (이미 커밋한 경우)

```bash
# Git tracking 제거 (파일은 유지)
git rm --cached backend/.env

# 커밋
git commit -m "Remove .env from Git tracking"
```

### 3. `.env.example` 생성

```bash
# backend/.env.example 생성
cat > /mnt/c/workspace2/aws_pro1/backend/.env.example << 'EOF'
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_publishable_key_here

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_DEFAULT_REGION=ap-northeast-2
EOF

# Git에 추가
git add backend/.env.example
git commit -m "Add backend environment variables template"
```

### 4. Terraform State 보안

**현재**: `terraform/terraform.tfstate` (로컬 파일)

**권장**: S3 원격 백엔드 (암호화 + 버전 관리)

```hcl
# terraform/backend.tf (새 파일 생성)
terraform {
  backend "s3" {
    bucket         = "energy-truck-terraform-state-[새계정ID]"
    key            = "terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

**설정 방법**:
1. S3 버킷 생성 (Console 또는 CLI)
2. DynamoDB 테이블 생성 (LockID 속성)
3. `terraform/backend.tf` 파일 작성
4. `terraform init -reconfigure` 실행

---

## 💰 비용 예상 (새 계정)

새 계정에서도 동일한 리소스를 생성하므로 비용은 같습니다:

| 리소스 | 월 비용 (24시간 운영) |
|--------|---------------------|
| ECS Frontend (0.25 vCPU, 0.5 GB) | $14 |
| ECS Backend (0.25 vCPU, 0.5 GB) | $14 |
| Application Load Balancer | $16 |
| ECR 이미지 저장 | $0.20 |
| CloudWatch Logs | $0.50 |
| **총합** | **~$45** |

**비용 절감 팁**:
- 사용하지 않을 때: ECS 서비스 중지 (`desired-count 0`) → $17/월
- 장기 미사용: `terraform destroy` → $0.20/월

---

## 🚨 문제 해결

### 문제 1: Terraform Apply 실패

**증상**:
```
Error: error creating ECS Service: InvalidParameterException: No Container Instances
```

**원인**: ECS 작업 정의에서 이미지를 찾을 수 없음

**해결**:
1. ECR에 이미지가 푸시되었는지 확인
2. ECS 작업 정의에서 올바른 ECR URI 사용 확인
3. IAM Task Execution Role에 ECR 권한 확인

### 문제 2: Docker Push 실패

**증상**:
```
denied: Your authorization token has expired. Reauthenticate and try again.
```

**해결**:
```bash
# ECR 재로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin [새계정ID].dkr.ecr.ap-northeast-2.amazonaws.com
```

### 문제 3: Access Denied 오류

**증상**:
```
Error: UnauthorizedOperation: You are not authorized to perform this operation.
```

**해결**:
1. IAM User 권한 확인
2. `AdministratorAccess` 또는 필요한 정책 부여
3. `aws sts get-caller-identity`로 올바른 계정 확인

---

## 📋 빠른 참조 명령어 모음

```bash
# === 인증 확인 ===
aws sts get-caller-identity
aws configure list

# === ECR 관련 ===
# 리포지토리 목록
aws ecr describe-repositories --region ap-northeast-2

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin [계정ID].dkr.ecr.ap-northeast-2.amazonaws.com

# === Terraform ===
# 초기화
docker-compose run --rm terraform init -reconfigure

# 계획 확인
docker-compose run --rm terraform plan

# 배포
docker-compose run --rm terraform apply

# 삭제
docker-compose run --rm terraform destroy

# === ECS 관련 ===
# 서비스 상태
aws ecs describe-services \
  --cluster energy-truck-cluster \
  --services energy-truck-frontend-service energy-truck-backend-service \
  --region ap-northeast-2

# 서비스 중지
aws ecs update-service \
  --cluster energy-truck-cluster \
  --service energy-truck-frontend-service \
  --desired-count 0 \
  --region ap-northeast-2

# === ALB ===
# DNS 주소 확인
aws elbv2 describe-load-balancers \
  --names energy-truck-alb \
  --region ap-northeast-2 \
  --query 'LoadBalancers[0].DNSName' \
  --output text

# === CloudWatch Logs ===
# 실시간 로그
aws logs tail /ecs/energy-truck-frontend --follow --region ap-northeast-2
```

---

## 🎯 요약

### 변경 필요한 파일 (최소한)

1. ✅ `~/.aws/credentials` (AWS CLI 설정)
2. ✅ `backend/.env` (AWS 자격 증명)

### Terraform 코드는 수정 불필요! ✅

모든 Terraform 파일 (`*.tf`)은 계정 정보가 하드코딩되어 있지 않으므로, AWS CLI 설정만 바꾸면 자동으로 새 계정에 배포됩니다.

### 전환 소요 시간

- **인증 설정**: 5분
- **코드 수정**: 2분
- **Terraform 배포**: 5~10분
- **총 소요 시간**: **약 15~20분**

---

**마지막 업데이트**: 2026-02-01  
**작성자**: Antigravity AI
