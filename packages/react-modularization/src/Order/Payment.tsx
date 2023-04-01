import { usePaymentMethods } from "./usePaymentMethods";

/*
Payment 컴포넌트는 한 가지 이상의 일을 하고 있다. 무슨 무슨 일을 하고 있는데?
뷰 로직과 뷰가 아닌 로직. 뷰 로직과 뷰가 아닌 로직이 뭔데?
뷰 로직은 리턴문의 JSX야. 리턴문을 제외하고 주석처리해보자. 그 때 뷰 로직에서 사용하고 있는 데이터를 구하는 로직이 뷰가 아닌 로직이야. 한 가지 이상의 일을 하면 안되는거니?
한 가지 이상의 일을 하면 코드를 이해하기 어려워져. 그래서 뷰 로직과 뷰가 아닌 로직을 분리해줄거야. 어떻게?
paymentMethods를 구하는 코드를 훅으로 분리해줄거야. 보여줘.

이전보다 뭐가 좋아진거야?
Payment 컴포넌트는 paymentMethods를 직접 구하지 않고 훅을 호출해서 가져오니까 뷰를 그리는 로직만 하기 때문에 한 가지 일만 하고 있어.
한 가지 일만 하게 된 건 이해가 됐어. 그게 유지보수하는 측면에서는 왜 좋은건지 예시를 들어줘.
뷰를 수정해야할 때는 Payment 컴포넌트를 수정하면 되고, paymentMethods를 관련해서 수정해야할 때는 usePaymentMethods파일에서 수정하면 되니까 편리해.
예를 들어서, API 호출 관련해서 수정사항이 생기면 usePaymentMethods파일만 수정하면 되니까 편리해. 
*/

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
