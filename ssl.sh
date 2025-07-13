#!/bin/bash
# mkcert가 설치되어 있는지 확인
if ! command -v mkcert &> /dev/null; then
    echo "mkcert를 설치합니다..."
    # mkcert 설치 (macOS)
    brew install mkcert
else
    echo "mkcert가 이미 설치되어 있습니다."
fi

# mkcert를 로컬 CA로 설정
mkcert -install

# local.dpmcore.o-r.kr 도메인용 SSL 인증서 생성
mkcert local.dpmcore.o-r.kr

echo "SSL 인증서가 생성되었습니다:"
echo "- local.dpmcore.o-r.kr.pem (인증서)"
echo "- local.dpmcore.o-r.kr-key.pem (개인키)"
echo ""
echo "Next.js에서 사용하려면 다음과 같이 설정하세요:"
echo "HTTPS=true"
echo "SSL_CRT_FILE=./local.dpmcore.o-r.kr.pem"
echo "SSL_KEY_FILE=./local.dpmcore.o-r.kr-key.pem"
