# 🤔 Jenkins 설치가 필요한가요?

**TL;DR**: 지금은 필요 없습니다. 먼저 인프라를 구축하고 수동 배포로 테스트한 후, 자동화가 필요할 때 설치하세요.

---

## 📊 배포 단계별 도구 필요성

| 단계 | 해야 할 일 | 필요한 도구 | Jenkins 필요? |
|------|-----------|------------|--------------|
| **1단계** | AWS 인프라 구축 | Terraform (Docker) | ❌ 불필요 |
| **2단계** | Docker 이미지 수동 빌드 & 푸시 | Docker, AWS CLI | ❌ 불필요 |
| **3단계** | 첫 배포 테스트 | ECS, ALB | ❌ 불필요 |
| **4단계** | 코드 수정 → 재배포 (수동) | Docker | ❌ 불필요 |
| **5단계** | 자동 배포 파이프라인 구축 | Jenkins | ✅ **필요** |

---

## ✅ 현재 해야 할 일 (Jenkins 없이)

### 1️⃣ Terraform으로 인프라 구축
```bash
# WSL 터미널
cd /mnt/c/workspace2/aws_pro1
docker-compose run --rm terraform init
docker-compose run --rm terraform plan
docker-compose run --rm terraform apply
```

이 단계에서 생성되는 것:
- VPC, 서브넷, 보안 그룹
- ECR (Docker 이미지 저장소)
- ECS 클러스터
- ALB (로드 밸런서)

### 2️⃣ Docker 이미지 수동 빌드 & 푸시
```bash
# 1. AWS ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com

# 2. 백엔드 빌드 & 푸시
docker build -t energy-truck-backend ./backend
docker tag energy-truck-backend:latest [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest
docker push [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-backend:latest

# 3. 프론트엔드 빌드 & 푸시
docker build -t energy-truck-frontend ./energy-trading-app --target production
docker tag energy-truck-frontend:latest [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest
docker push [ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest
```

### 3️⃣ ECS 서비스 배포 확인
AWS 콘솔에서 ECS → Cluster → Tasks 확인하여 컨테이너가 실행 중인지 확인.

---

## 🤖 Jenkins는 언제 설치하나요?

다음 중 하나라도 해당되면 Jenkins를 고려하세요:

### ✅ Jenkins 설치 시점
- [ ] 인프라가 완전히 구축되었고, 수동 배포에 성공했다
- [ ] 코드 변경 시마다 수동 배포하는 게 귀찮다
- [ ] 팀원들이 코드를 푸시할 때 자동으로 배포되었으면 좋겠다
- [ ] 배포 이력을 관리하고 싶다

### ❌ 지금 설치하지 말아야 하는 이유
- 인프라가 없는데 CI/CD를 먼저 만들면 테스트할 곳이 없습니다.
- Jenkins 설정이 복잡해서 디버깅 포인트가 늘어납니다.
- 수동 배포로 먼저 워크플로우를 이해하는 게 중요합니다.

---

## 🚀 지금 해야 할 것: 우선순위

### 1순위: Terraform 실행 ⭐⭐⭐
```bash
docker-compose run --rm terraform init
docker-compose run --rm terraform plan
```

### 2순위: 환경 변수 점검
- `backend/.env` - AWS 키 확인
- `terraform/ecs.tf` - Supabase 값 확인

### 3순위: AWS Account ID 확인
```bash
aws sts get-caller-identity --query Account --output text
```

---

## 💡 Jenkins 설치 방법 (미래를 위한 참고)

나중에 필요할 때를 위해 간단히 안내:

### Docker Compose 방식
`docker-compose.yml`에 추가:
```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    user: root
    ports:
      - "8080:8080"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    env_file:
      - ./jenkins/.env

volumes:
  jenkins_home:
```

실행:
```bash
docker-compose up -d jenkins
```

접속: `http://localhost:8080`

---

## 📝 결론

**현재 단계**: Jenkins 없이 Terraform + 수동 Docker 빌드/푸시로 충분합니다.

**다음 문서**: [`docs/deployment_master_guide.md`](./deployment_master_guide.md)의 STEP 1부터 실행하세요!

궁금한 점 있으면 언제든 물어보세요! 🚀
