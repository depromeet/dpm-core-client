# DPM Core 프로젝트 구조 및 패키지 설명서

## 📁 프로젝트 개요

DPM Core는 **Turborepo**를 기반으로 한 **모노레포 Next.js 프로젝트**입니다. 여러 애플리케이션과 공유 라이브러리를 하나의 저장소에서 관리하여 코드 재사용성과 개발 효율성을 높였습니다.

## 🏗️ 전체 구조

```
dpm-core-client/
├── apps/                     # 애플리케이션들
│   ├── admin/               # 관리자 앱
│   └── client/              # 클라이언트 앱
├── packages/                # 공유 패키지들
│   ├── shared/              # 공통 컴포넌트/유틸리티
│   └── api/                 # API 통신 라이브러리
├── package.json             # 루트 설정
├── turbo.json               # Turborepo 설정
├── tsconfig.base.json       # 공통 TypeScript 설정
└── yarn.lock                # 의존성 락 파일
```

## 📦 패키지 상세 설명

### 1. 애플리케이션 (apps/)

#### 🔧 `@dpm-core/admin` - 관리자 앱
- **위치**: `apps/admin/`
- **포트**: `3001`
- **목적**: 관리자용 대시보드 및 관리 기능
- **특징**: 
  - Next.js 15.3.3 기반
  - React 19 사용
  - 관리자 전용 UI/UX
  - 세션 관리 및 사용자 관리

#### 👥 `@dpm-core/client` - 클라이언트 앱
- **위치**: `apps/client/`
- **포트**: `3000`
- **목적**: 일반 사용자용 애플리케이션
- **특징**:
  - Next.js 15.3.3 기반
  - React 19 사용
  - React Query 데이터 관리
  - 사용자 인증 및 세션 관리

### 2. 공유 패키지 (packages/)

#### 🎨 `@dpm-core/shared` - 공통 컴포넌트/유틸리티
- **위치**: `packages/shared/`
- **목적**: 앱 간 공유되는 컴포넌트, 유틸리티, 타입 정의
- **주요 내용**:
  - UI 컴포넌트 (Button, Avatar, Card, Drawer, Popover)
  - 아이콘 컴포넌트
  - 인증 클라이언트/서버 유틸리티
  - 공통 유틸리티 함수
  - 타입 정의
  - 스타일 변형 관리

#### 🌐 `@dpm-core/api` - API 통신 라이브러리
- **위치**: `packages/api/`
- **목적**: 외부 API 통신을 위한 공통 HTTP 클라이언트
- **주요 내용**:
  - HTTP 클라이언트 설정
  - 인증 관련 API
  - 공통 API 유틸리티

## 🔧 기술 스택

### 공통 기술
- **모노레포**: Turborepo
- **패키지 관리**: Yarn Workspaces
- **TypeScript**: 5.x
- **코드 포맷팅**: Oxfmt
- **애니메이션**: Motion.js

### 프론트엔드 (Next.js 앱)
- **Next.js**: 15.3.3
- **React**: 19.0.0
- **Tailwind CSS**: 4.x
- **UI 컴포넌트**: Radix UI
- **데이터 관리**: React Query (client 앱)

### 백엔드/인증
- **인증**: Better Auth
- **HTTP 클라이언트**: Axios

## 🚀 개발 환경 설정

### 1. 초기 설정
```bash
# 의존성 설치
yarn install

# 모든 패키지 빌드
yarn build

# 로컬 인증서 발급
# hosts파일 수정 필수 -> local.dpmcore.o-r.kr
. ./ssl.sh

# 프록시 서버 실행
docker compose up -d

```

### 2. 개발 서버 실행
```bash
# 모든 앱 동시 실행
yarn dev

# 개별 앱 실행
yarn workspace @dpm-core/admin dev    # 관리자 앱 (포트 3001)
yarn workspace @dpm-core/client dev   # 클라이언트 앱 (포트 3000)
```

### 3. 빌드 및 배포
```bash
# 전체 빌드
yarn build

# 개별 빌드
yarn workspace @dpm-core/admin build
yarn workspace @dpm-core/client build
```

## 🔄 중요 설정

### 1. transpilePackages 설정
Next.js 앱에서 `@dpm-core/shared` 패키지의 `'use client'` 디렉티브를 유지하기 위해 `transpilePackages` 설정을 사용합니다:

```typescript
// apps/admin/next.config.ts, apps/client/next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['@dpm-core/shared'],
};
```

### 2. 패키지 참조 방식
- **shared 패키지**: 소스 코드 직접 참조 (`src/index.ts`)
- **api 패키지**: 빌드된 결과물 참조 (`dist/index.js`)

### 3. 의존성 관리
```json
{
  "dependencies": {
    "@dpm-core/shared": "workspace:*",
    "@dpm-core/api": "workspace:*"
  }
}
```

## 📋 개발 규칙

### 1. 코드 스타일
- **Oxfmt**를 사용한 일관된 코드 포맷팅
- **TypeScript** 강제 사용
- **엄격한 타입 검사** 적용

### 2. 컴포넌트 개발
- **'use client'** 디렉티브 명시적 사용
- **Radix UI** 기반 컴포넌트 개발
- **Tailwind CSS** 사용

### 3. 인증 처리
- **Better Auth** 사용
- 서버/클라이언트 분리된 인증 로직
- 세션 기반 인증 시스템

## 🛠️ 문제 해결

### 1. 'use client' 디렉티브 문제
- **해결방법**: `transpilePackages` 설정 확인
- **shared 패키지**: `main: "src/index.ts"` 설정 확인

### 2. 순환 참조 문제
- **해결방법**: 상대 경로 import 사용
- **예시**: `import { cn } from '../../utils/cn'`

### 3. 빌드 오류
- **dist 폴더 충돌**: `rm -rf packages/*/dist` 후 재빌드
- **의존성 문제**: `yarn install --force` 실행

## 📄 관련 파일들

- `package.json`: 루트 설정 및 워크스페이스 정의
- `turbo.json`: Turborepo 태스크 설정
- `tsconfig.base.json`: 공통 TypeScript 설정
- `.oxfmtrc.json`: 코드 포맷팅 설정
- `.oxlintrc.json`: 코드 린트 규칙
- `yarn.lock`: 의존성 잠금 파일 