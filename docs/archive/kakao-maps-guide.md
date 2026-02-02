# 🗺️ Kakao Maps 연동 가이드

## 개요
Energy Truck 프로젝트에 카카오맵을 연동하여 제주도 내 에너지 거래 위치를 시각화합니다.

---

## 📋 사전 준비

### 1. Kakao Developers 계정 생성
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. 개발자 등록 (처음 사용 시)

### 2. 애플리케이션 등록
1. **내 애플리케이션** 메뉴 클릭
2. **애플리케이션 추가하기** 클릭
3. 앱 정보 입력:
   - **앱 이름**: Energy Truck
   - **사업자명**: (선택사항)
4. **저장** 클릭

### 3. JavaScript 키 발급
1. 생성한 애플리케이션 선택
2. **앱 키** 탭에서 **JavaScript 키** 복사
3. `.env.local` 파일에 추가:

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=your_javascript_key_here
```

### 4. 플랫폼 등록
1. **플랫폼** 탭 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 입력:
   - 로컬: `http://localhost:3000`
   - 프로덕션: `https://yourdomain.com`

---

## 🛠️ 설치 및 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
cd c:\workspace2\aws_pro1\energy-trading-app
copy .env.local.example .env.local
```

`.env.local` 파일 수정:

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=your_actual_javascript_key
```

### 2. TypeScript 설정 확인

`tsconfig.json`에 types 경로가 포함되어 있는지 확인:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

---

## 📦 구현된 컴포넌트

### 1. KakaoMap 컴포넌트
**파일**: `components/kakao-map.tsx`

기본 카카오맵 컴포넌트로, 다양한 옵션을 지원합니다.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `{ lat: number, lng: number }` | `{ lat: 33.4996, lng: 126.5312 }` | 지도 중심 좌표 (제주도) |
| `level` | `number` | `10` | 지도 확대/축소 레벨 (1-14) |
| `className` | `string` | `''` | CSS 클래스명 |
| `markers` | `Array<Marker>` | `[]` | 마커 배열 |
| `onMarkerClick` | `(marker: any) => void` | - | 마커 클릭 이벤트 핸들러 |

#### 사용 예시

```tsx
import { KakaoMap } from '@/components/kakao-map'

export default function MapPage() {
  const markers = [
    {
      position: { lat: 33.4996, lng: 126.5312 },
      title: '제주시',
      content: '<strong>제주시 에너지 허브</strong><br/>판매: 50kWh',
    },
  ]

  return (
    <KakaoMap
      center={{ lat: 33.4996, lng: 126.5312 }}
      level={10}
      markers={markers}
      className="h-[500px]"
    />
  )
}
```

### 2. EnergyMapView 컴포넌트
**파일**: `components/energy-map-view.tsx`

에너지 거래 지도 전체 페이지 컴포넌트입니다.

#### 기능
- ✅ 제주도 에너지 거래 위치 표시
- ✅ 마커 클릭 시 상세 정보 표시
- ✅ 거래 목록 그리드 뷰
- ✅ 반응형 레이아웃 (모바일/태블릿/데스크톱)

#### 사용 예시

```tsx
import { EnergyMapView } from '@/components/energy-map-view'

export default function MapPage() {
  return <EnergyMapView />
}
```

---

## 🎨 커스터마이징

### 지도 스타일 변경

```tsx
<KakaoMap
  center={{ lat: 33.4996, lng: 126.5312 }}
  level={8}
  className="h-[600px] rounded-xl shadow-lg"
/>
```

### 커스텀 마커 아이콘

```tsx
useEffect(() => {
  if (!mapRef.current || !window.kakao) return

  const imageSrc = '/marker-icon.png' // 커스텀 아이콘 경로
  const imageSize = new window.kakao.maps.Size(40, 40)
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

  const marker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(33.4996, 126.5312),
    image: markerImage,
  })

  marker.setMap(mapRef.current)
}, [])
```

### 지도 컨트롤 커스터마이징

```tsx
// 지도 타입 컨트롤 위치 변경
map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPLEFT)

// 줌 컨트롤 숨기기
// zoomControl 추가 코드 제거
```

---

## 🚀 페이지에 통합하기

### 방법 1: 기존 Dashboard에 추가

`components/dashboard.tsx` 수정:

```tsx
import { EnergyMapView } from '@/components/energy-map-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Dashboard() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="map">거래 지도</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        {/* 기존 대시보드 내용 */}
      </TabsContent>
      
      <TabsContent value="map">
        <EnergyMapView />
      </TabsContent>
    </Tabs>
  )
}
```

### 방법 2: 별도 페이지로 생성

`app/map/page.tsx` 생성:

```tsx
import { EnergyMapView } from '@/components/energy-map-view'

export default function MapPage() {
  return <EnergyMapView />
}
```

---

## 🔧 고급 기능

### 1. 현재 위치 표시

```tsx
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      const locPosition = new window.kakao.maps.LatLng(lat, lng)
      map.setCenter(locPosition)
      
      // 현재 위치 마커 추가
      const marker = new window.kakao.maps.Marker({
        position: locPosition,
      })
      marker.setMap(map)
    })
  }
}, [])
```

### 2. 클러스터링 (마커 그룹화)

```bash
# 클러스터러 라이브러리 추가
# layout.tsx의 script 태그 수정
src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KEY&libraries=clusterer"
```

```tsx
const clusterer = new window.kakao.maps.MarkerClusterer({
  map: map,
  averageCenter: true,
  minLevel: 5,
})

clusterer.addMarkers(markers)
```

### 3. 경로 그리기 (Polyline)

```tsx
const linePath = [
  new window.kakao.maps.LatLng(33.4996, 126.5312),
  new window.kakao.maps.LatLng(33.2541, 126.5601),
]

const polyline = new window.kakao.maps.Polyline({
  path: linePath,
  strokeWeight: 5,
  strokeColor: '#FF0000',
  strokeOpacity: 0.7,
  strokeStyle: 'solid',
})

polyline.setMap(map)
```

---

## 🐛 트러블슈팅

### 문제 1: 지도가 표시되지 않음

**원인**: Kakao Maps SDK가 로드되지 않음

**해결**:
1. `.env.local`에 API 키가 올바른지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. Kakao Developers에서 플랫폼 도메인이 등록되었는지 확인

### 문제 2: TypeScript 에러

**원인**: Kakao Maps 타입 정의 누락

**해결**:
```bash
# types/kakao-maps.d.ts 파일이 있는지 확인
# tsconfig.json에 typeRoots 설정 확인
```

### 문제 3: 마커가 표시되지 않음

**원인**: 좌표가 잘못되었거나 지도 레벨이 너무 높음

**해결**:
```tsx
// 지도 레벨을 낮춰서 확대
<KakaoMap level={5} />

// 좌표 확인 (제주도: lat 33.x, lng 126.x)
```

---

## 📚 참고 자료

- [Kakao Maps API 문서](https://apis.map.kakao.com/web/)
- [Kakao Developers 가이드](https://developers.kakao.com/docs/latest/ko/local/dev-guide)
- [샘플 코드](https://apis.map.kakao.com/web/sample/)

---

## ✅ 체크리스트

- [ ] Kakao Developers 계정 생성
- [ ] 애플리케이션 등록 및 JavaScript 키 발급
- [ ] `.env.local`에 API 키 설정
- [ ] 플랫폼 도메인 등록
- [ ] 지도 컴포넌트 테스트
- [ ] 마커 표시 확인
- [ ] 반응형 레이아웃 확인
- [ ] 프로덕션 배포 시 도메인 추가 등록

---

**Energy Truck** - 제주도 에너지 거래를 지도로 한눈에! 🗺️⚡
