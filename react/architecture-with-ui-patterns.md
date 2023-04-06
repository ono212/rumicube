# 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기 (deep dive)

- [튜토리얼](#튜토리얼)
  - [커스텀 훅을 사용하여 뷰 로직과 뷰가 아닌 로직 분리하기 ⤴️](#커스텀-훅을-사용하여-뷰-로직과-뷰가-아닌-로직-분리하기-️)
  - [도메인 객체를 만들어서 도메인 데이터 객체 로직 분리하기 ⤴️](#도메인-객체를-만들어서-도메인-데이터-객체-로직-분리하기-️)
  - [새로운 요구사항 추가하기: 기부 옵션 추가하기 ⤴️](#새로운-요구사항-추가하기-기부-옵션-추가하기-️)
  - [새로운 요구사항 추가하기: 국가별 화폐 단위에 따라 반올림 로직 변경하기 ⤴️](#새로운-요구사항-추가하기-국가별-화폐-단위에-따라-반올림-로직-변경하기-️)
  - [다형성으로 산탄총 수술 문제 해결하기 ⤴️](#다형성으로-산탄총-수술-문제-해결하기-️)
- [📚 함께 읽기](#-함께-읽기)

(기준) Q. 커스텀 훅에는 어떤 코드가 있어야 하나요? 반대로 어떤 코드는 훅에서 다른 모듈로 분리해야 하나요?

> 커스텀 훅에는 사이드 이펙트와 상태 관리를 위한 코드가 있으면 됩니다. 만약 순수한 계산(pure calculation)에 해당하는 코드가 있다면 해당 로직은 도메인 모듈 같은 다른 곳으로 분리하는 것이 좋습니다.

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #eee; margin-bottom: 20px;">
  <img 
    width="100%" 
    height="100%"
    alt="image" 
    src="https://martinfowler.com/articles/modularizing-react-apps/evolution-4.png" 
    style="background-blend-mode: multiply; background-color: white;">
  <em style="display: block; text-align: center; font-size: 80%; padding: 0; color: #6d6c6c;" aria-label="caption">hook에서 순수한 계산인 도메인 로직이 별도의 모듈로 분리되었다</em>
</div>

## 튜토리얼

(목표) Q. 이번 튜토리얼의 목표는 무엇인가요?

> 아래와 같이 레이어 구조를 가진 프론트엔드 애플리케이션을 만들어보겠습니다:

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #eee; margin-bottom: 20px;">
  <img alt="image" src="https://martinfowler.com/articles/modularizing-react-apps/evolution-5.png" style="background-blend-mode: multiply; background-color: white;">
  <em style="display: block; text-align: center; font-size: 80%; padding: 0; color: #6d6c6c;" aria-label="caption">레이어드 프론트엔드 애플리케이션</em>
</div>

> 리팩토링할 예시 코드와 그려야 할 화면은 다음과 같습니다:

![Payment section](https://martinfowler.com/articles/modularizing-react-apps/payment-methods.png)

```tsx
// src/Payment.tsx
export const Payment = ({ amount }: { amount: number }) => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      if (methods.length > 0) {
        const extended: LocalPaymentMethod[] = methods.map((method) => ({
          provider: method.name,
          label: `Pay with ${method.name}`,
        }));
        extended.push({ provider: "cash", label: "Pay in cash" });
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  return (
    <div>
      <h3>Payment</h3>
      <div>
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
      </div>
      <button>${amount}</button>
    </div>
  );
};
```

> 리팩토링하는 이유는 다음과 같습니다:
>
> - 한 컴포넌트 안에 서로 다른 관심사가 섞여 있어서 읽기 어렵습니다. 만약 각 관심사에 대한 코드가 각각 더 비대해진다면 더욱 읽기 어려워질 것입니다.
>
> 여기서 말하는 서로 다른 관심사란 다음을 말합니다:
>
> - 네트워크 요청을 초기화하기 (`fetch`)
> - (컴포넌트가 보여줄 UI에 맞게) 서버 데이터를 가공하기 (`methods.map`)
> - 서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI 렌더링 하기 (`input[defaultChecked]`)
> - 컴포넌트 자체의 렌더링 로직 작성하기 (`h3: Payment, button: ${amount}`)
>
> 리팩토링 기대효과는 다음과 같습니다:
>
> - (상황) 결제 방법에 대한 요구사항이 추가돼서 컴포넌트 코드를 변경해야 할 수 있습니다. (예시) 네트워크 요청 URL이나 params가 달라질 수도 있고, 서버 데이터의 key나 value에 대한 인터페이스가 바뀔 수도 있고, 서버 데이터에서 준 결제 방법에 대한 UI 렌더링 방식이 달라질 수도 있고, 컴포넌트 자체의 UI 형태가 달라질 수도 있습니다. (문제점) 이때, 새로운 요구사항를 반영하려면 관련된 코드가 어딨는지 찾아야 하고, 찾는 동안 다른 코드도 함께 읽어야 하며, 새로 고친 사항이 다른 코드에 영향을 줄 수 있는지 확인해야 합니다. 즉, 관심사가 섞여 있으면 그만큼 유지보수하기가 어려워집니다. (기대효과) 따라서 관심사가 분리되면 유지보수하기가 더 쉬워지는 기대효과가 있습니다.

### 커스텀 훅을 사용하여 뷰 로직과 뷰가 아닌 로직 분리하기 [⤴️](#잘-알려진-ui-패턴을-사용하여-리액트-애플리케이션-모듈화하기-deep-dive)

(어떻게) Q. 관심사가 섞여 있어서 이를 리팩터링 한다는 건 알겠는데 관심사를 어떤 기준으로 분리해야 할까요?

> 뷰 로직(view logic)과 뷰가 아닌 로직(non-view logic)을 서로 다른 모듈로 분리하면 됩니다. 왜냐하면 일반적으로 뷰 로직(view logic)은 뷰가 아닌 로직(non-view logic)보다 더 자주 변경되기 때문입니다. 뷰 로직에 대한 요구사항이 변경되면 뷰 로직 파일을 변경하고, 뷰가 아닌 로직이 변경되면 뷰가 아닌 로직 파일을 변경할 수 있다면 두 개가 섞여 있을 때보다 유지보수가 쉬워집니다.

(어떻게) Q. 리액트에서 뷰 로직과 뷰가 아닌 로직을 분리하는 방법은 무엇인가요?

> (아이디어) 컴포넌트가 UI를 그리려면 데이터(상태)가 필요합니다. 이때 `상태를 사용해서 UI를 그리는 코드`는 뷰 로직(view logic)이고, `상태를 어떻게 구해야 하는지 작성하는 코드`는 뷰가 아닌 로직(non-view logic)입니다. 따라서 (1) 상태를 구하는 뷰가 아닌(non-view) 로직은 다른 모듈로 분리하고, (2) 컴포넌트는 뷰가 아닌(non-view) 로직을 담당하는 해당 모듈에서 상태를 가져와서 사용하기만 하면 됩니다. 그러면 뷰가 아닌 로직과 뷰 로직을 분리할 수 있습니다. (액션) 리액트에서 할 수 있는 구체적인 방법은 커스텀 훅을 만들어서 상태를 구하는 로직을 커스텀 훅으로 분리하는 것입니다. 커스텀 훅에 `상태를 구하는 뷰가 아닌 로직(non-view logic)`을 모아두고, 컴포넌트는 훅에서 구한 `상태를 가져와서 뷰 로직(view logic)에 사용`하기만 하면 뷰 로직과 뷰가 아닌 로직을 분리할 수 있습니다.
>
> 예시에서 `Payment` 컴포넌트의 리턴문을 보면 UI를 그릴 때 사용하는 상태가 `paymentMethods`라는 것을 알 수 있습니다. 따라서 `paymentMethods` 상태를 구하는 로직은 non-view 로직이므로 컴포넌트 바깥인 커스텀 훅으로 분리합니다:

```tsx
// src/hooks/usePaymentMethods.ts

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      if (methods.length > 0) {
        const extended: LocalPaymentMethod[] = methods.map((method) => ({
          provider: method.name,
          label: `Pay with ${method.name}`,
        }));
        extended.push({ provider: "cash", label: "Pay in cash" });
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
  };
};
```

> 이제 `Payment` 컴포넌트는 `usePaymentMethods` 훅이 구해준 상태를 가져와서 UI를 그리는 데 사용하기만 하면 됩니다:

```tsx
// src/components/Payment.tsx

export const Payment = ({ amount }: { amount: number }) => {
  const { paymentMethods } = usePaymentMethods();

  return (
    <div>
      <h3>Payment</h3>
      <div>
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
      </div>
      <button>${amount}</button>
    </div>
  );
};
```

> (효과) 이제 `paymentMethods` 상태를 구하는 로직이 `Payment` 컴포넌트에서 분리되었습니다. `Payment` 컴포넌트는 `paymentMethods`가 어떻게 구해지는지 신경 쓰지 않아도 됩니다. 덕분에 (해당 데이터를 사용해서 어떻게 UI를 그려야 하는지) 뷰 로직 한 가지에만 집중할 수 있게 되었습니다.

/*
서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI를 렌더링하는 부분을 새로운 컴포넌트로 추출할 수 있어. 어떻게 추출할 수 있는데?

paymentMethods를 map으로 돌리는 부분을 PaymentMethods컴포넌트로 추출하면 돼. 왜 그렇게 따로 추출하는데? 하면 뭐가 좋아?

이렇게 따로 분리하면 PaymentMethods컴포넌트는 순수함수라서 다른 곳에서 재사용하기 쉬워져서 좋아. 또 Payment컴포넌트도 결제 방법이 아닌 제목과 버튼을 렌더링하는 일에만 집중할 수 있어. 

PaymentMethods컴포넌트에서 defaultChecked되어야 하는지 직접 체크하는 로직이 있는데 이 부분도 개선할 수 있어. 왜 개선해야돼? 뭐가 문제야 대체.. (이제 그만해..)

데이터 객체의 속성을 직접 확인하는 로직이 한 곳에 뭉쳐져있는게 아니라 여러 곳에 흩어져있게 되면 수정하기 어려워지기 때문이야. 클래스로 만들어서 관리하게 되면 코드의 변화가 생겨서 수정해야할 때 그 클래스 파일에서 수정하면 되니까 유지보수하기 편해져.

또 usePaymentMethods 훅에서 서버 데이터를 로컬 데이터로 변환하는 부분도 위에서 말한 부분과 함께 클래스로 묶어서 만들 수 있어. 여긴 또 왜..?

왜냐면..훅 내부에서 데이터 객체의 속성에 직접 접근해서 데이터 형태를 변환하고 있기 때문이야.

그래서 PaymentMethod 도메인 클래스를 만들어서 도메인 객체를 관리함으로서 도메인 데이터 관련 로직을 분리할 수 있어. 데이터 속성에 직접 접근해서 확인하는 일이 더 이상 PaymentMethods 컴포넌트의 관심사가 아닌 도메인 객체의 관심사로 분리됐어. usePaymentMethods 훅도 더이상 데이터를 변환하는 로직이 자신이 관심사가 아닌 도메인 객체의 관심사로 분리됐어. 이렇게 분리하면 만약 서버 데이터의 key나 value가 바뀌었을 때 PaymentMethod 클래스에서만 수정하면 되기 때문에 유지보수에 용이해지는 장점이 있어.
*/

(무엇) Q. 이제 무엇을 또 리팩터링해야 하나요?

> 지금까지 분리된 관심사를 다시 한 번 정리해보겠습니다:

```diff
+ 네트워크 요청을 초기화하기 (`fetch`) => `usePaymentMethods`
+ (컴포넌트가 보여줄 UI에 맞게) 서버 데이터를 가공하기 (`methods.map`) => `usePaymentMethods`
  서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI 렌더링 하기 (`input[defaultChecked]`)
  컴포넌트 자체의 렌더링 로직 작성하기 (`h3: Payment, button: ${amount}`)
```

> 서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI 렌더링하는 하는 것은 새로운 하위 컴포넌트의 책임으로 추출할 수 있습니다:

```tsx
// src/components/Payment.tsx

import PaymentMethods from "./PaymentMethods";

const Payment = (/* ... */) => {
  /* ... */

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      <button>${amount}</button>
    </div>
  );
};
```

```tsx
// src/components/PaymentMethods.tsx

const PaymentMethods = ({
  paymentMethods,
}: {
  paymentMethods: LocalPaymentMethod[];
}) => {
  return (
    <>
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
    </>
  );
};
```

> 기대효과:
>
> - `PaymentMethods` 컴포넌트는 순수한 계산 함수(pure function, 리액트 관점에서는 상태를 갖지 않는 Presentational Component)입니다. 따라서 테스트하기도 쉽고 재사용하기도 쉽습니다.
> - 코드가 분리되었기 때문에 `Payment` 컴포넌트는 자체 렌더링 로직(`h3: Payment, button: ${amount}`)에만 집중할 수 있습니다.

> 지금까지 분리된 관심사를 다시 한 번 정리해보겠습니다:

```diff
+ 네트워크 요청을 초기화하기 (`fetch`) => `usePaymentMethods`
+ (컴포넌트가 보여줄 UI에 맞게) 서버 데이터를 가공하기 (`methods.map`) => `usePaymentMethods`
+ 서버 데이터에서 준 결제 방법에 따라 다른 방식으로 UI 렌더링 하기 (`input[defaultChecked]`) => `PaymentMethods`
  컴포넌트 자체의 렌더링 로직 작성하기 (`h3: Payment, button: ${amount}`)
```

> 이제 `Payment` 컴포넌트에는 자체 렌더링 로직 하나만 남았으므로 `Payment` 컴포넌트 입장에서는 모든 관심사가 잘 분리되었다고 볼 수 있습니다.

### 도메인 객체를 만들어서 도메인 데이터 객체 로직 분리하기 [⤴️](#잘-알려진-ui-패턴을-사용하여-리액트-애플리케이션-모듈화하기-deep-dive)

(어떻게) Q. 뷰 로직과 뷰가 아닌 로직으로 분리했는데 이후에도 더 리팩토링할 만한 포인트가 남아있나요?

> `PaymentMethods` 컴포넌트를 보면 결제 방법 input이 defaultChecked 되어야 하는지 체크하는 로직이 있습니다:

```tsx
// src/components/PaymentMethods.tsx

const PaymentMethods = ({
  paymentMethods,
}: {
  paymentMethods: LocalPaymentMethod[];
}) => {
  return (
    <>
      {paymentMethods.map((method) => (
        <label key={method.provider}>
          <input
            type="radio"
            name="payment"
            value={method.provider}
            {/* here */}
            defaultChecked={method.provider === "cash"}
          />
          <span>{method.label}</span>
        </label>
      ))}
    </>
  );
};
```

> (현상) 뷰 로직 안에 데이터 객체의 속성을 직접 확인하는 로직이 있습니다. 뷰 로직 안에 데이터 객체의 속성을 직접 확인하는 코드는 로직의 누수로 간주할 수 있습니다. (리스크) 왜냐하면 동일한 데이터 객체를 다른 뷰에서 사용할 때도 똑같이 객체의 속성을 직접 확인하는 로직이 동반될 가능성이 높기 때문입니다. 즉, 동일한 데이터 객체를 사용하는 곳마다 데이터 객체의 속성을 직접 확인하는 로직이 중복되거나 추가되면, 뷰에서 확인해야 하는 로직이 한 곳에 뭉쳐 있지 않고 여러 곳으로 흩어져서 유지보수하기 어려워집니다.
>
> 다른 곳에도 잠재적인 로직 누수가 있습니다:

```tsx
// src/hooks/usePaymentMethods.ts

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      if (methods.length > 0) {
        // --start
        const extended: LocalPaymentMethod[] = methods.map((method) => ({
          provider: method.name,
          label: `Pay with ${method.name}`,
        }));
        extended.push({ provider: "cash", label: "Pay in cash" });
        // --end
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
  };
};
```

> (현상) 상태를 구하는 `usePaymentMethods()` 훅을 보면 서버 데이터를 로컬 데이터 형태로 변환하고 있습니다. 여기에 있는 데이터 변환(data conversion from server to local) 로직은 위에서 언급했던 `method.provider === "cash"` 로직과 하나의 클래스로 묶을 수 있습니다:

```tsx
// src/models/PaymentMethod.ts

class PaymentMethod {
  private remotePaymentMethod: RemotePaymentMethod;

  constructor(remotePaymentMethod: RemotePaymentMethod) {
    this.remotePaymentMethod = remotePaymentMethod;
  }

  get provider() {
    return this.remotePaymentMethod.name;
  }

  get label() {
    if (this.provider === "cash") {
      return "Pay in cash";
    }

    return `Pay with ${this.provider}`;
  }

  get isDefaultMethod() {
    return this.provider === "cash";
  }
}
```

> 이제 `PaymentMethod` 도메인 클래스를 사용해서 default 현금 결제 방법을 정의할 수 있습니다:

```tsx
const payInCash = new PaymentMethod({ name: "cash" });
```

> 다시 `usePaymentMethods()` 훅으로 돌아가 데이터 변환하는 코드를 `PaymentMethod` 클래스를 사용하여 대체하겠습니다:

```tsx
// src/hooks/usePaymentMethods.ts

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      if (methods.length > 0) {
        // --start
        const extended: LocalPaymentMethod[] = methods.map((method) => new PaymentMethod(method));
        extended.push(new PaymentMethod({ name: "cash" }););
        // --end
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
  };
};
```

> 더 나아가 서버에서 준 결제 방법 데이터를 로컬 데이터로 변환하는 일만 담당하는 `convertPaymentMethods`라는 작은 함수로 추출할 수도 있습니다:

```tsx
// src/hooks/usePaymentMethods.ts

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<LocalPaymentMethod[]>(
    []
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = "https://online-ordering.com/api/payment-methods";

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      setPaymentMethods(convertPaymentMethods(methods));
    };

    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
  };
};

const convertPaymentMethods = (methods: RemotePaymentMethod[]) => {
  if (methods.length === 0) {
    return [];
  }

  const extended: PaymentMethod[] = methods.map((method) => new PaymentMethod(method));
  extended.push(new PaymentMethod({ name: "cash" }););

  return extended;
};
```

> 도메인 객체의 속성에 접근해서 `defaultChecked`를 결정했던 뷰 로직도 `PaymentMethod` 클래스를 사용하여 대체할 수 있습니다:
>
> - props 이름도 `paymentMethods: LocalPaymentMethod[]`에서 도메인 객체를 사용한 `options: PaymentMethod[]`로 바꾸겠습니다.

```tsx
// src/components/PaymentMethods.tsx

const PaymentMethods = ({
  options,
}: {
  options: PaymentMethod[];
}) => {
  return (
    <>
      {paymentMethods.map((method) => (
        <label key={method.provider}>
          <input
            type="radio"
            name="payment"
            value={method.provider}
            {/* here */}
            defaultChecked={method.isDefaultMethod}
          />
          <span>{method.label}</span>
        </label>
      ))}
    </>
  );
};
```

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #eee; margin-bottom: 20px;">
  <img alt="image" src="https://martinfowler.com/articles/modularizing-react-apps/refactoring-1.png" style="background-blend-mode: multiply; background-color: white;">
  <em style="display: block; text-align: center; font-size: 80%; padding: 0; color: #6d6c6c;" aria-label="caption">작은 부분을 조합하는 방식으로 리팩터링된 Payment 컴포넌트 구조</em>
</div>

> 지금 진행한 리팩터링은 "도메인 객체를 만들어서 도메인 데이터 객체 로직 분리"한 것입니다. 이로 인해 달라진 before/after를 비교해보겠습니다:
>
> - (현상) 훅과 뷰에 있던 도메인 객체 로직을 `PaymentMethod` 클래스로 분리했습니다.
> - (before) 서버 데이터를 받아서 뷰에 사용하려면 바로 사용할 수가 없고 데이터 가공이나 데이터 속성에 직접 접근 해야 했습니다. 그래서 데이터 변환 로직이 훅에 있었고 데이터 속성에 직접 접근하는 로직이 뷰에 있었습니다.
> - (after) 데이터 변환 로직과 데이터 속성에 접근하는 로직을 도메인 객체 `PaymentMethod` 클래스를 만들어서 캡슐화했습니다. 따라서 훅에 있던 데이터 변환 로직이 도메인 객체의 관심사로 분리되었고 덕분에 hook에는 네트워크 요청과 상태를 저장하는 관심사만 남았습니다. 또한 뷰에서 데이터 속성에 직접 접근하던 로직 또한 도메인 객체의 관심사로 분리되었고 덕분에 뷰에서 도메인 객체에 직접 접근할 일이 없어졌습니다. 결과적으로 도메인 객체의 로직에 대한 테스트도 쉬워지고 재사용성도 높아졌습니다.

> 현재 파일 구조는 다음과 같습니다:

```
src
├── App.tsx
├── components
│   ├── Payment.tsx
│   └── PaymentMethods.tsx
├── hooks
│   └── usePaymentMethods.ts
├── models
│   └── PaymentMethod.ts
└── types.ts
```

> 그리고 처음에 관심사를 분리하면 유지보수가 더 쉬워진다고 했는데 어떻게 유지보수가 쉬워지는지 보겠습니다:
>
> - 네트워크 요청 URL이나 params가 달라진다 => 훅 파일 `hooks/usePaymentMethods`만 고치면 된다.
> - 서버 데이터의 key나 value에 대한 인터페이스가 바뀐다 => 도메인 객체 `models/PaymentMethod` 클래스만 고치면 된다.
> - 서버 데이터에서 준 결제 방법에 대한 UI 렌더링 방식이 달라진다 => 하위 컴포넌트 `components/PaymentMethods`만 고치면 된다.
> - 컴포넌트 자체의 UI 형태가 달라진다 => 컴포넌트 `components/Payment`만 고치면 된다.

> 함수형 프로그래밍 관점에서도 데이터(data), 계산(calculation)과 액션(action)이 모두 더 작은 단위로 분리된 것을 알 수 있습니다:
>
> - 데이터: `models/PaymentMethod` 클래스
> - 계산: `components/PaymentMethods` 컴포넌트
> - 액션: `hooks/usePaymentMethods` 훅 및 `components/Payment` 컴포넌트
>
> (행동) 액션을 최소한으로 남기고 계산을 잘 추출하면 (기대효과) 계산이 독립적인 모듈로 분리된 만큼 전체 애플리케이션 관점에서 (계산은 외부에 영향을 주지 않으므로) 테스트도 쉽고 재사용도 쉬워집니다.

### 새로운 요구사항 추가하기: 기부 옵션 추가하기 [⤴️](#잘-알려진-ui-패턴을-사용하여-리액트-애플리케이션-모듈화하기-deep-dive)

(목표) Q. 새로운 요구사항을 처리할 때 기대하는 것은 무엇인가요?

> 기존에 결제 화면을 그릴 때 필요한 코드들을 관심사 별로 분리했기 때문에 새로운 요구사항을 와도 전체 코드를 다 살펴볼 필요 없이 분리된 관심사만 고치면 되는 것을 기대합니다.

(무엇) Q. 새로운 요구사항은 무엇인가요?

> 사용자가 결제를 할 때 팁으로 소액을 기부할 수 있는 옵션을 추가합니다. 사용자가 동의할 때만 기부할 수 있도록 기부할 것인지 묻는 체크박스를 보여줍니다. 기부 금액은 (1달러 - 주문금액의 1의 자리 미만 금액)으로 결정합니다. 예를 들어, 주문 금액이 $19.80인 경우 $0.20 달러를 기부할 것인지 묻고, 사용자가 기부에 동의하면 버튼에 총 금액이 표시됩니다:

![](https://martinfowler.com/articles/modularizing-react-apps/round-up.png)

(어떻게) Q. 새로운 요구사항을 처리하려면 어느 코드를 수정해야 하나요?

> 먼저 `Payment` 컴포넌트의 뷰 로직을 다음과 같이 수정해야 합니다:
>
> - (1) 사용자에게 소액을 기부할 것인지 동의 여부를 묻는 체크박스 UI를 추가합니다.
> - (2) 사용자가 기부를 동의하면 기부 금액을 포함해서 총액을 보여줍니다.
> - (3) 사용자가 기부를 동의하지 않으면 기존 주문 금액으로 총액을 보여줍니다.
>
> 그런데 여기 총액에 대한 뷰 로직 (2), (3)을 보면, 총액이라는 데이터를 바로 뷰에서 사용할 수 없고 총액을 구하는 계산(calculation) 로직이 필요합니다. 또한 계산 로직은 사용자의 기부 동의 여부 상태가 필요하므로 새로운 상태 데이터(data)를 선언해야 합니다.

```tsx
// src/components/Payment.tsx

import PaymentMethods from "./PaymentMethods";

const Payment = (/* ... */) => {
  /* ... */

  // (data) 기부 동의 여부를 나타내는 상태 선언
  const [agreeToDonate, setAgreeToDonate] = useState<boolean>(false);

  // (calculation) 기부 동의 여부에 따라 표시할 총액과 팁을 계산하는 로직
  const { total, tip } = useMemo(
    () => ({
      total: agreeToDonate ? Math.floor(amount + 1) : amount,
      tip: parseFloat((Math.floor(amount + 1) - amount).toPrecision(10)),
    }),
    [amount, agreeToDonate]
  );

  /* ... */

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      <div>
        {/* (view) 기부 동의 여부를 묻는 체크박스 UI */}
        <label>
          <input
            type="checkbox"
            onChange={handleChange}
            checked={agreeToDonate}
          />
          {/* (view) 기부 대상 금액 */}
          <p>
            {agreeToDonate
              ? "Thanks for your donation."
              : `I would like to donate $${tip} to charity.`}
          </p>
        </label>
      </div>
      {/* (view) 총액 */}
      <button>${total}</button>
    </div>
  );
};
```

> 새로운 변경사항이 추가되면서 `Payment` 컴포넌트 코드가 뷰 로직과 뷰가 아닌 로직이 다시 섞이게 되었습니다. 뷰 로직과 뷰가 아닌 로직이 불필요하게 섞여 있다면 분리하도록 합니다.
>
> 항상 분리해야 한다는 것은 아닙니다. 다만, (행동) 작고 응집력 있는 컴포넌트를 한데 모아 깔끔하게 정리하면, (기대효과) 전체 동작을 이해하기 위해 여러 코드를 이곳저곳 찾아볼 필요가 없어진다는 장점을 고려하는 것이 중요합니다.

(어떻게) Q. 팁과 총액을 계산하는 로직을 분리하려면 어떻게 해야 하나요?

> 팁과 총액을 계산하는 로직은 뷰 로직에서 사용할 데이터(상태)의 값을 구하는 로직입니다. 즉, 상태를 구하는 로직이므로 훅으로 분리할 수 있습니다:

```tsx
// src/hooks/useRoundUp.ts

export const useRoundUp = (amount: number) => {
  // (data) 기부 동의 여부를 나타내는 상태 선언
  const [agreeToDonate, setAgreeToDonate] = useState<boolean>(false);

  // (calculation) 기부 동의 여부에 따라 표시할 총액과 팁을 계산하는 로직
  const { total, tip } = useMemo(
    () => ({
      total: agreeToDonate ? Math.floor(amount + 1) : amount,
      tip: parseFloat((Math.floor(amount + 1) - amount).toPrecision(10)),
    }),
    [amount, agreeToDonate]
  );

  const updateAgreeToDonate = () => {
    setAgreeToDonate((agreeToDonate) => !agreeToDonate);
  };

  return {
    total,
    tip,
    agreeToDonate,
    updateAgreeToDonate,
  };
};
```

> 이제 `useRoundUp()` 훅을 사용하면 `Payment` 컴포넌트에 있던 기부 팁과 총액을 계산하는 로직을 대체할 수 있습니다:

```tsx
// src/components/Payment.tsx

import PaymentMethods from "./PaymentMethods";
import { useRoundUp } from "../hooks/useRoundUp";

const Payment = ({ amount }: { amount: number }) => {
  const { paymentMethods } = usePaymentMethods();

  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(amount);

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      <div>
        {/* (view) 기부 동의 여부를 묻는 체크박스 UI */}
        <label>
          <input
            type="checkbox"
            onChange={updateAgreeToDonate}
            checked={agreeToDonate}
          />
          {/* (view) 기부 대상 금액 */}
          <p>
            {agreeToDonate
              ? "Thanks for your donation."
              : `I would like to donate $${tip} to charity.`}
          </p>
        </label>
      </div>
      {/* (view) 총액 */}
      <button>${total}</button>
    </div>
  );
};
```

> 메시지 포매팅 부분도 헬퍼 함수 `formatCheckBoxLabel`로 추출하여 `Payment` 컴포넌트 코드를 간소화할 수 있습니다:

```tsx
// src/components/Payment.tsx

const Payment = ({ amount }: { amount: number }) => {
  const { paymentMethods } = usePaymentMethods();

  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(amount);

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      <div>
        {/* (view) 기부 동의 여부를 묻는 체크박스 UI */}
        <label>
          <input
            type="checkbox"
            onChange={updateAgreeToDonate}
            checked={agreeToDonate}
          />
          {/* (view) 기부 대상 금액 */}
          <p>{formatCheckboxLabel(agreeToDonate, tip)}</p>
        </label>
      </div>
      {/* (view) 총액 */}
      <button>${total}</button>
    </div>
  );
};

const formatCheckboxLabel = (agreeToDonate: boolean, tip: number) => {
  return agreeToDonate
    ? "Thanks for your donation."
    : `I would like to donate $${tip} to charity.`;
};
```

(의미) Q. `useRoundUp` 훅은 상태(`agreeToDonate`)를 관리하고, 상태와 연관된 값(`tip`, `total`)을 계산하며, 상태를 업데이트하는 함수(`updateAgreeToDonate`)를 사용처에 제공합니다. 상태와 관련된 로직이 이렇게 한 곳에 응집된다는 것은 어떤 의미를 가지고 있나요?

> 이제 팁과 총액에 대한 상태는 모두 `useRoundUp` 훅에서 관리됩니다. `useRoundUp` 훅은 체크박스 변경 이벤트와 같이 UI에서 이벤트가 발생할 때마다 상태를 변경합니다. 즉, 훅은 일종의 `뷰 뒤의 상태 머신`(a state machine behind a view)이라고 생각할 수 있습니다. 이벤트가 상태 머신으로 전송되면 상태 머신은 상태를 새로운 상태로 갱신하고, 새로운 상태의 갱신은 뷰의 리렌더링을 트리거합니다.

(의미) Q. 상태 관리를 컴포넌트로부터 분리해서 컴포넌트를 프레젠테이션 함수(presentational function)으로 만드는 것은 이전에 `usePaymentMethods` 훅에서도 반복했듯이 하나의 패턴으로 보입니다. 이 패턴은 어떤 이점이 있나요?

> 리액트의 훅을 사용하면 상태 관리 로직을 하나의 모듈로 분리할 수 있기 때문에 여러 뷰 컴포넌트에서 재사용할 수 있는 장점이 있습니다. 하지만 재사용이 용이해진다는 장점뿐만 아니라 컴포넌트의 관심사를 분리한다는 측면에서도 장점이 있습니다.

(적용) Q. 기부 동의 여부 체크박스도 하위 컴포넌트로 분리할 수 있지 않을까요?

> 맞습니다. `components/PaymentMethods`처럼 하위 컴포넌트로 분리할 수 있습니다:

```tsx
// src/components/DonationCheckbox.tsx

const DonationCheckbox = ({
  onChange,
  checked,
  content,
}: DonationCheckboxProps) => {
  return (
    <div>
      <label>
        <input type="checkbox" onChange={onChange} checked={checked} />
        <p>{content}</p>
      </label>
    </div>
  );
};
```

```tsx
// src/components/Payment.tsx

const Payment = ({ amount }: { amount: number }) => {
  const { paymentMethods } = usePaymentMethods();

  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(amount);

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      {/* (view) 기부 동의 여부를 묻는 체크박스 UI */}
      <DonationCheckbox
        onChange={updateAgreeToDonate}
        checked={agreeToDonate}
        content={formatCheckboxLabel(agreeToDonate, tip)}
      />
      {/* (view) 총액 */}
      <button>${total}</button>
    </div>
  );
};

const formatCheckboxLabel = (agreeToDonate: boolean, tip: number) => {
  return agreeToDonate
    ? "Thanks for your donation."
    : `I would like to donate $${tip} to charity.`;
};
```

> 지금까지의 코드 구조를 보면 다음과 같습니다:
>
> - `Payment` 컴포넌트는 뷰 로직을 담당하는 하위 컴포넌트 `<PaymentMethods>`와 `<DonationCheckbox>`를 렌더링합니다.
> - `Payment` 컴포넌트는 뷰 로직에 필요한 상태를 관리하는 훅 `useRoundUp()`과 `usePaymentMethods()`를 호출합니다.
> - 훅 `usePaymentMethods()`는 도메인 클래스 `PaymentMethod`의 도움을 받아 뷰에 필요한 상태를 구합니다.

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #eee; margin-bottom: 20px;">
  <img alt="image" src="https://martinfowler.com/articles/modularizing-react-apps/refactoring-2.png" style="background-blend-mode: multiply; background-color: white;">
  <em style="display: block; text-align: center; font-size: 80%; padding: 0; color: #6d6c6c;" aria-label="caption">현재 코드 구조</em>
</div>

### 새로운 요구사항 추가하기: 국가별 화폐 단위에 따라 반올림 로직 변경하기 [⤴️](#잘-알려진-ui-패턴을-사용하여-리액트-애플리케이션-모듈화하기-deep-dive)

(무엇) Q. 새로운 요구사항은 무엇인가요?

> 글로벌 서비스에 기부 옵션이 적용되면서 국가별 화폐에 따른 기부 금액 계산 로직을 변경해야 합니다. 예를 들어, 일본 시장에서 0.1엔은 기부금으로 너무 작기 때문에 일본 통화의 경우 100엔으로 반올림해야 합니다. 덴마크의 경우 10의 단위로 반올림해야 합니다.

(어떻게) Q. 어떻게 리팩토링 해야 하나요?

> `Payment` 컴포넌트에 국가 코드 `countryCode`를 prop으로 전달하도록 합니다:

```tsx
// 예시

<Payment amount={3312} countryCode="JP" />
```

> 기부 금액과 총액을 계산하는 로직이 일본 화폐를 분기 처리해야 하므로 `useRoundUp()` 훅도 함께 변경합니다:

```tsx
// src/hooks/useRoundUp.ts

export const useRoundUp = (amount: number, countryCode: string) => {
  /* ... */

  const { total, tip } = useMemo(
    () => ({
      total: agreeToDonate
        ? countryCode === "JP"
          ? Math.floor(amount / 100) * 100 + 100
          : Math.floor(amount + 1)
        : amount,
      // tip도 동일하게 분기 처리가 필요합니다
      /* ... */
    }),
    [amount, agreeToDonate]
  );

  const updateAgreeToDonate = () => {
    setAgreeToDonate((agreeToDonate) => !agreeToDonate);
  };

  return {
    total,
    tip,
    agreeToDonate,
    updateAgreeToDonate,
  };
};
```

> 금액에 대한 통화 기호를 표시할 때도 일본 화폐를 분기 처리 해야 하므로 `Payment` 컴포넌트의 뷰(`button: ${total}`)와 `formatCheckBoxLabel`도 함께 변경합니다:

```tsx
// src/components/Payment.tsx

const Payment = ({ amount }: { amount: number }) => {
  const { paymentMethods } = usePaymentMethods();

  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(amount);

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods paymentMethods={paymentMethods} />
      {/* (view) 기부 동의 여부를 묻는 체크박스 UI */}
      <DonationCheckbox
        onChange={updateAgreeToDonate}
        checked={agreeToDonate}
        content={formatCheckboxLabel(agreeToDonate, tip)}
      />
      {/* (view) 총액 */}
      <button>
        {countryCode === "JP" ? "¥" : "$"}
        {total}
      </button>
    </div>
  );
};
```

```tsx
// src/utils.ts

export const formatCheckboxLabel = (
  agreeToDonate: boolean,
  tip: number,
  countryCode: string
) => {
  const currencySign = countryCode === "JP" ? "¥" : "$";

  return agreeToDonate
    ? "Thanks for your donation."
    : `I would like to donate ${currencySign}${tip} to charity.`;
};
```

> 아직 덴마크 화폐를 추가하지도 않았고 다른 화폐도 추가해야 할 수도 있는데 그때마다 변경이 너무 많이 일어나고 있습니다.

(무엇) Q. 이렇게 하나를 변경할 때마다 여러 모듈을 건드려야 하는 문제를 뭐라고 하나요?

> 산탄총 수술(shotgun surgery) 문제라고 합니다. 만약 테스트가 불충분한 상태라면 산탄총 수술을 해야 할 때마다 여러 곳을 일일이 확인하는 것이 어려워 실수를 저지르기 쉽습니다.
>
> 아래 그림에서 같은 색으로 표시된 선은 여러 파일을 가로지르는 국가 코드 분기 처리 로직을 의미합니다. 국가 코드 처리는 뷰에서도 작업해야 하고, 훅에서도 작업해야 합니다:

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #eee; margin-bottom: 20px;">
  <img alt="image" src="https://martinfowler.com/articles/modularizing-react-apps/shotgun-surgery.png" style="background-blend-mode: multiply; background-color: white;">
  <em style="display: block; text-align: center; font-size: 80%; padding: 0; color: #6d6c6c;" aria-label="caption">새로운 국가 코드를 추가할 때마다 뷰를 담당하는 모듈과 훅을 담당하는 모듈을 모두 건드려야 합니다.</em>
</div>

(어떻게) Q. 산탄총 수술 문제를 해결하는 방법은 무엇인가요?

> 분기가 여러 곳에 흩어져 있는 산탄총 수술 문제를 해결하는 한 가지 가능한 해결책은 다형성을 이용해서 분기 처리를 대체하는 것입니다.

### 다형성으로 산탄총 수술 문제 해결하기 [⤴️](#잘-알려진-ui-패턴을-사용하여-리액트-애플리케이션-모듈화하기-deep-dive)

(어떻게) Q. 산탄총 수술 문제를 다형성으로 해결한다고 했는데 이게 무슨 말인가요?

> 우선 다형성이 무엇인지 이해해봅시다. 다형성(polymorphism)은 객체 지향 프로그래밍에서 서로 다른 객체들이 동일한 책임을 공유한다는 것을 의미합니다. 쉽게 말하면 서로 다른 타입의 객체들이 동일한 메시지에 대해 각자의 메서드를 이용해서 메시지를 처리할 수 있다는 것입니다. [[객체 지향의 사실과 오해]](https://velog.io/@jwkim/the-essence-of-object-orientation-ch-05-563w5ch7#:~:text=%EB%A9%94%EC%84%9C%EB%93%9C%EB%A5%BC%20%EA%B2%B0%EC%A0%95%ED%95%98%EA%B3%A0%20%EC%84%A0%ED%83%9D%ED%95%9C%EB%8B%A4.-,%EB%8B%A4%ED%98%95%EC%84%B1,-%EC%84%9C%EB%A1%9C%20%EB%8B%A4%EB%A5%B8%20%EA%B0%9D%EC%B2%B4%EB%93%A4%EC%9D%B4)
>
> 다형성이 해결하는 문제 중 하나가 "각기 다른 클래스들이 비슷한 기능을 수행하되, 그 구현 방식이 상이한 경우"입니다. 국가별 화폐 단위에 따라 (1) 통화 기호 값이 달라져야 하고 (2) 반올림 로직이 달라져야 하는 문제가 이와 같은 문제입니다. 현재 클라이언트 코드에서는 국가 코드로 어떤 값이 전달되는지에 따라 그 값을 일일이 확인해서 통화 기호 값을 다르게 분기 처리하고, 반올림 로직을 다르게 분기처리하고 있습니다.
>
> 그런데 만약 클라이언트 코드에서 국가 코드로 어떤 값이 들어왔는지 일일이 확인하는 대신에 어떤 객체를 받아서 통화 기호 값을 반환하는 메서드를 호출하고, 반올림 알고리즘 메서드를 호출하면 어떨까요? 다뤄야 하는 국가의 개수가 여러 개 늘어나거나 국가별 통화 기호 또는 반올림 알고리즘의 구현 방식이 특정 국가별로 중구난방으로 달라진다 하더라도 클라이언트에서는 변경할 내용이 없게 됩니다.
>
> 이렇게 서로 다른 객체들이 동일한 메시지(통화 기호, 반올림 알고리즘)에 대해 각자의 메서드를 이용해서 메시지를 처리할 수 있다는 것이 다형성입니다.
>
> 그리고 이런 다형성을 이용하는 디자인 패턴이 바로 전략 패턴입니다. 전략 패턴은 유사한 동작을 하는 알고리즘 집합을 만들고, 이들 알고리즘을 하나의 추상적인 인터페이스로 묶어서 상호 교환 가능하게 만드는 패턴(=서로 다른 타입의 객체들이 동일한 메시지에 대해 각자의 메서드를 이용해서 메시지를 처리하는 것)이기 때문입니다.

<details markdown="1">
<summary><strong>ChatGPT: 디자인 패턴 중에서 전략 패턴에 대해서 아주 쉽게 설명합니다</strong></summary>

전략 패턴은 유사한 동작을 하는 알고리즘의 집합을 만들고, 이들 알고리즘을 하나의 추상적인 인터페이스로 묶어서 상호 교환 가능하게 만드는 패턴입니다.

간단한 예시로는, 여러분이 알고리즘에 따라 다르게 동작하는 프로그램을 작성하고 있다고 가정해봅시다. 예를 들어, 정렬 알고리즘을 사용해 데이터를 정렬해야 하는데, 선택할 수 있는 여러 가지 알고리즘이 있습니다. 이때, 전략 패턴을 사용하면, 각각의 정렬 알고리즘을 하나의 인터페이스로 묶어서, 프로그램의 다른 부분과 분리된 캡슐화된 형태로 구현할 수 있습니다.

전략 패턴을 구현하는 방법은 크게 세 가지 단계로 나눌 수 있습니다.

먼저, 알고리즘을 구현할 수 있는 추상 인터페이스를 만듭니다. 이 인터페이스는 모든 알고리즘 클래스가 구현해야 하는 메서드들을 정의합니다.

다음으로, 구체적인 알고리즘 클래스를 만듭니다. 이 클래스들은 추상 인터페이스를 구현하며, 서로 다른 알고리즘을 구현합니다.

마지막으로, 전략을 사용하는 클라이언트 코드에서 추상 인터페이스를 사용합니다. 이를 통해, 클라이언트 코드에서는 실제로 사용할 알고리즘 클래스가 어떤 것인지 신경쓰지 않아도 됩니다. 대신에, 실행 시간에 전략을 선택하고, 그에 따른 결과를 받을 수 있습니다.

전략 패턴을 사용하면 알고리즘의 유연성과 재사용성을 높일 수 있으며, 알고리즘을 독립적으로 캡슐화하여, 코드 유지 보수와 확장성을 개선할 수 있습니다.

</details>

<details markdown="1">
<summary><strong>코드 예시</strong></summary>

```ts
interface SortingStrategy {
  sort(data: number[]): number[];
}

class QuickSort implements SortingStrategy {
  sort(data: number[]): number[] {
    // Implementation of quicksort algorithm
    return data.sort((a, b) => a - b);
  }
}

class MergeSort implements SortingStrategy {
  sort(data: number[]): number[] {
    // Implementation of mergesort algorithm
    return data.sort((a, b) => a - b);
  }
}

class SortingClient {
  private strategy: SortingStrategy;

  setStrategy(strategy: SortingStrategy): void {
    this.strategy = strategy;
  }

  doSorting(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// Usage
const sortingClient = new SortingClient();

// Use quicksort algorithm
sortingClient.setStrategy(new QuickSort());
const sortedData1 = sortingClient.doSorting([5, 1, 4, 2, 3]); // [1, 2, 3, 4, 5]

// Use mergesort algorithm
sortingClient.setStrategy(new MergeSort());
const sortedData2 = sortingClient.doSorting([5, 1, 4, 2, 3]); // [1, 2, 3, 4, 5]
```

</details>

(어떻게) Q. 다형성으로 현재 겪는 산탄총 수술 문제를 해결하려면 어떻게 해야 하나요?

> - 국가마다 통화 기호 값을 반환하는 메서드 `getCurrencySign`을 퍼블릭 인터페이스로 추출합니다.
> - 국가마다 반올림 알고리즘이 다르므로 `getRoundUpAmount`와 `getTip`을 인터페이스로 가져옵니다.

```tsx
export interface PaymentStrategy {
  getRoundUpAmount(amount: number): number;

  getTip(amount: number): number;
}
```

> 전략 인터페이스(strategy interface)의 구현 예시(호주 화폐 결제 전략)는 아래와 같습니다:

```tsx
// 호주 화폐 결제 전략 (Australian Payment Strategy)
export class PaymentStrategyAU implements PaymentStrategy {
  get currencySign(): string {
    return "$";
  }

  getRoundUpAmount(amount: number): number {
    return Math.floor(amount + 1);
  }

  getTip(amount: number): number {
    return parseFloat((this.getRoundUpAmount(amount) - amount).toPrecision(10));
  }
}

// 일본 화폐 결제 전략 (Japanese Payment Strategy)
export class PaymentStrategyJP implements PaymentStrategy {
  get currencySign(): string {
    return "¥";
  }

  getRoundUpAmount(amount: number): number {
    return Math.floor(amount / 100 + 1) * 100;
  }

  getTip(amount: number): number {
    return parseFloat((this.getRoundUpAmount(amount) - amount).toPrecision(10));
  }
}
```

> 각 국가별로 서브클래스를 만들고 각 서브클래스에는 국가별 반올림 로직이 있을 수 있습니다. 하지만 자바스크립트에서 함수는 일급 시민이므로 반올림 알고리즘을 전략의 구현체에 전달하면 서브클래스를 만들지 않아도 됩니다. 또한 인터페이스 구현이 하나뿐이므로 인라인 클래스를 사용해서 단일 구현 인터페이스로 줄일 수 있습니다.

```ts
// src/models/CountryPayment.ts

export class CountryPayment {
  private readonly _currencySign: string;
  private readonly algorithm: RoundUpStrategy;

  public constructor(currencySign: string, roundUpAlgorithm: RoundUpStrategy) {
    this._currencySign = currencySign;
    this.algorithm = roundUpAlgorithm;
  }

  get currencySign(): string {
    return this._currencySign;
  }

  getRoundUpAmount(amount: number): number {
    return this.algorithm(amount);
  }

  getTip(amount: number): number {
    return calculateTipFor(this.getRoundUpAmount.bind(this))(amount);
  }
}
```

> 이제 클라이언트 코드인 훅 `useRoundUp()`과 컴포넌트 `Payment`는 단일 클래스 `PaymentStrategy`에만 의존할 수 있습니다:

```tsx
// src/hooks/useRoundUp.ts

export const useRoundUp = (amount: number, strategy: PaymentStrategy) => {
  const [agreeToDonate, setAgreeToDonate] = useState<boolean>(false);

  const { total, tip } = useMemo(
    () => ({
      total: agreeToDonate ? strategy.getRoundUpAmount(amount) : amount,
      tip: strategy.getTip(amount),
    }),
    [agreeToDonate, amount, strategy]
  );

  const updateAgreeToDonate = () => {
    setAgreeToDonate((agreeToDonate) => !agreeToDonate);
  };

  return {
    total,
    tip,
    agreeToDonate,
    updateAgreeToDonate,
  };
};
```

```tsx
// src/components/Payment.tsx

export const Payment = ({
  amount,
  strategy = new PaymentStrategy("$", roundUpToNearestInteger),
}: {
  amount: number;
  strategy?: PaymentStrategy;
}) => {
  const { paymentMethods } = usePaymentMethods();

  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(
    amount,
    strategy
  );

  return (
    <div>
      <h3>Payment</h3>
      <PaymentMethods options={paymentMethods} />
      <DonationCheckbox
        onChange={updateAgreeToDonate}
        checked={agreeToDonate}
        content={formatCheckboxLabel(agreeToDonate, tip, strategy)}
      />
      <button>{formatButtonLabel(strategy, total)}</button>
    </div>
  );
};
```

```tsx
// src/utils.ts

export const formatCheckboxLabel = (
  agreeToDonate: boolean,
  tip: number,
  strategy: CountryPayment
) => {
  return agreeToDonate
    ? "Thanks for your donation."
    : `I would like to donate ${strategy.currencySign}${tip} to charity.`;
};
```

Resume: 디자인 좀 더 발전시키기: 네트워크 클라이언트 추출

## 📚 함께 읽기

- [eunbinn - [번역] 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기](https://velog.io/@eunbinn/modularizing-react-apps?utm_source=substack&utm_medium=email)
- [react/hooks.md](hooks.md#hooks)
- [architecture/layered-vs-clean-vs-hexagonal.md](../architecture/layered-vs-clean-vs-hexagonal.md#layered-architecture-vs-clean-architecutre-vs-hexagonal-architecture)
- [Refactoring Guru - 전략 패턴](https://refactoring.guru/ko/design-patterns/strategy)
