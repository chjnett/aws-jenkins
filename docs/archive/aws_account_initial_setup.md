# Phase 1: 새 AWS 계정 초기 설정 가이드

이 문서는 새 AWS 계정을 생성한 후, Terraform 및 CLI 사용을 위한 IAM User를 생성하고 권한을 부여하는 과정을 상세히 설명합니다.

## 1. IAM User 생성 (Terraform 배포용)

AWS 루트 계정(이메일 로그인)을 사용하는 것은 보안상 권장되지 않습니다. 따라서 인프라 배포를 위한 별도의 IAM User를 생성해야 합니다.

### 1. 단계: IAM 서비스 접속
1. AWS Console에 루트 계정으로 로그인합니다.
2. 상단 검색창에 **IAM**을 입력하고 선택하여 IAM 대시보드로 이동합니다.
3. 왼쪽 메뉴에서 **Users(사용자)**를 클릭합니다.
4. **Create user(사용자 생성)** 버튼을 클릭합니다.

### 2. 단계: 사용자 세부 정보 설정
* **User name**: `terraform-deploy` (또는 프로젝트에 맞는 식별 가능한 이름)
* **Provide user access to the AWS Management Console**: 체크 **해제** (CLI/Terraform 용도이므로 콘솔 접속 권한은 선택 사항이나, 보안을 위해 최소화하는 것이 좋습니다. 필요하다면 체크합니다.)
* **Next**를 클릭합니다.

### 3. 단계: 권한 설정 (중요)
이 단계에서 Terraform이 AWS 리소스를 생성하고 관리할 수 있도록 권한을 부여합니다.

1. **Permission options**에서 **Attach policies directly(직접 정책 연결)** 박스를 선택합니다.
2. 아래 **Permission policies(권한 정책)** 목록에서 검색창에 `AdministratorAccess`를 입력합니다.
    > **참고**: `AdministratorAccess`는 모든 리소스에 대한 전체 권한을 부여합니다. 초기 설정 및 광범위한 리소스 생성 편의를 위해 사용하지만, 프로덕션 환경에서는 최소 권한 원칙(Least Privilege)에 따라 필요한 권한만 부여하는 것이 모범 사례입니다.
3. 검색 결과에 나온 **AdministratorAccess** 옆의 체크박스를 선택합니다.
4. **Next**를 클릭합니다.

### 4. 단계: 검토 및 생성
1. 선택한 설정(User name, Permissions 등)을 확인합니다.
2. **Create user** 버튼을 클릭하여 사용자를 생성합니다.

---

## 2. Access Key (액세스 키) 발급

Terraform이 AWS API를 호출하기 위해서는 ID와 Password가 아닌 Access Key ID와 Secret Access Key가 필요합니다.

### 1. 단계: 보안 자격 증명(Security credentials) 이동
1. 사용자 목록에서 방금 생성한 `terraform-deploy` 사용자의 이름을 클릭합니다.
2. 화면 중간의 탭 메뉴에서 **Security credentials(보안 자격 증명)** 탭을 클릭합니다.

### 2. 단계: 액세스 키 생성
1. **Access keys** 섹션까지 스크롤을 내립니다.
2. **Create access key(액세스 키 만들기)** 버튼을 클릭합니다.
3. **Access key best practices & alternatives** 화면에서 **Command Line Interface (CLI)** 라디오 버튼을 선택합니다.
4. 하단의 "I understand..." 체크박스를 선택하고 **Next**를 클릭합니다.
5. (선택 사항) **Description tag**에 설명을 입력하고(예: `Terraform deployment key`) **Create access key**를 클릭합니다.

### 3. 단계: 키 저장 (매우 중요)
화면에 **Access key ID**와 **Secret access key**가 표시됩니다.

> [!WARNING]
> **Secret access key**는 이 화면에서 벗어나면 **다시는 확인할 수 없습니다.** 반드시 지금 안전하게 저장해야 합니다.

1. **Download .csv file** 버튼을 클릭하여 키 정보를 파일로 다운로드하고 안전한 곳에 보관합니다.
2. 또는 Access key ID와 Secret access key를 복사하여 패스워드 매니저 등에 저장합니다.
3. **Done**을 클릭하여 완료합니다.

## 3. 저장해야 할 정보 요약

향후 Terraform 설정(`terraform.tfvars` 또는 환경변수)에 사용할 정보입니다.

* **Account ID**: AWS 콘솔 우측 상단 계정 이름 옆의 숫자 (또는 대시보드에서 확인)
* **User Name**: `terraform-deploy`
* **Access Key ID**: `AKIA...` 로 시작하는 문자열
* **Secret Access Key**: (다운로드한 CSV 파일 확인)
* **Region**: `ap-northeast-2` (서울) - 리전은 변경 가능하나 주로 사용할 리전을 기억해둡니다.
