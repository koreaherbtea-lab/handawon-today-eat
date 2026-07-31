// ⚠️ 이 파일에는 사용자님의 Firebase 프로젝트 설정값을 넣어야 합니다.
//
// 받는 방법:
// 1) https://console.firebase.google.com 에서 프로젝트 생성
// 2) 왼쪽 메뉴 "빌드 > Authentication" → "시작하기" → 로그인 방법에서
//    "이메일/비밀번호", "Google", "익명" 3개를 모두 사용 설정
// 3) 왼쪽 메뉴 "빌드 > Firestore Database" → "데이터베이스 만들기"
//    (프로덕션 모드로 만들고, 이후 firestore.rules 내용을 규칙 탭에 붙여넣어 배포)
// 4) 프로젝트 설정(톱니바퀴 아이콘) > 일반 탭 > 하단 "내 앱" > 웹 앱 추가(</> 아이콘)
// 5) 발급된 firebaseConfig 값을 아래에 그대로 붙여넣기
//
// 자세한 절차는 README-firebase-setup.md 파일을 참고하세요.

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
