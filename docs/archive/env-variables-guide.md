# 🔐 환경 변수 설정 완벽 가이드

이 문서는 **어떤 환경 변수가 필요한지**, **어디에 설정하는지**, **어떻게 얻는지**를 명확하게 설명합니다.

---

## 📋 환경 변수 전체 목록

### 1️⃣ 로컬 개발용 (`backend/.env`)

```env
# ===== Supabase 데이터베이스 =====
SUPABASE_URL=https://loohzspmcmafmxachwpg.supabase.co
SUPABASE_KEY=sb_publishable_9bo2qkG-FpOMYhax3yw_xA_muermteP

# ===== AWS 배포용 (Terraform) =====
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=ap-northeast-2
```

### 2️⃣ AWS 배포용 (`terraform/ecs.tf`)

```hcl
environment = [
  { name = "SUPABASE_URL", value = "https://loohzspmcmafmxachwpg.supabase.co" },
  { name = "SUPABASE_KEY", value = "sb_publishable_..." }
]
```

---

## ❓ 자주 묻는 질문 (FAQ)

### Q1. PostgreSQL 링크(`DATABASE_URL`)도 필요한가요?

**A: 아니요, Supabase를 쓴다면 불필요합니다.**

- **Supabase는 PostgreSQL 기반 서비스**입니다.
- 백엔드 코드에서 `SUPABASE_URL`과 `SUPABASE_KEY`를 사용하면 자동으로 PostgreSQL에 연결됩니다.
- `terraform/ecs.tf`의 `DATABASE_URL`은 **예시일 뿐**이고, 실제로는 삭제해도 됩니다.

**결론**: `SUPABASE_URL`과 `SUPABASE_KEY`만 있으면 충분합니다.

---

### Q2. AWS Access Key는 어디서 얻나요?

**A: AWS IAM 콘솔에서 발급받습니다.**

#### 발급 방법:

1. **AWS Management Console 로그인**: https://console.aws.amazon.com
2. **IAM (Identity and Access Management)** 서비스로 이동
3. 좌측 메뉴에서 **"Users(사용자)"** 클릭
4. 본인 사용자 이름 클릭 (또는 새 사용자 생성)
5. **"Security credentials(보안 자격 증명)"** 탭 선택
6. **"Create access key(액세스 키 만들기)"** 버튼 클릭
7. 용도 선택: **"CLI" 또는 "Command Line Interface"** 선택
8. 다운로드 또는 복사:
   - `Access Key ID`: `AKIA...`로 시작
   - `Secret Access Key`: 딱 한 번만 보여줍니다! 반드시 복사해두세요.

#### ⚠️ 주의사항:
- Secret Access Key는 다시 볼 수 없으므로 안전한 곳에 저장하세요.
- 절대 GitHub에 올리지 마세요 (`.gitignore`에 `.env` 포함되어 있음).

---

### Q3. 현재 AWS 키가 이미 있는데, 맞는 건가요?

**A: 네, `backend/.env`에 이미 설정되어 있습니다.**

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=ap-northeast-2
```

이 키들이 유효한지 확인하려면:

```bash
# WSL 터미널에서
cd /mnt/c/workspace2/aws_pro1
docker-compose run --rm terraform init
```

만약 **"Access Denied"** 에러가 나면 키가 만료되었거나 잘못된 것이므로, 위 Q2 방법으로 재발급받으세요.

---

## 🛠️ 최종 설정 체크리스트

### ✅ 로컬 개발 (`backend/.env`)

- [ ] `SUPABASE_URL` - Supabase 프로젝트 URL
- [ ] `SUPABASE_KEY` - Supabase Anon/Public Key
- [ ] `AWS_ACCESS_KEY_ID` - Terraform용 (배포할 때만 필요)
- [ ] `AWS_SECRET_ACCESS_KEY` - Terraform용 (배포할 때만 필요)
- [ ] `AWS_DEFAULT_REGION` - 기본값: `ap-northeast-2`

### ✅ AWS 배포 (`terraform/ecs.tf`)

- [ ] `SUPABASE_URL` 값 수정 (**현재 placeholder**)
- [ ] `SUPABASE_KEY` 값 수정 (**현재 placeholder**)
- [ ] `DATABASE_URL` 삭제 (선택, Supabase 쓸 거면 불필요)
- [ ] `SECRET_KEY` 설정 (FastAPI JWT용, 아무 랜덤 문자열)

---

## 📝 다음 단계

1. **`backend/.env` 확인**: 위 체크리스트대로 값이 채워졌는지 확인
2. **`terraform/ecs.tf` 수정**: 
   ```bash
   # 57번째 줄 삭제 (DATABASE_URL)
   # 58-59번째 줄의 placeholder를 실제 값으로 교체
   ```
3. **테스트**:
   ```bash
   docker-compose run --rm terraform init  # Terraform 초기화 테스트
   ```

궁금한 점 있으면 언제든 물어보세요! 🚀
