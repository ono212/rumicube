# [브라우저 환경과 다양한 명세서](https://ko.javascript.info/browser-environment)

Q. 자바스크립트는 브라우저에서만 동작하나요?

> 아니요, 브라우저뿐만 아니라 웹서버에서도 동작하며 다른 환경에서도 동작합니다.

> 자바스크립트가 실행되는 플랫폼을 호스트라고 합니다. 각 플랫폼은 저마다의 특정되는 기능을 제공하며 이것을 자바스크립트 명세서에서는 호스트 환경이라고 합니다. 예를 들어 웹 브라우저가 호스트 환경일 경우에는 웹페이지를 제어할 수 있는 기능을 제공하며, Node.js가 호스트 환경 경우에는 서버 사이드 기능을 제공하는 것입니다.

Q. 웹 브라우저는 어떤 기능을 제공하나요?

> 최상단에 `window`라는 루트 객체를 제공하여 자바스크립트의 전역 객체로 사용할 수 있으며 브라우저 창을 제어할 수도 있습니다.

```js
function sayHi() {
  alert("안녕하세요.");
}

// 전역 함수는 전역 객체(window)의 메서드임
window.sayHi();

alert(window.innerHeight); // 창 내부(inner window) 높이
```

> 이렇게 자바스크립트 코드 상에서 `window`객체를 사용하여 전역 객체로서 사용하여 제어할 수 있습니다.

> 또한 DOM과 BOM을 제공합니다. DOM을 통해 웹페이지의 모든 객체에 접근할 수 있으며, BOM을 통해서 현재 URL과 브라우저 정보에 대해 접근할 수 있습니다.

Q. DOM이 무엇인가요?

> DOM은 Document Object Model의 약자로 문서 객체 모델을 의미합니다. 웹 페이지의 모든 요소를 객체로 나타낸 것입니다. 이 객체를 통해 웹 페이지의 요소에 접근할 수 있기 때문에 요소를 추가하거나 변경하는 등의 조작이 가능합니다.

Q. DOM에 어떻게 접근할 수 있나요?

> `document`객체를 통해 요소에 접근할 수 있습니다. `document`객체가 웹 페이지의 기본 진입점 역할을 하며, `document`객체를 통해서 다른 하위 요소들에도 접근할 수 있습니다.

```js
// 배경을 붉은색으로 변경하기
document.body.style.background = "red";

// 1초 후 원상태로 복구하기
setTimeout(() => (document.body.style.background = ""), 1000);
```

> `document`객체를 통해서 `body`요소의 스타일을 변경한 예시입니다. 이렇게 스타일을 변경하는 것 외에도 요소에 대해 이벤트 리스너를 추가하거나 속성을 추가하는 등의 다양한 프로퍼티와 메서드를 제공하고 있습니다. [DOM 명세서](https://dom.spec.whatwg.org/)를 참고하면 다양한 기능에 대해 볼 수 있습니다.

Q. 스타일도 DOM에 표시되나요?

> 스타일은 별도로 CSSOM이 만들어집니다. CSSOM은 CSS Object Model의 약자로 CSS 규칙과 스타일시트를 객체로 나타낸 것입니다. [CSSOM 명세서](https://www.w3.org/TR/cssom-1/)에서 어떻게 사용할 수 있는지 볼 수 있습니다. 실무에서 CSSOM을 사용해서 스타일을 수정하는 일이 많진 않습니다.

Q. BOM이 무엇인가요?

> BOM은 Browser Object Model의 약자로 브라우저 객체 모델을 의미합니다. 문서 외의 모든 것을 제어하기 위해 브라우저가 제공하는 추가 객체입니다. 이 객체를 통해 브라우저를 제어할 수 있습니다. 대표적으로 `navigator`객체와 `location`객체가 있습니다.

- `navigator`객체
  - 브라우저와 운영체제에 대한 정보를 제공합니다.
  - `navigator.userAgent`는 현재 사용중인 브라우저 정보를 알려줍니다.
- `location`객체
  - URL에 대한 정보를 제공합니다.
  - `location.href`는 현재 URL을 알려주며, 값을 넣어 해당 URL로 이동할 수도 있습니다.
- `alert/confirm/prompt`도 BOM이 제공하는 메서드입니다.

```js
alert(location.href); // 현재 URL을 보여줌
if (confirm("위키피디아 페이지로 가시겠습니까?")) {
  location.href = "https://wikipedia.org"; // 새로운 페이지로 넘어감
}
```

> BOM의 명세서가 따로 존재하진 않고, BOM은 HTML 명세서의 일부이기 때문에 추가적인 기능들은 [HTML 명세서](https://html.spec.whatwg.org/)에서 확인할 수 있습니다.
