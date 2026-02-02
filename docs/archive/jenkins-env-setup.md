# 🤖 Jenkins 환경 변수 설정 가이드 (Docker 기반)

**문제**: `Jenkinsfile` 5번째 줄에 `AWS_ACCOUNT_ID = 'your-aws-account-id'` placeholder가 있습니다.

이 문서는 **Docker로 Jenkins를 관리**하면서 안전하게 환경 변수를 주입하는 방법을 설명합니다.

---

## 🎯 두 가지 방법

### 방법 1️⃣: Jenkins를 Docker Compose로 실행 (권장)

`docker-compose.yml`에 Jenkins 서비스를 추가하여, 다른 서비스들과 함께 관리합니다.

#### 설정 방법:

**`docker-compose.yml`에 추가**:
```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    user: root  # Docker 소켓 접근을 위해
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock  # Docker-in-Docker
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
    env_file:
      - ./jenkins/.env  # Jenkins 전용 환경변수

volumes:
  jenkins_home:
```

**`jenkins/.env` 파일 생성**:
```env
# AWS 자격 증명
AWS_ACCOUNT_ID=123456789012
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=ap-northeast-2
```

**실행**:
```bash
docker-compose up -d jenkins
```

---

### 방법 2️⃣: Jenkins Credentials 사용 (기존 Jenkins 서버)

이미 외부 Jenkins 서버가 있다면, Jenkins UI에서 Credentials를 등록합니다.

#### 1. Jenkins 관리 페이지 접속
- `Jenkins 관리` → `Manage Credentials` → `Global credentials (unrestricted)` → `Add Credentials`

#### 2. Credential 추가

| 항목 | 값 |
|------|-----|
| Kind | Secret text |
| Scope | Global |
| Secret | `123456789012` (AWS Account ID) |
| ID | `AWS_ACCOUNT_ID` |
| Description | AWS Account ID |

같은 방식으로 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 추가.

#### 3. `Jenkinsfile` 수정

```groovy
pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = credentials('AWS_ACCOUNT_ID')  // Jenkins Credential ID
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = 'ap-northeast-2'
        ECR_REPO_FRONTEND = 'energy-truck-frontend'
        ECR_REPO_BACKEND = 'energy-truck-backend'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        CLUSTER_NAME = 'energy-truck-cluster'
        SERVICE_FRONTEND = 'energy-truck-frontend-service'
        SERVICE_BACKEND = 'energy-truck-backend-service'
    }
    
    // ... 나머지 stages
}
```

---

## ❓ AWS Account ID는 어디서 찾나요?

1. **AWS Management Console 로그인**
2. 우측 상단 계정 이름 클릭
3. **Account ID** 확인 (12자리 숫자)
   - 예: `123456789012`

또는 터미널에서:
```bash
aws sts get-caller-identity --query Account --output text
```

---

## 🔒 보안 주의사항

### ⚠️ 절대 하지 말 것:
```groovy
// ❌ 나쁜 예: 직접 하드코딩
environment {
    AWS_ACCOUNT_ID = '123456789012'
    AWS_SECRET_ACCESS_KEY = 'OxFAjqgm...'  // 절대 안 됨!
}
```

### ✅ 올바른 방법:
1. **Jenkins Credentials** 사용
2. **환경 변수 파일** (`.env`) 사용 + `.gitignore`에 추가
3. **AWS Secrets Manager** 또는 **Parameter Store** 사용 (고급)

---

## 📝 최종 체크리스트

Docker Compose 방식:
- [ ] `jenkins/.env` 파일 생성
- [ ] AWS Account ID, Access Key 입력
- [ ] `.gitignore`에 `jenkins/.env` 추가
- [ ] `docker-compose up -d jenkins` 실행

Jenkins Credentials 방식:
- [ ] Jenkins UI에서 Credentials 등록
- [ ] `Jenkinsfile`에서 `credentials()` 함수 사용
- [ ] Pipeline 테스트 실행

---

**어느 방법이 좋을까요?**
- **간단한 프로젝트**: Docker Compose 방식 (일관성 있는 환경)
- **팀 협업 / 보안 중요**: Jenkins Credentials 방식 (세밀한 권한 관리)

궁금한 점 있으면 언제든 물어보세요! 🚀
