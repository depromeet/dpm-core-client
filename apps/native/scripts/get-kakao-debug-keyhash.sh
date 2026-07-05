#!/usr/bin/env bash
# 카카오 로그인용 Android Debug 키해시 추출 스크립트
#
# 사용:
#   ./apps/native/scripts/get-kakao-debug-keyhash.sh
#
# 동작:
#   1. ~/.android/debug.keystore 가 없으면 생성
#   2. 키스토어의 SHA-1을 Base64로 변환 (카카오 키해시 포맷)
#   3. 결과 출력 + 카카오 디벨로퍼스 등록 안내

set -e

KEYSTORE="$HOME/.android/debug.keystore"
STOREPASS="android"
KEYPASS="android"
ALIAS="androiddebugkey"

# keytool이 실제로 실행 가능한지 확인 (macOS의 /usr/bin/keytool 스텁은 Java 안내만 띄움)
is_working_keytool() {
	"$1" -help >/dev/null 2>&1
}

# Android Studio 번들 JDK 우선 → 시스템 keytool fallback
find_keytool() {
	local candidates=(
		"/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool"
		"/Applications/Android Studio Preview.app/Contents/jbr/Contents/Home/bin/keytool"
		"$HOME/Library/Android/sdk/jdk/Contents/Home/bin/keytool"
	)

	for c in "${candidates[@]}"; do
		if [ -x "$c" ] && is_working_keytool "$c"; then
			echo "$c"
			return
		fi
	done

	if command -v keytool >/dev/null 2>&1 && is_working_keytool "keytool"; then
		echo "keytool"
		return
	fi

	return 1
}

KEYTOOL="$(find_keytool || true)"
if [ -z "$KEYTOOL" ]; then
	echo "❌ keytool을 찾을 수 없습니다."
	echo "   Android Studio를 설치하거나 JDK를 설치해주세요."
	echo "   - Android Studio: https://developer.android.com/studio"
	exit 1
fi

# debug.keystore 생성 (없을 때만)
if [ ! -f "$KEYSTORE" ]; then
	echo "▶ debug.keystore 생성 중..."
	mkdir -p "$(dirname "$KEYSTORE")"
	"$KEYTOOL" -genkey -v \
		-keystore "$KEYSTORE" \
		-storepass "$STOREPASS" \
		-keypass "$KEYPASS" \
		-alias "$ALIAS" \
		-keyalg RSA -keysize 2048 -validity 10000 \
		-dname "CN=Android Debug,O=Android,C=US" >/dev/null 2>&1
	echo "✅ 생성 완료: $KEYSTORE"
fi

# SHA-1 → Base64 변환
KEYHASH=$(
	"$KEYTOOL" -exportcert \
		-alias "$ALIAS" \
		-keystore "$KEYSTORE" \
		-storepass "$STOREPASS" \
		-keypass "$KEYPASS" 2>/dev/null \
		| openssl sha1 -binary \
		| openssl base64
)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  카카오 디벨로퍼스 Android 키해시"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  $KEYHASH"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "등록 위치:"
echo "  https://developers.kakao.com"
echo "  → 내 애플리케이션 → 앱 선택 → 플랫폼 → Android"
echo "  → 키 해시 항목에 위 값 추가 (= 포함)"
echo ""
