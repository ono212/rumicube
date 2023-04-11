# [번역] 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기

## (what) 어떤 내용이 나왔나요?

> 2023.03.18(토) 숙제
>
> 1. 아래 질문에 대한 답변을 모두 찾아옵니다.
> 2. 아래 질문을 제외하고 이 아티클에서 정확히 이해하지 못한 단어, 문장, 내용을 모두 적습니다.

Q. 비즈니스 로직이란 무엇인가요?

- 데이터를 가져오고 재구성하는 로직으로 UI와 관련된 정보는 포함하지 않는 로직입니다.

Q. 뷰 로직과 뷰가 아닌 로직은 어떻게 구분하나요?

- UI를 그리는 로직이 뷰 로직입니다.

Q. 리액트에서 뷰 로직과 뷰가 아닌 로직을 분리하는 방법은 무엇인가요?

- 첫번째 방법은 뷰가 아닌 로직을 커스텀 훅으로 분리하여 뷰 로직과 분리할 수 있습니다. 두번째 방법은 뷰 로직을 하위 컴포넌트로 추출하여 분리할 수 있습니다. 세번째 방법은 데이터와 동작을 클래스로 추출하여 분리할 수 있습니다.

Q. 아래 문장에서 색깔별로 해당하는 코드가 무엇인가요?

![](images/2023-03-18-18-04-06.png)

```tsx
export const Payment = ({ amount }: { amount: number }) => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      /* START: 네트워크 요청을 초기화하는 방법 */
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();
      /* END */

      if (methods.length > 0) {
        /* START: 데이터를 컴포넌트가 이해할 수 있는 로컬 형식으로 매핑하는 방법 */
        const extended: LocalPaymentMethod[] = methods.map((method) => ({
          provider: method.name,
          label: `Pay with ${method.name}`,
        }));
        /* END */
        extended.push({ provider: "cash", label: "Pay in cash" });
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  /* START: Payment 컴포넌트 자체의 렌더링 로직 */
  return (
    <div>
      <h3>Payment</h3>
      <div>
        /* START: 각 결제 방법을 렌더링하는 방법 */
        {paymentMethods.map((method) => (
          <label key={method.provider}>
            <input
              type="radio"
              name="payment"
              value={method.provider}
              defaultChecked={method.provider === "cash"}
            />
            <span>{method.label}</span>
          </label>
        ))}
        /* END */
      </div>
      <button>${amount}</button>
    </div>
  );
  /* END */
};
```

## 2023.04.01.next

서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI를 렌더링하는 부분을 새로운 컴포넌트로 추출할 수 있어. 어떻게 추출할 수 있는데?

paymentMethods를 map으로 돌리는 부분을 PaymentMethods컴포넌트로 추출하면 돼. 왜 그렇게 따로 추출하는데? 하면 뭐가 좋아?

이렇게 따로 분리하면 PaymentMethods컴포넌트는 순수함수라서 다른 곳에서 재사용하기 쉬워져서 좋아. 또 Payment컴포넌트도 결제 방법이 아닌 제목과 버튼을 렌더링하는 일에만 집중할 수 있어.

PaymentMethods컴포넌트에서 defaultChecked되어야 하는지 직접 체크하는 로직이 있는데 이 부분도 개선할 수 있어. 왜 개선해야돼? 뭐가 문제야 대체.. (이제 그만해..)

데이터 객체의 속성을 직접 확인하는 로직이 한 곳에 뭉쳐져있는게 아니라 여러 곳에 흩어져있게 되면 수정하기 어려워지기 때문이야. 클래스로 만들어서 관리하게 되면 코드의 변화가 생겨서 수정해야할 때 그 클래스 파일에서 수정하면 되니까 유지보수하기 편해져.

또 usePaymentMethods 훅에서 서버 데이터를 로컬 데이터로 변환하는 부분도 위에서 말한 부분과 함께 클래스로 묶어서 만들 수 있어. 여긴 또 왜..?

왜냐면..훅 내부에서 데이터 객체의 속성에 직접 접근해서 데이터 형태를 변환하고 있기 때문이야.

그래서 PaymentMethod 도메인 클래스를 만들어서 도메인 객체를 관리함으로서 도메인 데이터 관련 로직을 분리할 수 있어. 데이터 속성에 직접 접근해서 확인하는 일이 더 이상 PaymentMethods 컴포넌트의 관심사가 아닌 도메인 객체의 관심사로 분리됐어. usePaymentMethods 훅도 더이상 데이터를 변환하는 로직이 자신이 관심사가 아닌 도메인 객체의 관심사로 분리됐어. 이렇게 분리하면 만약 서버 데이터의 key나 value가 바뀌었을 때 PaymentMethod 클래스에서만 수정하면 되기 때문에 유지보수에 용이해지는 장점이 있어.

### 잘 모르겠는 것

- 데이터, 계산, 액션이 무슨 뜻인지 모르겠다.
- 도메인객체가 뭔지 모르겠다.

(개념) Q. 계산과 액션이 무슨 뜻인가요?

> 계산은 동일한 입력을 넣었을 때 동일한 출력하는 함수를 의미합니다. 반대로 액션은 동일한 입력을 넣어도 출력이 변경될 수 있는 함수 또는 부수효과가 있는 함수를 의미합니다.

(개념) Q. 부수효과란 무엇인가요?

```ts
type User = {
  id: number;
  name: string;
  birthday: string;
};

function createEmailAddress(user: User) {
  log(user);

  return `${name}.${birthday}.gmail.com`;
}

function log(user: User) {
  DB.save("LOG_TABLE", user);
}

const email = createEmailAddress({
  id: 1,
  name: "Min",
  birthday: "1990.01.23",
});
```

(이유) Q. 계산과 액션을 분리해야 좋은 이유는 무엇인가요?

> 계산은 동일한 입력을 주면 동일한 출력이 나오는 코드이므로 예측가능성이 높기 때문에 테스트하기 쉽고 재사용성이 높습니다. 반면에 액션은 동일한 입력을 주더라도 동일한 출력이 보장되지 않아서 예측 가능성이 낮고 그로 인해 함부로 재사용할 수 없고 테스트하기 어렵습니다.

(질문) Q. "테스트하기 쉽다"는 말은 무슨 뜻인가요?

> 무언가를 테스트를 하려면 테스트하려는 상황을 설정하고 설정한 상황에서 명확한 기대값이 존재해야 합니다. 따라서 테스트하기 쉽다는 말은 (1) 상황 설정이 쉽고 (2) 기대값이 명확하다는 뜻입니다.
>
> 예를 들어, 계산은 어떤 입력을 하면 어떤 출력이 나오는지 명확히 정해져 있기 때문에 상황 설정도 쉽고 기대값도 명확하여 테스트하기 쉽습니다. 반면에 액션은 어떤 입력을 넣었을 때 어떤 출력이 나올지 명확하지 않기 때문에 상황 설정도 더 까다롭게 해야 하고 기대값도 명확하지 않아 테스트하기 어렵습니다.
>
> 코드로 보면 다음과 같습니다:
>
> 액션에 대한 테스트입니다:

```ts
type User = {
  id: number;
  name: string;
  birthday: string;
};

/*
sendEmail 함수를 테스트해보자.

Q. 잘 동작하는지 테스트하려면 어떻게 해야 할까?
1. to 유저의 받은 편지함을 열어서 이메일이 잘 도착했는지 확인한다.
2. EmailClient.send() 함수에 인자가 기대한 대로 전달됐는지 확인한다.
*/
function sendEmail(from: User, to: User) {
  EmailClient.send(from, to);
}

// 함수 모킹
EmailClient.send = jest.fn();

const from = {
  id: 1,
  name: "Min",
  birthday: "1990.01.23",
};

const to = {
  id: 2,
  name: "Bboong",
  birthday: "1997.02.28",
};

// 테스트 이름을 정의하세요.
test("sendEmail 함수에 from과 to를 전달하면 from이 to에게 이메일을 전송한다", () => {
  // 테스트할 행동을 실행하세요.
  sendEmail(from, to);

  // 행동에 대한 기대값을 작성하세요.
  expect(EmailClient.send).toBeCalledWith(from, to);
});
```

```ts
function getCurrentTime() {
  return new Date().toISOString();
}

// Date 객체가 고정값으로 출력되도록 모킹
jest.useFakeTimers().setSystemTime(new Date("2023-04-08T08:05:40.224Z"));

// 테스트 이름을 정의하세요.
test("getCurrentTime() 함수를 호출하면 ISO 형식으로 오늘 날짜를 출력한다", () => {
  // 테스트할 행동을 실행하세요.
  // 행동에 대한 기대값을 작성하세요.
  expect(getCurrentTime()).toBe("2023-04-08T08:05:40.224Z");
});
```

> 계산에 대한 테스트입니다:

```ts
function sum(...args) {
  return args.reduce((acc, value) => (acc += value), 0);
}

// 테스트 이름을 정의하세요.
test("sum 함수에 인자를 전달하면 모든 인자의 합을 반환한다", () => {
  // 테스트할 행동을 실행하세요.
  // 행동에 대한 기대값을 작성하세요.
  expect(sum(1, 2, 3, 4, 5)).toBe(15);
});
```

## 2023.04.08.next

팁으로 소액을 기부할 수 있는 옵션을 추가하려고 해. 체크박스로 기부할 것인지 여부를 묻고 동의하면 버튼에 총 금액이 표시돼.

Payment 컴포넌트에 동의 여부를 묻기 위한 체크박스 UI를 추가할거야. 기부에 동의하면 기부 금액을 포함한 총액을, 동의하지 않으면 기존 주문 금액을 총액으로 보여줄거야.

이것을 구현하기 위해서는 기부 동의 여부를 나타내는 상태(agreeToDonate)가 필요하고, 또 동의 여부에 따라서 total과 tip이 달라지기 때문에 이를 계산하는 로직이 필요해.

Payment 컴포넌트에 구현한 새로운 요구사항을 따로 훅으로 분리할 수 있어. 왜 분리해? 어떻게 분리할거니?

뷰 로직과 뷰가 아닌 로직이 섞여 있기 때문이야. agreeToDonate, total, tip은 뷰 로직에서 사용하는 데이터를 구하고 있어. 즉 뷰가 아닌 로직이기 때문에 따로 훅으로 분리할 수 있어. 이렇게 분리했을 때 뭐가 좋은거야?

체크박스 상태, 팁, 총액을 관리하는 일은 useRoundUp 훅의 일이 되었기 때문에 유지보수하기에도 좋고 재사용 측면에서도 용이해졌어. 저 세가지 관련해서 수정할 일이 생기면 useRoundUp을 찾아가면 되니까 편리해.

이제 Payment 컴포넌트는 하위 컴포넌트인 PaymentMethods와 DonationCheckbox로 뷰를 렌더링하는데, 뷰 로직에 사용되는 데이터는 useRoundUp 훅과 usePaymentMethods훅을 호출하는 것이지.

## 📚 함께 읽기

- [velog - [번역] 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기](https://velog.io/@eunbinn/modularizing-react-apps#%EC%83%88%EB%A1%9C%EC%9A%B4-%EA%B5%AC%EC%A1%B0%EC%9D%98-%EC%9D%B4%EC%A0%90%EB%93%A4)
