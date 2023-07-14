# [DOM 탐색하기 과제](https://ko.javascript.info/dom-navigation#tasks)

## 1. 자식 DOM에 접근하기

> 문제

```html
<html>
  <body>
    <div>사용자:</div>
    <ul>
      <li>John</li>
      <li>Pete</li>
    </ul>
  </body>
</html>
```

아래 DOM 노드에 접근할 방법을 최소 한 가지 이상씩 생각해보세요.

- `<div>` DOM 노드
- `<ul>` DOM 노드
- 두 번째 `<li>` (Pete)

> 답안

- `<div>` DOM 노드
  - `document.body.children[0]`
  - `document.body.firstElementChild`
  - `document.body.children[1].previousElementSibling`
- `<ul>` DOM 노드
  - `document.body.children[1]`
  - `document.body.lastElementChild`
  - `document.body.children[0].nextElementSibling`
- 두 번째 `<li>` (Pete)
  - `document.body.children[1].children[1]`
  - `document.body.children[1].children[0].nextElementSibling`
  - `document.body.lastElementChild.lastElementChild`

## 2. 형제 노드에 관한 질문

> 문제

임의의 DOM 요소 노드 `elem`이 있다고 가정해봅시다.

- `elem.lastChild.nextSibling`은 항상 `null`일까요?
- `elem.children[0].previousSibling`은 항상 `null`일까요?

> 답안

- 네
  - `lastChild`는 모든 노드에 대해서 가장 마지막 자식 노드를 반환한 것이기 때문에 그 다음 형제 노드가 존재할 수 없습니다.
- 아니요
  - `children`은 요소 노드만 반환하기 때문에 `children[0]`에 대한 `previousSibling`이 존재할 수도 있습니다. 공백인 텍스트 노드라던지, 주석 노드와 같은 것이 앞에 존재할 수도 있습니다. 만약 `children`이 아니라 `childNode`를 사용했다면 앞에 이전 형제 노드가 없음을 보장할 수 있지만 `children`을 사용한 경우에는 보장할 수 없습니다.

## 3. 테이블의 모든 대각선 셀 선택하기

> 문제

테이블의 모든 대각선 셀을 빨간색으로 칠하는 코드를 작성해보세요.

`<table>`에서 모든 대각선 `<td>`를 가져와 아래 코드를 이용해 칠해야 합니다

```jsx
// td는 테이블 셀에 대한 참조가 되어야 합니다.
td.style.backgroundColor = "red";
```

> 답안

```jsx
let table = document.body.firstElementChild;

for (let i = 0; i < 5; i++) {
  table.rows[i].children[i].style.backgroundColor = "red";
  // table.rows[i].cells[i].style.backgroundColor = 'red';
}
```

각각 i번째 행의 i번째 열에 색을 칠해주면 됩니다. 먼저 `table.rows[i]`로 i번째 행을 가져옵니다. 그리고 그 행의 `children[i]`로 i번째 열에 접근하여 색을 칠해줬습니다. `children` 대신에 `cell`프로퍼티를 사용해도 됩니다. 행 내부의 모든 `<td>`를 반환하기 때문에 i번째 열에 접근할 수 있습니다.

[이 곳](https://codesandbox.io/s/table-diagonal-cells-yhlgdx)에서 실행 결과를 확인할 수 있습니다.
