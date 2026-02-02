# 🐳 Docker + WSL 2 기반 AWS 인프라 구축 가이드

이 문서는 **Windows 사용자가 WSL 2 (Windows Subsystem for Linux) 환경**에서 Docker를 사용하여 AWS 인프라를 구축하는 방법을 안내합니다.
WSL 2를 사용하면 Windows의 고질적인 **파일 잠금(File Locking) 문제**를 피하고, 리눅스 환경과 동일한 쾌적한 개발 경험을 할 수 있습니다.

---

## 1. 사전 준비 (Prerequisites)

1.  **WSL 2 설치 및 설정**:
    *   PowerShell(관리자)에서 `wsl --install` 실행 후 재부팅.
    *   Ubuntu 등 리눅스 배포판 설치 완료.
2.  **Docker Desktop 설정**:
    *   Settings -> General -> **Use the WSL 2 based engine** 체크.
    *   Settings -> Resources -> WSL Integration -> **Ubuntu(사용 중인 배포판)** 스위치 ON.
3.  **AWS Key 준비**: 
    *   `Access Key ID`와 `Secret Access Key`.

---

## 2. 프로젝트 준비 (WSL 내부에서 진행)

**중요**: Windows 터미널(PowerShell)이 아닌, **WSL 터미널(Ubuntu)**을 열어서 진행하세요.

1.  **프로젝트 경로 이동**:
    ```bash
    # Windows의 c:\workspace2\aws_pro1 로 이동하려면
    cd /mnt/c/workspace2/aws_pro1
    ```

2.  **환경 변수 설정 (`backend/.env`)**:
    AWS 자격 증명을 `backend/.env` 파일에 추가합니다. (Windows에서 편집해도 됩니다)

    ```env
    # AWS Credentials for Terraform
    AWS_ACCESS_KEY_ID=여기에_Access_Key_입력
    AWS_SECRET_ACCESS_KEY=여기에_Secret_Key_입력
    AWS_DEFAULT_REGION=ap-northeast-2
    ```

    > **보안 주의**: 이 파일은 절대 GitHub에 올리지 마세요 (`.gitignore`에 포함됨).

---

## 3. Terraform 컨테이너 설정 (`docker-compose.yml`)

프로젝트 루트의 `docker-compose.yml`에 Terraform 실행을 위한 서비스가 이미 설정되어 있습니다 (제가 추가해 두었습니다).

```yaml
  terraform:
    image: hashicorp/terraform:latest
    working_dir: /workspace
    volumes:
      - ./terraform:/workspace
    env_file:
      - ./backend/.env
```

---

## 4. 인프라 구축 명령어 (WSL 터미널에서 실행)

이제 로컬에 Terraform을 설치할 필요 없이, Docker를 통해 명령어를 실행합니다.

### 4-1. 초기화 (Init)
가장 먼저 실행해야 합니다. 필요한 플러그인을 다운로드합니다.

```bash
docker-compose run --rm terraform init
```

### 4-2. 계획 확인 (Plan)
생성될 리소스를 미리 확인합니다.

```bash
docker-compose run --rm terraform plan
```

### 4-3. 적용 (Apply)
실제로 AWS 리소스를 생성합니다. 비용이 발생할 수 있습니다.

```bash
docker-compose run --rm terraform apply
```
*   실행 중 `Enter a value:` 가 나오면 `yes` 입력 후 엔터.

---

## 5. 꿀팁 & 문제 해결

*   **속도 문제**: `/mnt/c/...` 경로는 Windows 파일 시스템을 거치므로 다소 느릴 수 있습니다. 더 빠른 속도를 원한다면 프로젝트를 WSL 내부 파일 시스템(`~/project` 등)으로 옮기는 것이 좋지만, 현재 설정으로도 Terraform 작업에는 충분합니다.
*   **권한 문제**: 만약 `permission denied`가 뜬다면 `sudo`를 붙이거나 `docker` 그룹 권한을 확인하세요.
*   **리소스 삭제 (Destroy)**:
    ```bash
    docker-compose run --rm terraform destroy
    ```

이제 윈도우 환경 설정 스트레스 없이 인프라를 구축해보세요! 🚀
