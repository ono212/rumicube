# Promise Chaining

Q. 프로미스 체이닝이 무엇인가요?

> 프로미스 체이닝이란 여러 개의 `then`메서드를 체인처럼 연결하여 비동기 작업을 순차적으로 처리하는 방식을 말합니다. 프로미스 체이닝의 예시입니다.

```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000); // (*)
})
  .then(function (result) {
    alert(result); // 1
    return result * 2;
  })
  .then(function (result) {
    alert(result); // 2
    return result * 2;
  })
  .then(function (result) {
    alert(result); // 4
    return result * 2;
  });
```

> 이렇게 `then`메서드를 체인처럼 연결하면, 비동기 작업을 순차적으로 처리하며 결과값을 순차적으로 전달할 수 있습니다.

Q. 프로미스 체이닝은 주로 어떤 상황에 사용하나요?

> 2개 이상의 비동기 작업을 순차적으로 실행해야 할 경우 사용합니다. 즉, 어떤 비동기 작업의 결과값을 이용해서 다음 비동기 작업에 실행해야 하는 상황에 프로미스 체이닝을 사용하여 해결할 수 있습니다.
>
> `fetch`메서드를 사용해서 예시를 들어보겠습니다. `fetch`는 네트워크 요청을 보낼 url을 인수로 받습니다. `fetch`를 호출하면 서버에서 response객체를 응답받으며 이행된 프로미스를 반환합니다.

```js
// 1. 서버에 요청을 보냅니다.
fetch("/article/promise-chaining/user.json")
  // 2. 서버로부터 응답받은 내용을 json으로 불러옵니다.
  .then((response) => response.json())
  // 3. 불러온 사용자 정보로 그 사용자의 github 프로필을 받아오기 위해 요청을 보내겠습니다.
  .then((user) => fetch(`https://api.github.com/users/${user.name}`))
  // 4. 서버로부터 응답받은 내용을 json으로 불러옵니다.
  .then((response) => response.json())
  // 5. 받아온 github 프로필 정보로 3초동안 프로필 이미지를 보여주겠습니다.
  .then(
    (githubUser) =>
      new Promise(function (resolve, reject) {
        // (*)
        let img = document.createElement("img");
        img.src = githubUser.avatar_url;
        img.className = "promise-avatar-example";
        document.body.append(img);

        setTimeout(() => {
          img.remove();
          resolve(githubUser); // (**)
        }, 3000);
      })
  )
  // 6. 3초 후에 alert창이 뜹니다.
  .then((githubUser) =>
    alert(`${githubUser.name}의 이미지를 성공적으로 출력하였습니다.`)
  );
```

> 이렇게 여러개의 비동기 작업을 순차적으로 해야하며 이전 결과값이 다음 비동기 작업에 필요할 경우 프로미스 체이닝으로 구현할 수 있습니다.

Q. 프로미스 체이닝은 어떻게 가능한건가요?

> `then`메서드를 포함한 `catch`, `finally` 메서드는 새로운 `Promise`객체를 반환하기 때문입니다. `then`메서드는 `Promise`객체를 반환하고, `Promise`에는 `then`메서드를 호출할 수 있기 때문에 체이닝이 가능합니다.

Q. `then`메서드에서 return한 값은 어떻게 다음 `then`메서드에 전달되는건가요?

> `then`메서드의 콜백함수는 일반 값을 반환할 수도 있고 `Promise` 객체를 생성하여 반환할 수도 있습니다. 일반 값을 반환하더라도 결국에는 `Promise`객체를 생성하여 반환하게 됩니다. 즉, `Promise.resovle(일반 값)`으로 처리됩니다.
>
> 다음은 경우에 따라 어떤 `Promise`객체를 반환하는지 정리한 것입니다.

- 값을 반환하는 경우
  - `state`: `fulfilled`, `result`: 값
  - `then`메서드의 첫번째 인수(프로미스가 `fulfilled`되었을 때 실행되는 함수)를 실행합니다.
- `return`문이 없을 경우
  - `state`: `fulfilled`, `result`: `undefined`
  - `then`메서드의 첫번째 인수(프로미스가 `fulfilled`되었을 때 실행되는 함수)를 실행합니다.
- `throw error`인 경우
  - `state`: `rejected`, `result`: `throw한 error`
  - `then`메서드의 두번째 인수(프로미스가 `rejected`되었을 때 실행되는 함수)를 실행합니다.
- `fulfilled` 상태인 `promise`를 반환하는 경우
  - `state`: `fulfilled`, `result`: `반환한 promise의 result`
  - `then`메서드의 첫번째 인수(프로미스가 `fulfilled`되었을 때 실행되는 함수)를 실행합니다.
- `reject` 상태인 `promise`를 반환하는 경우
  - `state`: `rejected`, `result`: `반환한 promise의 result`
  - `then`메서드의 두번째 인수(프로미스가 `rejected`되었을 때 실행되는 함수)를 실행합니다.
- `pending` 상태인 `promise`를 반환하는 경우
  - `promise`가 처리되기를 (`fulfilled`되거나 `rejected`) 기다렸다가 완료되면 그 `promise`를 반환한다.
  - `promise` 처리결과에 따라 `then`메서드의 첫번째 인수나 두번째 인수가 실행됩니다.
  - 아래는 예시입니다.

```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    alert(result); // 1
    return new Promise((resolve, reject) => {
      // (*) resolve를 호출하면 **를 실행합니다.
      setTimeout(() => resolve(result * 2), 1000);
    });
  })
  .then(function (result) {
    // (**)
    alert(result); // 2
  });
```

> 따라서 각 경우에 따라 위의 `state`와 `result`인 `Promise`객체를 반환하게 됩니다.

Q. 연결된 여러개의 `then`메서드들의 콜백함수들은 모두 차례대로 실행되나요?

> 네, 앞의 `then`메서드부터 차례대로 실행되지만 주의해야할 점이 있습니다.
>
> 각각의 콜백함수들은 `return`문이 있어야 합니다. 그렇지 않으면 다음 `then`메서드들의 콜백함수들이 인자를 받지 못합니다.

```js
new Promise((resolve, reject) => {
  resolve(1);
})
  .then(function (result) {
    // (*)
    alert(result); // 1
    result *= 2;
  })
  .then(function (result) {
    // (**)
    alert(result); // undefined
  });
```

> 위의 예시에서 첫번째 `then`메서드에 `return`문이 없기 때문에 두번째 `then`메서드는 인자를 받지 못해 `undefined`를 출력합니다.
>
> 두번째로 주의해야 할 점은 콜백함수 내부에 비동기 작업이 있을 경우에는 `Promise` 객체를 생성하여 반환해야합니다. `fetch`메서드의 경우 반환값이 `Promise`객체이기 때문에 자체로 `Promise`객체를 반환하는 메서드는 상관없지만, 예를 들어 `setTimeout`함수를 사용할 경우 새로운 프로미스 객체를 생성하여 반환해야 순차적으로 처리할 수 있습니다.

```js
Promise.resolve(1)
  .then((result) => {
    setTimeout(() => alert("첫번째 then : " + result), 3000); // (*)
    return result * 2;
  })
  // 3초 후에 *의 alert창을 실행한 후가 아닌 그보다 먼저 실행됩니다.
  .then((result) => alert("두번째 then : " + result)); // 1
```

> 위의 예시에서 3초 후에 첫번째 `then`메서드의 `alert`창이 먼저 실행된 후에 두번째 `then`메서드의 `alert`창을 실행하는 게 아니라, 두번째 `alert`창 실행 → 첫번째 `alert`창 실행의 순서로 이루어진 것을 알 수 있습니다.

```js
Promise.resolve(1)
  .then(
    (result) =>
      new Promise((resolve) => {
        setTimeout(() => {
          alert("첫번째 then : " + result);
          resolve(result * 2);
        }, 3000);
      })
  )
  // 첫번째 alert창 이후에 순차적으로 두번째 alert창이 실행됩니다.
  .then((result) => alert("두번째 then : " + result)); // 1
```

> `setTimeout`을 호출하면 `setTimeout`의 콜백함수는 콜백 큐에 담겨져 대기합니다. 그리고 다음 코드들을 실행합니다. 콜백함수는 콜 스택이 비워진 다음에야 호출됩니다. 그렇기 때문에 콜백함수의 실행을 기다리지 않고 다음 `then`메서드를 실행한 것입니다.
>
> `setTimeout`의 콜백함수를 수행한 다음에 이후의 `then`메서드를 순차적으로 실행하고 싶은 경우, `Promise`를 생성하여 내부에서 `setTimeout`을 호출하도록 해야합니다. 이렇게 하면 `Promise`객체는 객체가 처리되길 기다려야하기 때문에 콜백함수에서 모든 동작 이후에 `resolve`를 호출하면 다음 `then`메서드로 넘어갑니다.
