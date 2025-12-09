# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드를 제공합니다.

## 개발 명령어

### 필수 명령어
```bash
# 개발
pnpm dev                    # 모든 앱을 개발 모드로 시작
pnpm --filter @dpm-core/client dev    # Client 앱 (포트 3010)
pnpm --filter @dpm-core/admin dev     # Admin 앱 (포트 3020)

# 빌드 & 품질 관리
pnpm build                  # 모든 패키지 빌드
pnpm lint                   # Biome으로 린트
pnpm format                 # Biome으로 포맷

# 패키지 관리
pnpm create-package         # 대화형 패키지 생성 CLI
pnpm clean                  # 빌드 캐시 정리
```

### 테스트 & 타입 체크
```bash
turbo type-check           # TypeScript 타입 체크 실행
# 참고: 현재 테스트 프레임워크는 구성되지 않음
```

## 아키텍처 개요

### 모노레포 구조
이 프로젝트는 두 개의 메인 애플리케이션과 공유 패키지로 구성된 **Turborepo 기반 Next.js 모노레포**입니다:

- **apps/admin/** - 관리자 대시보드 (Next.js 15, React 19, 포트 3020, HTTPS)
- **apps/client/** - 클라이언트 애플리케이션 (Next.js 15, React 19, 포트 3010, HTTPS)
- **packages/shared/** - 공유 UI 컴포넌트 및 유틸리티 (@dpm-core/shared)
- **packages/api/** - HTTP 클라이언트 및 API 유틸리티 (@dpm-core/api)
- **packages/typescript-config/** - 공유 TypeScript 설정 (@dpm-core/typescript-config)

### 주요 기술 상세

#### 패키지 의존성
```json
// App package.json 의존성
{
  "@dpm-core/shared": "workspace:*",
  "@dpm-core/api": "workspace:*"
}
```

#### Next.js 설정
두 앱 모두 공유 패키지를 위한 `transpilePackages` 설정이 필요합니다:
```typescript
// apps/*/next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['@dpm-core/shared'],
};
```

#### 공유 패키지 구조
`@dpm-core/shared` 패키지는 다음을 내보냅니다:
- UI 컴포넌트 (Button, Avatar, Card, Drawer, Tabs, Checkbox, Label, Popover 등)
- 유틸리티 (cn, 날짜 헬퍼, logger)
- 아이콘 및 상수
- 폼 검증기 (Zod 기반)
- Google Analytics (react-ga4)
- 토스트 알림 (Sonner)
- 다크모드 지원 (next-themes)

### 인증 & 데이터 관리
- **인증**: 쿠키 기반 인증 (js-cookie)
- **데이터 페칭**: React Query (@tanstack/react-query v5)
- **HTTP 클라이언트**: ky (@dpm-core/api 패키지 내)
- **폼 관리**: React Hook Form + Zod v4
- **날짜 처리**: Day.js

### UI & 스타일링
- **CSS 프레임워크**: 커스텀 설정을 적용한 Tailwind CSS 4.x
- **UI 컴포넌트**: Radix UI primitives
- **애니메이션**: Motion.js, Lottie React, tw-animate-css
- **아이콘**: Lucide React
- **코드 스타일**: Biome 2.2.5 (포매터 및 린터)
- **가상화**: React Virtuoso (긴 리스트 최적화)
- **서스펜스**: @suspensive/react
- **드로어**: Vaul

## 개발 가이드라인

코드 스타일, 패턴 및 모범 사례에 대한 자세한 가이드라인은 **`.cursor/rules/`** 디렉토리를 참조하세요.

### TypeScript & React
- 함수형 및 선언적 프로그래밍 패턴 사용
- types보다 interfaces 선호
- enum 사용 지양; 대신 const maps 사용
- 이벤트 핸들러는 'handle' 접두사 사용 (handleClick, handleSubmit)
- 보조 동사를 사용한 설명적 이름 사용 (isLoading, hasError)
- 가능한 경우 React Server Components (RSC) 선호
- 'use client' 지시자 최소화

### 컴포넌트 개발
- 클라이언트 측 상호작용이 필요한 경우 'use client' 지시자 사용
- Radix UI primitives를 사용하여 컴포넌트 구축
- 스타일링에 Tailwind CSS 적용
- 조건부 클래스명에 cn() 유틸리티 사용
- 구조: exports, subcomponents, helpers, types

### 코드 품질
- 줄 너비: 100자
- 들여쓰기: 탭
- 따옴표 스타일: 작은따옴표
- 후행 쉼표: 항상 사용
- 세미콜론: 항상 사용

### 패키지 관리
- **패키지 매니저**: pnpm 8.15.6
- **Node.js 버전**: >=18
- 공유 패키지 참조 시 `workspace:*` 표기법 사용
- 적절한 워크스페이스 의존성 유지
- **버전 관리**: Changesets (@changesets/cli)

## 주요 설정 파일

- **turbo.json** - Turborepo 작업 설정 및 캐싱
- **biome.json** - 코드 포맷팅 및 린트 규칙
- **package.json** - 루트 워크스페이스 설정
- **.cursor/rules/** - 개발 규칙 및 컨벤션

## 일반적인 문제 & 해결 방법

### 빌드 이슈
```bash
# 빌드 캐시 정리 및 재설치
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 의존성 이슈
```bash
# 의존성 트리 확인
pnpm why package-name
pnpm -r list
```

### 'use client' 지시자 이슈
Next.js 앱에서 `transpilePackages: ['@dpm-core/shared']`가 설정되어 있는지 확인하세요.

### 로컬 개발 환경
- **Client**: `https://local-core.depromeet.shop:3010` (HTTPS 인증서 필요)
- **Admin**: `https://local-admin.depromeet.shop:3020` (HTTPS 인증서 필요)
- 루트 디렉토리에 SSL 인증서 파일 필요:
  - `local-core.depromeet.shop.pem` / `local-core.depromeet.shop-key.pem`
  - `local-admin.depromeet.shop.pem` / `local-admin.depromeet.shop-key.pem`