# [async와 await 과제](https://ko.javascript.info/async-await#tasks)

## 1. `.then/catch`대신 `async/await`를 사용하도록 아래 예시코드를 수정해주세요.

> 기존 예시 코드

```js
function loadJson(url) {
  return fetch(url).then((response) => {
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  });
}

loadJson("no-such-user.json").catch(alert); // Error: 404
```

> 답안

```js
async function loadJson(url) {
  // (1)
  try {
    // (5)
    let response = await fetch(url); // (2)

    if (response.status == 200) {
      // (3)
      let json = await response.json(); // (4
      return json;
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    // (5)
    alert(err);
  }
}
```

> 1. `loadJson`함수를 `async`함수로 만듭니다.
> 2. `await fetch(url)`로 결과값을 받습니다.
> 3. 2번의 결과값에 대해 `if-else`문은 `then`메서드 없이 작성할 수 있습니다.
> 4. `response.json()`도 비동기 작업이므로 `await`키워드를 사용합니다.
> 5. 기존 코드에서는 `loadJson`을 호출한 이후에 `catch`메서드를 체이닝하여 에러를 핸들링하고 있습니다. `catch`메서드를 사용하지 않기 위해 `async`함수 내부에서 `try…catch`문을 사용하여 에러를 핸들링하도록 합니다.

## 2. `.then/catch`대신 `async/await`를 사용하도록 아래 예시코드를 수정해주세요.

> `demoGithubUser` 안의 반복(recursion)은 반복문(loop)을 사용해 작성하도록 합니다. `async/await`를 사용하면 쉽게 작성할 수 있습니다.

> 기존 예시 코드

```js
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url).then((response) => {
    if (response.status == 200) {
      return response.json();
    } else {
      throw new HttpError(response);
    }
  });
}

// 유효한 사용자를 찾을 때까지 반복해서 username을 물어봄
function demoGithubUser() {
  let name = prompt("GitHub username을 입력하세요.", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then((user) => {
      alert(`이름: ${user.name}.`);
      return user;
    })
    .catch((err) => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("일치하는 사용자가 없습니다. 다시 입력해 주세요.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

demoGithubUser();
```

> 답안

```js
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}

async function loadJson(url) {
  let response = await fetch(url);

  if (response.status == 200) {
    let json = await response.json();
    return json;
  } else {
    throw new Error(response);
  }
}

// 유효한 사용자를 찾을 때까지 반복해서 username을 물어봄
async function demoGithubUser() {
  while (true) {
    try {
      let name = prompt("GitHub username을 입력하세요.", "iliakan");
      let user = await loadJson(`https://api.github.com/users/${name}`);
      alert(`이름: ${user.name}.`);
      return user;
    } catch (err) {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("일치하는 사용자가 없습니다. 다시 입력해 주세요.");
      } else {
        throw err;
      }
    }
  }
}

demoGithubUser();
```

> 재귀 대신 `while`문을 사용하여 이름을 반복하여 물어볼 수 있도록 수정했습니다. 만약 유효한 이름을 입력하면 `user`를 반환하면서 함수가 종료됩니다.

> `loadJson`함수를 `await`키워드를 붙여서 호출하기 때문에 then메서드를 사용하여 후속처리를 하지 않아도 됩니다. `try…catch`문을 사용했기 때문에 `loadJson`호출 시 에러가 발생하면 `catch`문으로 이동해 에러를 핸들링합니다.

## 3. 일반 함수 내부에서 `async`함수 호출하기

> 일반 함수 `f`에서 `async`함수인 `wait`함수를 호출하고, 그 결과값을 사용할 수 있도록 `f`함수 내부를 구현해주세요.

```js
async function wait() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // ...코드...
  // async wait()를 호출하고 그 결과인 10을 얻을 때까지 기다리려면 어떻게 해야 할까요?
  // f는 일반 함수이기 때문에 여기선 'await'를 사용할 수 없다는 점에 주의하세요!
}
```

> 답안

```jsx
async function wait() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  wait().then((result) => alert(result));
}

f();
```

> `wait`함수는 `async`함수이므로 `Promise`를 반환합니다. 그렇기 때문에 `then`메서드를 체이닝하여 사용할 수 있습니다. 그래서 `wait`를 호출한 후 `then`메서드를 사용하여 그 결과값을 사용하도록 구현하면 됩니다.
