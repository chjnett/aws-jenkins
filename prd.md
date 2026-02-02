# 📑 [Full-Spec PRD] Energy Truck: Jeju P2P Energy Platform

## 1. 프로젝트 비전 & 핵심 컨셉
* **서비스명:** Energy Truck (에너지 트럭)
* **컨셉:** 제주도 신재생 에너지 출력 제한(Curtailment) 문제를 해결하는 **'온디맨드 에너지 모빌리티'**.
* **UX 디자인:** 토스(Toss) 스타일의 극단적인 간결함, 여백의 미, 부드러운 애니메이션, 3D 에셋 활용.

## 2. 상세 기술 스택 (System Architecture)
### Frontend & Backend
* **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui
* **Backend:** FastAPI (Python 3.11+) - 태양광 모델링 로직 포함
* **Database/Auth:** Supabase (Auth, PostgreSQL, Realtime)

### DevOps & Infrastructure (NEW)
* **Containerization:** Docker, Docker Compose
* **CI/CD:** Jenkins, GitHub Webhooks
* **Cloud (AWS):** * **Compute:** ECS Fargate (Serverless Container) or EC2 with Auto Scaling
    * **Registry:** ECR (Elastic Container Registry)
    * **Network:** ALB (Application Load Balancer)
    * **Storage:** S3 (for 3D assets/static files)

---

## 3. 핵심 화면별 상세 기능 (생략 - 이전과 동일)

---

## 4. 인프라 및 배포 전략 (DevOps & Scalability)

### 4.1. Dockerization 전략
* **Multi-stage Build:** 프론트엔드와 백엔드 모두 Docker 이미지를 경량화하여 빌드 속도 및 배포 효율 최적화.
* **Docker Compose:** 로컬 환경에서 `Frontend`, `Backend`, `Redis`(캐시용)를 한 번에 띄워 개발 환경 동기화.

### 4.2. CI/CD 파이프라인 (Jenkins)
1.  **Trigger:** GitHub에 코드 `Push` 또는 `PR Merge`.
2.  **Build & Test:** Jenkins 내부에서 Docker 이미지 빌드 및 유닛 테스트 진행.
3.  **Push:** 빌드된 이미지를 **AWS ECR**로 업로드.
4.  **Deploy:** **AWS ECS**의 서비스 업데이트를 트리거하여 무중단 배포(Rolling Update) 수행.

### 4.3. 확장성(Scalability) 설계
* **Horizontal Scaling (Scale-out):** * AWS ALB를 전면에 배치하고, CPU/메모리 부하에 따라 ECS 태스크 개수를 자동으로 조절하는 **Auto Scaling** 설정.
    * 특히 태양광 모델링 계산 로직(백엔드)의 부하가 커질 경우 백엔드 인스턴스만 집중 확장 가능.
* **Vertical Scaling (Scale-up):** 초기 단계에서 리소스 사양을 낮게 시작하되, Jenkins를 통해 인스턴스 타입을 쉽게 변경하여 배포 가능하도록 구성.
* **Caching:** 실시간 SMP 가격 데이터나 반복되는 모델링 결과값은 **Redis**를 도입하여 DB 부하를 줄이고 응답 속도 개선.

---

## 5. API & 데이터베이스 설계 (생략 - 이전과 동일)

---

## 6. AI 에디터 명령 (Core Instructions)

1.  **Project Setup:** Next.js 14와 FastAPI의 기본 구조를 잡고, 각 루트에 `Dockerfile`을 생성해줘.
2.  **Docker Logic:** 프론트엔드용 `Dockerfile`은 `node:18-alpine`을, 백엔드용은 `python:3.11-slim`을 기반으로 작성해줘.
3.  **CI/CD Ready:** Jenkins Pipeline에서 사용하기 위해 이미지 빌드 및 태깅을 수행할 수 있는 `docker-compose.yml` 파일을 작성해줘.
4.  **Scaling Architecture:** 백엔드에서 무거운 계산 로직(동료의 모델링)이 병목이 되지 않도록 비동기(`async def`) 처리를 기본으로 하고, 향후 Redis 캐싱을 붙이기 쉬운 구조로 설계해줘.