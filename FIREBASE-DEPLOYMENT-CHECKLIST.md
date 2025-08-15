# 🔥 Firebase 배포 체크리스트

## ✅ ZIP 다운로드 후 해야 할 일

### 1. 필수 파일 교체
```bash
# ZIP 파일을 압축 해제한 후:

# package.json 교체
cp firebase-package.json package.json

# vite.config.ts 교체  
cp firebase-vite.config.ts vite.config.ts

# API 호출 설정 교체
cp firebase-frontend-config.ts client/src/lib/queryClient.ts
```

### 2. Firebase 프로젝트 설정
```bash
# .firebaserc 파일에서 프로젝트 ID 변경
{
  "projects": {
    "default": "your-actual-firebase-project-id"  # ← 여기 변경
  }
}
```

### 3. 의존성 설치
```bash
# 프론트엔드 의존성
npm install

# Functions 의존성
cd functions && npm install && cd ..
```

### 4. API 키 설정
```bash
# Firebase에 Gemini API 키 설정
firebase functions:config:set gemini.api_key="YOUR_ACTUAL_GEMINI_API_KEY"
```

### 5. 배포 실행
```bash
# 자동 배포 스크립트 실행권한 부여
chmod +x firebase-deploy.sh

# 원클릭 배포
./firebase-deploy.sh
```

## 📁 ZIP 파일에 포함된 핵심 파일들

### Firebase 설정
- ✅ `firebase.json` - Firebase 프로젝트 설정
- ✅ `.firebaserc` - 프로젝트 ID (수정 필요)
- ✅ `firestore.rules` - 데이터베이스 보안 규칙
- ✅ `firestore.indexes.json` - 성능 최적화

### Firebase Functions (완전한 백엔드)
- ✅ `functions/` 폴더 - 전체 서버리스 백엔드
- ✅ TypeScript 설정 완료
- ✅ Gemini AI 서비스 구현
- ✅ Firestore 연동 완료
- ✅ 보안 미들웨어 포함

### 배포 자동화
- ✅ `firebase-deploy.sh` - 원클릭 배포 스크립트
- ✅ `firebase-deployment-guide.md` - 상세 가이드
- ✅ `README-FIREBASE-DEPLOYMENT.md` - 완전 매뉴얼

### 프론트엔드 교체 파일
- ✅ `firebase-package.json` → `package.json`
- ✅ `firebase-vite.config.ts` → `vite.config.ts`  
- ✅ `firebase-frontend-config.ts` → `client/src/lib/queryClient.ts`

## 🚀 배포 소요시간: 약 5분

1. **ZIP 다운로드**: 30초
2. **파일 교체**: 1분
3. **의존성 설치**: 2분
4. **Firebase 설정**: 1분
5. **배포 실행**: 1분

## 🌐 배포 완료 후

배포가 완료되면 다음과 같은 URL이 생성됩니다:
- **웹사이트**: `https://your-project-id.web.app`
- **관리 콘솔**: `https://console.firebase.google.com`

## ⚠️ 주의사항

1. **프로젝트 ID**: `.firebaserc`에서 반드시 실제 Firebase 프로젝트 ID로 변경
2. **API 키 보안**: Firebase Functions Config로만 관리 (코드에 직접 입력 금지)
3. **파일 교체**: 기존 package.json, vite.config.ts 파일을 Firebase 버전으로 교체

---

✅ **이 체크리스트를 따라하시면 `firebase deploy` 명령 한 번으로 완전한 프로덕션 웹 애플리케이션이 배포됩니다!**