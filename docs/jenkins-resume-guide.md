# 🔄 Jenkins 작업 재개 가이드 (Resume Guide)

젠킨스 설정 중 중단되었을 때, 이어서 진행하는 방법입니다.

## 1. Jenkins 실행 상태 확인

터미널에서 다음 명령어로 젠킨스가 켜져 있는지 확인합니다.

```bash
docker ps
```

- **`jenkins` 컨테이너가 보이면?** → 바로 **2단계**로 이동!
- **안 보이면?** → 다시 켜주세요:
  ```bash
  docker-compose up -d jenkins
  ```

## 2. 브라우저 접속

- 주소: [http://localhost:9090](http://localhost:9090)
- 로그인 ( 계정 생성을 아직 안 했다면, `admin` / 초기 비밀번호 입력)

> **💡 초기 비밀번호를 까먹었다면?**
> ```bash
> docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
> ```
> 위 명령어를 입력하면 비밀번호가 나옵니다.

## 3. 필수 설정 체크 (어디까지 했는지 확인)

### ✅ A. 플러그인 설치 (Plugins)
- `Jenkins 관리` → `Plugins` → `Installed plugins` 메뉴로 이동.
- `Docker Pipeline`, `Amazon ECR plugin` 이미 있는지 확인.
- 없다면 `Available plugins` 탭에서 검색해서 설치 후 재시작.

### ✅ B. AWS 키 설정 (Credentials)
- 프로젝트 폴더의 `jenkins/.env` 파일을 열어보세요.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 등이 잘 들어있으면 **OK**입니다. (별도 설정 불필요)

## 4. 파이프라인(배포 작업) 만들기

이제 배포 자동화를 만들 차례입니다.

1. Jenkins 메인 화면 → **`New Item`** (새로운 작업) 클릭
2. 이름: `energy-truck-deploy` 입력
3. **`Pipeline`** 선택 → **OK**
4. 설정 화면 맨 아래 **Pipeline** 섹션:
   - **Definition**: `Pipeline script from SCM` 선택
   - **SCM**: `Git` 선택
   - **Repository URL**: (현재 작업 중인 GitHub 주소)
     - *로컬 테스트 중이라면 잠시 비워두거나, `jenkins/` 폴더 안의 Jenkinsfile 스크립트를 직접 복사해서 `Pipeline script` 모드로 테스트할 수도 있습니다.*
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. **Save** (저장)

## 5. 실행! (Build Now)

- 왼쪽 메뉴의 **`Build Now`** 클릭
- 아래쪽 **Build History**에서 파란색 공(성공)이 뜨면 배포 완료! 🔴 빨간색이면 실패.

---
**Tip**: 에러가 나면 **Console Output**을 확인하고 저에게 알려주세요!
