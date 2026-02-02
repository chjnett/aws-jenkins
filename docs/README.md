# 📚 Energy Truck 문서 인덱스

이 파일은 프로젝트의 모든 문서와 그 용도를 설명합니다.

---

## 🚀 배포 & 인프라 (핵심 문서)

### [`deployment_master_guide.md`](./deployment_master_guide.md) ⭐ **필독**
**종합 배포 가이드** - 인프라 구축부터 배포까지 모든 것을 다루는 마스터 문서

- 핵심 개념 (IaC, Docker, Fargate, CI/CD)
- 아키텍처 상세 분석
- Terraform 코드 완전 해부
- 단계별 실행 가이드 (STEP 0 ~ 3)
- 비용 관리 및 문제 해결

**대상**: 처음 배포하는 사람, 전체 시스템 이해가 필요한 사람

---

### [`infrastructure-setup-guide.md`](./infrastructure-setup-guide.md)
**Docker + WSL 기반 인프라 구축 간편 가이드**

- WSL 2 환경 설정 방법
- Docker를 통한 Terraform 실행
- 빠른 시작 명령어 모음

**대상**: 빠르게 시작하고 싶은 개발자

---

### [`terraform-env-setup.md`](./terraform-env-setup.md)
**환경 변수 설정 상세 가이드**

- `backend/.env` 파일 구성
- `terraform.tfvars` 생성 방법
- 보안 체크리스트

**대상**: 환경 변수 설정이 헷갈리는 사람

---

## 👥 협업 & 코드 구조

### [`collaboration-guide.md`](./collaboration-guide.md)
팀 협업을 위한 가이드 (Git 워크플로우, 코드 리뷰 등)

### [`code-structure-explanation.md`](./code-structure-explanation.md)
프로젝트 폴더 구조 및 파일 역할 설명

---

## 🗺️ 프론트엔드 기능

### [`kakao-api-key-setup.md`](./kakao-api-key-setup.md)
카카오 개발자 센터에서 API 키 발급 받는 방법

### [`kakao-maps-guide.md`](./kakao-maps-guide.md)
카카오 맵 API 통합 가이드

### [`user-guide.md`](./user-guide.md)
최종 사용자를 위한 웹사이트 사용 설명서

---

## 🗂️ 문서 우선순위

1. **처음 배포**: `deployment_master_guide.md` → `infrastructure-setup-guide.md`
2. **환경 설정**: `terraform-env-setup.md`
3. **프론트엔드 개발**: `kakao-api-key-setup.md` → `kakao-maps-guide.md`
4. **협업 시작**: `collaboration-guide.md` → `code-structure-explanation.md`

---

> **참고**: 이전에 있던 `backend-deployment-guide.md`, `deployment-guide.md` 등은 Docker+WSL 기반 워크플로우로 통합되어 삭제되었습니다.
