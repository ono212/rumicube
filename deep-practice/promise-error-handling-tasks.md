[프로미스와 에러 핸들링 과제](https://ko.javascript.info/promise-error-handling#tasks)

## 1. `setTimeout`에서 `throw error`를 할 경우 어떻게 될까?

> 문제

> 아래 코드에서 `setTimeout`의 콜백에서 `throw`한 `error`를 통해 `catch`메서드가 트리거될까요?

```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    throw new Error("에러 발생!");
  }, 1000);
}).catch(alert);
```

> 답안
>
> `catch`메서드는 트리거되지 않습니다.

## 모르겠는 것

> catch가 트리거 되지 않는 이유를 잘 모르겠습니다.

```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    reject("에러 발생!");
  }, 1000);
}).catch(alert);
```

> 위의 코드처럼 `throw error`가 아닌 `reject`로 바꿔주면 `catch`메서드가 트리거 됩니다.
> `reject`로는 트리거되고 `throw error`로는 트리거되지 않는 이유가 무엇인지 정확히 모르겠습니다.
>
> 모자딥에서는 "에러가 `executor`(실행자, 실행 함수)가 실행되는 동안이 아니라 나중에 발생합니다. 따라서 프라미스는 에러를 처리할 수 없습니다." 라고 했는데 이 이유가 잘 이해 가지않습니다.
>
> 에러는 호출자 방향으로 전파되는데, `setTimeout`의 콜백함수 같은 경우는 콜 스택의 가장 아래에 위치하기때문에 에러를 전파할 호출자가 없다고 알고 있습니다. 이와 관련된 이유인지 궁금합니다.
