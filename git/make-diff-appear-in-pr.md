# PR에서 diff 안 나오는 문제 해결하기

## 문제 상황

뭉치가 작업을 하고 PR을 올리고 싶어서 `New pull request` 버튼을 눌렀는데 PR이 생성되지 않았습니다. 왜 그랬을까요? 그리고 어떻게 해결해야 할까요?

## 원인

`New pull request`를 눌렀는데 PR이 생성되지 않은 이유는 merge base와 compare branch의 차이가 없기 때문입니다. 즉, 두 브랜치가 같은 커밋을 가리키고 있기 때문에 PR을 생성할 수 없는 것입니다.

실제로 뭉치가 PR을 올리려고 했던 상황은 다음과 같습니다:

### 뭉치의 행동 추적하기

현재 아래와 같은 git log 상황에서 예시 코드를 추가해달라는 리뷰를 받았습니다:

```
* a652936 (HEAD -> main, origin/main, origin/HEAD) promise 심층연습 노트 추가 (3일 전) ono212
```

그래서 `main` 브랜치에서 작업을 해서 새로 커밋을 했습니다:

```
* 5c076e5 (HEAD -> main) 예시 코드 추가 (18시간 전) ono212
* a652936 (origin/main, origin/HEAD) promise 심층연습 노트 추가 (3일 전) ono212
```

작업이 완료되었으니 push를 합니다:

```
* 5c076e5 (HEAD -> main, origin/main, origin/HEAD) 예시 코드 추가 (18시간 전) ono212
* a652936 promise 심층연습 노트 추가 (3일 전) ono212
```

그리고 PR을 올리려고 `New pull request`를 눌렀는데 PR이 생성되지 않았습니다.

왜냐하면 `main` 브랜치와 `origin/main` 브랜치가 같은 커밋을 가리키고 있습니다. 이런 상황에서는 diff가 없기 때문에 PR을 생성할 수 없던 것입니다.

## 해결

PR을 올리려면 merge base 브랜치 기준에서 봤을 때 PR 브랜치와 차이가 있어야 합니다. 따라서 `main` 브랜치에 작업을 하고 push를 하는 게 아니라 새 작업 브랜치를 생성하고 그 작업 브랜치로 PR을 올려야 합니다.

따라서 현재 git graph 상황을

```
* 5c076e5 (HEAD -> main, origin/main, origin/HEAD) 예시 코드 추가 (18시간 전) ono212
* a652936 promise 심층연습 노트 추가 (3일 전) ono212
```

새 브랜치 `docs-promise-deep-practice-with-examples`를 만들어서 git log를 아래처럼 바꾸면 됩니다:

```
* 5c076e5 (HEAD -> docs-promise-deep-practice-with-examples) 예시 코드 추가 (18시간 전) ono212
* a652936 (main, origin/main, origin/HEAD) promise 심층연습 노트 추가 (3일 전) ono212
```

위와 같은 상황을 만들기 위해서 다음과 같이 명령어를 입력합니다:

```sh
# 현재 HEAD가 가리키는 커밋이 5c076e5인 상황에서 작업 브랜치를 생성합니다
git switch -c docs-promise-deep-practice-with-examples
```

그러면 git graph가 다음과 같이 변합니다:

```
* 5c076e5 (HEAD -> docs-promise-deep-practice-with-examples, main, origin/main, origin/HEAD) 예시 코드 추가 (18시간 전) ono212
* a652936 promise 심층연습 노트 추가 (3일 전) ono212
```

이제 main 브랜치와 origin/main 브랜치가 `a652936`를 가리키도록 변경합니다:

```sh
# 현재 main 브랜치는 5c076e5를 가리키고 있습니다
git switch main

# main 브랜치가 a652936를 가리키도록 변경합니다
git reset --hard a652936

# origin/main을 업데이트합니다 (로컬의 main 브랜치와 동일하게 a652936을 가리키도록 합니다)
git push origin main --force
```

이제 git graph가 다음과 같이 변합니다:

```
* 5c076e5 (HEAD -> docs-promise-deep-practice-with-examples) 예시 코드 추가 (18시간 전) ono212
* a652936 (main, origin/main, origin/HEAD) promise 심층연습 노트 추가 (3일 전) ono212
```

결과적으로 origin/main과 docs-promise-deep-practice-with-examples 브랜치에서 diff가 생겼으므로 `5c076e5` 커밋이 diff로 인식되어 PR을 생성할 수 있게 되었습니다.
