#!/bin/bash

# 로컬 호스트명 설정
CLIENT_HOST="local-core.depromeet.shop"
ADMIN_HOST="local-admin.depromeet.shop"
# /etc/hosts 파일 경로
HOSTS_FILE="/etc/hosts"

###############################################################################

echo "🔧 로컬 개발 환경 SSL 설정을 진행합니다. (클라이언트: $CLIENT_HOST, 어드민: $ADMIN_HOST)"

###############################################################################

# mkcert가 설치되어 있는지 확인 및 설치
if ! command -v mkcert &> /dev/null; then
    echo "📦 mkcert가 설치되어 있지 않습니다. 설치를 진행합니다..."
    # mkcert 설치 (macOS)
    if command -v brew &> /dev/null; then
        brew install mkcert
    else
        echo "❌ Homebrew가 설치되어 있지 않습니다. 먼저 Homebrew를 설치해주세요."
        echo "💡 설치 방법: https://brew.sh/ 에서 확인하세요."
        exit 1
    fi
else
    echo "✅ mkcert가 이미 설치되어 있습니다."
fi

# mkcert를 로컬 CA로 설정
echo "🔐 mkcert를 로컬 CA로 설정합니다..."
mkcert -install

###############################################################################

# /etc/hosts 파일에 로컬 호스트가 등록되어 있는지 확인
if grep -q "$CLIENT_HOST" "$HOSTS_FILE" && grep -q "$ADMIN_HOST" "$HOSTS_FILE"; then
  echo "✅ $HOSTS_FILE 파일에 호스트명들이 이미 등록되어 있습니다."
else
# /etc/hosts 파일에 로컬 호스트 추가
  echo ""
  echo "📝 로컬 호스트들을 $HOSTS_FILE 파일에 등록하려면 시스템 비밀번호를 입력해주세요."
  if ! grep -q "$CLIENT_HOST" "$HOSTS_FILE"; then
    echo "127.0.0.1	$CLIENT_HOST" | sudo tee -a "$HOSTS_FILE" >/dev/null
    echo "✅ $HOSTS_FILE 파일에 $CLIENT_HOST 를 성공적으로 등록했습니다."
  fi
  if ! grep -q "$ADMIN_HOST" "$HOSTS_FILE"; then
    echo "127.0.0.1	$ADMIN_HOST" | sudo tee -a "$HOSTS_FILE" >/dev/null
    echo "✅ $HOSTS_FILE 파일에 $ADMIN_HOST 를 성공적으로 등록했습니다."
  fi
fi

###############################################################################

# HTTPS 인증서 생성
echo ""
echo "🔐 SSL 인증서를 생성하는 중입니다..."
mkcert -key-file "$CLIENT_HOST-key.pem" -cert-file "$CLIENT_HOST.pem" "$CLIENT_HOST"
mkcert -key-file "$ADMIN_HOST-key.pem" -cert-file "$ADMIN_HOST.pem" "$ADMIN_HOST"

echo ""
echo "🎉 로컬 개발 환경 설정이 완료되었습니다!"
echo "💡 이제 'pnpm dev' 명령어를 사용하여 개발 서버를 실행할 수 있습니다."