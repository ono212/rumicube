# [getElement*, querySelector*로 요소 검색하기](https://ko.javascript.info/searching-elements-dom)

Q. DOM 탐색 프로퍼티를 사용해 `document`객체로부터 하위로 내려가며 탐색하는 방법말고 직접적으로 어떤 요소에 바로 접근하는 방법은 없나요?

> 있습니다. 주로 많이 사용되는 6가지 메서드가 있는데 `querySelector`, `querySelectorAll`, `getElementById`, `getElementsByName`, `getElementsByTagName`, `getElementsByClassName`입니다.
>
> 크게 `querySelector*`메서드와 `getElementsBy*`메서드, `getElementById`메서드로 구분할 수 있습니다.
>
> 실무에서 많이 사용되는 메서드들은 `querySelector`와 `querySelectorAll`입니다.

Q. `querySelector*`메서드는 어떻게 사용할 수 있나요?

> `querySelector*`메서드는 `querySelector`와 `querySelectorAll`메서드를 말합니다.

- `querySelector`메서드
  - 사용법 : `elem.querySelector(css선택자)`
  - 반환값은 `elem`요소의 하위 요소들 중에서 css선택자와 일치하는 첫 번째 요소입니다. 일치하는 요소가 없을 경우에는 `null`을 반환합니다.
  - `elem`은 꼭 `document`객체가 아니어도 되며, 특정 요소에 대해서 호출할 수 있습니다.
- `querySelectorAll`메서드
  - 사용법 : `elem.querySelectorAll(css)`
  - 반환값은 elem요소의 하위 요소들 중에서 css선택자와 일치하는 모든 요소들을 담은 컬렉션입니다.
  - `querySelector`메서드는 일치하는 첫 번째 요소만 반환하지만, `querySelectorAll`메서드는 일치하는 모든 요소들을 반환한다는 점이 차이점입니다.
  - 그렇기 때문에 `elem.querySelectorAll(css)[0]`과 `elem.querySelector(css)`의 값은 같습니다.

> `querySelector`는 일치하는 요소를 찾으면 바로 검색을 멈추고 값을 반환하기 때문에 `querySelectorAll`보다 빠르다는 장점이 있습니다.

```html
<div id="container">
  <ul>
    <li>1-1</li>
    <li>1-2</li>
  </ul>
  <ul>
    <li>2-1</li>
    <li>2-2</li>
  </ul>
</div>
<script>
  // 문서 전체에서 id 속성 값이 "container"인 요소를 검색
  let container = document.querySelector("#container"); // div태그

  // container요소의 하위 요소들 중에서 ul의 하위태그인 li태그 ul의 마지막 자식 태그인 모든 요소를 검색
  let elements = container.querySelectorAll("ul > li:last-child");
  for (let elem of elements) {
    console.log(elem.innerHTML); // "1-2", "2-2"
  }
</script>
```

> [예시코드를 실행해볼 수 있는 링크](https://codepen.io/bbungchi/pen/ExOQPOQ)입니다.

Q. `getElementById`메서드는 어떻게 사용할 수 있나요?

> `document.getElementById(id)`의 구문으로 사용합니다. 찾으려는
> 요소의 id를 인자로 넘기며 해당 값을 id속성으로 가지는 요소를 반환합니다. 없을
> 경우에는 `null`을 반환합니다.
>
> `querySelector*`메서드와는 달리 특정 요소에서 호출할 순 없고 `document`객체에만 사용할 수 있습니다.
>
> 또한 요소의 id는 문서 내에서 유일해야 합니다. 겹치는 id가 있어서는 안됩니다.만약 문서 내에 동일한 id가 여러개 존재할 경우에 `getElementById`메서드를 사용하면 여러 개의 요소 중 어떤 요소를 반환할지 예측할 수 없습니다.

```html
<div id="container">
  <div id="elem">Element</div>
</div>

<script>
  // 요소 얻기
  let container = document.getElementById("container");

  // 배경색 변경하기
  container.style.background = "red";

  /*
	이렇게 id 속성값을 그대로 전역변수처럼 사용할 수도 있습니다.
	하지만 동일한 이름의 전역변수가 선언될 경우 요소로 참조할 수 없기 때문에 사용하지 않는 것이 좋습니다.
	*/
  elem.style.background = "purple";
</script>
```

Q. `getElementsBy*`메서드는 어떻게 사용할 수 있나요?

> `getElementsBy*`메서드는 `getElementsByName`, `getElementsByTagName`, `getElementsByClassName`가 있습니다. 이 메서드들을 사용하면 `name`, `tag`, `class` 별로 일치하는 요소들을 찾을 수 있습니다.

- `getElementsByName`
  - 사용법 : `document.getElementsByName(name)`
  - 문서 내에서 일치하는 name속성을 가진 요소들을 담은 컬렉션을 반환합니다.
  - `document`객체에만 사용할 수 있습니다.
- `getElementsByTagName`
  - `elem.getElementsByTagName(tag)`
  - elem의 하위 요소들 중에 인자로 넘긴 tag에 해당하는 요소들을 담은 컬렉션을 반환합니다.
  - \*이 인자일 경우, 하위의 모든 태그를 반환합니다.
- `getElementsByClassName`
  - `elem.getElementsByClassName(class)`
  - elem의 하위 요소들 중에 인자로 넘긴 class속성을 가진 요소들을 담은 컬렉션을 반환합니다.

```html
<form name="my-form">
  <div class="article">글</div>
  <div class="long article">내용이 긴 글</div>
</form>
<div>하윙</div>
<script>
  // 문서 전체에서 name 속성 값이 "my-form"인 요소를 검색
  let form = document.getElementsByName("my-form")[0];

  // form 내에서 class 속성 값이 "article"인 요소를 검색
  let articles = form.getElementsByClassName("article");
  console.log(articles.length); // 클래스 속성값이 'article'인 요소는 2개이므로 2를 출력합니다.

  // form 내의 div태그를 검색
  let divs = form.getElementsByTagName("div");
  for (div of divs) {
    console.log(div);
  }
</script>
```

> [예시코드를 실행해볼 수 있는 링크](https://codepen.io/bbungchi/pen/JjepXvQ)입니다.

Q. 일치하는 자식 요소들뿐만 아니라 더 하위에 있는 요소들도 반환하나요?

> 네, 중첩되어 있는 요소들이더라도 조건에 일치한다면 모두 반환합니다.

```html
<div id="1">
  1
  <div id="1-1">
    <div id="1-2"></div>
  </div>
</div>
<div id="2">2</div>

<script>
  let divs = document.getElementsByTagName("div");
  for (div of divs) {
    console.log(div);
  }
</script>
```

> [예시코드를 실행해볼 수 있는 링크](https://codepen.io/bbungchi/pen/mdQXEBq)입니다.
>
> 위 예시코드를 실행하면 `id`가 1인 `div`태그 하위에 있는 모든 `div`태그들이 출력되는 것을 확인할 수 있습니다.

Q. 위의 메서드들을 사용해 접근한 요소들에 값을 할당할 수 있나요?

> 네, 요소의 `id`, `class`와 같은 속성들에 대하여 값을 할당할 수 있습니다.

```html
<table id="table">
  <tr>
    <td>나이:</td>

    <td>
      <label>
        <input type="radio" name="age" value="young" checked /> 18세 미만
      </label>
      <label>
        <input type="radio" name="age" value="mature" /> 18세 이상, 60세 미만
      </label>
      <label>
        <input type="radio" name="age" value="senior" /> 60세 이상
      </label>
    </td>
  </tr>
</table>
<div id="div">div태그</div>
<script>
  let inputs = table.getElementsByTagName("input");

  inputs[0].name = "abcd";
  inputs[1].value = "efg";
  inputs[2].checked = true;

  for (let input of inputs) {
    console.log(input);
  }

  let div = document.getElementById("div");
  div.id = "7";
  console.log(div);
</script>
```

> 예시코드를 실행해볼 수 있는 링크입니다.
>
> 위의 예시코드를 통해 `input`태그의 `name`, `value`, `checked`속성과 `div`태그의 `id`속성에 값을 할당하고 변경된 값이 반영된 것을 확인할 수 있습니다.

Q. 위의 메서드들이 반환한 컬렉션을 담은 변수는 이후에 값이 변경되면 자동으로 갱신되나요?

> `getElementsBy`로 시작하는 메서드들만 자동 갱신됩니다. 이 메서드들은 살아있는 컬렉션을 반환하여 문서에 변경이 생길 때마다 컬렉션이 자동 갱신됩니다.

```html
<div>첫 번째 div</div>

<script>
  let divs = document.getElementsByTagName("div");
  alert(divs.length); // 1
</script>

<div>두 번째 div</div>

<script>
  console.log(divs.length); // 2
</script>
```

> 처음 `divs`변수에 값이 할당될 때 `div`태그는 하나만 있었습니다. 이후에 새로운 `div`태그가 문서에 추가되었습니다. 바로 `console`에 출력해보니 자동으로 값이 갱신되어서 `length`가 2인 것을 알 수 있습니다.

Q. 위의 메서드들 외에도 특정 요소를 검색할 수 있는 메서드가 있나요?

> `matches`메서드, `closest`메서드, `contains`메서드가 있습니다.

- `matches`메서드

  - 사용법 : `elem.matches(css선택자)`
  - `elem`요소가 인자로 받은 css선택자와 일치하는지 판단하는 메서드입니다.
  - 일치하면 `true`, 일치하지 않으면 `false`를 반환합니다.
  - 요소 배열에서 특정 요소만 필터링하고 싶을 때 유용하게 사용할 수 있습니다.

  ```html
  <a href="http://example.com/file.zip">...</a>
  <a href="http://ya.ru">...</a>

  <script>
    // document.body.children가 아니더라도 컬렉션이라면 이 메서드를 적용할 수 있습니다.
    for (let elem of document.body.children) {
      // elem요소가 <a> 태그이면서 href 속성 값이 "zip"으로 끝나는지 확인합니다.
      if (elem.matches('a[href$="zip"]')) {
        console.log("주어진 CSS 선택자와 일치하는 요소: " + elem.href); // 첫번째 a태그만 출력됩니다.
      }
    }
  </script>
  ```

- `closest`메서드

  - 사용법 : `elem.closest(css선택자)`
  - `elem`요소부터 시작해서 DOM 트리를 거슬러 올라가면서 인자로 주어진 css선택자와 일치하는 요소를 찾아 반환합니다.
  - `elem`요소부터 시작하기 때문에 자기 자신을 포함하여 일치하는 요소를 찾습니다.
  - 즉, 가장 가까운 css선택자에 해당하는 조상 요소를 찾는 메서드입니다.
  - 일치하는 요소를 찾으면 검색을 중단하고 해당 요소를 반환하며, 일치하는 요소가 없으면 `null`을 반환합니다.

  ```html
  <h1>목차</h1>

  <div class="contents">
    <ul class="book">
      <li class="chapter">1장</li>
      <li class="chapter">2장</li>
    </ul>
  </div>

  <script>
    let chapter = document.querySelector(".chapter"); // li

    // 자신을 포함해 클래스 속성 값이 "book"인 가장 가까운 조상요소를 찾습니다.
    console.log(chapter.closest(".book")); // ul

    // 자신을 포함해 클래스 속성 값이 "closest" 가장 가까운 조상요소를 찾습니다.
    console.log(chapter.closest(".contents")); // div

    // 자신을 포함해 가장 가까운 "h1"태그를 찾습니다.
    console.log(chapter.closest("h1")); // null
  </script>
  ```

  위의 예시코드에서 `h1`태그는 `li`태그의 조상 요소가 아닙니다. `li`태그의 가장 최상위 조상 요소는 `div`태그이기 때문입니다. 그래서 `h1`태그를 찾지못했기 때문 `null`을 반환합니다.

- `contains`메서드
  - 사용법 : `elemA.contains(elemB)`
  - `elemB`가 `elemA`의 후손이거나 또는 `elemA`와 `elemB`가 같은 요소이면 `true`를 그 외에는 `false`를 반환합니다.
