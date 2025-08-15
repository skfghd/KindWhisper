# 🔥 다정한 번역기 - Firebase 배포판

완전한 Firebase Hosting + Functions + Firestore 배포 패키지입니다.

## 📁 포함된 파일들

### 🔧 Firebase 설정
- `firebase.json` - Firebase 프로젝트 설정
- `.firebaserc` - 프로젝트 ID 설정 (수정 필요)
- `firestore.rules` - Firestore 보안 규칙
- `firestore.indexes.json` - 데이터베이스 인덱스

### ⚡ Firebase Functions (백엔드)
```
functions/
├── package.json          # Functions 의존성
├── tsconfig.json         # TypeScript 설정
└── src/
    ├── index.ts          # 메인 Functions 진입점
    ├── routes/
    │   ├── translate.ts  # 번역 API 라우트
    │   └── usage.ts      # 사용량 체크 라우트
    ├── services/
    │   ├── gemini.ts     # Gemini AI 서비스
    │   └── firestore.ts  # Firestore 데이터베이스
    ├── middleware/
    │   └── security.ts   # 보안 미들웨어
    └── utils/
        └── translation.ts # 번역 유틸리티
```

### 🌐 프론트엔드 설정
- `firebase-package.json` - 프론트엔드 의존성
- `firebase-vite.config.ts` - Vite 빌드 설정
- `firebase-frontend-config.ts` - API 호출 설정
- 기존 `client/` 폴더 그대로 사용

### 📚 배포 가이드
- `firebase-deployment-guide.md` - 상세한 배포 가이드
- `firebase-deploy.sh` - 원클릭 배포 스크립트
- `.env.example` - 환경 변수 예시

## 🚀 빠른 배포 (5분)

```bash
# 1. Firebase CLI 설치
npm install -g firebase-tools

# 2. Firebase 로그인
firebase login

# 3. .firebaserc에서 프로젝트 ID 변경
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}

# 4. API 키 설정
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# 5. 자동 배포 스크립트 실행
chmod +x firebase-deploy.sh
./firebase-deploy.sh
```

## ✅ 완전 배포 확인사항

### 🔥 Firebase 서비스
- [x] **Hosting**: 정적 웹사이트 호스팅
- [x] **Functions**: 서버리스 백엔드 API
- [x] **Firestore**: NoSQL 데이터베이스
- [x] **보안**: API 키 마스킹 및 Rate limiting

### 📱 배포된 기능
- [x] 황석희 스타일 감성 번역
- [x] 일일 125명 사용량 제한
- [x] AI 크레딧 소진시 폴백 번역
- [x] 실시간 사용량 모니터링
- [x] 마음의 해석 (💖) 기능
- [x] 귀여운 안내 메시지 (🐻🐱🐇)

### 🔒 보안 기능
- [x] API 키 자동 마스킹
- [x] 에러 메시지 정화
- [x] Rate limiting (분당 100 요청)
- [x] CORS 설정
- [x] Firebase 보안 규칙

## 🌐 배포 후 URL 구조

```
https://your-project-id.web.app/                    # 메인 웹사이트
https://your-project-id.web.app/api/translate      # 번역 API
https://your-project-id.web.app/api/usage/check    # 사용량 체크
```

## 📊 Firebase 콘솔 모니터링

배포 후 다음에서 모니터링 가능:
- **Functions 로그**: `firebase functions:log`
- **Firestore 데이터**: Firebase 콘솔 > Firestore Database
- **Hosting 트래픽**: Firebase 콘솔 > Hosting
- **사용량 통계**: Firebase 콘솔 > Usage and Billing

## 💰 비용 최적화

- ✅ **일일 사용량 제한**: 125명/일로 API 비용 통제
- ✅ **Function Cold Start 최적화**: asia-northeast3 리전 사용
- ✅ **Firestore 읽기 최적화**: 인덱스 설정 완료
- ✅ **CDN 캐싱**: Firebase Hosting 자동 CDN

## 🛠️ 추가 설정

### 커스텀 도메인
```bash
firebase hosting:channel:deploy custom-domain
```

### SSL 인증서
Firebase Hosting에서 자동으로 Let's Encrypt SSL 인증서 제공

### 모니터링 설정
```bash
# Cloud Monitoring 연동
firebase projects:addfirebase your-project-id
```

---

✅ **이 패키지로 `firebase deploy` 명령 한 번으로 완전한 프로덕션 웹 애플리케이션이 배포됩니다!**

🌟 **특징**: Replit 환경 제약 없이 Firebase 인프라에서 안정적으로 운영 가능