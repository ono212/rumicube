# [요소 검색하기 과제](https://ko.javascript.info/searching-elements-dom#tasks)

> 문제

테이블과 폼이 있는 문서가 있다고 가정합시다.

아래 조건에 맞는 요소는 어떻게 찾을 수 있을까요?

1. `id="age-table"`인 테이블
2. 테이블 내의 `label` 요소 모두(총 3개)
3. 테이블 내의 첫 번째 `td`(Age가 적힌 곳)
4. `name="search"`인 `form`
5. 폼의 첫 번째 `input`
6. 폼의 마지막 `input`

별도의 창에서 [table.html](https://ko.javascript.info/task/find-elements/table.html)을 열어 브라우저 내 도구를 사용해 문제를 풀어보세요.

> 답안

```jsx
// 1. id="age-table"인 테이블
let ageTable = document.getElementById("age-table");

// 2. 테이블 내의 label 요소 모두(총 3개)
ageTable.getElementsByTagName("label"); // 방법1
document.querySelectorAll("#age-table label"); // 방법2

// 3. 테이블 내의 첫 번째 td(Age가 적힌 곳)
ageTable.querySelector("td"); // 방법1
ageTable.rows[0].cells[0]; // 방법2
ageTable.getElementsByTagName("td")[0]; // 방법3

// 4. name="search"인 form
let searchForm = document.getElementsByName("search")[0]; // 방법1
document.querySelector('form[name="search"]'); // 방법2

// 5. 4번 form의 첫 번째 input
let formInputs = searchForm.querySelectorAll("input");
formInputs[0]; // 방법1
searchForm.querySelector("input"); // 방법2
searchForm.getElementsByTagName("input")[0]; // 방법3

// 6. 폼의 마지막 input
formInputs[formInputs.length - 1]; // 방법1
```
