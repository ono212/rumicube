# 2023-02-18 (토) state 콜로케이션

> 🚀 **TL;DR**
>
> VDOM을 재조정하는 건 비용이 많이 들기 때문에 렌더를 신경써야 합니다. 그래서 `useCallback`, `useMemo`, `React.memo`로 할 수 있는데 이것도 비용이 드는 일이기 때문에 그 전에 state-colocation을 하는 게 좋습니다. state-colocation은 두가지 방법이 있는데 첫번째는 상태가 관련있는 컴포넌트와 상태와 관련없는 컴포넌트를 분리하는 것입니다. 두번째는 children으로 넘겨주는 방법입니다(children이 어떻게 다시 렌더링되지 않는건지 이해가 안 가요).

(언제) Q. 리액트는 언제 컴포넌트를 리렌더링하나요?

> 상태가 변경되면 리렌더링합니다.

(어떻게) Q. 리액트에서 렌더와 커밋이 있는데 개발자는 두 개중에 어떤 걸 더 신경 써야 하나요?

> - 렌더: 컴포넌트를 호출해서 리액트 엘리먼트를 얻는 것 (with 재조정)
> - 커밋: 리액트 엘리먼트를 실제 DOM에 반영하는 것
>
> 렌더를 신경써야 한다. 렌더를 할 때마다 이전 VDOM과 새 VDOM의 변경사항을 최소한으로 반영하기 위해 비교하는 재조정을 해야 하는데 재조정 연산이 커밋에 비해 훨씬 비싸기 때문이다.

(왜) Q. state 콜로케이션이란 무엇이고 왜 해야 하나요?

> 리액트에서 렌더는 재조정이라는 비싼 연산을 하기 때문에 최소화하는 게 좋습니다. 그런데 렌더링을 최소화하려면 최적화를 해야 하는데 리액트에서 대표적인 최적화 방법이 `useMemo()`가 있고, `useCallback()`, `React.memo()`가 있습니다. 최적화를 하는 것도 하나의 비용이기 때문입니다. 이 세 가지 방법은 항상 사용하는 게 꼭 좋은 것은 아닙니다.
>
> 1. 개발자는 리액트의 렌더를 신경 써야 한다.
> 2. (왜?) 렌더에서 재조정하는 과정이 비싸기 때문이다.
> 3. (그러면 어떻게 해?) 그래서 `useMemo()`, `useCallback()`, `React.memo()`를 사용해서 메모이제이션을 할 수 있습니다.
> 4. (그러면 항상 메모이제이션 하면 되는 거 아냐?) 그런데 위 세 가지 최적화 메서드는 사용하는 것이 항상 좋지는 않습니다. 어떤 경우에는 오히려 성능을 떨어뜨릴 수 있습니다.
> 5. (그런데) state 콜로케이션은 항상 최적화에 도움이 됩니다. state 콜로케이션을 하면 렌더의 재조정에 항상 도움이 됩니다.

(언제) Q. state 콜로케이션을 할 수 있는 상황이 언제인가요?

> 실천

## 🤓 함께 알기

- [Chrome Developers - performance.now()](https://developer.chrome.com/blog/when-milliseconds-are-not-enough-performance-now/)

## 📚 함께 읽기

- [Dan Abramov - memo()를 하기 전에](https://overreacted.io/ko/before-you-memo/)
- [Developer way - The mystery of React Element, children, parents and re-renders](https://www.developerway.com/posts/react-elements-children-parents)
- [codesandbox - state colocation 수련](https://codesandbox.io/s/state-colocation-forked-isi195?file=/src/App.js)
