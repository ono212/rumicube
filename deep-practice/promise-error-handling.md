# [프로미스와 에러 핸들링](https://ko.javascript.info/promise-error-handling)

Q. 프로미스에서 에러는 언제 발생하나요?

- `Promise`의 `executor`함수에서 `reject`함수를 호출하는 경우
- `executor`함수나 `Promise`의 후속 처리 메서드(`then`, `catch`, `finally`)에서 `throw error`를 할 경우
- `throw error`로 에러를 던지지 않아도 코드를 실행하면서 발생하는 모든 종류의 에러
  - ex) 존재하지 않는 함수를 호출했을 경우

> 즉, 프로미스가 거부될 때 에러가 발생합니다.

```js
// executor함수에서 reject호출
new Promise((resolve, reject) => {
  reject(new Error("에러 발생!"));
}).catch(alert); // Error: 에러 발생!

// executor함수에서 throw eroor
new Promise((resolve, reject) => {
  throw new Error("에러 발생!");
}).catch(alert); // Error: 에러 발생!

// 후속 처리 메서드의 핸들러에서 throw error
new Promise((resolve, reject) => {
  resolve("OK");
})
  .then((result) => {
    throw new Error("에러 발생!"); // 프라미스가 거부됨
  })
  .catch(alert); // Error: 에러 발생!

// 존재하지 않는 함수를 호출
new Promise((resolve, reject) => {
  resolve("OK");
})
  .then((result) => {
    blabla(); // 존재하지 않는 함수
  })
  .catch(alert); // ReferenceError: blabla is not defined
```

Q. 프로미스에서 에러가 발생하면 어떻게 처리할 수 있나요?

> 가장 가까운 `then`의 `rejection`핸들러나 `catch`의 핸들러를 추가하고 이 핸들러 내부에 에러를 어떻게 처리할지 코드를 작성하면 됩니다. 왜냐하면 에러가 발생하면 가장 가까운 에러 핸들러를 실행하기 때문입니다.
>
> 특히 `catch`메서드는 에러를 처리하고 싶은 지점에 정확히 위치시키는게 중요합니다. 프로미스 체이닝으로 여러개의 후속처리메서드들이 연결되어 있을 때, `catch`메서드는 자신이 위치한 곳보다 아래쪽에서 발생하는 에러들에 대해서는 감지하지 못하며 자신보다 높은 곳에서 발생하는 에러에 대해서만 감지할 수 있습니다. 그래서 `catch`메서드를 사용할 경우 적절한 곳에 위치시켜서 에러를 핸들링할 수 있도록 해야합니다.

```js
new Promise((resolve, reject) => {
  resolve(1);
})
  .then((result) => result + 1)
  .catch((error) => alert("첫번째 catch문: " + error))
  .then((result) => {
    throw new Error("에러 발생!"); // 프로미스가 거부되었습니다.
  })
  .catch((error) => alert("두번째 catch문: " + error)); // 하위의 가장 가까운 핸들러가 실행됩니다.
```

> 실행 결과

```js
두번째 catch문: Error: 에러 발생!
```

> 하위의 가장 가까운 에러 핸들러가 실행된 것을 알 수 있습니다.

Q. `catch`메서드 뒤에도 체이닝으로 연결할 수 있나요?

> 네, `catch`메서드도 `promise`를 반환하기 때문에 뒤에 다른 후속 처리 메서드들을 연결할 수 있습니다.
>
> `catch`메서드의 핸들러가 `throw error`를 할 경우 거부되는 `promise`를 반환하고, 그렇지 않은 경우는 이행되는 `promise`를 반환합니다. 그래서 체이닝으로 연결하여 다른 메서드를 사용할 수 있습니다.

```js
new Promise((resolve, reject) => {
  reject();

  console.log("프로미스 생성자 내부");
})
  .then(
    () => conosle.log("resolve됐을 때 실행합니다."),
    () => {
      throw new Error("에러 발생!");

      console.log("저는 실행되지 않습니다..");
    }
  )
  .catch(() => {
    console.log("catch메서드입니다.");
  })
  .then(() => {
    console.log("에러 핸들링한 후 새로운 작업을 실행할 수 있습니다.");
  });
```

> 실행 결과

```js
프로미스 생성자 내부
catch메서드입니다.
에러 핸들링한 후 새로운 작업을 실행할 수 있습니다.
```

Q. 에러가 발생했는데 에러 핸들러가 없는 경우에는 어떻게 되나요?

> 이러한 경우 브라우저 환경에서는 `unhandledrejection` 이벤트가 발생합니다. 그래서 `unhandledrejection` 이벤트에 대한 이벤트 리스너를 추가하여 이런 상황에 대한 처리를 할 수 있습니다. 보통 이런 에러가 발생했을 때는 회복할 수 없는 상황이기 때문에 사용자에게 문제 상황을 알리고 가능하면 서버에 에러 정보를 보내는 것이 최선입니다.

```js
window.addEventListener("unhandledrejection", function (event) {
  // unhandledrejection 이벤트엔 두 개의 특수 프로퍼티가 있습니다.
  alert(event.promise); // [object Promise] - 에러를 생성하는 프라미스
  alert(event.reason); // Error: 에러 발생! - 처리하지 못한 에러 객체
});

new Promise(function () {
  throw new Error("에러 발생!");
}); // 에러를 처리할 수 있는 .catch 핸들러가 없음
```

```js
new Promise((resolve, reject) => {
  reject();

  console.log("프로미스 생성자 내부");
})
  .then(
    () => conosle.log("resolve됐을 때 실행합니다."),
    () => {
      throw new Error("에러 발생!");

      console.log("저는 실행되지 않습니다.....");
    }
  )
  .catch(() => {
    console.log("catch메서드입니다.");
  })
  .then(() => {
    console.log("에러 핸들링한 후 새로운 작업을 실행할 수 있습니다.");
  });
```

## 함께 읽기

- [catch메서드 체이닝 예제 코드](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Using_promises#chaining_after_a_catch)
