# children prop을 사용해서 최적화하기

(이유) Q. 연산이 비싼 컴포넌트를 children prop으로 받으면 왜 최적화가 되나요?

- children으로 받은 컴포넌트는 JSX element를 한번만 생성하고 그것을 재사용하기 때문에 변경이 없어서 다시 리렌더링되지 않습니다.

Q. 왜 children으로 받은 컴포넌트는 JSX element를 한번만 생성하나요?

Q. children으로 받은 컴포넌트를 한번만 생성한다고 했는데 어떻게 그렇게 하나요?

(이유) Q. 상태 color를 왜 ColorInput 컴포넌트 내부로 이동시키나요?

## 📚 함께 읽기

- [Kent C. Dodds - One simple trick to optimize React re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)
- [codesandbox - state-colocation (문제 해결 단계를 주석으로 작성)](https://codesandbox.io/s/state-colocation-munje-haegyeol-dangyereul-juseogeuro-jagseong-95nnbk)
- [codesandbox - children으로 최적화하는 문제 주석 답변](https://codesandbox.io/s/childreneuro-coejeoghwahaneun-munje-juseog-dabbyeon-6cdd8r)
