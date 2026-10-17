# 약학다식 · PillGuide Frontend

사진으로 알약을 확인하고 약 정보·복약 기록을 관리하는 **약학다식**의 모바일 중심 웹 클라이언트입니다. 사용자 화면과 입력을 담당하며, 식약처 조회와 비즈니스 처리는 Spring 백엔드에 위임합니다.

## 주요 화면과 기술

- 로그인·온보딩, 홈, 알약 스캔·결과·기록, 약 검색, 복약 체크·알림, 마이페이지.
- React 19 · TypeScript · Vite 7 · React Router · Tailwind CSS.
- Node.js 24, npm을 사용하며 Vercel에 배포합니다.

## 아키텍처

```text
사용자 → React SPA (Vercel)
             ↓ same-origin API 프록시
         Cloudflare → Spring (EC2 / K3s)
                          ├─ 식약처 OpenAPI / DB
                          └─ 로컬 Model H 추론 서버 (연동 예정)
```

브라우저는 추론 서버나 식약처에 직접 접근하지 않습니다. API 키와 서버 비밀정보도 프론트에 포함하지 않습니다.

**현재 상태:** 화면에는 mock 데이터가 남아 있으며, 스캔 화면은 실제 추론 대신 결과 페이지로 이동합니다. `src/api/scanPills.ts`도 mock 모드이므로 사진 → Spring → AI 전체 흐름은 아직 연결되지 않았습니다. 화면 구현과 실제 서버 연동 완료를 구분합니다.

## 로컬 개발

Node.js 24 설치 후 저장소 루트에서 실행합니다.

```sh
npm ci
npm run dev
```

| 명령 | 용도 |
|---|---|
| `npm run verify` | 린트 → 테스트 → TypeScript 검사·프로덕션 빌드 |
| `npm run build` | 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 로컬 확인 |

로컬 로그인은 기본적으로 `http://localhost:8080` 백엔드를 사용합니다. 실제 로그인 검증에는 백엔드 실행과 프론트 개발 주소에 맞는 CORS·OAuth 콜백 설정이 필요합니다. `VITE_*` 값은 클라이언트에 노출되므로 비밀 키를 넣지 않습니다.

## 구조와 배포

| 경로 | 역할 |
|---|---|
| `src/features/` | 인증·약·검색·복약·알림 등 기능별 화면과 상태 |
| `src/components/`, `src/layout/` | 공통 UI와 모바일 레이아웃 |
| `src/api/`, `src/utils/` | API 관련 코드와 공통 유틸리티 |
| `tests/` | 환경별 라우팅·프록시 헤더 테스트 |
| `vercel.ts` | 환경별 API 프록시, SPA fallback, 빌드 명령 |

Vercel Production은 `main`과 운영 API를, Preview는 다른 브랜치/PR과 개발 API를 연결합니다. 배포 환경에서는 `VITE_API_URL`, `VITE_API_BASE_URL`을 설정하지 않고 same-origin 프록시를 사용합니다. Preview 로그인에는 허용된 OAuth 콜백이 필요합니다.

## 연결 문서

- [배포·환경 라우팅 가이드](docs/deployment.md)
- [Backend — 비즈니스 API](https://github.com/pillguide/Backend)
- [AI-server — 추론 API 연동 명세](https://github.com/pillguide/AI-server/blob/main/docs/SPRING_INTEGRATION.md)
- [manifest — Kubernetes / GitOps 배포](https://github.com/pillguide/manifest)
