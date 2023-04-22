import PaymentMethod from '../models/PaymentMethod';

type PaymentMethodsProps = {
  paymentMethods: PaymentMethod[];
};

const PaymentMethods = ({ paymentMethods }: PaymentMethodsProps) => {
  return (
    <>
      {paymentMethods.map((method) => (
        <label key={method.provider}>
          <input
            type="radio"
            name="payment"
            value={method.provider}
            defaultChecked={method.isDefaultMethod}
          />
          <span>{method.label}</span>
        </label>
      ))}
    </>
  );
};

export default PaymentMethods;
