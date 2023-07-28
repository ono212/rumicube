# [주요 노드 프로퍼티 과제](https://ko.javascript.info/basic-dom-node-properties#tasks)

## 1. 노드 타입 맞추기

```html
<html>
  <body>
    <script>
      alert(document.body.lastChild.nodeType);
    </script>
  </body>
</html>
```

`alert`창에 어떤 값이 출력될까요?

> 답안

> “1”이 출력됩니다. 1은 요소 노드를 의미합니다. script가 실행되는 시점에 `body`태그의 가장 마지막 자식 요소는 script자신입니다.

## 2. 주석 안의 태그

```html
<script>
  let body = document.body;

  body.innerHTML = "<!--" + body.tagName + "-->";

  alert(body.firstChild.data); // 얼럿 창엔 어떤 내용이 출력될까요?
</script>
```

`alert`창에 어떤 값이 출력될까요?

> 답안

> “BODY”가 출력됩니다.
>
> `innerHTML`을 사용하여 `body`태그 내부의 내용은 “<!—BODY—>”가 되었습니다.
>
> `body`태그의 첫번째 자식 자식 노드는 방금 `innerHTML`로 삽입한 주석 노드입니다.
>
> `data`프로퍼티로 주석 노드의 내용을 반환하므로 “BODY”가 출력되는 것입니다.

## 3. DOM 계층 구조와 `document`

- DOM 계층 구조에서 `document`는 어떤 클래스에 속할까요?
- 그 클래스는 DOM 계층 구조에서 어디에 위치할까요?
- 그 클래스는 `Node`, `Element`, `HTMLElement` 중 어떤 클래스를 상속받을까요?

> 답안

- `document`노드는 `HTMLDocument`클래스에 속합니다.
  ```jsx
  console.log(document.constructor.name); // HTMLDocument
  ```
- `HTMLDocument`클래스는 `Document`클래스를 상속받으며 `Documet`클래스는 `Node`클래스를 상속받습니다. 그렇기 때문에 `HTMLDocument`클래스는 `Node`클래스 아래, `Document`클래스 아래에 위치합니다. ( `Node` - `Document` - `HTMLDocument`)
  ```jsx
  console.log(HTMLDocument.prototype.constructor.name); // HTMLDocument
  console.log(HTMLDocument.prototype.__proto__.constructor.name); // Document
  console.log(HTMLDocument.prototype.__proto__.__proto__.constructor.name); // Node
  ```
- `HTMLDocument`클래스는 `Node`클래스를 상속받습니다.
  ```jsx
  console.log(document instanceof Node); // true
  console.log(document instanceof Element); // false
  console.log(document instanceof HTMLElement); // false
  ```
