# [DOM 탐색하기](https://ko.javascript.info/dom-navigation)

Q. DOM을 이용하여 요소에 접근하려면 어떻게 해야 하나요?

> DOM트리의 시작점이 되는 `document`객체에 먼저 접근해야 합니다. `document`객체를 통해서 하위의 어떤 노드에도 접근할 수 있습니다.

Q. `document`객체를 통해서 어떻게 다른 노드에 접근할 수 있나요?

> 먼저 `document`객체의 프로퍼티를 사용하면 DOM 트리의 상단에 있는 노드들에 접근할 수 있습니다. 접근할 수 있는 요소들은 `<html>`, `<body>`, `<head>` 태그입니다.

- `document.documentElement`로 `<html>`태그에 접근할 수 있습니다.
- `document.body`로 `<body>`태그에 접근할 수 있습니다.
- `document.head`로 `<head>`태그에 접근할 수 있습니다.

Q. 위의 세가지 태그를 제외한 다른 노드에 접근하려면 어떻게 해야 하나요?

> `childNodes`, `children` 프로퍼티를 사용하면 해당 노드의 자식 노드를 컬렉션으로 반환합니다.

```html
<html>
  <body>
    <div>시작</div>

    <ul>
      <li>항목</li>
    </ul>

    <div>끝</div>

    <script>
      for (let i = 0; i < document.body.childNodes.length; i++) {
        alert(document.body.childNodes[i]); // Text, DIV, Text, UL, ... , SCRIPT
      }
    </script>
    ...추가 내용...
  </body>
</html>
```

> 여기서 자식 노드란 해당 노드의 바로 아래에 있는 자식 요소를 말합니다. 예를 들어 `<head>`, `<body>`는 `<html>`의 자식 노드가 됩니다. 위의 예시에서는 `<div>`, `<ul>`는 `<body>`의 자식 노드가 됩니다.

> 후손 노드라는 용어도 있는데 자식 노드 뿐만 아니라 자식 노드의 모든 자식 노드까지 포함하는 하위에 있는 모든 요소를 의미합니다. `<body>`의 후손 노드는 `<div>`, `<ul>`, `<ul>`의 자식 노드인 `<li>`까지 통틀어 후손 노드가 됩니다.

> `childNodes`프로퍼티와 `children`프로퍼티도 약간의 차이가 있습니다.
>
> - `childNodes` : 요소 노드 뿐만 아니라 텍스트 노드와 같은 모든 종류의 자식 노드들을 반환합니다.
> - `children` : 자식 노드들 중 요소 노드들만 반환합니다.

> 위 예시에서 `document.body.childNodes`는 `body`의 자식 노드를 `alert`창에 출력하고 있습니다. 이 때 실행 결과를 보면 요소 노드 뿐만 아니라 공백을 담고 있는 텍스트 노드도 함께 반환하고 있는 것을 알 수 있습니다. `script` 마지막으로 출력되고 종료되는 이유는 스크립트 실행 시점에는 `<script>`이후의 추가 내용을 읽지 못했기 때문입니다.

Q. `childNodes`와 `children`은 배열을 반환하나요?

> 배열이 아닌 **컬렉션**을 반환합니다. 컬렉션은 배열과 유사해 보이지만, 배열이 아닌 반복 가능한 **유사 배열 객체**입니다.
>
> 그래서 이터러블이기 때문에 `for…of`반복문을 사용할 수 있습니다.

```js
for (let node of document.body.childNodes) {
  alert(node); // 컬렉션 내의 모든 노드를 보여줍니다.
}
```

> 하지만 배열은 아니기 때문에 `filter`와 같은 배열 메서드는 사용할 수 없습니다. 만약 배열 메서드를 사용하고 싶다면 `Array.from`으로 감싸서 배열로 만든 후에 사용할 수 있습니다.

> 또한 컬렉션은 거의 사용되지 않는 프로퍼티들이 많기 때문에 `for…in`으로 순회할 경우 불필요한 프로퍼티들을 순회할 수 있습니다. 그래서 컬렉션에는 `for…in`반복문을 사용하지 않는 것이 좋습니다.

> 마지막으로 탐색용 프로퍼티는 읽기 전용이기 때문에 어떤 값을 할당할 수는 없습니다. DOM을 변경하는 메서드는 따로 존재합니다.

Q. 다른 탐색용 프로퍼티는 무엇이 있나요?

> 모든 종류의 노드를 탐색하는 프로퍼티, 요소 노드만 탐색하는 프로퍼티, table태그에 추가적으로 지원되는 프로퍼티에 대해 알아보겠습니다.

1. 노드의 종류에 상관없이 모든 종류의 노드(텍스트 노드, 요소 노드, 주석 노드, 문서 노드)를 탐색하는 프로퍼티입니다.

- `parentNode` : 부모 노드를 반환합니다.
- `firstChild` : 첫번째 자식 노드를 반환합니다.
- `lastChild` : 마지막 자식 노드를 반환합니다.
- `nextSibling` : 다음 형제 노드를 반환합니다.
- `previousSibling` : 이전 형제 노드를 반환합니다.

```html
<html>
  <head>
    ...
  </head>
  <body>
    ...
  </body>
</html>
```

```js
// <body>의 부모 노드는 <html>입니다
alert(document.body.parentNode === document.documentElement); // true

// <head>의 다음 형제 노드는 <body>입니다.
alert(document.head.nextSibling); // HTMLBodyElement

// <body>의 이전 형제 노드는 <head>입니다.
alert(document.body.previousSibling); // HTMLHeadElement
```

---

2. 아래의 프로퍼티들은 해당하는 노드들 중 요소 노드인 것들만 반환합니다. 위의 프로퍼티들과 유사하지만 요소 노드만 탐색한다는 차이점이 있습니다.

- `children` : 자식 노드들 중 요소 노드들만 반환합니다.
- `parentElement` : 부모 요소 노드를 반환합니다.
- `firstElementChild` : 첫 번째 자식 요소 노드를 반환합니다.
- `lastElementChild` : 마지막 자식 요소 노드를 반환합니다.
- `previousElementSibling` : 이전 형제 요소 노드를 반환합니다.
- `nextElementSibling` : 다음 형제 요소 노드를 반환합니다.

```html
<html>
  <body>
    <div>시작</div>

    <ul>
      <li>항목</li>
    </ul>

    <div>끝</div>

    <script>
      for (let elem of document.body.children) {
        alert(elem); // DIV, UL, DIV, SCRIPT
      }
    </script>
    ...
  </body>
</html>
```

위에서의 예시와는 다르게 `childNode`가 아닌 `children`프로퍼티를 사용했습니다. 그래서 공백을 담고 있는 텍스트 노드는 `alert`창에 출력되지 않고 요소 노드들만 출력되는 것을 확인할 수 있습니다.

---

3. 테이블과 관련된 태그들은 위에서 설명한 프로퍼티들 외에 추가적인 프로퍼티를 제공합니다.

- `table.rows`, `thead.rows`, `tbody.rows`, `tfoot.rows` : 각각 테이블(`thead`, `tbody`, `tfoot`) 내에 존재하는 모든 `<tr>`요소를 담은 컬렉션을 반환합니다.
- `table.caption/tHead/tFoot` : 각각 `<caption>`, `<thead>`, `<tfoot>` 요소를 반환합니다.
- `table.tBodies` : 모든 `<tbody>` 요소를 반환합니다.
- `tr.cells` : 해당 `<tr>` 내부의 모든 `<td>`, `<th>` 요소를 반환합니다.
- `tr.rowIndex` : 테이블 내에서 해당 `<tr>`이 몇 번째 줄인지 숫자로 반환합니다.
- `td.cellIndex`, `th.cellIndex` : 각각 속해있는 `<tr>`요소 내에서 몇 번째 열인지 숫자로 반환합니다.
