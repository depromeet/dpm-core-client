# 패키지 사용법 설명서

## 📚 개요

이 문서는 DPM Core 모노레포에서 각 패키지를 사용하는 방법을 설명합니다.

## 🎨 @dpm-core/shared 패키지 사용법

### 1. 기본 import 방식

```typescript
// 모든 export를 한 번에 가져오기
import { Button, Avatar, cn, formatDate } from '@dpm-core/shared';

// 개별 컴포넌트 import
import { LoginButton } from '@dpm-core/shared';
import { UserAvatar } from '@dpm-core/shared';
```

### 2. UI 컴포넌트 사용

#### Button 컴포넌트
```typescript
import { Button } from '@dpm-core/shared';

export default function MyPage() {
  return (
    <div>
      <Button variant="default" size="md">
        기본 버튼
      </Button>
      <Button variant="outline" size="sm">
        아웃라인 버튼
      </Button>
      <Button variant="destructive" size="lg">
        삭제 버튼
      </Button>
    </div>
  );
}
```

#### Avatar 컴포넌트
```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@dpm-core/shared';

export default function UserProfile() {
  return (
    <Avatar>
      <AvatarImage src="/user-avatar.jpg" alt="사용자" />
      <AvatarFallback>홍길동</AvatarFallback>
    </Avatar>
  );
}
```

#### Card 컴포넌트
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@dpm-core/shared';

export default function InfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
      </CardHeader>
      <CardContent>
        <p>카드 내용입니다.</p>
      </CardContent>
    </Card>
  );
}
```

#### Drawer 컴포넌트
```typescript
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter, 
  DrawerClose 
} from '@dpm-core/shared';

export default function DrawerExample() {
  return (
    <Drawer>
      <DrawerTrigger>메뉴 열기</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>메뉴</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <p>메뉴 내용</p>
        </div>
        <DrawerFooter>
          <DrawerClose>닫기</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

#### Popover 컴포넌트
```typescript
import { Popover, PopoverTrigger, PopoverContent } from '@dpm-core/shared';

export default function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger>정보 보기</PopoverTrigger>
      <PopoverContent>
        <p>추가 정보가 여기에 표시됩니다.</p>
      </PopoverContent>
    </Popover>
  );
}
```

### 3. 아이콘 컴포넌트 사용

```typescript
import { 
  ArrowRightIcon, 
  ChevronRightIcon, 
  KakaoLogoIcon, 
  UserAvatarIcon 
} from '@dpm-core/shared';

export default function IconExample() {
  return (
    <div className="flex gap-2">
      <ArrowRightIcon className="w-5 h-5" />
      <ChevronRightIcon className="w-5 h-5" />
      <KakaoLogoIcon className="w-6 h-6" />
      <UserAvatarIcon className="w-8 h-8" />
    </div>
  );
}
```

### 4. 유틸리티 함수 사용

#### cn 함수 (클래스 이름 조합)
```typescript
import { cn } from '@dpm-core/shared';

export default function StyledComponent() {
  const isActive = true;
  
  return (
    <div 
      className={cn(
        'px-4 py-2 rounded-lg',
        isActive && 'bg-blue-500 text-white',
        'hover:bg-gray-100'
      )}
    >
      스타일 컴포넌트
    </div>
  );
}
```

#### 날짜 유틸리티
```typescript
import { formatDate } from '@dpm-core/shared';

export default function DateDisplay() {
  const date = new Date();
  
  return (
    <div>
      <p>오늘: {formatDate(date)}</p>
      <p>상대 시간: {formatDate(date, 'relative')}</p>
    </div>
  );
}
```

### 5. 인증 관련 사용

#### 클라이언트 인증
```typescript
import { authClient } from '@dpm-core/shared';

export default function AuthComponent() {
  const handleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: 'kakao',
        callbackURL: '/dashboard'
      });
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <button onClick={handleLogin}>
      카카오로 로그인
    </button>
  );
}
```

#### 로그인 버튼 컴포넌트
```typescript
import { LoginButton } from '@dpm-core/shared';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8">로그인</h1>
        <LoginButton />
      </div>
    </div>
  );
}
```

### 6. 타입 정의 사용

```typescript
import type { ApiResponse, UserSession } from '@dpm-core/shared';

// API 응답 타입 사용
const handleApiCall = async (): Promise<ApiResponse<UserSession>> => {
  // API 호출 로직
  return {
    success: true,
    data: {
      id: '1',
      name: '사용자',
      email: 'user@example.com'
    }
  };
};
```

## 🌐 @dpm-core/api 패키지 사용법

### 1. 기본 HTTP 클라이언트 사용

```typescript
import { http } from '@dpm-core/api';

// GET 요청
const fetchUsers = async () => {
  try {
    const response = await http.get('/users');
    return response.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
};

// POST 요청
const createUser = async (userData: any) => {
  try {
    const response = await http.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    throw error;
  }
};
```

### 2. 인증 API 사용

```typescript
import { auth } from '@dpm-core/api';

// 로그인
const login = async (credentials: LoginCredentials) => {
  try {
    const response = await auth.login(credentials);
    return response;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 사용자 정보 조회
const getUserProfile = async () => {
  try {
    const profile = await auth.getProfile();
    return profile;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    throw error;
  }
};
```

### 3. React Query와 함께 사용

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from '@dpm-core/api';

// 사용자 목록 조회
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => http.get('/users').then(res => res.data)
  });
};

// 사용자 생성
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: any) => http.post('/users', userData),
    onSuccess: () => {
      // 성공 시 사용자 목록 다시 조회
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
```

## 📱 앱에서의 실제 사용 예시

### 1. 사용자 대시보드 페이지

```typescript
// apps/client/app/dashboard/page.tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button
} from '@dpm-core/shared';
import { useUsers } from '@/hooks/useUsers';

export default function Dashboard() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{user.email}</p>
              <Button className="mt-4 w-full">
                프로필 보기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 2. 로그인 페이지

```typescript
// apps/client/app/login/page.tsx
import { LoginButton, Card, CardHeader, CardTitle, CardContent } from '@dpm-core/shared';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              소셜 로그인으로 간편하게 시작하세요
            </p>
            <LoginButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎯 주요 사용 팁

### 1. 컴포넌트 조합 패턴
```typescript
// 여러 컴포넌트를 조합하여 사용
import { Card, Button, Avatar } from '@dpm-core/shared';

const UserCard = ({ user, onEdit }) => (
  <Card>
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3>{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <Button onClick={() => onEdit(user)}>
        편집
      </Button>
    </div>
  </Card>
);
```

### 2. 스타일 커스터마이징
```typescript
import { Button, cn } from '@dpm-core/shared';

const CustomButton = ({ className, ...props }) => (
  <Button 
    className={cn(
      'bg-gradient-to-r from-blue-500 to-purple-600',
      'hover:from-blue-600 hover:to-purple-700',
      className
    )}
    {...props}
  />
);
```

### 3. 타입 안전성 확보
```typescript
import type { ComponentProps } from 'react';
import { Button } from '@dpm-core/shared';

type CustomButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

const LoadingButton = ({ loading, children, ...props }: CustomButtonProps) => (
  <Button disabled={loading} {...props}>
    {loading ? '로딩 중...' : children}
  </Button>
);
```

## ⚠️ 주의사항

1. **'use client' 디렉티브**: 클라이언트 컴포넌트는 자동으로 처리됩니다.
2. **스타일 충돌**: Tailwind CSS 클래스를 사용할 때 충돌을 방지하기 위해 `cn` 함수를 사용하세요.
3. **의존성 관리**: 패키지 간 순환 참조를 피하세요.
4. **타입 안전성**: TypeScript 타입을 적극 활용하세요. 