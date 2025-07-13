# DPM Core Monorepo

이 프로젝트는 DPM (Digital Product Management) 코어 시스템의 monorepo입니다. Turborepo를 사용하여 관리되며, 사용자 대상 클라이언트와 관리자 대상 어드민 프로젝트로 구성되어 있습니다.

## 프로젝트 구조

```
dpm-core-monorepo/
├── apps/
│   ├── client/          # 사용자 대상 웹 애플리케이션
│   └── admin/           # 관리자 대상 웹 애플리케이션
├── packages/
│   └── shared/          # 공통 컴포넌트, 유틸리티, 타입
└── ...
```

## 기술 스택

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript 5
- **UI Library**: Radix UI + Tailwind CSS 4
- **Authentication**: Better Auth
- **State Management**: TanStack Query
- **Build Tool**: Turborepo
- **Code Quality**: Biome (linting + formatting)
- **Package Manager**: Yarn 4.9.2

## 시작하기

### 의존성 설치

```bash
yarn install
```

### 개발 서버 실행

모든 애플리케이션을 동시에 실행:

```bash
yarn dev
```

개별 애플리케이션 실행:

```bash
# 사용자 클라이언트 (포트 3000)
yarn workspace @dpm-core/client dev

# 관리자 어드민 (포트 3001)
yarn workspace @dpm-core/admin dev
```

### 빌드

```bash
yarn build
```

### 코드 포맷팅 및 린팅

```bash
yarn format
yarn lint
```

## 패키지 설명

### apps/client
- 사용자 대상 웹 애플리케이션
- 포트: 3000
- 인증, 세션 관리, 사용자 대시보드 등

### apps/admin
- 관리자 대상 웹 애플리케이션
- 포트: 3001
- 사용자 관리, 세션 관리, 시스템 모니터링 등

### packages/shared
- 공통 컴포넌트, 유틸리티, 타입 정의
- 두 애플리케이션에서 공통으로 사용되는 코드

## 개발 가이드

### 새로운 공통 컴포넌트 추가

1. `packages/shared/src/components/`에 컴포넌트 생성
2. `packages/shared/src/index.ts`에 export 추가
3. 필요한 앱에서 import하여 사용

### 새로운 유틸리티 함수 추가

1. `packages/shared/src/utils/`에 유틸리티 함수 생성
2. `packages/shared/src/index.ts`에 export 추가
3. 필요한 앱에서 import하여 사용

### 타입 정의 추가

1. `packages/shared/src/types/`에 타입 정의 생성
2. `packages/shared/src/index.ts`에 export 추가
3. 필요한 앱에서 import하여 사용
