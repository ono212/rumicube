# 콜백 설명

> wiring 하는 가장 쉬운 방법: 백지 상태에서 개념을 설명한다.
>
> - 설명의 흐름이 끊어지면 안된다. (스토리텔링)
> - 설명을 할 때 모르는 개념이 나오면 메모해두고 그 개념을 다시 학습한다.

(개념) Q. 콜백이 무엇인가요?

> (사전적 정의에서 출발) 콜백(callback)이라는 것은 영어로는 "전화를 다시 건다"는 뜻이고 프로그래밍에서는 어떤 프로세스 A가 실행되는데 프로세스 A가 끝나면 이어서 "무언가"를 실행해야 할 때, 이 무언가에 대한 내용을 담고 있는 함수를 콜백이라고 합니다.

(이유) Q. 자바스크립트에서 콜백은 왜 사용하나요?

> (실제 상황에서 어떤 맥락에서 쓰이냐면) 자바스크립트에서 비동기로 실행하는 함수들이 있습니다. 비동기로 실행하는 함수는 언제 끝날지 알 수 없습니다. 예를 들어,

```js
const todoItem = fetch("https://jsonplaceholder.typicode.com/todos/1");
console.log("todoItem: ", todoItem);
```

> 위 코드를 실행하면 어떻게 될까요? 우리가 원하는 결과물은 HTTP API에서 `todo {id: 1}`을 가져와서 `todoItem`을 출력하는 것이지만 실제로는 `todoItem: undefined`라고 출력됩니다.
>
> 즉 비동기 함수를 실행하면 그 함수가 끝날 때까지 기다리지 않고 다음 코드를 실행합니다. 그래서 `todoItem`이라는 변수에는 `undefined`가 할당됩니다.
>
> 만약 비동기 함수가 끝난 이후에 꼭 실행해야 하는 코드가 있으면 어떻게 해야 할까요? 이럴 때 콜백을 사용합니다.

(개념) Q. 그런데 비동기는 뭐에요?

> 프로세스 A가 비동기로 실행된다는 것은 프로세스 A가 끝날 때까지 기다리지 않고 다음 코드를 실행한다는 것을 의미합니다.

(질문) Q. 근데 프로세스 A가 끝날 때까지 기다리고 나서 다음 코드를 실행하면 되는데, 왜 기다리지 않나요?

> 동기로 코드를 실행하면 코드가 순서대로 실행됩니다. 그런데 모든 코드들을 다 동기적으로만 실행되게 해서 앞선 코드가 완료되어야만 다음 코드가 실행될 수 있다면 UX 측면에서 문제가 될 수 있습니다.
>
> 예를 들어, 회원가입 버튼을 클릭하면 회원가입 API가 호출되는데 만약 인터넷이 엄청 느려서 API 호출이 오래 걸리면 사용자는 API 호출이 완료될 때까지 다른 기능을 사용할 수가 없습니다. 이것은 UX 측면에서 좋지 않습니다.
>
> 즉, 시간이 오래 걸리는 프로세스를 실행해도 다른 코드를 실행할 수 있게 하려면 시간이 오래 걸리는 프로세스를 비동기로 처리해야 합니다. 그래서 비동기를 사용합니다.

(어떻게) Q. 그러면 콜백은 어떻게 사용하나요?

> 비동기로 실행하는 함수를 실행할 때 콜백을 함께 넘겨줍니다. 그러면 비동기 함수가 끝나고 나서 콜백을 실행합니다.

```ts
// loadScript를 사용해서 콜백헬이 발생하는 코드를 차례대로 보여주기
```

---

> 콜백을 작성하는 방식에서는 다음과 같은 문제가 발생합니다:

```js

```

## memo

- `fetch()` 함수를 쓸 때 콜백을 어떻게 쓰는 거더라?
  - fetch는 애초에 async 함수였고 역사적으로 그 이전에 request API, 또는 더 옛날에 xhr 모듈로 네트워크 요청을 보냈다.