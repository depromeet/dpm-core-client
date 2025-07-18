# 패키지 추가 및 수정 설명서

## 📚 개요

이 문서는 DPM Core 모노레포에서 새로운 패키지를 추가하거나 기존 패키지를 수정하는 방법을 설명합니다.

## 🚀 CLI 도구로 패키지 생성 (권장)

### 1. CLI 도구 실행

```bash
# 패키지 생성 CLI 실행
yarn create-package

# 또는 직접 스크립트 실행
node scripts/create-package.js
```

### 2. 대화형 설정

CLI 도구가 다음 항목들을 순차적으로 질문합니다:

1. **패키지 이름**: 생성할 패키지 이름 입력 (예: `ui-components`)
2. **패키지 타입 선택**:
   - `1. UI 컴포넌트 패키지` - React 컴포넌트를 포함하는 패키지
   - `2. API 서비스 패키지` - API 통신을 위한 서비스 패키지
   - `3. 유틸리티 패키지` - 공통 유틸리티 함수들을 포함하는 패키지
   - `4. 커스텀 패키지` - 사용자 정의 패키지
3. **패키지 설명**: 패키지에 대한 설명 입력
4. **샘플 컴포넌트 생성** (UI 컴포넌트 패키지 선택 시): 예제 컴포넌트 생성 여부

### 3. 사용 예시

```bash
$ yarn create-package

🚀 DPM Core 패키지 생성 도구

패키지 이름을 입력하세요 (예: ui-components): my-components

패키지 타입을 선택하세요:
1. UI 컴포넌트 패키지 - React 컴포넌트를 포함하는 패키지
2. API 서비스 패키지 - API 통신을 위한 서비스 패키지
3. 유틸리티 패키지 - 공통 유틸리티 함수들을 포함하는 패키지
4. 커스텀 패키지 - 사용자 정의 패키지

선택 (1-4): 1
패키지 설명을 입력하세요: 커스텀 UI 컴포넌트들
샘플 컴포넌트를 생성하시겠습니까? (y/N): y
컴포넌트 이름을 입력하세요 (예: MyComponent): CustomButton

ℹ 패키지 생성 중: @dpm-core/my-components
ℹ 타입: UI 컴포넌트 패키지
ℹ 설명: 커스텀 UI 컴포넌트들
✓ 패키지 '@dpm-core/my-components'이 성공적으로 생성되었습니다!

다음 단계:
1. cd packages/my-components
2. yarn install (워크스페이스 레벨에서 실행)
3. yarn workspace @dpm-core/my-components build
4. 다른 패키지에서 사용: yarn workspace <app-name> add @dpm-core/my-components
```

### 4. 자동 생성되는 파일들

CLI 도구는 다음 파일들을 자동으로 생성합니다:

```
packages/my-components/
├── package.json          # 패키지 설정 및 의존성
├── tsconfig.json         # TypeScript 설정
├── README.md             # 패키지 문서
└── src/
    ├── index.ts          # 진입점 파일
    ├── components/       # 컴포넌트 디렉터리 (UI 패키지)
    │   └── CustomButton.tsx
    ├── utils/            # 유틸리티 디렉터리
    │   └── cn.ts         # 클래스 이름 조합 함수
    └── types/            # 타입 정의 디렉터리
```

### 5. 생성 후 작업

```bash
# 1. 의존성 설치
yarn install

# 2. 패키지 빌드
yarn workspace @dpm-core/my-components build

# 3. 다른 앱에서 사용
yarn workspace @dpm-core/admin add @dpm-core/my-components
```

## 🛠️ 수동 패키지 생성 (고급)

CLI 도구를 사용하지 않고 수동으로 패키지를 생성하려면 다음 절차를 따르세요:

## 🆕 새로운 패키지 추가

### 1. 패키지 디렉터리 생성

```bash
# packages 디렉터리에 새 패키지 생성
mkdir packages/new-package-name
cd packages/new-package-name

# 기본 디렉터리 구조 생성
mkdir src
mkdir src/components
mkdir src/utils
mkdir src/types
```

### 2. package.json 생성

```json
{
  "name": "@dpm-core/new-package-name",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "format": "biome format --write .",
    "lint": "biome lint --write ."
  },
  "dependencies": {
    // 필요한 의존성 추가
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "tsup": "^8.0.1",
    "typescript": "^5"
  },
  "peerDependencies": {
    // 필요한 경우 peer dependencies 추가
  }
}
```

### 3. TypeScript 설정 추가

```json
// packages/new-package-name/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. 진입점 파일 생성

```typescript
// packages/new-package-name/src/index.ts
// 패키지에서 export할 모든 모듈을 여기에 정의

// 컴포넌트 export
export * from './components/MyComponent';

// 유틸리티 export
export * from './utils/myUtils';

// 타입 export
export * from './types/myTypes';
```

### 5. 루트 워크스페이스에 패키지 추가

패키지가 자동으로 워크스페이스에 인식되는지 확인:

```bash
# 워크스페이스 확인
yarn workspaces list

# 의존성 설치
yarn install
```

### 6. 다른 패키지에서 사용하기

```json
// apps/client/package.json 또는 apps/admin/package.json
{
  "dependencies": {
    "@dpm-core/new-package-name": "workspace:*"
  }
}
```

## 📦 패키지 타입별 설정

### 1. UI 컴포넌트 패키지 (shared 타입)

```json
// package.json
{
  "name": "@dpm-core/ui-components",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "files": ["dist", "src"],
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

#### 컴포넌트 작성 예시:

```typescript
// src/components/NewButton.tsx
'use client';

import { type ComponentProps } from 'react';
import { cn } from '../utils/cn';

export interface NewButtonProps extends ComponentProps<'button'> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const NewButton = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  ...props 
}: NewButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'default',
          'border border-gray-300 bg-transparent hover:bg-gray-100': variant === 'outline',
          'bg-transparent hover:bg-gray-100': variant === 'ghost',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
```

### 2. API/서비스 패키지

```json
// package.json
{
  "name": "@dpm-core/api-service",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "dependencies": {
    "axios": "^1.10.0",
    "qs": "^6.11.0"
  }
}
```

#### API 서비스 작성 예시:

```typescript
// src/services/userService.ts
import { http } from '../http';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await http.get('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await http.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const response = await http.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await http.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await http.delete(`/users/${id}`);
  }
};
```

### 3. 유틸리티 패키지

```json
// package.json
{
  "name": "@dpm-core/utils",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "dependencies": {
    "dayjs": "^1.11.13",
    "lodash": "^4.17.21"
  }
}
```

#### 유틸리티 함수 작성 예시:

```typescript
// src/validation/validators.ts
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    return phoneRegex.test(value);
  },

  password: (value: string): boolean => {
    return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
  }
};
```

## 🔧 기존 패키지 수정

### 1. 새로운 컴포넌트 추가

```typescript
// packages/shared/src/components/ui/new-component.tsx
'use client';

import { type ComponentProps } from 'react';
import { cn } from '../../utils/cn';

export interface NewComponentProps extends ComponentProps<'div'> {
  title: string;
  subtitle?: string;
}

export const NewComponent = ({ 
  className, 
  title, 
  subtitle, 
  children, 
  ...props 
}: NewComponentProps) => {
  return (
    <div className={cn('p-4 border rounded-lg', className)} {...props}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
```

### 2. index.ts에 새 컴포넌트 추가

```typescript
// packages/shared/src/index.ts
// ... 기존 exports ...

// 새 컴포넌트 추가
export * from './components/ui/new-component';
```

### 3. 패키지 의존성 추가

```bash
# 특정 패키지에 의존성 추가
yarn workspace @dpm-core/shared add new-dependency

# 개발 의존성 추가
yarn workspace @dpm-core/shared add -D new-dev-dependency

# 전체 워크스페이스 의존성 동기화
yarn install
```

### 4. 기존 컴포넌트 수정

```typescript
// packages/shared/src/components/ui/button.tsx
'use client';

import { type ComponentProps } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean; // 새로운 prop 추가
}

export const Button = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  loading = false, // 새로운 prop 추가
  disabled,
  children,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'default',
          'border border-gray-300 bg-transparent hover:bg-gray-100': variant === 'outline',
          'bg-transparent hover:bg-gray-100': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
```

## 📄 문서 작성

### 1. README.md 작성

```markdown
# @dpm-core/new-package-name

## 설치

```bash
yarn add @dpm-core/new-package-name
```

## 사용법

```typescript
import { NewComponent } from '@dpm-core/new-package-name';

export default function MyPage() {
  return (
    <NewComponent title="제목" subtitle="부제목">
      내용
    </NewComponent>
  );
}
```

## API 문서

### NewComponent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | 컴포넌트 제목 |
| subtitle | string | - | 컴포넌트 부제목 (선택사항) |

## 예시

[사용 예시들...]
```

### 2. 변경사항 문서화

```markdown
# CHANGELOG.md

## [0.2.0] - 2024-01-XX

### Added
- 새로운 NewComponent 컴포넌트 추가
- Button 컴포넌트에 loading 상태 추가

### Changed
- Button 컴포넌트 스타일 개선

### Fixed
- Avatar 컴포넌트 접근성 문제 수정
```

## 🧪 테스트 추가

### 1. 테스트 설정

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "vitest": "^1.0.0"
  }
}
```

### 2. 테스트 파일 작성

```typescript
// src/components/ui/__tests__/new-component.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '../new-component';

describe('NewComponent', () => {
  it('renders title correctly', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<NewComponent title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <NewComponent title="Test Title">
        <div>Child content</div>
      </NewComponent>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
```

## 🔄 버전 관리

### 1. 의미론적 버전 관리

- **Major (1.0.0)**: 호환성을 깨는 변경사항
- **Minor (0.1.0)**: 새로운 기능 추가 (하위 호환)
- **Patch (0.0.1)**: 버그 수정 (하위 호환)

### 2. 변경사항 커밋 컨벤션

```bash
# 새 기능 추가
git commit -m "feat: Add NewComponent to shared package"

# 버그 수정
git commit -m "fix: Fix Button component loading state"

# 문서 업데이트
git commit -m "docs: Update NewComponent usage examples"

# 스타일 변경
git commit -m "style: Improve Button component styling"

# 리팩토링
git commit -m "refactor: Simplify Avatar component logic"
```

## 🚀 배포 및 빌드

### 1. 개발 중 실시간 빌드

```bash
# 특정 패키지 개발 모드
yarn workspace @dpm-core/shared dev

# 모든 패키지 개발 모드
yarn dev
```

### 2. 프로덕션 빌드

```bash
# 특정 패키지 빌드
yarn workspace @dpm-core/shared build

# 모든 패키지 빌드
yarn build
```

### 3. 빌드 결과 확인

```bash
# 빌드 결과 확인
ls -la packages/shared/dist/

# 타입 정의 파일 확인
cat packages/shared/dist/index.d.ts
```

## ⚠️ 주의사항

### 1. 순환 참조 방지

```typescript
// ❌ 잘못된 예시 - 순환 참조
// packages/shared/src/components/ui/button.tsx
import { cn } from '@dpm-core/shared'; // 자기 자신 참조

// ✅ 올바른 예시 - 상대 경로 사용
import { cn } from '../../utils/cn';
```

### 2. 의존성 관리

```bash
# 중복 의존성 확인
yarn why package-name

# 의존성 정리
yarn install --check-files
```

### 3. 타입 안전성 확보

```typescript
// 타입 정의 파일 생성 시 주의사항
export interface ComponentProps {
  // 모든 props에 대해 명확한 타입 정의
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}
```

## 🔍 디버깅 팁

### 1. 패키지 해상도 확인

```bash
# 패키지 해상도 확인
yarn why @dpm-core/shared

# 워크스페이스 정보 확인
yarn workspaces info
```

### 2. 빌드 문제 해결

```bash
# 캐시 정리
yarn cache clean

# node_modules 재설치
rm -rf node_modules yarn.lock
yarn install

# 빌드 캐시 정리
rm -rf packages/*/dist
yarn build
```

이 문서를 참고하여 DPM Core 모노레포에서 패키지를 효율적으로 관리하고 개발할 수 있습니다. 