# [마이크로태스크](https://ko.javascript.info/microtask-queue)

Q. `Promise` 후속 처리 메서드(`then`, `catch`, `finally`) 핸들러는 동기적으로 실행되나요?

> 아니요, `Promise` 후속 처리 메서드(`then`, `catch`, `finally`) 핸들러는 비동기적으로 실행됩니다.

```js
let promise = Promise.resolve();

promise.then(() => alert("프로미스 성공!"));

alert("코드 종료");
```

> 위의 예시코드를 실행하면 “코드 종료”가 먼저 출력되고, 그 다음에 “프로미스 성공!”이 출력됩니다. 프로미스가 바로 이행상태가 됐음에도 `then` 핸들러가 바로 실행되지 않은 것으로 보아 비동기적으로 실행된 것을 확인할 수 있습니다.

> 비동기적으로 실행되는 이유는 `Promise` 후속 처리 메서드(`then`, `catch`, `finally`)의 콜백함수들은 브라우저 환경의 마이크로태스크 큐에 들어가서 처리되기 때문입니다. 즉시 실행되는 것이 아니라 큐에 들어가서 기다리다가 모든 코드를 실행한 후에 실행됩니다.

Q. 마이크로태스크 큐가 무엇인가요?

> 마이크로태스크 큐는 브라우저 환경에 존재하는 큐입니다. 큐이기 때문에 선입선출의 특징이 있습니다. 작업들이 큐에 들어온 순서대로 처리합니다.

Q. 마이크로태스크 큐에는 어떤 작업들이 들어오나요?

> `Promise` 후속 처리 메서드(`then`, `catch`, `finally`)의 콜백함수들이 들어옵니다.

Q. 마이크로태스크 큐에 있는 작업들은 언제 꺼내져서 실행되나요?

> 콜스택이 비었을 때, 마이크로태스크 큐에 있는 작업들 중 가장 먼저 들어온 작업을 꺼내서 콜스택에 넣고 그 작업을 실행합니다. 예를 들어 1번 질문의 예시코드는 다음과 같은 순서로 동작합니다.

> `promise`가 이행되었습니다. → `promise`의 `then`핸들러는 마이크로태스크 큐에서 대기합니다. → “코드 종료”를 출력합니다. → 콜스택이 비었기 때문에 `promise`의 `then`핸들러를 콜스택에 푸시하고 실행합니다.. → “프로미스 성공!”을 출력합니다.

Q. “프로미스 성공!”을 먼저 출력하고 싶으면 어떻게 해야할까요?

```js
let promise = Promise.resolve();

promise.then(() => alert("프로미스 성공!")).then(() => alert("코드 종료"));
```

뒤에 `then`메서드를 체이닝하면 됩니다. 여러 개의 후속 메서드들로 체이닝이 형성돼있을 때도 똑같이 순차적으로 비동기적으로 실행되기 때문입니다.

Q. 자바스크립트 엔진은 `unhandledrejection` 이벤트를 어떻게 감지하는건가요?

> 마이크로태스크 큐에 있는 작업을 모두 완료하여 큐가 빈 상태가 되면, 자바스크립트 엔진은 현재 `Promise`들 중에 거부 상태인 `Promise`가 있는지 검사합니다. 이 때 하나라도 거부 상태인 `Promise`가 있다면 `unhandledrejection` 핸들러를 트리거하는 것입니다.

```js
let promise = Promise.reject(new Error("프로미스 실패!"));
setTimeout(() => promise.catch((err) => alert("잡았다!")), 1000);

// Error: 프로미스 실패!
window.addEventListener("unhandledrejection", (event) => alert(event.reason));
```

> 실행 결과

```js
Error: 프로미스 실패!
잡았다!
```

위의 예시코드에서 `setTimeout`함수을 사용해 `catch`메서드를 추가해줬음에도 `unhandledrejection` 이벤트가 트리거된 것을 확인할 수 있습니다. `setTimeout`의 콜백함수가 저장되는 태스크 큐의 작업들은 마이크로태스크큐가 다 비워진 이후에 콜스택에 푸시되어 처리됩니다. 그렇기 때문에 `unhandledrejection` 이벤트가 트리거되고, 그 다음에 `catch` 핸들러가 실행된 것입니다.
