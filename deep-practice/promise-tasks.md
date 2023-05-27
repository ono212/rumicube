# 프로미스 과제

## 1. `resolve`를 두 번 호출할 수 있을까?

```js
let promise = new Promise(function (resolve, reject) {
  resolve(1);

  setTimeout(() => resolve(2), 1000);
});

promise.then(alert);
```

> 위 코드를 실행하면 `alert`창에 2가 아닌 1이 출력됩니다. `resolve`나 `reject`를 여러 번 호출할 수 없기 때문입니다. `resolve`나 `reject`가 한 번 호출되면 그 이후에 호출되는 `resolve`나 `reject`는 무시됩니다.

## 2. `Promise`로 `setTimeout`과 동일한 기능을 하는 함수 구현해보기

> 문제 조건
>
> - delay함수는 `Promise`를 반환해야한다.
> - ms이후에 `fulfilled`되어야한다.

```js
function delay(ms) {
  // 여기에 코드 작성
}

delay(3000).then(() => alert("3초후 실행"));
```

> 답안

```jsx
function delay(ms) {
  // 여기에 코드 작성
  return new Promise((resolve) => setTimeout(resolve, ms));
}

delay(3000).then(() => alert("3초후 실행"));
```

> `Promise`객체를 생성하여 내부에서 `setTimeout`을 수행하도록 하면 됩니다. ms초 후에 `resolve`를 호출하도록 `setTimeout`에 콜백을 넘겨줍니다. `delay`함수가 이러한 `Promise`객체를 생성하면서 반환하도록 하면 ms초 후에 `resolve`가 호출되기 때문에 그 다음 `then`메서드의 콜백을 호출하여 `alert`창을 실행할 수 있습니다.
>
> 이 때 `then`메서드로 넘길 값은 없기 때문에 인자없이 `resolve`를 호출하도록 합니다.

## 3. Promise로 애니메이션이 적용된 원 만들기

> 작성 중,,,
