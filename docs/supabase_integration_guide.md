# Supabase 연동 가이드 (로그인 제외, 데이터베이스만 사용)

현재 로컬 상태(State)로만 관리되고 있는 에너지 판매 데이터를 Supabase 데이터베이스에 실제로 저장하고 불러오도록 연동하는 가이드입니다.
로그인(Auth) 기능 없이, 누구나 판매 요청을 올릴 수 있거나 혹은 정해진 API 키로만 접근하는 방식을 가정합니다.

## 1. Supabase 프로젝트 설정

Supabase 대시보드에서 새 프로젝트를 생성한 후, 아래 과정을 진행합니다.

### 1.1 테이블 생성 (`energy_sales`)
`SQL Editor`에서 아래 쿼리를 실행하여 테이블을 생성합니다.

```sql
create table public.energy_sales (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  area numeric not null, -- 설치 면적
  region text not null, -- 지역 (JEJU_EAST 등)
  coefficient numeric not null, -- 발전 계수
  monthly_energy numeric not null, -- 월간 예상 발전량
  profit numeric not null, -- 예상 수익
  status text not null default 'pending', -- 상태 (pending, approved, collected 등)
  
  constraint energy_sales_pkey primary key (id)
);
```

### 1.2 Row Level Security (RLS) 설정
로그인 없이도 데이터를 쓰게(INSERT) 하려면 RLS 정책을 열어줘야 합니다.
(보안상 취약할 수 있으므로, 실제 서비스 시에는 익명 인증(Anonymous Auth) 등을 고려해야 하지만 여기서는 가장 단순한 방법을 안내합니다.)

1.  `Authentication` > `Policies` 로 이동
2.  `energy_sales` 테이블의 RLS가 `Enable` 되어 있다면, `New Policy` 클릭
3.  **Insert Policy**: `Enable insert for anon (public) role`
    - `WITH CHECK expression`: `true`
4.  **Select Policy**: `Enable select for anon (public) role`
    - `USING expression`: `true`

---

## 2. 프로젝트 코드 수정

### 2.1 패키지 설치
Next.js 프로젝트(`energy-trading-app`) 폴더에서 Supabase 클라이언트를 설치합니다.

```bash
npm install @supabase/supabase-js
```

### 2.2 환경 변수 설정 (`.env.local`)
Supabase 대시보드(`Settings` > `API`)에서 URL과 Anon Key를 복사하여 `.env.local` 파일을 생성(또는 수정)합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Supabase 클라이언트 생성 (`utils/supabase.ts`)
`energy-trading-app/utils` 폴더(없으면 생성)에 `supabase.ts` 파일을 만듭니다.

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2.4 판매 로직 수정 (`sell-drawer.tsx`)
기존의 `handleActivateListing` 함수(현재는 버튼 클릭 시 UI만 변경)를 수정하여 실제 DB에 저장하도록 변경합니다.

```typescript
import { supabase } from '@/utils/supabase' // 위에서 만든 클라이언트 import

// ...

const handleActivateListing = async () => {
  setIsCalculating(true) // 로딩 표시용 (UI에 추가 필요)

  const { data, error } = await supabase
    .from('energy_sales')
    .insert([
      {
        area: Number(area),
        region: selectedRegion,
        coefficient: currentCoefficient,
        monthly_energy: calculatedEnergy / 0.7, // 역산 or 별도 state 저장 추천
        profit: calculatedProfit,
        status: 'active'
      },
    ])

  if (error) {
    console.error('Error inserting data:', error)
    alert('저장에 실패했습니다.')
    setIsCalculating(false)
    return
  }

  // 성공 시
  setIsListingActive(true)
  setStep('active')
  setIsCalculating(false)
}
```

---

## 3. Docker 배포 시 주의사항

Docker로 배포할 때는 환경 변수를 컨테이너에 주입해야 합니다.

### 3.1 `docker-compose.yml` 수정
`frontend` 서비스 섹션에 환경 변수를 추가합니다. API Key는 보안 정보이므로 `.env` 파일을 통해 주입하는 것이 가장 좋습니다.

**방법 A: `.env` 파일 사용 (권장)**
프로젝트 루트의 `.env` 파일에 위에서 설정한 변수들을 추가하고, `docker-compose.yml`에서 참조합니다.

```yaml
  frontend:
    # ... 기존 설정 ...
    env_file:
      - .env # 여기에 NEXT_PUBLIC_SUPABASE_... 가 있어야 함
```

**참고**: Next.js는 빌드 타임(Build Time)에 `NEXT_PUBLIC_` 변수를 코드에 박아넣습니다(Inlining).
따라서 운영 환경(Production) 이미지를 빌드할 때는 **빌드 시점**에 이 변수들이 있어야 합니다.
개발 모드(`next dev`)에서는 런타임에 읽어오므로 `env_file`로 주입해주면 됩니다.
