# [이벤트 루프와 매크로태스크, 마이크로태스크](https://ko.javascript.info/event-loop#ref-59)

Q. 자바스크립트 엔진은 어떻게 동작하나요?

> 자바스크립트 엔진은 처리해야 할 태스크가 없는 경우에는 잠들어 있습니다. 잠들어 있다가 새로운 태스크가 추가되어 처리해야 할 태스크가 있는 경우에는 활성화되어 먼저 들어온 태스크부터 순차적으로 처리합니다.

> 태스크는 자바스크립트 엔진에 있는 콜 스택에 추가되어 실행됩니다. 콜 스택은 코드가 실행되는 시간의 흐름에 따라 생성되는 실행 컨텍스트를 저장하는 스택입니다. 가장 상위에는 있는 실행 컨텍스트가 현재 실행 중인 코드의 실행 컨텍스트입니다.

> 또한 엔진이 어떤 태스크를 처리하는 동안에는 렌더링이 절대 일어나지 않는다는 특징이 있습니다.

Q. 처리해야 할 태스크들은 어디에 보관되나요?

> 먼저 태스크는 종류에 따라 매크로태스크와 마이크로태스크로 나눌 수 있습니다.

> 매크로태스크는
>
> - 스크립트 실행
> - `setTimeout`, `setInterval`과 같은 비동기 함수의 콜백함수
> - 이벤트가 발생했을 때 이벤트 핸들러
>   가 있습니다.

> 마이크로태스크는
>
> - 프로미스 후속 처리 메서드(`then`, `catch`, `finally`)의 콜백함수
> - `Mutation Observer API`
> - `queueMicrotask(func)`의 인수로 넘겨준 함수
>   가 있습니다. 마이크로태스크는 코드를 사용해서만 만들 수 있습니다.

> 매크로태스크는 V8 용어로 매크로태스크 큐(macrotask queue)에, 마이크로태스크는 V8 용어로 마이크로태스크 큐(microtask queue)에 보관됩니다.

> 만약 엔진이 `script`를 처리하고 있는 와중에 사용자가 마우스를 움직여서 `mousemove`이벤트가 발생한다면 이 이벤트는 매크로태스크 큐에 추가되어 대기하게 됩니다.

> `setTimeout`과 `setInterval`같은 타이머 함수과 실행되면 브라우저에 있는 `Web API`로 넘어가서 호출 스케줄링하여 지정한 시간이 되면 매크로태스크 큐에 콜백함수를 추가합니다. 이렇게 `Web API`가 처리해주기 때문에 일정 시간 기다리는 동안 다른 작업을 할 수 있는 것입니다. `Web API`는 브라우저에서 제공하는 API로 `setTimeout`, `setInterval`과 같은 타이머 함수, `DOM API`, `XMLHttpRequest`, `fetch`와 같은 `HTTP` 요청 함수 등이 있습니다. `Web API`는 자바스크립트 엔진이 아닌 브라우저에 존재합니다.

Q. 큐가 2개인데 어떤 방식으로 콜 스택에 추가되어 처리되나요?

> 먼저 매크로태스크 큐와 마이크로태스크 큐의 태스크들은 각자의 큐에서 대기하다가, 콜 스택이 비어있을 때 순차적으로 콜 스택에 추가되어 실행됩니다. 이 때 어떤 태스크를 우선적으로 실행할지 기준이 있습니다.

> 마이크로태스크 큐의 우선순위가 매크로태스크 큐의 우선순위 보다 높아서 마이크로태스크 큐의 태스크들을 먼저 실행합니다. 큐의 특성에 따라 가장 먼저 큐에 적재되었던 태스크 먼저 콜 스택으로 이동하며, 마이크로태스크 큐에 대기중인 태스크들을 모두 처리한 후에 매크로태스크 큐의 태스크들을 실행합니다.

> 매크로태스크를 하나 처리할 때마다 마이크로태스크가 있는지 확인하여 모두 처리하고 렌더링을 합니다. 즉, 하나의 매크로태스크 처리 → 모든 마이크로태스크 처리 → 렌더링의 순서로 처리됩니다.

> 이러한 처리를 하는 것이 이벤트 루프입니다. 콜 스택이 비었는지 확인하고, 매크로태스크 큐와 마이크로태스크 큐의 태스크들을 확인하여 순서에 맞게 콜 스택으로 이동시켜 실행시킵니다.

Q. 이벤트 루프가 무엇인가요?

> 이벤트 루프는 브라우저 환경에 존재하는 것으로 현재 실행중인 태스크가 없을 때(콜 스택이 비어있을 때) 콜백 큐와 마이크로태스크 큐를 확인하여 콜 스택으로 태스크를 이동하여 실행시키는 일을 합니다. 즉, 콜 스택과 콜백 큐, 마이크로태스크 큐를 반복적으로 확인하여 대기 중인 태스크를 실행시킵니다.

Q. 이벤트 루프는 어떻게 동작하나요?

> 1. 매크로태스크 큐에서 가장 오래된 태스크를 꺼내 실행합니다.
> 2. 마이크로태스크 큐에 태스크가 존재한다면,
>
>    2-1. 가장 오래된 태스크부터 꺼내 순서대로 처리합니다.
>
>    2-2. 마이크로태스크 큐가 빌 때까지 모든 태스크를 처리합니다.
>
> 3. 렌더링할 것이 있다면 렌더링합니다.
> 4. 매크로태스크 큐에 태스크가 존재한다면 1로 돌아가고, 태스크가 없다면 새로운 매크로태스크가 생길 때까지 기다립니다.

> 이렇게 마이크로태스크는 다른 매크로태스크가 실행되기 전이면서 렌더링 전에 처리되기 때문에 모든 마이크로태스크를 동일한 환경에서 처리할 수 있습니다.

Q. 왜 모든 마이크로태스크를 동일한 환경에서 처리할 수 있나요?

> 하나의 매크로태스크를 처리한 후에 모든 마이크로태스크를 수행합니다. 즉, 매크로태스크를 처리한 후에 어떤 이벤트가 발생하여 새로운 이벤트 핸들러가 처리되기 전이면서 렌더링 전에 모든 마이크로태스크를 수행합니다.

> 그렇기 때문에 UI 변화나 네트워크 통신에 의한 데이터 변경 같이 애플리케이션 환경에 변화를 주는 작업에 영향을 받지 않고 동일한 환경에서 모든 마이크로태스크를 처리할 수 있는 것입니다.

Q. 만약 처리 시간이 오래 걸리는 태스크가 이미 처리되고 있을 때 사용자가 마우스로 버튼을 클릭하는 것과 같이 새로운 태스크가 발생하면 어떻게 되나요?

> 태스크를 처리하는 동안 새로운 태스크를 처리할 순 없기 때문에 느리게 처리되어 좋지 않은 사용자 경험을 줄 수 있습니다.

> 특히 매우 복잡한 계산이나 프로그래밍 에러 때문에 무한 루프에 빠지게 될 때는 브라우저가 `alert`창을 띄웁니다. “응답 없는 페이지” `alert` 창을 사용자에게 보여주어 페이지 전체와 함께 해당 태스크를 취소시킬지 말지 선택하도록 합니다.

Q. 위의 문제를 어떻게 해결할 수 있나요?

> 해당 태스크를 지연시간이 0인 `setTimeout`을 사용하여 여러 개의 태스크로 쪼개는 방법이 있습니다. 태스크를 쪼개면 태스크 중간중간 사용자 이벤트에 반응할 수 있습니다. 예시를 보겠습니다.

> 유스 케이스 1: CPU 소모가 많은 태스크 쪼개기
>
> 아래는 처리 시간이 오래 걸리는 예시 코드입니다.

```js
let i = 0;

let start = Date.now();

function count() {
  // CPU 소모가 많은 무거운 작업을 수행
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("처리에 걸린 시간: " + (Date.now() - start) + "ms");
}

count();
```

> 위의 코드를 실행하고 마우스 오른쪽 버튼을 클릭해보면 우클릭 메뉴가 바로 화면에 나타나지 않고 `alert`창이 뜬 다음에 우클릭 메뉴가 화면에 표시됩니다. 즉, 숫자 카운팅이 끝나고 `alert`창이 뜨는 작업을 모두 실행하기 전까지 사용자 이벤트를 즉시 처리하지 않는 것입니다.

> 그래서 태스크를 쪼개는 방법으로 문제를 완화해보겠습니다. `setTimeout`을 중첩으로 호출하여 태스크를 쪼갭니다.

```js
let i = 0;

let start = Date.now();

function count() {
  // 무거운 작업을 쪼갠 후 이를 수행 (*)
  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("처리에 걸린 시간: " + (Date.now() - start) + "ms");
  } else {
    setTimeout(count); // 새로운 호출을 스케줄링 (**)
  }
}

count();
```

> 위의 코드를 실행하면 수정 전의 코드보다 마우스 우클릭을 했을 때보다 빠르게 우클릭 메뉴가 표시됩니다.
>
> 위의 코드는 i가 1000000의 배수일 때마다 `do-while`문을 탈출합니다. 즉, `do-while`문은 1000000씩 증가하도록 카운팅 한 후 종료됩니다. 1000000000이 되기 전까지 1000000씩 쪼개어 카운팅하여 `setTimeout`으로 이어서 카운팅할 수 있도록 태스크를 스케줄링해주고 있습니다.

> 첫 번째 부분 카운팅: 1~1000000
>
> 두 번째 부분 카운팅 : 1000001 ~ 2000000
>
> …
>
> 마지막 부분 카운팅 : 999000001 ~ 1000000000

> 만약 첫 번째 부분 카운팅을 진행하고 있는 동안 클릭 이벤트가 발생한다면 두 번째 부분 카운팅을 시작하기 전에 이벤트를 처리합니다. 다음과 같은 순서로 동작합니다.
>
> 첫 번째 부분 카운팅 시작 → 마우스 우클릭 → 첫 번째 부분 카운팅 종료 → `setTimeout`으로 `count`함수 스케줄링 → 마우스 우클릭에 대한 이벤트 처리 → 두 번째 부분 카운팅 시작
>
> 두 번째 부분 카운팅을 시작하기 전에 이벤트 처리가 되는 이유는 이벤트 핸들러가 `setTimeout`의 콜백함수(두 번째 부분 카운팅 작업)보다 먼저 매크로태스큐에 푸시되었기 때문입니다. 코드를 다 실행하여 콜 스택이 비었기 때문에 이벤트 루프가 순차적으로 이벤트 핸들러를 콜 스택에 푸시하여 실행한 후에 `count`함수를 실행합니다. 그래서 우클릭에 대한 이벤트 핸들러를 실행한 후에 두번째 부분 카운팅을 시작하는 것입니다.
>
> 하지만 `alert`창이 뜨는데 걸리는 시간이 이전 코드보다 조금 더 오래 걸리는 것을 볼 수 있습니다. 코드를 더 보완하여 시간차를 더 줄여보도록 하겠습니다.

```js
let i = 0;

let start = Date.now();

function count() {
  // 스케줄링 코드를 함수 앞부분으로 옮김
  // i가 해당 카운팅에서 1e9가 되지 않을 때만 스케줄링하면 되므로 분기처리를 해줍니다.
  if (i < 1e9 - 1e6) {
    setTimeout(count); // 새로운 호출을 스케줄링함
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("처리에 걸린 시간: " + (Date.now() - start) + "ms");
  }
}

count();
```

> `setTimeout`으로 `count`함수 호출을 스케줄링하는 코드를 `count`함수의 앞부분으로 옮겼습니다. 이렇게 앞부분에서 스케줄링을 한 후 숫자 카운팅을 하면, 숫자를 카운팅하면서 `setTimeout`의 대기 시간도 함께 소모되기 때문입니다.
>
> 이전의 코드와 지금의 코드는 모두 `setTimeout`이 중첩으로 호출되고 있습니다. 이렇게 중첩호출이 많을 경우에는 최소 대기 시간을 4ms이상으로 강제해야 한다는 제약이 HTML5에 명시되어있습니다.
>
> 그렇기 때문에 `setTimeout`으로 스케줄링하는 부분을 함수의 앞부분으로 옮김으로써 대기 시간을 소모하면서 카운팅을 진행하도록 리팩토링한 것입니다.
>
> 코드를 실행해보면 사용자 이벤트를 처리하면서 `alert`창이 뜨는 시간도 조금 더 빨라진 것을 확인할 수 있습니다.

---

> 두 번째 예시입니다.
>
> 유스 케이스 2: 프로그레스 바
>
> 현재 작업 중인 태스크가 있을 경우에는 작업이 끝나야 화면에 DOM 변경이 반영되어 렌더링됩니다. 이 특징으로 인해 어떤 작업이 진행 중인 중간 상태가 화면에 표시되지 않고 완료된 상태를 화면에 보여줄 수 있습니다. 중간중간 모든 변경된 화면을 매번 사용자에게 보여준다면 사용자에게 혼란을 줄 수 있기 때문입니다.

```html
<div id="progress"></div>

<script>
  function count() {
    for (let i = 0; i < 1e6; i++) {
      i++;
      progress.innerHTML = i;
    }
  }

  count();
</script>
```

> 위 예시코드는 i가 999999로 올라가는 과정을 화면에 나타내지 않습니다. 999999인 화면만 나타납디다.
>
> 하지만 프로그레스 바와 같은 작업의 진행상황을 화면에 나타내야 하는 경우도 있습니다. 이 때 `setTimeout`을 사용해 태스크를 여러 개로 쪼개면 중간중간 상태 변화를 화면에 나타낼 수 있습니다.

```html
<div id="progress"></div>

<script>
  let i = 0;

  function count() {
    // 무거운 작업을 쪼갠 후 이를 수행
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e7) {
      setTimeout(count);
    }
  }

  count();
</script>
```

> i가 1000까지 카운팅됨 → `setTimeout`으로 `count`함수 스케줄링 → `count`함수 종료됨 → 렌더링 → 스케줄링한 `count`함수 실행 → i가 2000까지 카운팅됨 → `setTimeout`으로 `count`함수 스케줄링 → `count`함수 종료됨 → 렌더링 → 스케줄링한 `count`함수 실행 → …

> 이렇게 1000단위로 나누어 태스크를 처리하도록 하면 1000단위로 갱신될 때마다 화면에 나타내도록 할 수 있습니다. 하나의 매크로태스크가 끝나고 렌더링한 다음, 스케줄링한 `count`함수(매크로태스크)가 실행되기 때문입니다.

---

> 세 번째 예시입니다.
>
> 유스 케이스 3: 이벤트 처리가 끝난 이후에 작업하기
>
> 브라우저가 이미 `onclick`이벤트를 처리하고 있는 상황에서 마우스를 움직여서 새로운 이벤트가 발생했다고 가정해보겠습니다. 이 때 새로운 이벤트에 대한 핸들러는 이미 처리하고 있는 `onclick`이벤트의 처리를 끝낸 후에 호출됩니다. 즉,
>
> `onclick` 이벤트 핸들러 실행 중 → 새로운 `mouseover` 이벤트 발생 → 처리 중이던 `onclick` 이벤트 핸들링을 계속 함 → `mouseover` 이벤트 핸들러 실행
>
> 순으로 실행됩니다.

> 하지만 이처럼 동작하지 않는 경우도 있습니다. 이벤트 핸들러 내부에 `dispatchEvent`로 다른 이벤트를 실행하는 코드가 있는 경우입니다. 이런 상황에서는 `dispatchEvent`로 트리거한 이벤트의 핸들러를 먼저 실행한 후에 현재 처리중이던 이벤트 핸들링을 이어서 진행합니다.

> 예시 코드

```html
<button id="menu">메뉴(클릭해주세요)</button>

<script>
  menu.onclick = function () {
    alert(1);

    menu.dispatchEvent(
      new CustomEvent("menu-open", {
        bubbles: true,
      })
    );

    alert(2);
  };

  // 1과 2 사이에 트리거됩니다
  document.addEventListener("menu-open", () => alert("중첩 이벤트"));
</script>
```

> 위 코드를 실행하면 1 → 중첩 이벤트 → 2의 순으로 출력되는 것을 확인할 수 있습니다. 즉, 이벤트 안에서 발생하는 이벤트는 동기적으로 처리되는 것을 알 수 있습니다.

> 하지만 이렇게 이벤트가 중첩되어있을 때 동기적으로 처리하는 것이 아니라 기존에 처리중이던 이벤트의 처리를 끝내도록 하고 싶으면 어떻게 해야할까요? 중첩 이벤트를 지연시간이 0인 `setTimeout`으로 감싸면 됩니다.

```html
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function () {
    alert(1);

    setTimeout(() =>
      menu.dispatchEvent(
        new CustomEvent("menu-open", {
          bubbles: true,
        })
      )
    );

    alert(2);
  };

  document.addEventListener("menu-open", () => alert("중첩 이벤트"));
</script>
```

> 이렇게 코드를 수정하고 메뉴를 클릭하면 1 → 2 → 중첩 이벤트 순서로 출력됩니다. 즉, menu에 대한 `onclick` 이벤트 핸들러 수행이 완전히 끝 후에 중첩된 이벤트인 `menu-open`를 디스패칭합니다.

> 이렇게 `setTimeout`을 사용하여 태스크를 쪼개어 중첩된 `dispatchEvent`의 실행 시점을 뒤로 미뤄서 비동기적으로 실행하도록 할 수 있습니다.

Q. 만약 마이크로태스크가 아닌 어떤 함수를 현재 코드의 실행이 끝난 후, 새로운 이벤트 핸들러가 처리되기 전이면서 렌더링이 되기 전에(마이크로태스크로) 실행하고 싶다면 어떻게 해야하나요?

> `queueMicrotask`함수를 호출하여 해당 함수를 인자로 넘겨주면 됩니다. `queueMicrotask`함수는 인자로 받은 함수를 마이크로태스크 큐에 적재합니다.

> 예시 코드

```html
<div id="progress"></div>

<script>
  let i = 0;

  function count() {
    // 무거운 작업을 쪼갠 후 이를 수행
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e6) {
      queueMicrotask(count);
    }
  }

  count();
</script>
```

> 이 코드를 실행하면 화면에는 중간 갱신 없이 카운팅이 다 종료된 후에 1000000만 표시됩니다. `count`함수를 마이크로태스크 큐에 적재하여서 렌더링을 하기 전에 `count`함수가 계속 호출되기 때문입니다. 그래서 숫자가 1000000이 되었을 때 마이크로태스크 큐에 존재하는 태스크가 없기 때문에 그 때 렌더링이 되는 것입니다.