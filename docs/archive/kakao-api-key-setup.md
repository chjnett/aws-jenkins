# 🔑 Kakao Maps API 키 발급 가이드

## 📌 빠른 시작

Kakao Maps를 사용하려면 **JavaScript 키**가 필요합니다. 아래 단계를 따라 5분 안에 발급받으세요!

---

## 1️⃣ Kakao Developers 계정 생성

### 1-1. 사이트 접속
[Kakao Developers](https://developers.kakao.com/) 접속

### 1-2. 로그인
- 카카오 계정으로 로그인
- 계정이 없다면 카카오톡 앱에서 사용하는 계정으로 가입

### 1-3. 개발자 등록 (처음 사용 시)
1. 우측 상단 **프로필 아이콘** 클릭
2. **개발자 등록** 클릭
3. 약관 동의 후 **등록하기**

---

## 2️⃣ 애플리케이션 생성

### 2-1. 내 애플리케이션 메뉴
1. 상단 메뉴에서 **내 애플리케이션** 클릭
2. **애플리케이션 추가하기** 버튼 클릭

### 2-2. 앱 정보 입력
```
앱 이름: Energy Truck
회사명: (선택사항)
```

### 2-3. 저장
**저장** 버튼 클릭하여 애플리케이션 생성 완료

---

## 3️⃣ JavaScript 키 발급

### 3-1. 앱 선택
생성한 **Energy Truck** 애플리케이션 클릭

### 3-2. 앱 키 확인
1. 좌측 메뉴에서 **앱 키** 탭 클릭
2. **JavaScript 키** 찾기

```
JavaScript 키: 1234567890abcdef1234567890abcdef
```

### 3-3. 키 복사
**JavaScript 키** 옆의 복사 버튼 클릭

> ⚠️ **주의**: REST API 키가 아닌 **JavaScript 키**를 사용해야 합니다!

---

## 4️⃣ 플랫폼 등록

### 4-1. 플랫폼 설정
1. 좌측 메뉴에서 **플랫폼** 탭 클릭
2. **Web 플랫폼 등록** 버튼 클릭

### 4-2. 사이트 도메인 입력

#### 로컬 개발 환경
```
http://localhost:3000
```

#### 프로덕션 환경 (배포 후)
```
https://yourdomain.com
https://www.yourdomain.com
```

> 💡 **팁**: 여러 도메인을 등록할 수 있습니다. 로컬과 프로덕션 모두 등록하세요!

### 4-3. 저장
**저장** 버튼 클릭

---

## 5️⃣ 프로젝트에 API 키 설정

### 5-1. 환경 변수 파일 생성

프로젝트 루트에서:

```bash
cd c:\workspace2\aws_pro1\energy-trading-app
copy .env.local.example .env.local
```

### 5-2. API 키 입력

`.env.local` 파일을 열고 발급받은 키를 입력:

```env
# Kakao Maps API Key
NEXT_PUBLIC_KAKAO_MAP_KEY=1234567890abcdef1234567890abcdef

# Supabase (기존)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ **중요**: `1234567890abcdef1234567890abcdef`를 실제 발급받은 키로 교체하세요!

### 5-3. 개발 서버 재시작

```bash
# 개발 서버가 실행 중이라면 Ctrl+C로 중지 후
npm run dev
```

---

## 6️⃣ 동작 확인

### 6-1. 브라우저 접속
```
http://localhost:3000
```

### 6-2. 로그인 후 대시보드 확인
1. 로그인 화면에서 로그인
2. 대시보드의 **가격 추이** 섹션에 제주도 지도가 표시되는지 확인

### 6-3. 콘솔 확인
브라우저 개발자 도구(F12) → Console 탭에서:

```
✅ Kakao Maps SDK 로드 완료
```

메시지가 표시되면 성공!

---

## 🐛 문제 해결

### 문제 1: "Kakao Maps SDK가 로드되지 않았습니다"

**원인**: API 키가 설정되지 않았거나 잘못됨

**해결**:
1. `.env.local` 파일이 존재하는지 확인
2. `NEXT_PUBLIC_KAKAO_MAP_KEY` 값이 올바른지 확인
3. 개발 서버 재시작

```bash
# 서버 중지 (Ctrl+C)
npm run dev
```

### 문제 2: "Invalid appkey"

**원인**: 잘못된 API 키 또는 플랫폼 미등록

**해결**:
1. Kakao Developers에서 JavaScript 키 재확인
2. 플랫폼에 `http://localhost:3000` 등록 확인
3. 키 복사 시 공백이 포함되지 않았는지 확인

### 문제 3: 지도가 표시되지 않음

**원인**: 도메인이 플랫폼에 등록되지 않음

**해결**:
1. Kakao Developers → 플랫폼 탭
2. Web 플랫폼에 현재 도메인 추가
3. 페이지 새로고침

### 문제 4: CORS 에러

**원인**: 등록되지 않은 도메인에서 접근

**해결**:
```
Kakao Developers → 플랫폼 → Web 플랫폼 등록
현재 사용 중인 도메인 추가
```

---

## 📊 API 키 관리 팁

### 보안
- ✅ `.env.local` 파일은 `.gitignore`에 포함되어 있음 (커밋되지 않음)
- ✅ `NEXT_PUBLIC_` 접두사가 있는 환경 변수는 클라이언트에 노출됨
- ⚠️ JavaScript 키는 브라우저에 노출되므로 플랫폼 등록으로 보호

### 키 재발급
1. Kakao Developers → 내 애플리케이션
2. 앱 키 탭 → **키 재발급** 버튼
3. `.env.local` 파일 업데이트
4. 개발 서버 재시작

### 사용량 모니터링
1. Kakao Developers → 내 애플리케이션
2. **통계** 탭에서 API 호출 횟수 확인
3. 무료 할당량: 월 300,000건

---

## 🚀 다음 단계

### 1. 지도 커스터마이징
[`components/kakao-map.tsx`](file:///c:/workspace2/aws_pro1/energy-trading-app/components/kakao-map.tsx) 파일 수정

### 2. 마커 데이터 연동
Supabase에서 실제 에너지 거래 데이터 가져오기

### 3. 고급 기능 추가
- 현재 위치 표시
- 마커 클러스터링
- 경로 그리기

자세한 내용은 [`docs/kakao-maps-guide.md`](file:///c:/workspace2/aws_pro1/docs/kakao-maps-guide.md) 참고

---

## 📚 참고 자료

- [Kakao Maps API 공식 문서](https://apis.map.kakao.com/web/)
- [JavaScript API 가이드](https://apis.map.kakao.com/web/guide/)
- [샘플 코드](https://apis.map.kakao.com/web/sample/)
- [FAQ](https://devtalk.kakao.com/c/kakao-map)

---

## ✅ 체크리스트

완료한 항목에 체크하세요:

- [ ] Kakao Developers 계정 생성
- [ ] 애플리케이션 생성 (Energy Truck)
- [ ] JavaScript 키 발급
- [ ] 플랫폼 등록 (`http://localhost:3000`)
- [ ] `.env.local` 파일 생성
- [ ] API 키 입력
- [ ] 개발 서버 재시작
- [ ] 브라우저에서 지도 확인
- [ ] 콘솔에서 "SDK 로드 완료" 메시지 확인

---

**Energy Truck** - 5분 만에 Kakao Maps 연동 완료! 🗺️⚡
