# 카카오 로그인 Android 키해시 등록 가이드

> Android 환경에서 카카오 네이티브 SDK 로그인을 사용하려면, 빌드 키스토어의 SHA-1 지문을 Base64로 변환한 **키해시**를 카카오 디벨로퍼스 콘솔에 등록해야 합니다.

## 1. 왜 키해시가 필요한가

Android는 누구나 우리 앱 패키지명(`com.depromeet.core.app`)을 흉내낼 수 있습니다. 카카오는 패키지명만으로는 진위 확인이 안 되기 때문에, **앱 서명 키의 지문(SHA-1)**을 추가 검증합니다.

```
[진짜 우리 앱]                          [가짜 앱]
서명: 우리 키스토어                     서명: 임의의 키스토어
지문: 등록된 키해시                     지문: 등록 안 된 키해시
       ↓                                       ↓
카카오 서버: 통과                       카카오 서버: 거부 (KOE006)
```

서명 키스토어는 위조 불가능한 비밀이라 "진짜 우리 앱만" 통과시킬 수 있습니다.

## 2. 어떤 키해시를 등록해야 하나

빌드 종류마다 다른 키스토어로 서명되기 때문에 각각 등록해야 합니다.

| 빌드 | 서명 키스토어 | 등록 주체 | 빈도 |
|---|---|---|---|
| **EAS 클라우드 빌드** (production / preview / development) | EAS Upload Key | 팀 공통 (한 번) | 1회 |
| **Play Store 정식 배포** | Google App Signing Key | 팀 공통 (한 번) | 1회 |
| **로컬 컴파일** (`expo run:android`, Android Studio) | 각자의 `~/.android/debug.keystore` | **개발자 본인** | 머신마다 |

→ **EAS Build만 쓰면** 팀 공통 키해시 2개로 충분.
→ **로컬에서 직접 컴파일하면** 각자 자기 머신 키해시를 추가 등록 필요.

## 3. 로컬 debug 키해시 등록 (개발자 본인)

### 3-1. 스크립트 실행

```bash
./apps/native/scripts/get-kakao-debug-keyhash.sh
```

이 스크립트가 자동으로:
1. `~/.android/debug.keystore`가 없으면 생성
2. SHA-1을 Base64로 변환
3. 카카오에 등록할 키해시 출력

출력 예시:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  카카오 디벨로퍼스 Android 키해시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ZGKEJLTDR9hVuTnfpA6yqaY7hjo=
```

### 3-2. 카카오 디벨로퍼스에 등록

1. <https://developers.kakao.com/> 로그인
2. **내 애플리케이션** → 우리 앱 선택
3. 좌측 메뉴 **앱 설정 → 플랫폼**
4. **Android 플랫폼**의 **키 해시** 항목 → **추가**
5. 위에서 받은 값(`=` 포함, 28자) 붙여넣기
6. **저장**

> ⚠️ `=` 빠뜨리지 마세요. 카카오는 패딩 포함 전체 문자열로 매칭합니다.

### 3-3. 사전 요구사항

스크립트가 동작하려면 다음 중 하나가 필요합니다:

- **Android Studio 설치** (권장): <https://developer.android.com/studio>
  - 스크립트가 Android Studio 번들 JDK를 자동으로 찾아 사용
- **시스템 JDK 설치**: `brew install openjdk` 등

macOS의 `/usr/bin/keytool` 은 "Java 설치하세요" 안내만 띄우는 스텁이라 실제 동작하지 않습니다. 스크립트가 알아서 우회합니다.

### 3-4. 수동으로 추출 (스크립트 안 쓰고 싶다면)

```bash
# debug.keystore 생성 (없으면)
KEYTOOL="/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool"
"$KEYTOOL" -genkey -v \
  -keystore ~/.android/debug.keystore \
  -storepass android -keypass android \
  -alias androiddebugkey \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"

# 키해시 추출
"$KEYTOOL" -exportcert \
  -alias androiddebugkey \
  -keystore ~/.android/debug.keystore \
  -storepass android -keypass android \
  | openssl sha1 -binary | openssl base64
```

## 4. 팀 공통 키해시 등록 (이미 등록됨)

> 이 섹션은 참고용. 신규 환경 구축 시에만 다시 할 일.

### 4-1. EAS Upload Key

```
Expo Dashboard → Credentials → Android → Keystore → SHA-1 인증서 지문
```

→ SHA-1 (`14:ED:8C:48:...` 형식) 을 Base64로 변환:

```bash
echo "14:ED:8C:48:..." \
  | awk -F: '{for(i=1;i<=NF;i++)printf "%s",$i}' \
  | xxd -r -p | openssl base64
```

### 4-2. Play Store App Signing Key

```
Google Play Console → 앱 선택 → 출시 → 설정 → 앱 서명 → 앱 서명 키 인증서의 SHA-1
```

→ 위와 동일하게 Base64 변환 후 등록.

## 5. 검증

### 키해시 등록이 잘 된 경우
- 로그인 버튼 탭 → KakaoTalk 앱 실행 → 인증 → 성공

### 키해시 미등록 / 불일치
- `KakaoSdkError: KOE006 (앱 키가 등록되지 않았거나 키 해시 불일치)`
- 또는 `not registered key hash` 메시지

이 에러가 나면:
1. 카카오 콘솔에 본인 키해시 등록 여부 재확인
2. `=` 패딩 포함 28자 전체를 정확히 입력했는지 확인
3. 카카오 콘솔에서 **저장** 버튼을 눌렀는지 확인 (입력만 하고 저장 안 하면 반영 안 됨)

## 6. 자주 묻는 질문

**Q. iOS는 키해시 안 등록해도 되나?**
A. iOS는 Apple이 앱 배포를 통제하기 때문에 Bundle ID만으로 검증 충분. 키해시 개념 자체가 없음.

**Q. 팀원이 늘 때마다 키해시 등록해야 하나?**
A. 로컬 컴파일 방식이면 그렇습니다. 그래서 가능하면 **EAS Dev Build를 공유해서 쓰는 방식**이 운영 부담이 적습니다. 한 명이 빌드해서 .apk 공유 → 팀원들은 그걸 설치 + 메트로 서버만 띄워 개발.

**Q. 키해시는 비밀 정보인가?**
A. 아닙니다. **공개 정보입니다.** SHA-1 fingerprint는 인증서의 공개 지문일 뿐이라 노출돼도 보안 위험 없음. 비밀은 키스토어 파일 자체 (`.jks`).

**Q. `~/.android/debug.keystore` 가 사라지면?**
A. 새로 생성하면 됩니다. **새 키스토어는 다른 SHA-1을 가지므로 카카오에 다시 등록 필요.** 일관성 유지를 위해 안 지우는 게 좋습니다.

**Q. CI에서 Android 빌드 시 키해시는?**
A. CI가 EAS Build를 트리거하는 구조라면 EAS Upload Key 그대로 쓰니까 추가 등록 불필요. CI 머신이 직접 컴파일하는 구조면 그 머신의 debug 키해시 등록 필요.
