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

Q. 초기화가 무엇인가요?

## 📚 함께 읽기

- [velog - [번역] 잘 알려진 UI 패턴을 사용하여 리액트 애플리케이션 모듈화하기](https://velog.io/@eunbinn/modularizing-react-apps#%EC%83%88%EB%A1%9C%EC%9A%B4-%EA%B5%AC%EC%A1%B0%EC%9D%98-%EC%9D%B4%EC%A0%90%EB%93%A4)
