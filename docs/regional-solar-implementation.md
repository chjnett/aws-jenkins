# ☀️ 제주 지역별 태양광 발전 수익 계산 구현 가이드

## 1. 개요 (Overview)
현재 단순 면적 입력 기반의 수익 계산 방식을 **지도 기반의 지역별 정밀 계산**으로 업그레이드합니다.
제주도를 4개의 권역(동/서/남/북)으로 나누고, 각 관측소의 실제 수치를 기반으로 발전량을 계산합니다.

## 2. 핵심 로직 (Core Logic)

### 기존 방식
$$ \text{발전량} = \text{면적} \times 0.15 \times 5 \times 30 $$
*(단순 상수 곱셈)*

### 변경 방식
$$ \text{발전량} = \text{면적} (m^2) \times \text{지역별 계수} (Coefficient) $$

- **지역별 계수 Example**: `10.59227...` (단위 면적당 예상 발전량)
- 사용자가 지도에서 지역을 선택하거나, 위치를 찍으면 해당 권역의 계수가 자동 적용됩니다.

---

## 3. 구현 상세 (Implementation Details)

### A. 데이터 구조 (Data Structure)
제주도를 4개 권역으로 나누어 관측소 데이터를 정의합니다.

```typescript
type Region = 'JEJU_NORTH' | 'JEJU_SOUTH' | 'JEJU_EAST' | 'JEJU_WEST';

// 관측소별 발전 계수 (예시 데이터)
const SOLAR_DATA: Record<Region, number> = {
  JEJU_NORTH: 10.592272727272727, // 제주시 (북)
  JEJU_SOUTH: 11.245000000000000, // 서귀포 (남) - 일반적으로 일사량이 더 높음
  JEJU_EAST: 10.850000000000000,  // 성산 (동)
  JEJU_WEST: 10.920000000000000,  // 고산 (서)
};

// 권역 구분 로직 (위도/경도 기준)
// 한라산 기준: 위도 33.36, 경도 126.53
const CENTER = { lat: 33.3617, lng: 126.5292 };
```

### B. UI/UX 흐름
1. **판매하기(Sell Drawer) 진입**
2. **지도 표시**: 카카오맵 로드
   - 지도에 4개 구역을 폴리곤(Polygon) 또는 마커로 시각화
   - 또는 사용자가 핀(Marker)을 찍으면 위/경도 기반으로 구역 자동 판별
3. **위치 선택**:
   - 사용자가 자신의 발전소 위치 클릭 → `Region` 결정
4. **면적 입력**:
   - 기존 입력창(m²) 사용
5. **결과 계산**:
   - `선택된 Region의 계수` × `입력한 면적` = `예상 발전량`

---

## 4. Map 구현 방안 (Kakao Map)

### 방안 1: 핀 포인트 방식 (추천)
- 사용자가 지도를 클릭하여 자신의 위치를 지정.
- 클릭한 좌표(lat, lng)와 한라산 중심 좌표를 비교하여 4분면 판별.

```javascript
// 권역 판별 알고리즘 (Pseudo code)
function getRegion(lat, lng) {
  if (lat > CENTER.lat) {
    if (lng > CENTER.lng) return 'JEJU_NORTH_EAST'; // 실제론 제주시가 북쪽 커버
    else return 'JEJU_NORTH_WEST'; 
  }
  // ... 단순화하여 동서남북 4등분 매핑
}
```

### 방안 2: 행정구역 폴리곤 클릭
- 제주시/서귀포시/동부/서부 폴리곤을 지도에 그리고, 클릭 이벤트를 받음.
- 시각적으로 더 명확하나 구현 난이도 높음.

---

## 5. 작업 단계 (Action Plan)

1. [ ] `sell-drawer.tsx`에 `KakaoMap` 컴포넌트 추가
2. [ ] 4개 권역에 대한 `SOLAR_COEFFICIENT` 상수 정의
3. [ ] 지도 클릭 시 해당 지역 판별 로직(위/경도 계산) 구현
4. [ ] 계산 로직 수정: `area * coefficient`
5. [ ] UI 업데이트: "위치를 선택해주세요" 단계 추가
