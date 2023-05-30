# Promise

Q. 프라미스가 무엇인가요?

> 프라미스는 자바스크립트의 객체로 비동기 작업을 효율적으로 관리하며 비동기 작업 결과를 처리하기 위해 사용됩니다.

Q. 프라미스는 어떻게 사용하나요?

> 프로미스는 생성자 함수 `new Promise()`를 호출하고 생성자 함수의 인자에 `executor` 함수를 넘기면 됩니다.

```js
new Promise(executor);
```

Q. `executor` 함수는 뭐에요?

> `executor` 함수는 말 그대로 "실행자"인데 `new Promise()`를 호출할 때 자동으로 실행되는 함수입니다. 즉 우리가 `new Promise(executor)`를 실행하면 Promise 객체가 만들어지는데 이때 `executor` 함수도 함께 자동으로 실행됩니다. `executor` 함수를 정의하는 방법은 다음과 같습니다:

```js
let promise = new Promise(function (resolve, reject) {});
```

> resolve와 reject는 자바스크립트에서 빌트인으로 제공하는 콜백입니다. Promise 객체를 사용하는 이유는 비동기 동작을 하기 위함이고 이 비동기 동작은 성공할 수도 있고 실패할 수도 있습니다. 성공한다면 우리는 성공한 결과 값을 받으면 됩니다. 실패한다면 에러를 핸들링하면 됩니다. 그래서 성공한 값을 받기 위해 `resolve(value)`를 실행하고, 실패한 값을 받기 위해 `reject(error)`를 실행합니다.

```js
let promise = new Promise(function (resolve, reject) {
  // 성공했을 경우 resolve 함수에 성공한 결과값을 인자로 넘겨서 호출합니다
  resolve(value);

  // 실패했을 경우 reject 함수에 에러값을 인자로 넘겨서 호출합니다
  reject(error);
});
```

> 이때 executor 함수는 처리 성공 여부에 따라 자동으로 resolve 함수나 reject 함수를 호출합니다.

(예시) Q. `new Promise()`에 인자로 넘길 executor 함수를 정의하는 예시를 보여주세요.

> 예를 들어, setTimeout으로 1초 후에 "완료"라는 메시지를 전달하고 싶다면 다음과 같이 executor 함수를 정의할 수 있습니다:

```js
let promise = new Promise(function (resolve, reject) {
  // 프라미스가 만들어지면 executor 함수는 자동으로 실행됩니다.

  // 1초 뒤에 일이 성공적으로 끝났다는 신호가 전달되면서 result는 '완료'가 됩니다.
  setTimeout(() => resolve("완료"), 1000);
});
```

Q. 프라미스로 어떻게 비동기 처리를 할 수 있나요?

> 먼저 프라미스는 `new Promise(executor)`로 프라미스 객체를 생성할 수 있습니다.

```js
const getPosts = (url) => {
  return new Promise((resolve, reject) => {
    // 비동기로 처리할 작업을 작성합니다.
  });
};
```

> 프로미스 객체는 `state` 프로퍼티와 `result` 프로퍼티를 갖고 있습니다.

```js
{
  state: 'pending' | 'fulfilled' | 'rejected'
  result: undefined | <받은 값>
}
```

> 프로미스를 생성할 때는 각 프로퍼티는 어떤 값을 가질까요? 아래와 같습니다:

```ts
{
  state: "pending";
  result: undefined;
}
```

```js
const getPosts = (url) => {
  return new Promise((resolve, reject) => {
    // 비동기로 처리할 작업을 작성합니다.
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 비동기 작업이 성공하면, resolve함수를 호출하며 넘길 값을 인자로 넘겨줍니다.
        resolve(JSON.parse(xhr.response));
      } else {
        // 비동기 작업이 실패하면, reject함수를 호출하며 넘길 값을 인자로 넘겨줍니다.
        reject(xhr.status, xhr.statusText);
      }
    };
  });
};
```

> `resolve`함수를 호출하면 프라미스 객체의 `state`가 `fulfilled`로 변하며 `result`는 인자에 넘긴 값이 됩니다. `reject`함수를 호출하면 상태가 `rejected`로 변하며 `result`는 인자에 넘긴 값이 됩니다. 그래서 프라미스를 사용하면 비동기 작업이 성공적으로 완료되었는지 혹은 실패했는지의 비동기 작업의 상태와 결과를 관리할 수 있습니다.

Q. 그렇다면 프라미스로 비동기 작업 이후의 후속 작업은 어떻게 실행할 수 있나요?

> 프라미스는 후속 작업을 위해 후속 처리 메서드를 제공합니다. `then`, `catch`, `finally` 메서드입니다.

> `then`메서드는 2개의 콜백함수를 인수로 받습니다. 첫번째 인수는 프라미스가 성공적으로 이행(`fulfilled`)됐을 때 실행되는 콜백함수입니다. 두번째 인수는 프라미스가 거부(`rejected`)됐을 때 실행되는 콜백함수입니다. 그리고 각각의 콜백함수들은 `resolve`나 `reject`함수를 호출했을 때 인자로 넘긴 값을 인수로 받습니다. `then`메서드가 실행되는 시점은 프라미스의 상태가 변경되었을 때 자동으로 실행됩니다. 즉, 첫번째 인수 콜백함수는 비동기 작업이 성공적으로 처리됐을 때의 후속 작업을, 두번째 인수 콜백함수는 비동기 작업이 실패했을 때의 후속 작업을 담당합니다.

```js
promise.then(
  function (result) {
    /** 결과(result)를 다룹니다.
     *  resolve함수를 호출하면 실행됩니다. */
  },
  function (error) {
    /** 에러(error)를 다룹니다.
     *  reject함수를 호출하면 실행됩니다. */
  }
);
```

> `catch`메서드는 1개의 콜백함수를 인수로 받습니다. `catch`메서드가 실행되는 시점은 프라미스가 거부(rejected)됐을 때입니다. 즉 인수인 콜백함수는 비동기 작업이 실패했을 때의 후속 작업을 담고 있습니다.

```js
promise.catch(function (error) {
  /** 에러를 다루는 콜백함수만 가집니다.
   *  reject함수를 호출하면 실행됩니다. */
  alert(error);
});
```

> `finally`메서드도 1개의 콜백함수를 인수로 받습니다. `finally`메서드는 프라미스의 상태와 관련없이(이행됐던 거부됐던 상관없이) 무조건 한 번은 호출됩니다. 그래서 `finally`메서드는 비동기 작업 후에 결과에 상관없이 공통적으로 수행해야할 작업이 있을 경우에 사용하면 좋습니다. 프라미스의 상태와 상관없이 호출되기 때문에 콜백함수는 인수를 받지 않습니다.

```js
promise.finally(() => {
  // 인수를 받지 않습니다.
  console.log("끝");
});
```
