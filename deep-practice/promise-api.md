# Promise API

`Promise`클래스에는 5개의 정적 메서드(`Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.resolve`, `Promise.reject`)가 있는데 이에 대해 차례대로 알아보겠습니다.

Q. `Promise.all`은 어떤 동작을 하는 메서드인가요?

> `Promise.all`메서드는 인자로 여러 개의 프로미스로 구성된 배열을 받을 수 있습니다.

```js
let promise = Promise.all([…promise…]);
```

> `Promise.all`메서드가 실행되면 인자로 받은 프로미스가 모두 이행되길 기다립니다. 모두 이행된다면 각 프로미스의 `result`프로퍼티 값을 담은 배열을 `result`로 가지는 새로운 `Promise`를 반환하는 메서드입니다.

```js
// 3개의 프로미스가 모두 이행되면 각 결과값인 1, 2, 3을 배열로 담아 반환됩니다.
Promise.all([
  new Promise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Promise((resolve) => setTimeout(() => resolve(3), 1000)), // 3
]).then(console.log); // [1,2,3]
```

> 위의 예시 코드를 실행하면 가장 늦게 이행되는 세번째 프로미스를 기다렸다가 3초 후에

```js
{
	state: "fulfilled",
	result: [1, 2, 3]
}
```

> 인 `Promise`를 반환합니다. 그리고 `then`메서드에서 그 결과값을 받아 `[1,2,3]`을 출력하는 것을 알 수 있습니다.

> 즉, 여러 개의 프로미스를 인자로 받아 모두 이행되길 기다린 후, 그 결과값을 가진 새로운 이행된 프로미스를 반환하는 메서드입니다. 만약 여러 개의 프로미스 중 하나라도 거부되면 즉시 거부된 프로미스를 반환합니다.

Q. `Promise.all`은 주로 어떤 상황에 사용하나요?

> 서로 관련이 있는 비동기 작업 여러 개가 모두 이행된 후에, 해당 결과값을 이용하여 그 이후의 코드를 실행해야할 경우에 사용됩니다.

> 예를 들면 다음과 같은 상황입니다. `names`는 유저네임이 담긴 배열입니다. 각 유저네임으로 api를 요청하여 유저 정보를 받고, 받은 정보를 사용하여 유저의 이름을 `alert`해보도록 하겠습니다.
>
> `names`배열을 매핑하여 각 `name`으로 `fetch`메서드를 호출하여 프로미스로 구성된 배열을 반환합니다. 그리고 이 배열을 `Promise.all`의 인수로 사용됩니다.

```js
let names = ["iliakan", "Violet-Bora-Lee", "jeresig"];

// 1. fetch를 사용하여 프로미스로 매핑합니다.
let requests = names.map((name) =>
  fetch(`https://api.github.com/users/${name}`)
);

// 2. 3개의 모든 요청이 이행되길 기다립니다.
Promise.all(requests)
  .then((responses) => {
    // 3. 모든 응답이 성공적으로 이행되어 then핸들러가 실행됩니다.
    for (let response of responses) {
      alert(`${response.url}: ${response.status}`); // 모든 url의 응답코드가 200입니다.
    }

    return responses;
  })
  // 4. 응답 메시지가 담긴 배열을 response.json()로 매핑해 내용을 읽습니다.
  .then((responses) => Promise.all(responses.map((r) => r.json())))
  // 5. JSON 형태의 응답 메시지는 파싱 되어 배열 'users'에 저장됩니다.
  .then((users) => users.forEach((user) => alert(user.name)));
```

Q. `Promise.all`은 매개변수로 요소가 모두 프로미스인 배열만 받을 수 있는건가요?

> 아니요, 프로미스가 아닌 값도 배열의 요소여도 동작합니다.

```js
var promise = Promise.all([1, 2]);
```

> 위 promise는

```jsx
{
	state: "fulfilled",
	result: [1, 2]
}
```

> 인 `Promise`를 반환합니다. 즉, 그대로 `result`값을 가지는 이행된 프로미스를 반환합니다.

Q. `Promise.all`은 비동기적으로 동작하나요?

> 받은 인자에 따라 동기적으로 동작하기도 하고 비동기적으로 동작하기도 합니다.
>
> 빈 배열을 인자로 받으면 즉시 이행되어 다음 코드에서 바로 결과를 확인할 수 있습니다.
>
> 빈 배열이 아닌 경우에는 `Promise.all`은 비동기적으로 동작합니다. 여러 개의 프로미스로 구성된 배열을 받고 여러 개의 프로미스가 모두 `settled`될 때 까지 기다린 후에 그 결과를 반환하기 때문에 비동기적으로 동작합니다. 예시 코드입니다.

```jsx
var p = Promise.all([]); // 즉시 이행합니다.
var p2 = Promise.all([1337, "hi"]); // 프로미스가 아닌 값이지만 비동기적으로 실행됩니다.

console.log(p);
console.log(p2);

// 마이크로태스크 큐와 호출 스택이 비워진 다음에 실행하기 위해 setTimeout을 사용해서 출력합니다.
setTimeout(function () {
  console.log("the stack is now empty");
  console.log(p2);
});
```

> 실행 결과

```js
Promise { <state>: "fulfilled", <value>: Array[0] }
Promise { <state>: "pending" }
the stack is now empty
Promise { <state>: "fulfilled", <value>: Array[2] }
```

> p`는 동기적으로 즉시 이행되어 `console`문에서 `fulfilled`된 `promise`가 출력되는 것을 확인할 수 있습니다. 그와 달리 `p2`는 비동기적으로 실행되기 때문에 `console`문에서는 아직 `pending`상태로 출력이 됩니다. 그 후에 `setTimeout`의 콜백함수에서 실행한 `console`문에서는 `fulfilled`된 상태인 `promise`가 출력되는 것을 볼 수 있습니다.
