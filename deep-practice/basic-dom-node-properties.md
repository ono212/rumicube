# [주요 노드 프로퍼티](https://ko.javascript.info/basic-dom-node-properties)

Q. DOM 노드 클래스가 무엇인가요?

> 각각의 DOM 노드는 특정 DOM 노드 클래스를 기반으로 만들어지는 객체입니다. DOM 노드 클래스는 여러 개가 있으며 계층 구조를 형성하고 있습니다. 계층 구조이기 때문에 하위 클래스들은 상위 클래스의 프로퍼티와 메서드를 상속받습니다. 각각의 클래스마다 지원하는 프로퍼티와 메서드가 다릅니다. 그래서 각각의 DOM 노드는 어떤 클래스를 상속받는지에 따라서 어떤 프로퍼티와 메서드를 가질지가 결정됩니다.

Q. 어떤 클래스가 있나요?

- `EventTarget` : 가장 상위에 있는 추상 클래스입니다. 가장 상위에 있기 때문에 모든 DOM는 이벤트를 사용할 수 있습니다.
- `Node` : `parentNode`, `nextSibling`, `childNodes` 등의 DOM 탐색 프로퍼티들을 제공합니다. `EventTarget`클래스를 상속받습니다.
- `Text` : 텍스트 노드에 해당하는 클래스입니다. `Node`클래스를 상속받습니다.
- `Comment` : 주석 노드에 해당하는 클래스입니다. `Node`클래스를 상속받습니다.
- `Element` : 요소 노드에 해당하는 클래스입니다. `Node`클래스를 상속받습니다. `nextElementSibling`, `children`, `getElementsByTagName`, `querySelector` 같은 요소 전용 탐색 프로퍼티나 메서드를 제공합니다.
- `HTMLElement` : `Element`클래스를 상속받습니다. HTML 요소 노드의 베이스 역할을 하는 클래스입니다.
- `HTMLInputElement` : `<input>`요소에 해당하는 클래스입니다. `HTMLElement`클래스를 상속받습니다.
- `HTMLBodyElement` : `<body>`요소에 해당하는 클래스입니다. `HTMLElement`클래스를 상속받습니다.
- `HTMLAnchorElement` : `<a>`요소에 해당하는 클래스입니다. `HTMLElement`클래스를 상속받습니다.

이외에도 다양한 클래스가 있습니다.

Q. `<input>`요소는 어떤 프로퍼티와 메서드를 사용할 수 있나요?

> `<input>`요소는 `HTMLInputElement`클래스에 해당합니다. `<input>`요소에 해당하는 DOM객체는 `HTMLInputElement`클래스를 기반으로 만들어집니다. 상위의 클래스들로부터 상속받은 프로퍼티와 메서드를 사용할 수 있습니다.

- `HTMLInputElement`클래스로부터는 입력 관련 프로퍼티를 상속받습니다.
- `Element`클래스로부터는 요소 전용 탐색 프로퍼티와 메서드를 상속받습니다.
- `Node`클래스로부터는 DOM 탐색 프로퍼티를 상속받습니다.
- `EventTarget`클래스로부터는 이벤트 관련 기능을 상속받습니다.

Q. 클래스 이름은 어떻게 확인할 수 있나요?

> `constructor.name`으로 확인할 수 있습니다. 객체는 `constructor`프로퍼티를 가집니다. 그래서 `constructor`로 클래스 생성자를 참조하고 `name`으로 이름을 참조하면 됩니다.

```js
alert(document.body.constructor.name); // HTMLBodyElement
```

> `toString`으로도 확인할 수 있습니다.

```html
<body>
  <div id="div1">div 태그</div>

  <script>
    console.log(document.body.toString()); // [object HTMLBodyElement]
    console.log(div1.toString()); // [object HTMLDivElement]
  </script>
</body>
```

> `instanceof`로도 클래스 이름을 확인할 수 있습니다. `instanceof`는 상속 여부를 알려주는 연산자입니다.

```js
alert(document.body instanceof HTMLBodyElement); // true
alert(document.body instanceof HTMLElement); // true
alert(document.body instanceof Element); // true
alert(document.body instanceof Node); // true
alert(document.body instanceof EventTarget); // true
```

Q. 태그 이름은 어떻게 확인할 수 있나요?

> `nodeName`이나 `tagName`프로퍼티로 확인할 수 있습니다.
>
> `nodeName`의 경우에는 요소 노드에 호출하면 태그 이름을 반환하지만, 다른 종류의 노드(텍스트 노드, 주석 노드, 문서 노드)에 호출하면 노드 타입을 나타내는 문자열을 반환합니다.
>
> `tagName`은 요소 노드에만 호출할 수 있기 때문에, 다른 종류의 노드에 호출할 경우 `undefined`를 반환합니다.

```html
<body>
  <!-- 주석 -->

  <script>
    // 주석 노드에 호출했기 때문에 undefined를 반환합니다.
    alert(document.body.firstChild.tagName); // undefined
    // 주석 노드 타입을 나타내는 문자열을 반환합니다.
    alert(document.body.firstChild.nodeName); // #comment

    // 문서 노드에 호출했기 때문에 undefined를 반환합니다.
    alert(document.tagName); // undefined
    // 문서 노드 타입을 나타내는 문자열을 반환합니다.
    alert(document.nodeName); // #document

    // 요소 노드에 호출했을 때는 동일한 결과를 반환하는 것을 알 수 있습니다.
    alert(document.body.nodeName); // BODY
    alert(document.body.tagName); // BODY
  </script>
</body>
```

> 위의 예시 코드를 보면 태그 이름은 대문자로 반환된다는 것을 알 수 있습니다.

Q. 노드 타입을 알 수 있는 프로퍼티도 있나요?

> 네, `nodeType`이라는 프로퍼티가 있습니다. 상숫값을 반환합니다.

- `elem.nodeType == 1` – 요소 노드
- `elem.nodeType == 3` – 텍스트 노드
- `elem.nodeType == 8` - 주석 노드
- `elem.nodeType == 9` – 문서 객체

```html
<body>
  <!-- 주석 -->

  <script>
    let elem = document.body;

    alert(elem.nodeType); // 1 => 요소 노드

    // 첫 번째 자식 노드
    alert(elem.firstChild.nodeType); // 8 => 주석 노드

    // 두 번째 자식 노드
    alert(elem.firstChild.nextSibling.nodeType); // 3 => 텍스트 노드

    // 문서 객체의 타입 확인
    alert(document.nodeType); // 9 => 문서 객체
  </script>
</body>
```

Q. `innerHTML`은 무엇인가요?

> `innerHTML`은 해당 요소 안의 HTML을 문자열 형태로 받아오는 프로퍼티입니다. 요소 노드에만 사용가능합니다. 받아오는 것 뿐만 아니라 값을 할당하면 요소 안의 HTML을 수정할 수 있습니다.

```html
<body>
  <div>div 태그</div>

  <script>
    let div = document.body.querySelector("div");
    console.log(div.innerHTML); // "div 태그"

    div.innerHTML = "<h1>새로운 div!</h1>"; // 교체
    console.log(div.innerHTML); // "<h1>새로운 div!</h1>"
    console.log(document.body.innerHTML); // "<div><h1>새로운 div!</h1></div> ..."
  </script>
</body>
```

> 예시코드를 실행하면 페이지에 `<h1>`으로 “새로운 div!”가 표시된 것을 확인할 수 있습니다. 기존의 `div`태그는 사라지지 않습니다. `div`태그 내부에 `h1`태그가 삽입된 것입니다.

Q. `innerHTML`로 값을 할당할 때 `script`태그가 포함되어 있으면 어떻게 되나요?

> `script`태그가 포함되어 있더라도 실행되지 않습니다.

Q. `+=`로 새로운 내용을 기존 내용에 붙여넣을 수 있나요?

> 네, 그런데 내부적으로는 새로운 내용을 추가한 것이 아니라 기존 내용을 삭제한 후에 기존 내용에 새로운 내용을 합친 내용을 쓰는 것입니다.
>
> 기존 내용을 삭제한 후에 다시 쓰는 것이기 때문에 이미지 등의 리소스가 모두 다시 로딩됩니다. 그래서 만약 기존의 내용에 마우스로 드래그를 한 상황이라면 새로운 내용을 다시 쓸 때 드래그가 풀리는 문제가 생깁니다. `input`태그라면 사용자가 입력한 값이 있을 경우 사라지는 문제가 생길 것입니다.

Q. `outerHTML`은 무엇인가요?

> `outerHTML`은 해당 요소의 HTML을 문자열 형태로 받아오는 프로퍼티입니다. `innerHTML`은 요소 안의 HTML만 받아오지만 `outerHTML`은 요소 자체도 받아옵니다.

```html
<div id="elem">Hello <b>World</b></div>

<script>
  console.log(elem.innerHTML); // Hello <b>World</b>
  console.log(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
</script>
```

> `innerHTML`의 내용에 해당 요소 태그까지 가져오는 것을 알 수 있습니다.
>
> 내용을 수정할 때에도 `innerHTML`과 차이가 있습니다. `outerHTML`로 내용을 수정하면, `outerHTML`을 호출한 해당 요소 자체를 삭제한 후에 새로운 내용을 삽입합니다.

```html
<div>Hello, world!</div>

<script>
  let div = document.querySelector("div");

  // div.outerHTML를 사용해 <p>...</p>로 교체
  div.outerHTML = "<p>새로운 요소</p>";

  console.log(div.outerHTML); // <div>Hello, world!</div> (*)
</script>
```

> 화면에는 "새로운 요소"가 반영됐지만 \*의 콘솔문을 실행하면 `<p>`태그는 반영되지 않은채 기존의 내용인 `<div>Hello, world!</div>`가 출력됩니다.

> 그 이유는 값을 할당했을 때 `outerHTML`연산을 호출한 해당 요소 자체를 DOM에서 삭제하기 때문입니다. 삭제한 후에 새롭게 할당한 값인 `<p>새로운 요소</p>`를 삭제 후 생긴 공간에 삽입합니다. div변수는 삭제한 요소를 담고 있는 것이기 때문에 `div.outerHTML`을 했을 때 `<div>Hello, world!</div>`를 출력합니다.

> 해당 요소가 삭제됐음에도 `div`변수가 값을 계속 가지고 있는 이유는 `querySeletor`는 값이 자동으로 갱신되는 메서드가 아니기 때문입니다. 만약 아래의 예시코드처럼 값이 자동으로 갱신되는 메서드인 `getElementsByTagName`을 사용하면 요소가 삭제된 것이 반영되기 때문에 두번째 `div`태그를 출력합니다.

```html
<div>기존 내용</div>
<div>div태그</div>

<script>
  let divs = document.getElementsByTagName("div");
  // 이렇게 변수에 따로 할당해서 사용하면 위의 예시코드와 똑같이 동작합니다.
  // let div = divs[0];
  divs[0].outerHTML = "<p>새로운 요소</p>";
  console.log(divs[0].outerHTML);
</script>
```

> 그래서 `outerHTML`을 사용할 땐 주의해야합니다. `outerHTML`은 아예 해당 요소를 삭제한 후에 새롭게 할당한 HTML을 삽입합니다. `innerHTML`은 해당 요소를 삭제하지 않으며 해당 요소 내부의 내용을 삭제합니다.

Q. 태그가 포함되지 않은 태그 내부의 순수한 텍스트만 얻을 순 없나요?

> `textContent`프로퍼티를 사용하면 순수한 텍스트만 얻을 수 있습니다.

```html
<div id="news">
  <h1>주요 뉴스!</h1>
  <p>화성인이 지구를 침공하였습니다!</p>
</div>

<script>
  // 주요 뉴스! 화성인이 지구를 침공하였습니다!
  alert(news.textContent);
</script>
```

> `alert`창에 `<h1>`과 `<p>`는 표시되지 않고 텍스트만 출력되는 것을 확인할 수 있습니다.

> `textContent`로 새로운 값을 할당하는 것도 가능합니다. 하지만 텍스트자체로 할당됩니다. `innerHTML`과 비교하면 이해가 쉽습니다.

```html
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("이름을 알려주세요.", "<b>이보라</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

> 위의 예시에서 `prompt`창에 `<b>이보라</b>`를 입력받았습니다. 그리고 입력받은 값을 `elem1`에는 `innerHTML`로, `elem2`에는 `textContent`로 할당했습니다. 실행 결과를 보면 `elem1`은 `<b>`가 태그로 해석이 됐기 때문에 "이보라"만 굵은 글씨로 출력됩니다. 하지만 `elem2`는 `<b>`를 텍스트로 취급하여 `<b>이보라</b>`가 그대로 출력됩니다.
>
> 즉, `textContent`는 값을 할당할 때도 텍스트로 취급하여 저장하는 것을 알 수 있습니다.

> 사용자의 입력값을 받도록 처리해야할 경우가 많은데, 이 때 사용자가 입력한 값을 텍스트로 처리되어야 하기 때문에 `textContent`를 사용하는게 좋습니다. `innerHTML`로 처리할 경우, HTML로 취급되기 때문에 XSS공격에 취약할 수 있습니다.

Q. 다른 노드 타입은 내용을 변경할 수 있나요?

> 네, `nodeValue`와 `data` 프로퍼티로 변경가능합니다. `innerHTML`과 `outerHTML`은 요소 노드에만 사용할 수 있습니다.

```html
<body>
  안녕하세요.
  <!-- 주석 -->
  <script>
    let text = document.body.firstChild;
    alert(text.data); // 안녕하세요.

    let comment = text.nextSibling;
    alert(comment.data); // 주석
  </script>
</body>
```

> 이렇게 텍스트 노드와 주석 노드에 내용에 접근 가능합니다.

Q. 다른 유용한 프로퍼티는 어떤 게 있나요?

- `hidden` 프로퍼티

  - 요소를 숨기도록 지정할 수 있는 프로퍼티입니다.
  - `true`일 때는 숨기고 `false`일 때는 숨긴 요소를 다시 보여줍니다.
  - `style="display: none"`과 동일한 효과입니다.
  - 아래는 `setInterval`을 사용하여 요소를 깜빡이도록 구현한 예제입니다.

    ```html
    <div id="elem">깜빡이는 요소</div>

    <script>
      setInterval(() => (elem.hidden = !elem.hidden), 1000);
    </script>
    ```

- `value` 프로퍼티
  - `<input>`, `<select>`, `<textarea>` 태그에서 사용가능한 프로퍼티입니다.
- `href` 프로퍼티
  - `<a>`태그에서 사용가능한 프로퍼티입니다.
- `id` 프로퍼티
  - 모든 요소 노드에서 사용가능한 프로퍼티입니다.

Q. 요소가 어떤 프로퍼티를 사용할 수 있는지 어떻게 알 수 있나요?

- [명세서](https://html.spec.whatwg.org/)를 통해 알 수 있습니다.
- `console.dir(elem)`을 사용하면 지원하는 프로퍼티 목록이 출력됩니다
- 개발자 도구의 Elements패널의 하위 패널인 Properties를 클릭하면 지원하는 프로퍼티 목록을 볼 수 있습니다.
