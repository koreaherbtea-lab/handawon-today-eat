# Firebase 연동 설정 가이드

이 문서는 `오늘뭐먹지.html`을 실제로 여러 사람이 함께 쓰는 서비스로 만들기 위한 설정 절차입니다.
코드는 이미 Firebase(Authentication + Firestore)와 연동되도록 작성되어 있고,
**아래 절차대로 프로젝트를 만들고 설정값만 넣어주시면** 바로 동작합니다.

---

## 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com 접속 → Google 계정으로 로그인
2. "프로젝트 추가" → 프로젝트 이름 입력 (예: handawon-today-eat) → 생성

## 2. 로그인 방식 켜기 (Authentication)
1. 왼쪽 메뉴 **빌드 > Authentication** → "시작하기"
2. "Sign-in method" 탭에서 아래 3가지를 **모두 사용 설정**
   - **이메일/비밀번호**
   - **Google**
   - **익명(Anonymous)** — 비회원 방문자도 자신의 식사기록을 남기고, 소통창에 글을 쓸 수 있게 해줍니다.

## 3. 데이터베이스 만들기 (Firestore)
1. 왼쪽 메뉴 **빌드 > Firestore Database** → "데이터베이스 만들기"
2. **프로덕션 모드**로 시작 (테스트 모드 아님)
3. 만든 뒤 "규칙(Rules)" 탭으로 이동 → 이 폴더의 **`firestore.rules`** 파일 내용을 그대로 붙여넣고 **게시(Publish)**
   - 이 규칙이 실제 보안 담당입니다. (누가 글을 쓸 수 있는지, 본인 글/댓글만 지울 수 있는지, 회원소통창은 승인된 회원만 볼 수 있는지 등)

## 4. 웹 앱 등록 → 설정값 받기
1. 프로젝트 설정(⚙️ 톱니바퀴) → **일반** 탭 → 아래로 스크롤 → "내 앱" → **웹(</>) 아이콘** 클릭
2. 앱 닉네임 아무거나 입력 → 등록
3. 화면에 나오는 `firebaseConfig = { apiKey: "...", ... }` 값을 통째로 복사
4. 이 폴더의 **`firebase-config.js`** 파일을 열어서, 안내 문구 아래 있는 placeholder 값들을 방금 복사한 값으로 교체

```js
export const firebaseConfig = {
    apiKey: "여기에 실제 값",
    authDomain: "여기에 실제 값",
    projectId: "여기에 실제 값",
    storageBucket: "여기에 실제 값",
    messagingSenderId: "여기에 실제 값",
    appId: "여기에 실제 값"
};
```

## 5. Google 로그인 도메인 등록
1. Authentication > Settings > **승인된 도메인(Authorized domains)**
2. 실제 서비스 도메인을 추가 (예: `handawon-today-eat.netlify.app`)
   - 등록하지 않으면 배포된 사이트에서 Google 로그인 팝업이 "도메인이 승인되지 않았습니다" 오류를 낼 수 있습니다.

## 6. 첫 관리자 계정 지정하기
Firebase에는 "이 사람이 관리자다"를 자동으로 정해주는 기능이 없어서, **최초 1회는 콘솔에서 수동으로** 지정해야 합니다.

1. 사이트에서 평소처럼 회원가입을 한 번 진행 (본인이 관리자로 쓸 계정)
2. Firebase 콘솔 > Firestore Database > `members` 컬렉션에서 방금 가입한 문서를 찾음
3. 그 문서의 필드를 아래처럼 수정
   - `role`: `"member"` → `"admin"`
   - `status`: `"pending"` → `"approved"`
4. 이후 그 계정으로 로그인하면 메뉴에 **"관리자"** 탭이 나타나고,
   회원 승인 대기 명단 확인 · 승인/거절 · 강제 탈퇴가 가능합니다.

## 7. 배포 시 주의사항 (Netlify + GitHub)
- `firebase-config.js`는 `.gitignore`에 등록되어 있어 **GitHub 저장소에는 올라가지 않습니다.**
- 다만 이 파일 안의 값은 서버 비밀번호 같은 "진짜 비밀 값"이 아니라, **브라우저에서 이 웹앱이 어떤 Firebase 프로젝트를 쓰는지 알려주는 식별자**입니다. (배포된 사이트를 열어 개발자도구로 보면 어차피 누구나 볼 수 있는 값입니다) 실제 보안은 3번에서 게시한 `firestore.rules`가 담당합니다.
- 그래서 배포 방식에 따라 아래 중 하나를 선택하시면 됩니다.
  - **A. 그냥 커밋하기(가장 간단)**: `firebase-config.js`를 `.gitignore`에서 빼고 그대로 커밋 → Netlify가 자동으로 함께 배포합니다.
  - **B. gitignore 유지 + 수동 업로드**: GitHub에는 올리지 않고, Netlify 사이트 설정에서 파일을 직접 배포에 포함시키는 방법(예: Netlify Drop으로 폴더 통째 업로드) 사용
  - **C. 빌드 시 생성**: Netlify 환경변수(Site settings > Environment variables)에 각 값을 등록하고, 빌드 스크립트가 그 값으로 `firebase-config.js`를 자동 생성하도록 구성 (조금 더 손이 갑니다)

## 8. 확인해보기
설정을 마친 뒤 사이트에 접속해서:
- 회원가입 → Firestore `members` 컬렉션에 `status: pending` 문서가 생기는지 확인
- 관리자 계정으로 로그인 → "관리자" 메뉴에서 승인 처리
- 승인된 계정으로 로그인 → 회원소통창 글쓰기가 가능한지 확인
- 다른 브라우저(또는 시크릿 창)로 접속 → 소통창 글이 똑같이 보이는지 확인 (이제 서버에 저장되므로 모두에게 공유됩니다)

---

## 알아두시면 좋은 한계점
- **사진 첨부**는 지금은 Firestore 문서 안에 base64로 직접 저장합니다(문서당 1MB 제한). 500KB가 넘는 사진은 업로드가 막히도록 해두었습니다. 사진을 더 크고 많이 다루려면 **Firebase Storage** 연동이 추가로 필요합니다.
- **댓글**은 별도 컬렉션이 아니라 게시글 문서 안의 배열로 저장됩니다. 소규모 서비스에는 충분하지만, 댓글이 아주 많아지면 서브컬렉션 구조로 옮기는 것이 좋습니다.
- **강제 탈퇴**는 "회원 자격(Firestore 문서)"만 삭제합니다. 로그인 계정(Firebase Auth) 자체를 완전히 삭제하려면 Cloud Functions(Admin SDK)를 이용한 서버 측 코드가 추가로 필요합니다(브라우저 코드만으로는 불가능한 영역입니다).
