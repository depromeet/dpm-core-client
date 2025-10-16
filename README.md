# DPM Core 모노레포

DPM Core는 **Turborepo**를 기반으로 한 **모노레포 Next.js 프로젝트**입니다. 여러 애플리케이션과 공유 라이브러리를 하나의 저장소에서 관리하여 코드 재사용성과 개발 효율성을 높였습니다.

## 🏗️ 프로젝트 구조

```
dpm-core-client/
├── apps/                    # 애플리케이션들
│   ├── admin/               # 관리자 앱 (포트 3020)
│   └── client/              # 클라이언트 앱 (포트 3010)
├── packages/                # 공유 패키지들
│   ├── shared/              # 공통 컴포넌트/유틸리티
│   └── api/                 # API 통신 라이브러리
├── scripts/                 # 유틸리티 스크립트
│   └── local-server-setup   # 로컬 서버 환경 세팅
├── docs/                    # 문서
│   ├── PROJECT_STRUCTURE.md
│   ├── PACKAGE_USAGE.md
│   └── PACKAGE_MANAGEMENT.md
└── package.json             # 루트 설정
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 개별 앱 실행
pnpm run dev:client   # 클라이언트 앱 (포트 3010)
pnpm run dev:admin   # 관리자 앱 (포트 3020)
```

### 3. 빌드

```bash
# 모든 패키지 빌드
pnpm build

# 개별 패키지 빌드
pnpm build:client
pnpm build:admin
```

### 사용 가능한 패키지 타입

1. **UI 컴포넌트 패키지** - React 컴포넌트를 포함하는 패키지
2. **API 서비스 패키지** - API 통신을 위한 서비스 패키지
3. **유틸리티 패키지** - 공통 유틸리티 함수들을 포함하는 패키지
4. **커스텀 패키지** - 사용자 정의 패키지

### 패키지 사용법

```typescript
// @dpm-core/shared 패키지 사용
import { Button, Avatar, cn } from '@dpm-core/shared';

// @dpm-core/api 패키지 사용
import { http, auth } from '@dpm-core/api';
```

## 🔧 개발 환경 설정

### 주요 기술 스택

- **Next.js**: 15.3.3
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x
- **Turborepo**: 2.x
- **Biome**: 코드 포맷팅 및 린팅

### 중요 설정

#### transpilePackages 설정
```typescript
// apps/admin/next.config.ts, apps/client/next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['@dpm-core/shared'],
};
```

#### 의존성 관리
```json
{
  "dependencies": {
    "@dpm-core/shared": "workspace:*",
    "@dpm-core/api": "workspace:*"
  }
}
```

## 📚 문서

- [프로젝트 구조 설명서](docs/PROJECT_STRUCTURE.md)
- [패키지 사용법 가이드](docs/PACKAGE_USAGE.md)
- [패키지 관리 설명서](docs/PACKAGE_MANAGEMENT.md)

## 🛠️ 사용 가능한 명령어

### 개발
```bash
pnpm dev                    # 모든 앱 개발 모드 실행
pnpm build                  # 모든 패키지 빌드
pnpm lint                   # 코드 린팅
pnpm format                 # 코드 포맷팅
pnpm format-and-lint        # biome check .
pnpm format-and-lint:fix    # biome check . --write
pnpm check-types            # 타입 체크
pnpm clean                  # 빌드 캐시 정리 (node_modules, .turbo, dist)
```

### 특정 워크스페이스 명령어
```bash
pnpm turbo [명령어] --filter [workspace] 
```

## 🎯 개발 가이드라인

### 1. 컴포넌트 개발
- **'use client'** 디렉티브 명시적 사용
- **Radix UI** 기반 컴포넌트 개발
- **Tailwind CSS** 사용
- **cn 함수**를 통한 클래스 이름 조합

### 2. 타입 안전성
- **TypeScript** 강제 사용
- **엄격한 타입 검사** 적용
- **interface** 우선 사용

### 3. 코드 품질
- **Biome**를 사용한 일관된 코드 포맷팅
- **커밋 컨벤션** 사용

### 4. 순환 참조 방지
- **Biome noImportCycles**를 통한 순환 참조 방지
- **Turborepo**를 통한 패키지 간 순환 참조 방지

```typescript
// ❌ 잘못된 예시
import { cn } from '@dpm-core/shared';

// ✅ 올바른 예시
import { cn } from '../../utils/cn';
```

## 🔍 문제 해결

### 빌드 오류
```bash
# 캐시 관련 정리
pnpm clean

pnpm install
```

## 📝 커밋 컨벤션

```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 및 설정 변경
```

## 🤝 기여 방법

1. 브랜치 생성
2. 변경사항 구현
3. 테스트 실행
4. 커밋 및 푸시
5. PR 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
