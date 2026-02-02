# 🤖 Jenkins 설정 및 실행 가이드

이 문서는 Docker로 Jenkins를 실행하고, AWS 배포 파이프라인을 설정하는 방법을 안내합니다.

---

## 🚀 1. Jenkins 실행하기

`docker-compose.yml`에 이미 Jenkins 설정이 포함되어 있습니다.

```bash
# Jenkins 실행 (백그라운드)
docker-compose up -d jenkins

# 로그 확인 (초기 비밀번호 확인용)
docker-compose logs -f jenkins
```

### 🔑 초기 비밀번호 확인
로그에서 다음과 같은 메시지를 찾으세요:
```
Please use the following password to proceed to installation:

Note: This password will also be found at: /var/jenkins_home/secrets/initialAdminPassword

********************************
(여기에 복잡한 비밀번호가 있습니다)
********************************
```
이 비밀번호를 복사해둡니다.

---

## 🛠️ 2. Jenkins 초기 설정

1. **브라우저 접속**: [http://localhost:9090](http://localhost:9090)
   - 포트 충돌 방지를 위해 `8080` 대신 `9090`으로 설정했습니다.
2. **비밀번호 입력**: 복사한 초기 비밀번호 붙여넣기
3. **플러그인 설치**: **"Install suggested plugins"** 클릭 (시간이 좀 걸립니다 ☕)
4. **관리자 계정 생성**:
   - Username: `admin` (또는 본인 이름)
   - Password: (기억하기 쉬운 비밀번호)
   - Full name, E-mail 입력
   - **Save and Finish**
5. **Jenkins URL**: [http://localhost:9090/](http://localhost:9090/) 그대로 두고 **Save and Finish**
6. **"Start using Jenkins"** 클릭

---

## 🔌 3. 필수 플러그인 설치

AWS 배포를 위해 추가 플러그인이 필요합니다.

1. **Jenkins 관리** -> **Plugins** -> **Available plugins**
2. 다음 플러그인 검색 및 설치:
   - `Docker Pipeline`
   - `Amazon ECR plugin` (Docker 이미지 푸시용)
   - `Pipeline: AWS Steps` (선택 사항)
   - `Blue Ocean` (시각적으로 보기 좋음, 선택 사항)
3. **"Download now and install after restart"** 선택
4. 설치 완료 후 **"Restart Jenkins"** 체크 또는 `docker-compose restart jenkins` 실행

---

## 🔐 4. 자격 증명 (Credentials) 설정

AWS에 접근하기 위한 키를 등록합니다.

### 방법 A: `jenkins/.env` 파일 사용 (가장 쉬움)
이미 프로젝트 폴더에 `jenkins/.env` 파일이 생성되었습니다. 여기에 키를 입력하면 Jenkins 컨테이너가 시작될 때 자동으로 환경 변수로 읽어옵니다.
**`jenkins/.env` 파일을 채워주세요!**

### 방법 B: Jenkins GUI에서 등록 (보안상 권장)
1. **Jenkins 관리** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**
2. **+ Add Credentials** 클릭
3. **AWS Account ID**:
   - Kind: **Secret text**
   - Secret: `123456789012` (본인 AWS 계정 ID)
   - ID: `AWS_ACCOUNT_ID`
   - Description: AWS Account ID
4. **AWS Access Key ID**:
   - Kind: **Secret text**
   - Secret: `AKIA...` (Access Key)
   - ID: `AWS_ACCOUNT_ID` (**주의**: Jenkinsfile에서 변수명 확인 필요. 보통 `AWS_ACCESS_KEY_ID`로 씀)
     - *잠깐!* `Jenkinsfile`을 보면 `AWS_ACCOUNT_ID` 변수는 있지만 Access Key는 환경 변수나 `~/.aws/credentials`를 사용하는 방식입니다.
     - Docker 방식에서는 환경 변수 주입이 더 편합니다. (방법 A 추천)

---

## 🛤️ 5. 파이프라인 생성

1. **Dashboard** -> **+ New Item**
2. 이름: `energy-truck-deploy`
3. **Pipeline** 선택 -> **OK**
4. **Pipeline** 섹션으로 스크롤:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/chjnett/aws-jenkins.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
5. **Save**

---

## ▶️ 6. 빌드 실행

1. **Build Now** 클릭
2. **Console Output**을 보면서 진행 상황 확인

### ⚠️ 예상되는 오류와 해결
- **Docker 권한 오류 ("permission denied while trying to connect to the Docker daemon")**:
  - `docker-compose.yml`에서 `/var/run/docker.sock`을 마운트해뒀고 `user: root`로 설정했으므로 대부분 해결됩니다.
- **AWS 인증 오류**:
  - `jenkins/.env` 파일에 Access Key가 제대로 들어있는지 확인하세요.

---

궁금한 점 있으면 물어보세요!
