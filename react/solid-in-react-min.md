# [[번역] React에 SOLID 원칙 적용하기](https://dev-boku.tistory.com/entry/%EB%B2%88%EC%97%AD-React%EC%97%90-SOLID-%EC%9B%90%EC%B9%99-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

- [단일 책임 원칙(SRP) ⤴️](#단일-책임-원칙srp-️)
- [개방-폐쇄 원칙 (OCP) ⤴️](#개방-폐쇄-원칙-ocp-️)
  - [개방-폐쇄 원칙을 지키는 방법: 컴포넌트 합성](#개방-폐쇄-원칙을-지키는-방법-컴포넌트-합성)
- [리스코프 치환 원칙](#리스코프-치환-원칙)
- [📚 함께 읽기 ⤴️](#-함께-읽기-️)

(주의) Q. SOLID 원칙은 객체 지향 프로그래밍에서 사용되고 리액트는 함수형 프로그래밍과 가까운데 SOLID 원칙을 리액트에 적용하는 게 좋은 걸까요?

> SOLID는 소프트웨어 설계 원칙이기 때문에 언어나 프레임워크에 구애받지 않습니다. SOLID 원칙을 적용하면 코드의 유지보수성이 높아지고, 재사용성이 높아지며, 확장성이 높아지고, 테스트하기 쉬워집니다. 물론 객체 지향 프로그래밍에 근거하기 때문에 리액트와 잘 맞지 않는 부분도 있을 수 있겠지만 리액트에 맞게 SOLID 원칙을 잘 적용하면 리액트의 장점을 더욱 살릴 수 있습니다.

(기대효과) Q. SOLID 원칙을 리액트에 적용하면 어떤 기대효과가 있을까요?

> not yet

## 단일 책임 원칙(SRP) [⤴️](#번역-react에-solid-원칙-적용하기)

(적용) Q. 단일 책임 원칙은 리액트에서 어떻게 적용할 수 있을까요?

> 단일 책임 원칙(SRP, Single Responsibility Principle)에 따르면 "한 컴포넌트는 한 가지 작업을 수행"합니다.
>
> 단일 책임 원칙을 리액트 컴포넌트에 적용해보면 다음과 같습니다:
>
> - 너무 많은 작업을 수행하는 큰 컴포넌트를 더 작은 컴포넌트로 나눈다
> - 주요 컴포넌트 기능과 관련 없는 코드를 별도의 유틸리티 함수로 추출한다
> - 관련 있는 기능을 모아서 커스텀 hook으로 캡슐화한다

```tsx
const ActiveUsersList = () => {
  // (a-1) useState를 사용해서 user를 상태로 선언한다
  const [users, setUsers] = useState([]);

  // (a-2) useEffect를 사용해서 user의 값을 구한다
  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch("/some-api");
      const data = await response.json();
      setUsers(data);
    };

    loadUsers();
  }, []);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // (b) (a-1)과 (a-2)에서 구한 상태 user를 사용해서 UI를 그린다
  return (
    <ul>
      {users
        .filter((user) => !user.isBanned && user.lastActivityAt >= weekAgo)
        .map((user) => (
          <li key={user.id}>
            <img src={user.avatarUrl} />
            <p>{user.fullName}</p>
            <small>{user.role}</small>
          </li>
        ))}
    </ul>
  );
};
```

> `ActiveUsersList` 컴포넌트는 한 가지 일만 하고 있을까요? 그렇지 않습니다. 먼저 뷰 로직과 뷰가 아닌 로직으로 구분해서 보면 크게 2가지 일을 하고 있습니다:
>
> 1. 뷰가 아닌 로직: 상태 `user`를 선언하고 값을 구하는 코드 (a-1, a-2)
> 2. 뷰 로직: 값을 구한 상태 `user`를 사용해서 UI를 그리는 코드 (b)
>
> 따라서 뷰가 아닌 로직과 뷰 로직은 서로 다른 일을 하는 것이기 때문에 단일 책임 원칙에 따라 각각을 한 가지 일만 담당하도록 개별 모듈로 분리할 수 있습니다.
>
> `user` 상태를 관리(변수 선언 및 값 구하기)하는 코드는 커스텀 훅으로 추출할 수 있습니다:

```tsx
// useUsers는 API로부터 users를 페치하는 "한 가지" 일만 수행합니다
const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch("/some-api");
      const data = await response.json();
      setUsers(data);
    };

    loadUsers();
  }, []);

  return { users };
};
```

> 메인 컴포넌트가 하던 여러 가지 일을 개별 모듈이 하나씩 담당하도록 분리하면 코드가 다음과 같이 간결해집니다:

```tsx
// (proactive)(행동) 뷰가 아닌 로직을 커스텀 훅으로 추출했기 때문에
const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch("/some-api");
      const data = await response.json();
      setUsers(data);
    };

    loadUsers();
  }, []);

  return { users };
};

// (effect)(효과) 메인 컴포넌트의 코드가 짧아지고 관심사가 분리되어 가독성이 좋아졌습니다
const ActiveUsersList = () => {
  const { users } = useUsers();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return (
    <ul>
      {users
        .filter((user) => !user.isBanned && user.lastActivityAt >= weekAgo)
        .map((user) => (
          <li key={user.id}>
            <img src={user.avatarUrl} />
            <p>{user.fullName}</p>
            <small>{user.role}</small>
          </li>
        ))}
    </ul>
  );
};
```

> 이제 뷰 로직을 살펴보겠습니다. 뷰 로직에서는 상태 `users`가 객체 배열이기 때문에 배열의 아이템을 하나씩 순회하면서 JSX를 만들어내고 있습니다. 만약 순회하면서 만들어내는 JSX가 (1) 이벤트 핸들러도 없고 (2) 한 줄짜리 코드라면 굳이 컴포넌트로 분리할 필요는 없습니다. 하지만 이 경우에는 여러 줄의 마크업을 생성하기 때문에 컴포넌트로 분리하는 것이 좋습니다:

```tsx
// user 객체 데이터를 받아서 JSX를 반환하는 "한 가지" 일만 수행합니다
const UserItem = ({ user }) => {
  return (
    <li>
      <img src={user.avatarUrl} />
      <p>{user.fullName}</p>
      <small>{user.role}</small>
    </li>
  );
};
```

> 이제 메인 컴포넌트는 다음과 같이 간결해집니다:

```tsx
const ActiveUsersList = () => {
  const { users } = useUsers();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return (
    <ul>
      {users
        .filter((user) => !user.isBanned && user.lastActivityAt >= weekAgo)
        .map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
    </ul>
  );
};
```

> 마지막으로 `useUsers()` 훅이 구한 `users` 데이터에서 비활성 사용자를 제외하는 필터링 로직이 있습니다. 이러한 로직은 다른 곳에서 재사용될 수 있고 부수효과가 없는 계산(calculation)이기 때문에 유틸리티 함수로 추출하면 됩니다:

```tsx
// 활성 사용자만 필터링하는 "한 가지" 일만 수행합니다
const getOnlyActive = (users) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return users.filter(
    (user) => !user.isBanned && user.lastActivityAt >= weekAgo
  );
};
```

> 따라서 메인 컴포넌트는 다음과 같이 간결해집니다.
>
> `ActiveUsersList`가 하는 일은 다음과 같습니다:
>
> - `useUsers()` 훅을 사용해서 `users` 상태를 가져옵니다
> - `getOnlyActive()` 유틸리티 함수를 사용해서 비활성 사용자를 제외한 사용자 목록을 구합니다
> - `UserItem` 컴포넌트를 사용해서 사용자 목록을 렌더링합니다
>
> 즉, `ActiveUsersList`가 하는 일은 (한 가지 일만 담당하는) 여러 가지 모듈을 어떻게 조합해야 하는지 플로우를 구성해서 UI를 그리는 것입니다:

```tsx
const ActiveUsersList = () => {
  // get data
  const { users } = useUsers();

  // filter and render
  return (
    <ul>
      {getOnlyActive(users).map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

> 마지막 개선 사항으로 `activeUsers`만 직접 가져와서 사용하면 더 간결해집니다:

```tsx
// useUsers()와 getOnlyActive()를 조합해서 activeUsers 상태를 만드는 "한 가지"일을 수행합니다
const useActiveUsers = () => {
  // fetch
  const { users } = useUsers();

  // filter
  const activeUsers = useMemo(() => {
    return getOnlyActive(users);
  }, [users]);

  return { activeUsers };
};
```

```tsx
const ActiveUsersList = () => {
  // get data
  const { activeUsers } = useActiveUsers();

  // render
  return (
    <ul>
      {activeUsers.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

> 이제 단일 책임 원칙으로 리팩토링하기 전후를 비교하고 어떤 효과가 생겼는지 보겠습니다:

```tsx
// 단일 책임 원칙을 지키지 않은 경우

const ActiveUsersList = () => {
  /* fetch data for UI */
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch("/some-api");
      const data = await response.json();
      setUsers(data);
    };

    loadUsers();
  }, []);

  /* ancillary(less important) data to filter (NOT UI data) */
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  /* filter data and render UI */
  return (
    <ul>
      {users
        .filter((user) => !user.isBanned && user.lastActivityAt >= weekAgo)
        .map((user) => (
          <li key={user.id}>
            <img src={user.avatarUrl} />
            <p>{user.fullName}</p>
            <small>{user.role}</small>
          </li>
        ))}
    </ul>
  );
};
```

> 단일 책임 원칙을 지키기 전 `ActiveUsersList`가 하는 일은 다음과 같습니다:
>
> - UI에 필요한 데이터를 직접 구합니다
> - UI에 필요한 데이터를 필터링하기 위해 보조 데이터를 직접 구합니다
> - UI에 필요한 데이터를 직접 필터링합니다
> - 하위 컴포넌트 없이 직접 마크업을 그려서 UI를 렌더링합니다
>
> 모든 일을 직접 하고 있습니다.

```tsx
// 단일 책임 원칙을 지킨 경우

// 단일 책임 원칙을 준수하도록 모듈화한다
const useActiveUsers = () => {
  /* ... */
};
const useUsers = () => {
  /* ... */
};
const getOnlyActive = (users) => {
  /* ... */
};
const UserItem = ({ user }) => {
  /* ... */
};

// 모듈을 조합해서 UI를 렌더링한다
const ActiveUsersList = () => {
  // get data
  const { activeUsers } = useActiveUsers();

  // render
  return (
    <ul>
      {activeUsers.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

> 단일 책임 원칙을 지킨 후 `ActiveUsersList`가 하는 일은 다음과 같습니다:
>
> - UI에 필요한 데이터를 다른 모듈을 사용해서 가져옵니다
> - 가져온 데이터를 사용해서 UI를 렌더링합니다
>
> 모든 일을 직접하는 게 아니라 해당 역할에 맞는 모듈을 조합해서 사용합니다. (interact with other modules)

## 개방-폐쇄 원칙 (OCP) [⤴️](#번역-react에-solid-원칙-적용하기)

(무엇) Q. 개방-폐쇄 원칙이란 무엇인가요?

> 쉽게 말하면, 어떤 모듈에 새로운 기능을 추가할 때 기존에 존재하는 코드를 변경하지 않고도(closed for modification) 새로운 기능을 추가(open for extension)할 수 있어야 한다는 원칙입니다.

<details markdown="1">
<summary><strong>더보기</strong></summary>

개방-폐쇄 원칙(Open-Closed Principle)은 "소프트웨어 개체(software entity = 클래스, 모듈, 함수 등)는 확장에는 열려 있어야 하고, 변경에는 닫혀 있어야 한다"는 원칙입니다.

여기서 말하는 확장과 변경은 기존 코드를 기준으로 합니다. 따라서 확장에 열려있다(open for extension)는 말은 기존 코드를 건드리지 않고 새로운 기능을 추가하기 쉽다는 뜻이고, 변경에 닫혀있다(closed for modification)는 말은 새로운 기능을 추가할 때 기존 코드를 변경하면 안된다는 뜻입니다.

</details>

(어떻게) Q. 기존 코드를 변경하지 않으면서 새로운 기능을 추가한다는 게 말이 되나요?

> 맞습니다. 새로운 기능에 대한 구현을 내부에 하면서 내부 코드는 건드리면 안된다는 것은 말이 안됩니다. 그런데 말이 되는 경우가 한 가지 있습니다. 새로운 기능에 대한 구현을 기존 코드가 아니라 사용하는 쪽에서 구현하면 됩니다. 그리고 정의부에서는 새로운 기능에 대한 세부 구현을 알지 못하더라도 내부에서 사용할 수 있게 추상화가 잘 된 인터페이스를 제공해주면 됩니다.

(예시) Q. 개방-폐쇄 원칙을 지키지 않는 예제를 보여주세요.

> `Header` 컴포넌트는 여러 페이지에서 사용됩니다. 이때 페이지마다 공통으로 공유하는 부분도 있고 페이지마다 다른 부분도 있습니다:

```tsx
const Header = () => {
  const { pathname } = useRouter();

  return (
    <header>
      <Logo />
      <Actions>
        {/* 🚨 페이지가 늘어날 때마다 링크를 다르게 구현해야 합니다. */}
        {pathname === "/dashboard" && (
          <Link to="/events/new">Create event</Link>
        )}
        {pathname === "/" && <Link to="/dashboard">Go to dashboard</Link>}
      </Actions>
    </header>
  );
};

const HomePage = () => (
  <>
    <Header />
    <OtherHomeStuff />
  </>
);

const DashboardPage = () => (
  <>
    <Header />
    <OtherDashboardStuff />
  </>
);

/* ...other Pages using Header... */
```

> `Header`를 사용하는 페이지가 늘어날 때마다 `Header` 컴포넌트의 내부에 들어가서 작업할 링크를 직접 구현해야 합니다. 이러한 접근 방식은 `Header` 컴포넌트의 내부가 사용처의 컨텍스트와 긴밀하게 결합되어 수정에 닫혀 있어야 하는 폐쇄(closed for modification) 원칙을 위반합니다.

### 개방-폐쇄 원칙을 지키는 방법: 컴포넌트 합성

(해결) Q. `Header` 컴포넌트가 수정에 닫혀 있도록 개방-폐쇄 원칙을 지키게 하려면 어떻게 해야 하나요?

> `Header` 컴포넌트의 내부에서 작업할 링크를 직접 구현하는 책임을 `Header` 컴포넌트를 사용하는 클라이언트 코드가 담당하게 하면 됩니다.
>
> 즉 `Header` 컴포넌트는 자신을 사용하는 클라이언트 컴포넌트가 전달해주는 것을 그대로 렌더링하면 됩니다.

```tsx
const Header = ({ children }) => (
  <header>
    <Logo />
    <Actions>{children}</Actions>
  </header>
);

const HomePage = () => (
  <>
    <Header>
      <Link to="/dashboard">Go to dashboard</Link>
    </Header>
    <OtherHomeStuff />
  </>
);

const DashboardPage = () => (
  <>
    <Header>
      <Link to="/events/new">Create event</Link>
    </Header>
    <OtherDashboardStuff />
  </>
);
```

> 이제 `Header`를 사용하는 로직에 새로운 기능을 추가할 때 `Header` 컴포넌트 내부를 변경하지 않고도(closed for modification) 새로운 기능을 추가할 수 있습니다(open for extension).

(정리) Q. 컴포넌트 합성은 무엇이고, 컴포넌트 합성이 해결하는 문제가 개방-폐쇄 원칙과 어떻게 연관되나요?

> (what) 이렇게 더 "구체적인" 컴포넌트가 "일반적인" 컴포넌트를 렌더링하고 `props`를 통해 "구체적인" 내용을 구성하는 방식을 컴포넌트 합성(component composition)이라고 합니다.
>
> (how) 위와 같이 리액트에서 컴포넌트 합성을 구현하는 방법은 "구체적인" 부모 컴포넌트가 "일반적인" 자식 컴포넌트를 렌더링하고, 부모 컴포넌트가 "구체적인" 로직을 "일반적인" 자식 컴포넌트의 `props`에 전달하는 방식입니다.
>
> (why) 컴포넌트 합성을 사용하면 기존 코드를 변경하지 않고도 새로운 기능을 추가할 수 있습니다 (사실상 새로운 기능에 대한 세부 구현은 사용처에서 전달하는 것이기 때문에 컴포넌트 정의부에서는 `전달한 내용의 세부 구현이 다르더라도 동일한 방식으로 사용할 수 있도록 일반적인 인터페이스(=추상화가 잘된 인터페이스)를 가지도록 설계하는 것`이 open for extension, closed for modifcation을 지키는 핵심입니다). 즉, 개방-폐쇄 원칙(OCP)을 지킬 수 있습니다.

<details markdown="1">
<summary><strong>ChatGPT: Q. 리액트에서 컴포넌트 합성은 어떻게 구현하나요?</strong></summary>

React에서는 컴포넌트가 부모 컴포넌트로부터 입력 데이터와 구성 정보를 수신할 수 있는 "props" 시스템을 사용하여 컴포넌트를 구성합니다. 컴포넌트 계층구조를 통해 데이터를 전달함으로써 개발자는 보다 모듈화되고 재사용 가능한 코드베이스를 만들 수 있습니다.

</details>

## 리스코프 치환 원칙

(무엇) Q. 리스코프 치환 원칙이 무엇인가요?

> 리스코프 치환 원칙(LSP)은 "하위 타입 객체가 상위 타입 객체를 대체할 수 있는" 객체 간의 관계 유형입니다. [리액트에서는 상속을 권장하지 않기 때문에](https://ko.reactjs.org/docs/composition-vs-inheritance.html#so-what-about-inheritance) 이 원칙은 리액트에 적용하지 않겠습니다.

## 📚 함께 읽기 [⤴️](#번역-react에-solid-원칙-적용하기)

- [dev-boku - [번역] React에 SOLID 원칙 적용하기](https://dev-boku.tistory.com/entry/%EB%B2%88%EC%97%AD-React%EC%97%90-SOLID-%EC%9B%90%EC%B9%99-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)
- [React Docs - 합성 vs 상속](https://ko.reactjs.org/docs/composition-vs-inheritance.html#specialization)
