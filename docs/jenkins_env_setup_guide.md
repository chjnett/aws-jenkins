# 🔐 Jenkins 환경 변수(.env) 설정 가이드

Docker로 실행되는 Jenkins가 AWS 리소스(ECR, ECS)에 접근할 수 있도록 **접속 권한(Key)**을 설정하는 파일입니다.
이 파일은 보안상 **외부에 유출되면 안 되므로** `.gitignore`에 자동 포함되어야 합니다.

---

## 1. 파일 생성 위치
프로젝트 최상위 폴더(`aws_pro1`) 안에 `jenkins` 폴더를 만들고 그 안에 `.env` 파일을 만듭니다.

*   **경로**: `/mnt/c/workspace2/aws_pro1/jenkins/.env`

```bash
# 터미널 명령어
cd /mnt/c/workspace2/aws_pro1
mkdir -p jenkins
nano jenkins/.env
```

## 2. `.env` 파일 내용 (복사 붙여넣기)
`nano` 편집기가 열리면 아래 내용을 복사해서 붙여넣으세요.
**(주의: 본인의 실제 Access Key 값을 넣어야 합니다!)**

```bash
# AWS 접속 ID (CSV 파일의 Access key ID)
AWS_ACCESS_KEY_ID=AKIA4SKJYGDGG4SOMJHU

# AWS 비밀번호 (CSV 파일의 Secret access key)
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY_HERE

# AWS 리전 (서울)
AWS_DEFAULT_REGION=ap-northeast-2

# AWS 계정 ID (숫자 12자리)
AWS_ACCOUNT_ID=863979974860
```

> **Tip**: `AWS_SECRET_ACCESS_KEY`는 이전에 다운로드 받은 `terraform-deploy_accessKeys.csv` 파일 안에 들어있습니다.

## 3. 저장 및 종료 방법 (nano 기준)
1.  내용 붙여넣기 후
2.  `Ctrl + O` 누르고 `Enter` (저장)
3.  `Ctrl + X` (종료)

## 4. 적용 확인
파일을 만든 후 Jenkins를 다시 실행해야 적용됩니다.

```bash
docker-compose down
docker-compose up -d jenkins
```
