#!/bin/bash

# Firebase 완전 배포 스크립트
# 사용법: chmod +x firebase-deploy.sh && ./firebase-deploy.sh

set -e  # 에러 발생시 스크립트 중단

echo "🚀 다정한 번역기 Firebase 배포 시작..."

# 1. Firebase CLI 설치 확인
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI가 설치되지 않았습니다."
    echo "다음 명령으로 설치하세요: npm install -g firebase-tools"
    exit 1
fi

# 2. 로그인 상태 확인
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Firebase 로그인이 필요합니다..."
    firebase login
fi

# 3. 프로젝트 설정 확인
if [ ! -f ".firebaserc" ]; then
    echo "❌ .firebaserc 파일이 없습니다. Firebase 프로젝트를 설정해주세요."
    echo "firebase init을 실행하거나 .firebaserc 파일을 생성하세요."
    exit 1
fi

# 4. 환경 변수 확인
echo "🔧 환경 변수 확인 중..."
if ! firebase functions:config:get | grep -q "gemini"; then
    echo "⚠️  Gemini API 키가 설정되지 않았습니다."
    echo "다음 명령으로 설정하세요:"
    echo "firebase functions:config:set gemini.api_key=\"YOUR_GEMINI_API_KEY\""
    read -p "계속 진행하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 5. Functions 의존성 설치
echo "📦 Functions 의존성 설치 중..."
cd functions
npm install
cd ..

# 6. 프론트엔드 빌드
echo "🔨 프론트엔드 빌드 중..."
npm install
npm run firebase:build

# 7. 빌드 결과 확인
if [ ! -d "dist" ]; then
    echo "❌ 프론트엔드 빌드 실패! dist 폴더가 생성되지 않았습니다."
    exit 1
fi

echo "✅ 빌드 완료!"

# 8. Firebase 배포
echo "🌐 Firebase 배포 중..."
firebase deploy

echo ""
echo "🎉 배포 완료!"
echo ""
echo "📱 웹사이트 URL을 확인하려면:"
echo "firebase hosting:channel:open live"
echo ""
echo "📊 Firebase 콘솔:"
echo "https://console.firebase.google.com/project/$(firebase use --quiet)"
echo ""
echo "🔧 Functions 로그 확인:"
echo "firebase functions:log"