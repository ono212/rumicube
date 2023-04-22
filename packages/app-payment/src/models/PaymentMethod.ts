type RemotePaymentMethod = {
  name: string;
};

class PaymentMethod {
  private remotePaymentMethod: RemotePaymentMethod;

  constructor(remotePaymentMethod: RemotePaymentMethod) {
    this.remotePaymentMethod = remotePaymentMethod;
  }

  get provider() {
    return this.remotePaymentMethod.name;
  }

  get label() {
    if (this.provider === 'cash') {
      return 'Pay in cash';
    }

    return `Pay with ${this.provider}`;
  }

  get isDefaultMethod() {
    return this.provider === 'cash';
  }
}

export default PaymentMethod;
