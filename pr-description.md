## 🚀 작업 개요

이번 PR은 로깅 시스템 개선과 인증 관련 코드 리팩토링을 포함합니다.

## ✨ 주요 변경사항

### 1. Logger 모듈 추가 📝
- **위치**: `packages/shared/src/utils/logger.ts`
- **기능**:
  - 레벨별 로깅 지원 (debug, info, warn, error)
  - 타임스탬프, 환경정보, 이모지 옵션 제공
  - 전용 로거 메서드: `api()`, `auth()`, `query()`, `component()`
  - 프로덕션/개발 환경별 자동 로그 레벨 설정

### 2. HTTP 요청 로깅 개선 🌐
- API 패키지에서 `console.log`를 Logger로 전면 교체
- HTTP 요청/응답 상태 실시간 로깅
- Refresh plugin 디버깅 로그 추가
- 에러 발생 시 상세 정보 로깅

### 3. React Query 설정 최적화 ⚡
- `staleTime`: 5분 (불필요한 재요청 방지)
- `gcTime`: 10분 (가비지 컬렉션 최적화)
- `refetchOnWindowFocus`: false
- `refetchOnReconnect`: false
- `refetchOnMount`: false
- **결과**: 중복 API 호출 문제 해결

### 4. API 패키지 구조 개선 📦
- `members/` 디렉토리 추가 및 `getMyMemberInfo` API 구현
- 공통 타입 정의를 위한 `type.ts` 파일 추가
- Refresh plugin 로직 개선 (401 에러 처리 수정)

### 5. Better Auth 제거 및 인증 로직 간소화 🔐
- Better Auth 관련 의존성 및 코드 완전 제거
- 불필요한 auth API route 파일 삭제
- `AuthProvider` 추가로 인증 상태 관리 간소화
- 로그인 버튼 컴포넌트 리팩토링

## 🔧 기술적 개선사항

### Logger 사용 예시
```typescript
// 기존
console.log('HTTP 요청:', method, url);

// 변경
logger.api(method, url, status);
logger.auth('로그인 성공', { userId });
logger.error('API 호출 실패', error);
```

### React Query 중복 호출 해결
- 문제: 개발/프로덕션 환경에서 API가 3번씩 호출되는 문제
- 원인: Refresh plugin의 401 체크 로직 비활성화 및 잘못된 재시도 로직
- 해결: 
  - 401 체크 로직 활성화
  - `staleTime` 설정으로 캐싱 활용
  - 불필요한 refetch 옵션 비활성화

## 📋 변경된 파일

### 새로 추가된 파일
- `packages/shared/src/utils/logger.ts`
- `packages/api/src/members/index.ts`
- `packages/api/src/type.ts`
- `packages/api/src/plugins/create-refresh-plugin.ts`
- `apps/client/providers/auth-provider.tsx`

### 삭제된 파일
- `apps/admin/app/api/auth/[...all]/route.ts`
- `apps/admin/lib/auth-client.ts`
- `apps/admin/lib/auth.ts`
- `apps/client/app/api/auth/[...all]/route.ts`
- `apps/client/lib/auth-client.ts`
- `apps/client/lib/auth.ts`
- `packages/shared/src/auth/client.ts`
- `packages/shared/src/auth/server.ts`

## 🧪 테스트 완료 항목
- [x] Logger 모듈 정상 동작 확인
- [x] API 요청 로깅 확인
- [x] React Query 중복 호출 문제 해결 확인
- [x] 인증 플로우 정상 동작 확인
- [x] TypeScript 컴파일 성공
- [x] 빌드 성공

## 🚨 주의사항
- Better Auth가 완전히 제거되어 기존 인증 로직이 변경되었습니다
- Logger를 사용하려면 `@dpm-core/shared`에서 import 필요
- API 패키지 사용 시 빌드 필요 (`yarn workspace @dpm-core/api build`)

## 📝 TODO (후속 작업)
- [ ] Logger 설정을 환경변수로 관리
- [ ] 프로덕션 환경에서 로그 수집 시스템 연동
- [ ] API 에러 핸들링 개선
- [ ] 인증 토큰 갱신 로직 완성

---

리뷰 부탁드립니다! 🙏 