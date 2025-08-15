# Firebase 배포 가이드

## 🚀 한 번에 배포하기

```bash
# 1. Firebase CLI 설치 (전역)
npm install -g firebase-tools

# 2. Firebase 로그인
firebase login

# 3. 프로젝트 초기화
firebase init

# 4. 환경 변수 설정
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# 5. 빌드 및 배포
npm run firebase:build
firebase deploy
```

## 📋 상세 설정 단계

### 1. Firebase 프로젝트 설정

1. [Firebase 콘솔](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. **프로젝트 ID**를 `.firebaserc` 파일에 업데이트:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 2. Firebase 서비스 활성화

Firebase 콘솔에서 다음 서비스들을 활성화하세요:
- ✅ **Hosting** (정적 웹사이트 호스팅)
- ✅ **Functions** (서버리스 백엔드)  
- ✅ **Firestore** (NoSQL 데이터베이스)
- ✅ **Authentication** (선택사항)

### 3. 환경 변수 설정

```bash
# Gemini API 키 설정
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# 설정 확인
firebase functions:config:get
```

### 4. 로컬 개발 및 테스트

```bash
# Firebase 에뮬레이터 실행
firebase emulators:start

# 프론트엔드 개발 서버
npm run dev

# Functions 로컬 테스트
cd functions && npm run serve
```

### 5. 배포

```bash
# 프론트엔드 빌드
npm run firebase:build

# 전체 배포 (Hosting + Functions + Firestore)
firebase deploy

# 개별 배포
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 🔧 필수 파일 구조

```
├── firebase.json           # Firebase 프로젝트 설정
├── .firebaserc            # 프로젝트 ID 설정
├── firestore.rules        # Firestore 보안 규칙
├── firestore.indexes.json # Firestore 인덱스 설정
├── functions/             # Cloud Functions
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── routes/
│       ├── services/
│       └── middleware/
├── client/               # React 프론트엔드
├── dist/                # 빌드된 프론트엔드 (자동 생성)
└── firebase-vite.config.ts
```

## 🌐 배포 후 URL

배포 완료 후 다음과 같은 URL들이 생성됩니다:

- **웹사이트**: `https://your-project-id.web.app`
- **API**: `https://asia-northeast3-your-project-id.cloudfunctions.net/api`
- **Firebase 콘솔**: `https://console.firebase.google.com/project/your-project-id`

## 🔒 보안 설정

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 프로덕션에서는 인증된 사용자만 접근 가능하도록 변경
    match /{document=**} {
      allow read, write: if true; // 개발용 - 프로덕션에서 변경 필요
    }
  }
}
```

### Functions 환경 변수
```bash
# API 키는 반드시 Firebase Functions Config로 관리
firebase functions:config:set gemini.api_key="YOUR_ACTUAL_KEY"

# 절대 코드에 하드코딩하지 마세요!
```

## 🚨 주의사항

1. **프로젝트 ID 변경**: `.firebaserc` 파일의 프로젝트 ID를 실제 Firebase 프로젝트 ID로 변경
2. **API 키 보안**: Gemini API 키는 Firebase Functions Config를 통해서만 설정
3. **도메인 설정**: 커스텀 도메인 사용시 Firebase Hosting에서 도메인 연결
4. **비용 관리**: Functions 실행 횟수와 Firestore 읽기/쓰기 횟수 모니터링

## 🛠️ 문제 해결

### Functions 배포 실패
```bash
# Functions 디렉토리에서 의존성 설치
cd functions && npm install

# TypeScript 컴파일 오류 확인
cd functions && npm run build
```

### Hosting 배포 실패
```bash
# 프론트엔드 빌드 확인
npm run firebase:build

# dist 폴더 생성 확인
ls -la dist/
```

### API 호출 실패
```bash
# Functions URL 확인
firebase functions:list

# 환경 변수 확인
firebase functions:config:get
```

---

✅ **이 설정으로 `firebase deploy` 명령 한 번으로 완전한 웹 애플리케이션이 배포됩니다!**