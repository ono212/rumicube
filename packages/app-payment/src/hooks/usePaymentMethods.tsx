import { useState, useEffect } from 'react';
import PaymentMethod from '../models/PaymentMethod';

type RemotePaymentMethod = any;

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const url = 'https://online-ordering.com/api/payment-methods';

      const response = await fetch(url);
      const methods: RemotePaymentMethod[] = await response.json();

      if (methods.length > 0) {
        const extended: PaymentMethod[] = methods.map(
          (method) => new PaymentMethod(method)
        );

        extended.push(new PaymentMethod({ name: 'cash' }));
        setPaymentMethods(extended);
      } else {
        setPaymentMethods([]);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { paymentMethods };
};

export default usePaymentMethods;
