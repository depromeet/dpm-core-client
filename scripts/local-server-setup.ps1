# PowerShell 스크립트 - 로컬 개발 환경 SSL 설정
# 관리자 권한으로 실행 필요

# 로컬 호스트명 설정
$CLIENT_HOST = "local-core.depromeet.shop"
$ADMIN_HOST = "local-admin.depromeet.shop"
# Windows hosts 파일 경로
$HOSTS_FILE = "$env:SystemRoot\System32\drivers\etc\hosts"

###############################################################################

Write-Host "🔧 로컬 개발 환경 SSL 설정을 진행합니다. (클라이언트: $CLIENT_HOST, 어드민: $ADMIN_HOST)" -ForegroundColor Cyan

###############################################################################

# 관리자 권한 확인 및 자동 상승
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "🔐 관리자 권한이 필요합니다. UAC 프롬프트를 확인해주세요..." -ForegroundColor Yellow

    # 관리자 권한으로 재시작
    $scriptPath = $MyInvocation.MyCommand.Path
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -Wait
    exit 0
}

###############################################################################

# mkcert가 설치되어 있는지 확인
$mkcertInstalled = $null -ne (Get-Command mkcert -ErrorAction SilentlyContinue)

if (-not $mkcertInstalled) {
    Write-Host "📦 mkcert가 설치되어 있지 않습니다. 설치를 진행합니다..." -ForegroundColor Yellow

    # Chocolatey 확인
    $chocoInstalled = $null -ne (Get-Command choco -ErrorAction SilentlyContinue)
    # Scoop 확인
    $scoopInstalled = $null -ne (Get-Command scoop -ErrorAction SilentlyContinue)

    if ($chocoInstalled) {
        Write-Host "📦 Chocolatey를 사용하여 mkcert를 설치합니다..." -ForegroundColor Cyan
        choco install mkcert -y
    }
    elseif ($scoopInstalled) {
        Write-Host "📦 Scoop을 사용하여 mkcert를 설치합니다..." -ForegroundColor Cyan
        scoop install mkcert
    }
    else {
        Write-Host "❌ 패키지 매니저가 설치되어 있지 않습니다." -ForegroundColor Red
        Write-Host "💡 다음 중 하나를 설치해주세요:" -ForegroundColor Yellow
        Write-Host "   - Chocolatey: https://chocolatey.org/install" -ForegroundColor Yellow
        Write-Host "   - Scoop: https://scoop.sh" -ForegroundColor Yellow
        Write-Host "" -ForegroundColor Yellow
        Write-Host "   또는 수동으로 mkcert를 설치하세요:" -ForegroundColor Yellow
        Write-Host "   https://github.com/FiloSottile/mkcert/releases" -ForegroundColor Yellow
        exit 1
    }

    # 설치 후 다시 확인
    $mkcertInstalled = $null -ne (Get-Command mkcert -ErrorAction SilentlyContinue)
    if (-not $mkcertInstalled) {
        Write-Host "❌ mkcert 설치에 실패했습니다." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ mkcert가 이미 설치되어 있습니다." -ForegroundColor Green
}

# mkcert를 로컬 CA로 설정
Write-Host "🔐 mkcert를 로컬 CA로 설정합니다..." -ForegroundColor Cyan
mkcert -install

###############################################################################

# hosts 파일에 로컬 호스트가 등록되어 있는지 확인
$hostsContent = Get-Content $HOSTS_FILE -Raw
$clientHostExists = $hostsContent -match [regex]::Escape($CLIENT_HOST)
$adminHostExists = $hostsContent -match [regex]::Escape($ADMIN_HOST)

if ($clientHostExists -and $adminHostExists) {
    Write-Host "✅ hosts 파일에 호스트명들이 이미 등록되어 있습니다." -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "📝 로컬 호스트들을 hosts 파일에 등록합니다..." -ForegroundColor Cyan

    $hostsEntries = @()

    if (-not $clientHostExists) {
        $hostsEntries += "127.0.0.1`t$CLIENT_HOST"
        Write-Host "✅ hosts 파일에 $CLIENT_HOST 를 등록했습니다." -ForegroundColor Green
    }

    if (-not $adminHostExists) {
        $hostsEntries += "127.0.0.1`t$ADMIN_HOST"
        Write-Host "✅ hosts 파일에 $ADMIN_HOST 를 등록했습니다." -ForegroundColor Green
    }

    if ($hostsEntries.Count -gt 0) {
        # hosts 파일에 추가
        Add-Content -Path $HOSTS_FILE -Value "`n$($hostsEntries -join "`n")" -Encoding ASCII
    }
}

###############################################################################

# HTTPS 인증서 생성
Write-Host ""
Write-Host "🔐 SSL 인증서를 생성하는 중입니다..." -ForegroundColor Cyan

# 프로젝트 루트 디렉토리로 이동 (스크립트 위치 기준)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

# 인증서 생성
mkcert -key-file "$CLIENT_HOST-key.pem" -cert-file "$CLIENT_HOST.pem" $CLIENT_HOST
mkcert -key-file "$ADMIN_HOST-key.pem" -cert-file "$ADMIN_HOST.pem" $ADMIN_HOST

Write-Host ""
Write-Host "🎉 로컬 개발 환경 설정이 완료되었습니다!" -ForegroundColor Green
Write-Host "💡 이제 'pnpm dev' 명령어를 사용하여 개발 서버를 실행할 수 있습니다." -ForegroundColor Cyan
Write-Host ""
Write-Host "계속하려면 아무 키나 누르세요..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
