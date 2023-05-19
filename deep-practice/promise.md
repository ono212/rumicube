# Promise

Q. 프라미스가 무엇인가요?

> 프라미스는 자바스크립트의 객체로 비동기 작업을 효율적으로 관리하며 비동기 작업 결과를 처리하기 위해 사용됩니다.

Q. 프라미스로 어떻게 비동기 처리를 할 수 있나요?

> 먼저 프라미스는 `new Promise(executor)`로 프라미스 객체를 생성할 수 있습니다.

```js
const getPosts = (url) => {
  return new Promise((resolve, reject) => {
    // 비동기로 처리할 작업을 작성합니다.
  });
};
```

> 생성할 때 프라미스 객체의 `state`프로퍼티는 `pending`, `result`프로퍼티는 `undefined`입니다. 그리고 객체를 생성하면서 `executor`라는 실행함수를 인자로 넘깁니다. `executor`는 `new Promise`로 생성할 때 바로 실행됩니다. 이 실행함수에 비동기로 처리할 작업을 작성합니다. 이 실행함수의 구조는 어느정도 정해져있는데 실행함수는 인수로 `resolve`함수와 `reject`함수를 가지고 있습니다. 보통 비동기로 처리할 작업을 작성하고 작업이 성공적으로 처리되면 `resolve`함수를, 작업이 실패하면 `reject`함수를 호출하도록 작성합니다. 호출하면서 인자로 처리 결과를 함께 넘길 수 있습니다.

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
