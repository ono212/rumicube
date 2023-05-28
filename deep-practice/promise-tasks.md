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

## 3. `Promise`로 애니메이션이 적용된 원 만들기

> 문제
>
> `showCircle`함수는 원의 중심점, 반지름, 콜백함수를 인자로 받습니다. 이 함수는 인자로 받은 중심점을 기준으로 빨간색 원이 점점 커지는 애니메이션 효과를 화면에 나타냅니다.
> 현재 `showCircle`함수는 콜백함수를 인자로 받아서 애니메이션이 종료된 후에 콜백함수를 실행합니다.
>
> `showCircle`함수가 콜백함수를 인자로 받지 않고 `Promise`를 반환하도록 하여 이후의 동작을 추가할 수 있도록 구현해봅니다.
>
> 아래는 기존의 `showCircle`함수입니다.

```js
/*
 * cx: 원의 x축 중심점, cy: 원의 y축 중심점, radius: 반지름
 */
function showCircle(cx, cy, radius, callback) {
  let div = document.createElement("div");
  div.style.width = 0;
  div.style.height = 0;
  div.style.left = cx + "px";
  div.style.top = cy + "px";
  div.className = "circle";
  document.body.append(div);

  setTimeout(() => {
    div.style.width = radius * 2 + "px";
    div.style.height = radius * 2 + "px";

    div.addEventListener("transitionend", function handler() {
      div.removeEventListener("transitionend", handler);
      // 콜백함수를 호출합니다.
      callback(div);
    });
  }, 0);
}

// 콜백함수를 인수로 전달하여 애니메이션 이후에 "안녕하세요!" 라는 메세지가 뜨도록 구현했습니다.
showCircle(150, 150, 100, (div) => {
  div.classList.add("message-ball");
  div.append("안녕하세요!");
});
```

> 답안

```js
function showCircle(cx, cy, radius) {
  let div = document.createElement("div");
  div.style.width = 0;
  div.style.height = 0;
  div.style.left = cx + "px";
  div.style.top = cy + "px";
  div.className = "circle";
  document.body.append(div);

  // setTimeout을 수행한 후 이후의 작업을 수행하기 위해 Promise를 생성하여 반환하도록 합니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      div.style.width = radius * 2 + "px";
      div.style.height = radius * 2 + "px";

      div.addEventListener("transitionend", function handler() {
        div.removeEventListener("transitionend", handler);
        // 콜백이 아닌 resolve를 호출합니다.
        resolve(div);
      });
    }, 0);
  });
}

// 콜백함수가 아닌 then메서드를 활용하여 이후의 메세지가 뜨는 동작을 구현합니다.
showCircle(150, 150, 100).then((div) => {
  div.classList.add("message-ball");
  div.append("Hello, world!");
});
```

> 내부에서 `setTimeout`을 수행하는 `Promise`객체를 생성하며 반환하면 됩니다. 이렇게 하면 뒤의 `then`메서드는 `Promise`가 처리되길 기다렸다가 핸들러를 수행합니다. 애니메이션이 종료되면 `resolve`함수를 호출하면서 메세지를 보여줄 div태그를 인자로 넘겨줍니다. 이렇게 코드를 수정하면 `showCircle`함수는 `Promise`를 반환하기 때문에 `then`메서드를 사용할 수 있으며, 애니메이션 효과가 종료된 후 순차적으로 메세지가 뜨는 동작을 수행할 수 있습니다.
>
> [동작을 확인할 수 있는 샌드박스 링크입니다.](https://plnkr.co/edit/eAP9wNrKyu2LvWLZ?p=preview&preview)
