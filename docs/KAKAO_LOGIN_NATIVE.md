# 카카오 로그인 (네이티브 앱 흐름)

> RN/Expo가 처음이라도 읽을 수 있도록 기초 개념부터 설명합니다.

## 1. 배경: 무엇을 해결하려고 했나

기존 카카오 로그인은 **웹 OAuth** 방식이었습니다.

- 사용자가 [카카오로 시작하기] 버튼 클릭
- 브라우저(또는 앱 WebView)가 `https://kauth.kakao.com/oauth/authorize?...` 로 이동
- 카카오의 **웹 로그인 페이지**가 뜸 (ID/비밀번호 입력)
- 로그인 완료 후 우리 백엔드 콜백으로 redirect

웹에서는 자연스럽지만, **RN 앱(WebView로 우리 웹을 띄운 하이브리드 앱)에서는 다음 문제가 있습니다:**

1. KakaoTalk 앱이 이미 깔려있는데도 굳이 ID/PW를 다시 입력해야 함 (UX 나쁨)
2. WebView 안의 카카오 웹 페이지가 KakaoTalk 앱을 부르지 못함
3. 결과적으로 "카카오로 로그인" 기능이 사실상 이메일 로그인과 다를 게 없어짐

이번 작업은 **앱 환경에서 진짜 KakaoTalk 앱을 띄워서 로그인하도록** 바꾸는 작업입니다.

## 2. 사전 지식: 이 프로젝트의 RN 구조

### 2-1. 우리 앱은 "WebView 하이브리드"

```
┌─────────────────────────────────────┐
│        RN 앱 (Expo)                  │
│  - 네이티브 코드 (iOS/Android)        │
│  - Expo 모듈 (푸시, 카메라 등)        │
│                                      │
│  ┌───────────────────────────────┐  │
│  │  WebView                       │  │
│  │  - 우리 Next.js 웹앱이 그대로 뜸 │  │
│  │  - 사실상 앱 전체가 이 안에 있음 │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

웹앱 코드는 [apps/client](../apps/client/)에 있고, RN 껍데기는 [apps/native](../apps/native/)에 있습니다. 사용자가 보는 화면 99%는 WebView 안의 웹입니다.

### 2-2. WebView ↔ RN 통신은 "Bridge"로 한다

WebView 안의 JavaScript는 KakaoTalk 앱을 직접 부를 수 없습니다. 카카오 SDK는 네이티브(iOS/Android) 영역에서만 동작하기 때문이죠.

그래서 **Bridge**라는 통로가 필요합니다:

```
[WebView JS] ─── kakaoLogin() 호출 ──→ [RN JS] ─── Kakao SDK ──→ [iOS/Android 네이티브] ─── KakaoTalk 앱
[WebView JS] ←──── accessToken ─────── [RN JS] ←─── 결과 ─────── [iOS/Android 네이티브] ←─── KakaoTalk 앱
```

우린 [@webview-bridge](https://gronxb.github.io/webview-bridge/) 라이브러리를 씁니다. RN에서 메서드를 등록해두면, WebView에서 `bridge.메서드명()` 으로 호출할 수 있어요.

### 2-3. Expo란?

Expo는 RN을 쉽게 쓰게 해주는 도구입니다. 핵심:

- **`app.config.js`**: 앱 메타 정보 (이름, 번들 ID, 권한 등) 한 곳에서 설정
- **Config Plugin**: 외부 라이브러리가 필요한 네이티브 설정(예: iOS Info.plist 수정)을 자동으로 해주는 시스템
- **`expo prebuild`**: 위 설정을 실제 네이티브 코드(iOS의 Xcode 프로젝트, Android의 Gradle 프로젝트)에 반영하는 명령어
- **`expo-dev-client`**: 외부 네이티브 모듈을 쓸 수 있게 해주는 커스텀 dev 빌드

## 3. 전체 동작 플로우

사용자가 앱에서 [카카오로 시작하기] 버튼을 누른 순간부터 로그인이 완료되기까지:

```
1. [WebView] 사용자가 LoginButton 클릭
   │
   │  isApp + bridge 사용 가능 여부 체크
   ▼
2. [WebView] bridge.kakaoLogin() 호출
   │
   │  (WebView → RN 경계 넘음)
   ▼
3. [RN]  @react-native-kakao/user 의 login() 실행
   │
   │  네이티브 SDK가 알아서:
   │  - KakaoTalk 앱이 설치돼있으면 → KakaoTalk 띄움
   │  - 설치돼있지 않으면 → 카카오계정 웹 로그인 띄움
   ▼
4. [KakaoTalk 앱] 사용자 인증 (생체인증/패턴 등)
   │
   ▼
5. [RN]  Kakao SDK가 accessToken 받아서 반환
   │
   │  { success: true, accessToken: "Kakao가 발급한 토큰" }
   │  ※ 이건 "카카오 서버용" 토큰일 뿐, 우리 서비스 세션 아님
   ▼
6. [WebView] bridge 응답으로 Kakao accessToken 받음
   │
   ▼
7. [WebView] POST {BASE_URL}/login/auth/kakao { accessToken }
   │
   ▼
8. [백엔드] 카카오 서버에 토큰 검증 + 우리 DB에서 유저 매칭
   │
   │  - GET kapi.kakao.com/v2/user/me 로 토큰 유효성 + 유저 정보 확인
   │  - 우리 DB에 유저 있으면 로그인 / 없으면 가입 처리
   │  - 우리 서비스 JWT 발급 (accessToken, refreshToken)
   │  - Set-Cookie 헤더로 쿠키 셋팅
   ▼
9. [WebView] 응답 받음 → 우리 서비스 쿠키 설정됨 → '/'로 이동
   │
   ▼
10. [AuthProvider] 쿠키 기반으로 인증 상태 인식 → 로그인 완료
```

**웹 브라우저(앱 아님)에서는** 1번에서 `isApp=false`라 bridge가 동작하지 않고, 기존 `<a href="{BASE_URL}/login/kakao">` 그대로 카카오 OAuth 웹 페이지로 갑니다. 폴백이 자동입니다.

## 4. 변경된 파일별 설명

### 4-1. [apps/native/package.json](../apps/native/package.json) — Kakao SDK 패키지 추가

```json
"@react-native-kakao/core": "^2.4.0",
"@react-native-kakao/user": "^2.4.0",
```

- `@react-native-kakao/core`: Kakao SDK 초기화 / 공통 기능
- `@react-native-kakao/user`: 카카오 로그인 기능 (`login()`, `logout()` 등)

**왜 이걸 골랐나**: Expo Config Plugin을 제공해서 네이티브 설정(iOS Info.plist의 URL Scheme, Android intent-filter)을 자동으로 해줍니다. 직접 Xcode/Gradle 만지지 않아도 됩니다.

### 4-2. [apps/native/app.config.js](../apps/native/app.config.js) — Expo 설정

```js
plugins: [
  // ...
  [
    '@react-native-kakao/core',
    {
      nativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
      android: { authCodeHandlerActivity: true },
      ios: { handleKakaoOpenUrl: true },
    },
  ],
],
extra: {
  // ...
  kakaoNativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
},
```

**plugins 부분이 하는 일** (Expo가 `expo prebuild` 할 때 자동으로 반영):
- iOS: Info.plist에 URL Scheme `kakao{NATIVE_APP_KEY}` 추가 (KakaoTalk이 우리 앱으로 돌아올 때 이 스킴으로 콜백)
- iOS: `LSApplicationQueriesSchemes`에 `kakaokompassauth`, `kakaolink` 등록 (KakaoTalk이 깔려있는지 우리 앱에서 확인 가능하게)
- Android: AndroidManifest.xml에 카카오 콜백용 Activity 추가

**extra 부분이 하는 일**: 같은 환경변수를 런타임 JS 코드에서도 읽을 수 있게 노출 (다음 파일에서 사용).

> `process.env.KAKAO_NATIVE_APP_KEY`는 빌드 시점에 읽힘. 빌드 머신/CI에 환경변수가 세팅돼 있어야 합니다.

### 4-3. [apps/native/app/_layout.tsx](../apps/native/app/_layout.tsx) — SDK 초기화

```ts
import { initializeKakaoSDK } from '@react-native-kakao/core';
import Constants from 'expo-constants';

const kakaoNativeAppKey = Constants.expoConfig?.extra?.kakaoNativeAppKey as string | undefined;

if (kakaoNativeAppKey) {
  initializeKakaoSDK(kakaoNativeAppKey);
}
```

**하는 일**: 앱이 켜질 때 한 번, Kakao SDK에게 "이게 우리 앱 키야"라고 알려주는 작업. 이 한 줄이 없으면 `login()` 호출 시 SDK가 "초기화 안 됨" 에러를 냅니다.

**왜 root layout에서**: RN/Expo는 `_layout.tsx`가 모든 화면보다 먼저 마운트되는 진입점입니다. WebView가 뜨기 전에 SDK 준비를 끝내야 안전합니다.

### 4-4. [apps/native/bridge/app-bridge.ts](../apps/native/bridge/app-bridge.ts) — Bridge 메서드 추가

```ts
import { login as kakaoLoginNative } from '@react-native-kakao/user';

export const appBridge = bridge({
  // ... 기존 메서드들
  async kakaoLogin() {
    try {
      const result = await kakaoLoginNative();
      return { success: true as const, accessToken: result.accessToken };
    } catch (error) {
      const message = error instanceof Error ? error.message : '카카오 로그인에 실패했습니다.';
      return { success: false as const, error: message };
    }
  },
});

export type AppBridge = typeof appBridge;
```

**하는 일**: WebView에서 호출할 수 있는 `kakaoLogin` 이라는 함수를 등록.
- 내부에서 RN의 `@react-native-kakao/user` SDK 호출
- 성공/실패 결과를 직렬화 가능한 plain object로 반환 (Bridge는 함수/클래스 못 넘김)

**`export type AppBridge`**: 이 타입이 [apps/client/providers/bridge-provider.tsx](../apps/client/providers/bridge-provider.tsx)에서 import되어, WebView 측에서 타입 안전하게 `bridge.kakaoLogin()` 호출할 수 있게 해줍니다.

### 4-5. [packages/api/src/auth/remote.ts](../packages/api/src/auth/remote.ts) — 백엔드 호출 함수

```ts
kakaoLogin: async (params: { accessToken: string }) => {
  const res = await http.post('login/auth/kakao', { json: params });
  return res;
},
```

**하는 일**: 백엔드의 `POST /login/auth/kakao` 엔드포인트를 호출하는 헬퍼.

**왜 별도 함수**: `auth.login`, `auth.reissue` 등 기존 인증 API와 같은 곳에 모아두면 사용처에서 일관되게 `auth.kakaoLogin(...)` 으로 부를 수 있어 깔끔합니다.

### 4-6. [apps/client/components/login-button.tsx](../apps/client/components/login-button.tsx) — UI에서 분기 처리

```tsx
const { isApp } = useAppConfig();
const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
const kakaoLogin = useBridgeStore(({ kakaoLogin }) => kakaoLogin);

const canUseNativeKakao =
  isApp && isWebViewBridgeAvailable && isNativeMethodAvailable('kakaoLogin');

const handleClick = async (e) => {
  if (!canUseNativeKakao) return; // 웹이면 그냥 a href로 OAuth 페이지 이동

  e.preventDefault();
  const result = await kakaoLogin();         // 1. Bridge 호출
  if (!result.success) { toast.error(...); return; }
  await auth.kakaoLogin({ accessToken: result.accessToken }); // 2. 백엔드 exchange
  router.replace('/');                       // 3. 홈 이동
};
```

**3중 체크가 필요한 이유**:
- `isApp`: 진짜 우리 RN 앱 안의 WebView인지 (UA 헤더로 판별, [middleware.ts](../apps/client/middleware.ts) 참고)
- `isWebViewBridgeAvailable`: Bridge가 로드돼서 RN과 통신 가능한지
- `isNativeMethodAvailable('kakaoLogin')`: RN 앱 버전이 이 메서드를 가지고 있는지 (구버전 앱 호환성)

셋 중 하나라도 false면 → 기존 웹 OAuth로 폴백.

## 5. 배포 절차

코드 변경만으로는 동작하지 않습니다. 다음을 순서대로 해야 합니다.

### 5-1. 카카오 디벨로퍼스 콘솔 설정

1. <https://developers.kakao.com/> 접속
2. 앱 등록 → **네이티브 앱 키** 받음 (이걸 환경변수로 쓸 거)
3. [내 애플리케이션 > 플랫폼] 에서:
   - iOS: 번들 ID `com.depromeet.core.app` 등록
   - Android: 패키지명 `com.depromeet.core.app` + 키 해시 (debug용/release용 둘 다) 등록
4. [카카오 로그인] 활성화 ON
5. [동의항목] 에서 필요한 정보(닉네임/이메일 등) 체크

### 5-2. 환경변수 설정

`apps/native/.env`:
```
KAKAO_NATIVE_APP_KEY=발급받은_네이티브_앱_키
```

EAS Build로 배포한다면 EAS Secret으로도 등록:
```bash
eas secret:create --scope project --name KAKAO_NATIVE_APP_KEY --value 발급받은_키
```

### 5-3. 패키지 설치 + 네이티브 재빌드

```bash
# 1. JS 패키지 설치
pnpm install

# 2. Expo 네이티브 프로젝트 재생성
cd apps/native
pnpm expo prebuild --clean

# 3. iOS / Android 빌드
pnpm ios       # 또는 pnpm android
```

**`prebuild --clean`이 꼭 필요한 이유**: Config Plugin이 추가됐기 때문에 iOS의 Info.plist, Android의 AndroidManifest.xml 등 네이티브 설정 파일이 새로 생성/갱신돼야 합니다.

### 5-4. 백엔드 작업 요청

백엔드 팀에 `POST /login/auth/kakao` 신규 엔드포인트 추가 요청:

- **요청**: `{ accessToken: string }` — RN Kakao SDK가 발급한 카카오 토큰
- **처리**:
  1. `GET https://kapi.kakao.com/v2/user/me` 에 `Authorization: Bearer {accessToken}` 으로 호출 → 카카오 유저 정보 획득
  2. 우리 DB에서 유저 매칭 / 가입 처리
  3. 우리 서비스 JWT 발급
- **응답**: Set-Cookie 헤더로 `accessToken`, `refreshToken` 쿠키 셋팅 (이메일 로그인과 동일 패턴)

> Apple 로그인의 `POST /login/auth/apple`이 이미 있다면, 그것의 카카오 버전을 만들어달라고 말하면 됩니다.

## 6. 검증 체크리스트

배포 후 다음을 확인하세요:

- [ ] **KakaoTalk 설치 기기**: 버튼 탭 → KakaoTalk 앱이 떠야 함
- [ ] **KakaoTalk 미설치 기기**: 버튼 탭 → SDK가 자동으로 카카오계정 웹 로그인으로 폴백
- [ ] **웹 브라우저**: 기존 `/login/kakao` OAuth 흐름 그대로 동작 (`isApp=false`라 분기 안 탐)
- [ ] 로그인 완료 후 우리 서비스 쿠키가 정상 세팅되어 홈에서 인증 상태 유지
- [ ] 앱 재시작 후에도 로그인 유지 (AuthProvider의 reissue 흐름과 연동)

## 7. 자주 묻을 만한 의문

**Q. 왜 카카오 토큰을 그대로 안 쓰고 우리 서비스 토큰으로 다시 발급받지?**
A. 카카오 토큰은 카카오 API용입니다. 우리 백엔드 API들은 우리가 발급한 JWT를 검증하도록 돼있고, 권한 관리/만료 정책도 우리 마음대로 해야 합니다. 그래서 한 번 교환 과정을 거칩니다.

**Q. WebView 안에서 그냥 `kakaokompassauth://` URL을 호출하면 안 되나?**
A. 가능하지만 (이전 대화에서 "대안"이라 부른 방식), WebView가 커스텀 스킴을 OS에 넘기는 핸들러를 짜야 하고, KakaoTalk이 콜백으로 돌려보낼 때 그걸 다시 WebView에 주입하는 로직도 직접 만들어야 합니다. SDK 쓰면 그걸 다 자동으로 해줍니다.

**Q. `expo prebuild` 하면 기존 네이티브 코드가 다 날아가는 거 아닌가?**
A. 우리 프로젝트는 `prebuild` 결과물(`ios/`, `android/` 폴더)을 git에 안 올리는 "managed-ish" 워크플로우입니다. 매번 빌드 시 생성합니다. 그래서 `--clean`이 안전합니다.

**Q. 카카오 토큰을 WebView에서 백엔드로 보낼 때 가로채일 위험은?**
A. HTTPS 통신이고, 토큰은 일회용에 가까운 단명 토큰입니다. 우리 백엔드가 검증 후 자체 세션으로 교환하면 그 다음부턴 카카오 토큰을 쓸 일이 없습니다.
