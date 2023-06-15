# [async와 await](https://ko.javascript.info/async-await)

Q. `async`가 무엇인가요?

> `async`는 `function` 앞에 위치하는 키워드입니다. `async`키워드가 붙은 함수는 항상 `Promise`를 반환합니다. `Promise`가 아닌 값을 반환해도 이행 상태의 프라미스로 값을 감싸 이행된 프라미스가 반환되도록 합니다.

```js
async function f() {
  return 1;
}

f().then(alert); // 1
```

> 위 예시 코드에서 `f`함수에서 `result`가 1인 이행된 프로미스를 반환했기 때문에 1이 출력되는 것을 알 수 있습니다. `f`함수가 1을 반환하더라도 `Promise.resolve(1)`을 반환하는 것과 같습니다.

> 즉, `async`함수는 `Promise`를 반환하는 함수입니다. 그리고 `async`함수 내부에서는 `await`키워드를 사용할 수 있습니다.

Q. `await`는 무엇인가요?

> `await`는 `async`함수 내부에서만 사용할 수 있는 키워드입니다. (만약 일반 함수에서 `await`를 사용하면 문법 에러가 발생합니다.)

> `await`는 보통 `Promise` 앞에 붙어 사용됩니다. `Promise`가 아닌 문 앞에 사용된다면 그 값을 이행된 `Promise`로 변환시킵니다.

```js
// await는 async 함수 안에서만 동작합니다.
let value = await promise;
```

> `await`는 `Promise`를 기다리는 역할을 합니다. `async`함수를 실행하다가 `await`키워드를 만나면, `Promise`가 `fulfilled`되거나 혹은 `reject`될 때까지 `async`함수의 실행을 중단하고 기다립니다. 그리고 그 처리된 `Promise` 객체의 `result` 프로퍼티에 저장된 값을 반환합니다.

> 예시 코드

```js
async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("완료!"), 1000);
  });

  let value = await promise; // 프라미스가 이행될 때까지 기다립니다. (*)

  alert(value); // "완료!"
}

f();
```

> `*`로 표시한 줄에 `await`키워드가 있습니다. 그래서 잠시 함수의 실행을 멈추고 `promise`가 처리될 때까지 기다립니다. `promise`가 이행되어 해당 `promise`객체의 `result`값인 “완료!”가 `value`에 할당됩니다.

Q. `await`가 `promise`의 처리를 기다리는 동안 함수 밖의 다른 코드들도 실행되지 않고 기다리나요?

> 프로미스 내부의 비동기 작업을 처리하는 동안 다른 일을 처리할 수 있습니다. 왜냐하면 비동기 작업은 브라우저에서 제공하는 Web API가 수행하기 때문입니다. Web API는 DOM API, 타이머 함수, HTTP 요청(`Ajax`)과 같은 비동기 처리를 합니다. 그래서 Web API가 비동기 작업을 수행하여 `Promise`의 처리를 기다리는 동안 자바스크립트 엔진은 다른 일(다른 스크립트 실행, 이벤트 처리 등)을 처리할 수 있습니다.

Q. `Promise`가 `resolve`도 `reject`도 되지 않으면 어떻게 되나요?

> `Promise`의 코드를 다 실행했는데 `resolve`도 `reject`도 되지 않아 계속 `pending`상태이면 `await`문 이후의 함수 내부 코드들은 실행되지 않습니다.

> 예시 코드

```js
function promise() {
  return new Promise((resolve, reject) => {
    console.log(1);
  });
}
async function f() {
  try {
    let result = await promise();
    console.log("promise가 처리되었습니다.");
    alert(result);
  } catch (err) {
    console.log(err);
  }
}

f();

console.log("---f() 호출 이후---");

console.log(2);
console.log(3);
```

> 실행 결과

```js
1
---f() 호출 이후---
2
3
```

> `promise`를 호출한 이후의 콘솔문인 “promise가 처리되었습니다.”와 `alert`문이 실행되지 않고, `f`함수 밖의 코드들은 실행된 것을 확인할 수 있습니다.

Q. 만약 최상위 레벨 코드에서 `await`를 사용하고 싶으면 어떻게 하면 되나요?

> 익명 `async`함수로 코드를 감싸면 최상위 레벨 코드에서도 `await`를 사용할 수 있습니다.

```js
(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();
  ...
})();
```

Q. `await`가 기다리던 `Promise`가 거부되면 어떻게 되나요?

`Promise`가 거부 상태가 되면 `await`문은 거부된 값을 `throw`합니다. 그래서 `try…catch`문을 사용하면 `throw`한 에러를 잡을 수 있습니다.

> 예시 코드

```js
async function f() {
  try {
    let response = await fetch("http://유효하지-않은-주소");
    let user = await response.json();
  } catch (err) {
    // try코드 블록에서 발행한 모든 에러를 여기서 잡을 수 있습니다.
    alert(err);
  }
}

f();
```

> 만약 `async`함수 내부에 에러를 처리하는 코드가 없는 상황에서 에러가 발생했다면 `async`함수는 거부된 `Promise`를 반환합니다. 그래서 이런 상황에서는 `async`함수에 `catch`메서드를 추가해주면 에러를 핸들링할 수 있습니다.

> 예시 코드

```js
async function f() {
  let response = await fetch("http://유효하지-않은-주소");
}

// f()는 거부 상태의 프라미스가 됩니다.
f().catch(alert); // TypeError: failed to fetch // (*)
```

Q. `async`, `await`를 사용한 비동기 처리의 장점은 무엇인가요?

> `async`, `await`는 프로미스 후속 처리 메서드를 사용하지 않고 마치 동기 처리처럼 프로미스를 사용할 수 있습니다. 그래서 프로미스 체이닝으로 비동기 처리를 하는 것보다 가독성이 좋고 사용법도 간단합니다.
