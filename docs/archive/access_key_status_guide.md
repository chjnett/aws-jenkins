# 🔑 Access Key 상태 및 다음 단계 가이드

**작성일**: 2026-01-31  
**상태**: Access Key 만료/무효화

---

## 📋 목차

1. [현재 상황 요약](#현재-상황-요약)
2. [만료된 것 vs 살아있는 것](#만료된-것-vs-살아있는-것)
3. [AWS 인증 아키텍처](#aws-인증-아키텍처)
4. [실행 중인 리소스 아키텍처](#실행-중인-리소스-아키텍처)
5. [다음 단계 (Action Items)](#다음-단계-action-items)
6. [비용 관리](#비용-관리)

---

## 🎯 현재 상황 요약

### ❌ 만료된 것
- **Access Key**: `AKIAIOSFODNN7EXAMPLE`
  - 상태: 무효화 (Invalid)
  - 영향: 로컬 AWS CLI 작업 불가

### ✅ 정상 작동 중
- **웹 애플리케이션**: 계속 실행 중
- **AWS Console 접근**: 여전히 가능
- **모든 AWS 리소스**: 영향 없음

---

## 🔐 만료된 것 vs 살아있는 것

### ❌ Access Key 만료 (CLI/API 인증)

```
영향받는 작업:
├─ AWS CLI 명령어 (aws ecs, aws ecr, etc.)
├─ Terraform 배포/수정 (terraform apply, destroy)
├─ Docker 이미지 푸시 (ECR 인증)
├─ 로컬 스크립트/자동화
└─ SDK 기반 애플리케이션

현재 상태: ❌ 모두 불가능
해결 방법: 새 Access Key 발급 필요
```

### ✅ 계속 작동하는 것

#### 1. **AWS Console (웹 브라우저 접근)**
```
로그인 방법:
├─ URL: https://console.aws.amazon.com
├─ Account ID: 155684258455
├─ IAM User: awspublic-naeilsys-0014
└─ Password: (별도 관리)

상태: ✅ 정상 작동
이유: Console 로그인은 Access Key와 별개
```

#### 2. **실행 중인 모든 AWS 리소스**
```
ECS 서비스:
├─ Frontend 컨테이너 ✅
├─ Backend 컨테이너 ✅
└─ IAM Task Execution Role 사용 (Access Key 불필요)

네트워크:
├─ Application Load Balancer ✅
├─ VPC, Subnets ✅
└─ Security Groups ✅

스토리지:
├─ ECR 이미지 저장소 ✅
└─ CloudWatch Logs ✅

상태: ✅ 모두 정상 작동
이유: AWS 내부 IAM Role 기반 인증
```

---

## 🏗️ AWS 인증 아키텍처

### 전체 인증 구조

```mermaid
graph TB
    subgraph "로컬 개발 환경"
        A[개발자 PC / WSL2]
        B[AWS CLI]
        C[Terraform]
        D[Docker CLI]
    end
    
    subgraph "AWS 인증 시스템"
        E[IAM User: awspublic-naeilsys-0014]
        F[Access Key ❌무효화]
        G[Console Password ✅활성]
    end
    
    subgraph "AWS 서비스 (실행 중)"
        H[ECS Tasks]
        I[IAM Task Execution Role]
        J[Application Load Balancer]
        K[ECR Repository]
    end
    
    A -->|aws configure| F
    F -.->|❌ 인증 실패| B
    F -.->|❌ 인증 실패| C
    F -.->|❌ 인증 실패| D
    
    E -->|✅ 정상| G
    G -->|웹 브라우저| AWS콘솔
    
    H -->|자동 인증| I
    I -->|권한 부여| K
    J -->|트래픽 라우팅| H
    
    style F fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style G fill:#51cf66,stroke:#2f9e44,color:#fff
    style H fill:#51cf66,stroke:#2f9e44,color:#fff
    style I fill:#51cf66,stroke:#2f9e44,color:#fff
```

### 인증 타입 비교

| 인증 타입 | 용도 | 자격 증명 | 현재 상태 |
|-----------|------|-----------|-----------|
| **Console 로그인** | 웹 브라우저 | Username + Password | ✅ 정상 |
| **Access Key** | CLI/API/SDK | Access Key ID + Secret | ❌ 무효화 |
| **IAM Task Role** | ECS 컨테이너 | AWS 내부 자동 발급 | ✅ 정상 |

---

## 🌐 실행 중인 리소스 아키텍처

### 네트워크 및 컴퓨팅 구조

```mermaid
graph TB
    subgraph "인터넷"
        USER[사용자 브라우저]
    end
    
    subgraph "AWS ap-northeast-2 (서울)"
        subgraph "VPC: energy-truck-vpc (10.0.0.0/16)"
            subgraph "Public Subnet A (10.0.1.0/24)"
                ALB[Application Load Balancer<br/>energy-truck-alb]
                TASK1[ECS Task: Frontend<br/>Port: 3000]
            end
            
            subgraph "Public Subnet C (10.0.2.0/24)"
                TASK2[ECS Task: Backend<br/>Port: 8000]
            end
            
            IGW[Internet Gateway]
            SG1[Security Group: ALB<br/>In: 80 from 0.0.0.0/0]
            SG2[Security Group: ECS<br/>In: 3000, 8000 from ALB]
        end
        
        subgraph "IAM"
            ROLE[IAM Role<br/>ecs-task-execution-role]
        end
        
        subgraph "ECR"
            ECR1[energy-truck-frontend:latest]
            ECR2[energy-truck-backend:latest]
        end
        
        subgraph "CloudWatch"
            LOG1[/ecs/energy-truck-frontend]
            LOG2[/ecs/energy-truck-backend]
        end
    end
    
    USER -->|HTTP:80| ALB
    ALB -->|Target Group| TASK1
    ALB -->|Target Group /api/*| TASK2
    
    IGW -->|Public IP| ALB
    IGW -->|Public IP| TASK1
    IGW -->|Public IP| TASK2
    
    TASK1 -->|Pull Image| ECR1
    TASK2 -->|Pull Image| ECR2
    
    TASK1 -.->|Assume Role| ROLE
    TASK2 -.->|Assume Role| ROLE
    
    TASK1 -->|Write Logs| LOG1
    TASK2 -->|Write Logs| LOG2
    
    style ALB fill:#4dabf7,stroke:#1971c2,color:#fff
    style TASK1 fill:#51cf66,stroke:#2f9e44,color:#fff
    style TASK2 fill:#51cf66,stroke:#2f9e44,color:#fff
    style ROLE fill:#ffd43b,stroke:#fab005,color:#000
```

### 접속 URL

```
프론트엔드 (기본):
http://energy-truck-alb-969796262.ap-northeast-2.elb.amazonaws.com/

백엔드 API:
http://energy-truck-alb-969796262.ap-northeast-2.elb.amazonaws.com/api/health
http://energy-truck-alb-969796262.ap-northeast-2.elb.amazonaws.com/api/simulation/price-data
```

### 리소스 상태 요약

| 리소스 | 이름 | 상태 | 비용 발생 |
|--------|------|------|-----------|
| VPC | energy-truck-vpc | ✅ Active | 무료 |
| Subnet | energy-truck-public-a/c | ✅ Active | 무료 |
| Internet Gateway | energy-truck-igw | ✅ Active | 무료 |
| Security Group | 2개 (ALB, ECS) | ✅ Active | 무료 |
| **ALB** | energy-truck-alb | ✅ Active | **$16/월** |
| **ECS Cluster** | energy-truck-cluster | ✅ Active | 무료 |
| **ECS Service (Frontend)** | energy-truck-frontend-service | ✅ Running (1/1) | **$14/월** |
| **ECS Service (Backend)** | energy-truck-backend-service | ✅ Running (1/1) | **$14/월** |
| ECR Repository | frontend/backend | ✅ Active | $0.20/월 |
| CloudWatch Logs | 2 log groups | ✅ Active | $0.50/월 |

**총 예상 비용**: **$45~50/월** (24시간 운영 시)

---

## 🔧 다음 단계 (Action Items)

### 우선순위 1: Access Key 재발급 (필수)

#### Step 1: AWS Console 로그인

```
1. URL: https://console.aws.amazon.com
2. Account ID 입력: 155684258455
3. IAM User: awspublic-naeilsys-0014
4. Password: (본인 비밀번호)
```

#### Step 2: 새 Access Key 발급

**Console 경로**:
```
IAM Dashboard
└─ Users (좌측 메뉴)
   └─ awspublic-naeilsys-0014 (클릭)
      └─ Security credentials (탭)
         └─ Access keys (섹션)
            └─ Create access key (버튼)
```

**또는 직접 링크**:
```
https://console.aws.amazon.com/iam/home#/users/awspublic-naeilsys-0014?section=security_credentials
```

**발급 절차**:
1. **Create access key** 클릭
2. Use case 선택: **Command Line Interface (CLI)**
3. 확인 체크박스 선택
4. (선택) Description tag: `local-cli-2026-01`
5. **Create access key** 클릭
6. **중요**: Access Key ID와 Secret Access Key 복사
7. **Download .csv file** (안전한 위치에 백업)

#### Step 3: 로컬 환경 설정

**방법 1: AWS CLI Configure (추천)**
```bash
aws configure

# 입력:
AWS Access Key ID [****************FRMT]: <새로운 Access Key ID>
AWS Secret Access Key [****************bZK3]: <새로운 Secret Access Key>
Default region name [ap-northeast-2]: ap-northeast-2
Default output format [json]: json
```

**방법 2: 직접 파일 수정**
```bash
# credentials 파일 위치 확인
cat ~/.aws/credentials

# 편집
nano ~/.aws/credentials

# 내용:
[default]
aws_access_key_id = <새로운 Access Key ID>
aws_secret_access_key = <새로운 Secret Access Key>
```

#### Step 4: 확인

```bash
# 인증 테스트
aws sts get-caller-identity

# 예상 출력:
{
    "UserId": "AIDASIP4BIKL47DVPC2RL",
    "Account": "155684258455",
    "Arn": "arn:aws:iam::155684258455:user/awspublic-naeilsys-0014"
}

# ECS 상태 확인
aws ecs describe-services \
  --cluster energy-truck-cluster \
  --services energy-truck-frontend-service energy-truck-backend-service \
  --region ap-northeast-2
```

✅ **성공**: 이제 모든 CLI 작업 가능!

---

### 우선순위 2: 기존 Access Key 정리

#### Console에서 확인 및 정리

1. IAM → Users → awspublic-naeilsys-0014 → Security credentials
2. Access keys 섹션 확인
3. 기존 키 `AKIASIP4BIKLRR7NFRMT` 찾기
   - **있다면**: "Delete" 클릭하여 삭제
   - **없다면**: 이미 삭제됨 (OK)

#### 권장 키 관리 정책

```
Access Key 개수: 최대 1개 유지
이유:
├─ 불필요한 키 최소화 (보안)
├─ 관리 복잡도 감소
└─ 유출 시 영향 범위 최소화

주기적 로테이션:
├─ 3개월마다 새 키 발급
├─ 기존 키 비활성화 → 1주일 후 삭제
└─ AWS Trusted Advisor에서 90일 이상 키 경고
```

---

### 우선순위 3: 보안 강화

#### `.gitignore` 확인 및 업데이트

```bash
# 현재 .gitignore 확인
cat /mnt/c/workspace2/aws_pro1/.gitignore

# 추가해야 할 항목
cat >> /mnt/c/workspace2/aws_pro1/.gitignore << 'EOF'

# AWS Credentials (실수 방지)
.aws/
credentials
config

# Terraform State
terraform/*.tfstate
terraform/*.tfstate.backup
terraform/.terraform/
terraform/.terraform.lock.hcl

# Environment Variables
.env
.env.*
!.env.example

# Logs
*.log
EOF

# Git에서 민감 파일 제거 (이미 커밋한 경우)
git rm --cached terraform/terraform.tfstate 2>/dev/null || true
git rm --cached terraform/terraform.tfstate.backup 2>/dev/null || true
git rm --cached .env 2>/dev/null || true

# 커밋
git add .gitignore
git commit -m "Update .gitignore to exclude sensitive files"
```

#### `.env.example` 생성 (팀원용)

```bash
# 템플릿 생성
cat > /mnt/c/workspace2/aws_pro1/.env.example << 'EOF'
# AWS Configuration
AWS_REGION=ap-northeast-2
AWS_ACCOUNT_ID=your_account_id_here

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database (if needed in future)
# DATABASE_URL=postgresql://user:password@host:5432/dbname
EOF

git add .env.example
git commit -m "Add environment variables template"
```

---

### 우선순위 4: 비용 모니터링 설정

#### AWS Budget 생성

**Console 경로**:
```
AWS Billing Dashboard
└─ Budgets (좌측 메뉴)
   └─ Create budget
```

**직접 링크**: https://console.aws.amazon.com/billing/home#/budgets/create

**설정 값**:
```yaml
Budget type: Cost budget
Budget name: MonthlyBudget
Period: Monthly
Budget amount: $10 USD

Alert thresholds:
  - 80% of budgeted amount ($8)
  - 100% of budgeted amount ($10)

Email recipients: <본인 이메일>
```

#### CloudWatch Logs 보관 기간 설정

```bash
# 7일 보관으로 설정 (비용 절감)
aws logs put-retention-policy \
  --log-group-name /ecs/energy-truck-frontend \
  --retention-in-days 7 \
  --region ap-northeast-2

aws logs put-retention-policy \
  --log-group-name /ecs/energy-truck-backend \
  --retention-in-days 7 \
  --region ap-northeast-2

# 확인
aws logs describe-log-groups \
  --log-group-name-prefix /ecs/energy-truck \
  --region ap-northeast-2 \
  --query 'logGroups[*].[logGroupName,retentionInDays]'
```

**비용 절감**: ~$0.40/월

---

## 💰 비용 관리

### 현재 비용 구조

```mermaid
pie title 월간 비용 분포 ($45)
    "ECS Frontend" : 14
    "ECS Backend" : 14
    "ALB" : 16
    "ECR + Logs" : 1
```

### 비용 절감 전략

#### 전략 1: ECS 서비스 중지 (62% 절감)

**언제**: 테스트 완료 후, 당분간 사용 안 할 때

```bash
# 서비스 중지 (Fargate 비용 제거)
aws ecs update-service \
  --cluster energy-truck-cluster \
  --service energy-truck-frontend-service \
  --desired-count 0 \
  --region ap-northeast-2

aws ecs update-service \
  --cluster energy-truck-cluster \
  --service energy-truck-backend-service \
  --desired-count 0 \
  --region ap-northeast-2

# 확인
aws ecs describe-services \
  --cluster energy-truck-cluster \
  --services energy-truck-frontend-service energy-truck-backend-service \
  --region ap-northeast-2 \
  --query 'services[*].[serviceName,runningCount,desiredCount]'
```

**결과**:
- 비용: $45/월 → $17/월 (62% 절감)
- ALB는 유지 (재시작 빠름)
- 재시작: 1~2분

**재시작**:
```bash
aws ecs update-service \
  --cluster energy-truck-cluster \
  --service energy-truck-frontend-service \
  --desired-count 1 \
  --region ap-northeast-2

aws ecs update-service \
  --cluster energy-truck-cluster \
  --service energy-truck-backend-service \
  --desired-count 1 \
  --region ap-northeast-2
```

#### 전략 2: 전체 인프라 삭제 (99% 절감)

**언제**: 프로젝트 일시 중단, 한 달 이상 사용 안 할 때

```bash
# Terraform으로 모든 리소스 삭제
cd /mnt/c/workspace2/aws_pro1
docker-compose run --rm terraform destroy

# 확인 프롬프트에서 'yes' 입력
```

**삭제되는 리소스**:
- ✅ ECS Cluster, Services, Tasks
- ✅ ALB, Target Groups, Listeners
- ✅ VPC, Subnets, IGW, Route Tables
- ✅ Security Groups
- ✅ IAM Roles
- ❌ ECR Repositories (이미지 보존됨)

**결과**:
- 비용: $45/월 → $0.20/월 (99% 절감)
- ECR 이미지만 남음
- 재배포: 5~10분

**재배포**:
```bash
docker-compose run --rm terraform apply
```

#### 전략 3: 완전 삭제 (100% 절감)

**언제**: 프로젝트 완전 종료

```bash
# 1. 인프라 삭제
docker-compose run --rm terraform destroy

# 2. ECR 이미지 삭제
aws ecr delete-repository \
  --repository-name energy-truck-frontend \
  --force \
  --region ap-northeast-2

aws ecr delete-repository \
  --repository-name energy-truck-backend \
  --force \
  --region ap-northeast-2

# 3. CloudWatch Logs 삭제 (선택)
aws logs delete-log-group \
  --log-group-name /ecs/energy-truck-frontend \
  --region ap-northeast-2

aws logs delete-log-group \
  --log-group-name /ecs/energy-truck-backend \
  --region ap-northeast-2
```

**결과**:
- 비용: $45/월 → $0/월 (100% 절감)
- 모든 리소스 삭제
- 재배포: Docker 빌드 + Terraform (15분)

### 비용 절감 시나리오별 가이드

| 상황 | 추천 전략 | 월 비용 | 재시작 시간 |
|------|----------|---------|-------------|
| 오늘만 안 씀 | 전략 1 (ECS 중지) | $17 | 1~2분 |
| 이번 주 안 씀 | 전략 1 (ECS 중지) | $17 | 1~2분 |
| 한 달 이상 안 씀 | 전략 2 (인프라 삭제) | $0.20 | 5~10분 |
| 프로젝트 종료 | 전략 3 (완전 삭제) | $0 | 15분 |

---

## ✅ 체크리스트

### 즉시 해야 할 것 (오늘)

- [ ] AWS Console 로그인 확인
- [ ] 새 Access Key 발급
- [ ] 로컬 `~/.aws/credentials` 업데이트
- [ ] `aws sts get-caller-identity` 테스트
- [ ] 웹사이트 접속 확인 (http://energy-truck-alb-969796262...)

### 이번 주 내

- [ ] `.gitignore` 업데이트 및 커밋
- [ ] `.env.example` 생성
- [ ] AWS Budget 알림 설정 ($10 threshold)
- [ ] CloudWatch Logs 보관 기간 7일 설정
- [ ] 기존 Access Key 삭제 (Console에서)

### 선택 사항 (시간 날 때)

- [ ] Terraform state를 S3 백엔드로 이동
- [ ] MFA(Multi-Factor Authentication) 활성화
- [ ] IAM 권한 최소화 (least privilege 원칙)
- [ ] Cost Explorer에서 비용 추이 확인

### 사용 종료 시

- [ ] ECS 서비스 중지 (`desired-count 0`)
- [ ] 또는 Terraform destroy (완전 삭제)
- [ ] 비용 발생 중단 확인

---

## 📚 참고 자료

### AWS Console 주요 페이지

- **IAM (Access Key 관리)**: https://console.aws.amazon.com/iam/home
- **ECS (컨테이너 서비스)**: https://ap-northeast-2.console.aws.amazon.com/ecs/v2/clusters
- **EC2 > Load Balancers**: https://ap-northeast-2.console.aws.amazon.com/ec2/home?region=ap-northeast-2#LoadBalancers
- **ECR (이미지 저장소)**: https://ap-northeast-2.console.aws.amazon.com/ecr/repositories
- **CloudWatch Logs**: https://ap-northeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-2#logsV2:log-groups
- **Billing & Budgets**: https://console.aws.amazon.com/billing/home

### 주요 명령어 모음

```bash
# 인증 테스트
aws sts get-caller-identity

# ECS 서비스 상태 확인
aws ecs describe-services --cluster energy-truck-cluster \
  --services energy-truck-frontend-service energy-truck-backend-service \
  --region ap-northeast-2

# ALB DNS 확인
aws elbv2 describe-load-balancers --names energy-truck-alb \
  --region ap-northeast-2 --query 'LoadBalancers[0].DNSName' --output text

# 실행 중인 태스크 확인
aws ecs list-tasks --cluster energy-truck-cluster --region ap-northeast-2

# CloudWatch 로그 실시간 확인
aws logs tail /ecs/energy-truck-frontend --follow --region ap-northeast-2
aws logs tail /ecs/energy-truck-backend --follow --region ap-northeast-2
```

---

## 🎯 핵심 요약

### 현재 상황
1. ❌ Access Key 무효화 → 로컬 CLI 작업 불가
2. ✅ 웹 애플리케이션 정상 작동
3. ✅ AWS Console 접속 가능
4. 💰 월 $45 비용 발생 중

### 즉시 해야 할 일
1. 새 Access Key 발급 (AWS Console)
2. 로컬 AWS CLI 재설정 (`aws configure`)
3. 인증 테스트 (`aws sts get-caller-identity`)

### 비용 절감
- 사용 안 할 때: ECS 서비스 중지 ($17/월)
- 한 달 이상: 인프라 삭제 ($0.20/월)

---

**마지막 업데이트**: 2026-01-31  
**작성자**: Antigravity AI
