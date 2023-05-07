# react template qna

## 타입스크립트

Q. 아래 `type-check`는 무엇을 하는 명령어인가요? 왜 추가했나요?

`package.json`:

```jsonc
{
  "scripts": {
    // ...
    "type-check": "tsc --noEmit --skipLibCheck"
    // ...
  }
}
```

> 패키지 전체에서 타입 에러가 발생하는지 확인하기 위한 스크립트입니다. 패키지 안에서 파일을 들여보지 않는 한 타입 에러가 발생하는 것을 인지하지 못하기 때문에 타입 에러를 인지하기 위해서 추가한 스크립트입니다.

## 웹팩 설정

Q. `.browserslistrc` 파일은 무슨 파일인가요?

> 웹 애플리케이션을 만들 때는 브라우저 호환성을 고려해야 합니다. `browserslist` 파일에 지원할 브라우저 목록을 정의하면 JS, CSS 등 전처리 도구에서 해당 브라우저 지원 목록을 참고하여 코드를 변환합니다. 즉 babel, autoprefixer, webpack 등에서 타겟 브라우저 설정을 일일이 설정할 필요 없이 (모든 툴이 browserslist 파일부터 찾으므로) `browserslist` 파일 하나만으로 브라우저 호환성을 고려할 수 있어서 편리합니다.

Q. 웹팩 설정 파일이 `webpack.config.ts`, `webpack.dev.ts`, `webpack.prod.ts` 왜 3개인가요?

> 웹팩 개발환경 설정 파일과 프로덕션 설정 파일에는 공통적으로 들어가는 코드가 있는데 이 코드를 각 파일마다 따로 따로 중복해서 쓰면, 나중에 공통 설정의 코드를 수정할 때 일일이 두 개씩 바꿔줘야 하는 불편함이 발생합니다. 이렇게 중복으로 인해 생기는 불편한 점을 해소하기 위해 공통 파일을 만들어서 사용합니다.

## 📚 함께 읽기

- [browserslist가 뭘까](https://blog.shiren.dev/2020-12-01/)
