import React from "react";
import axios from "axios";

const paymentData = {
  agentId: "",
  memberId: "",
  merchantId: "",
  account: "",
  redirectUrl: "",
};

export class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { price: 0, qrcId: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // получить qrcId
    axios
      .post(`/payment/v1/qrc-id-reservation`, {
        quantity: 1,
      })
      .then((res) => {
        this.setState({ qrcId: res.data.qrcIds[0] });
      });

    // регистрация Кассовой ссылки СБП
    axios
      .post(`/payment/v1/cash-register-qrc`, {
        agentId: paymentData.agentId,
        memberId: paymentData.memberId,
        merchantId: paymentData.merchantId,
        account: paymentData.account,
        redirectUrl: paymentData.redirectUrl,
        qrcId: this.state.qrcId,
      })
      .then((res) => {
        this.setState({ qrcId: res.data.qrcIds[0] });
      });
  }

  handleChange(event) {
    this.setState({ price: event.target.value });
    
  }

  handleSubmit(event) {
    console.log("handle only submit")
    // активация Кассовой ссылки СБП
    axios
      .post(`/payment/v1/cash-register-qrc/${this.state.qrcId}/params`, {
        amount: this.state.price * 100,
      }).then((res) => {
        alert("Result:" + res.data.message)
      })
      
    alert("A price was submitted: " + this.state.price);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div class="mb-3">
          <label class="form-label text-dark">
            Сумма
            <input
              class="form-control"
              type="number"
              min="1"
              step="any"
              price={this.state.price}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <button type="submit" class="btn btn-success">
          Сгенерировать
        </button>
      </form>
    );
  }
}
