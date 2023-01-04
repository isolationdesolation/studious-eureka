import React from "react";
import axios from "axios";

export class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { price: 0, qrcId: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {}

  handleChange(event) {
    this.setState({ price: event.target.value });
  }

  handleSubmit(event) {
    console.log("handle only submit");
    // init
    axios
      .post(`https://securepay.tinkoff.ru/v2/Init`, {
        TerminalKey: "TinkoffBankTest",
        Amount: 140000,
        OrderId: "21050",
        Description: "Подарочная карта на 1400.00 рублей",
        DATA: {
          Phone: "+71234567890",
          Email: "a@test.com",
        },
        Receipt: {
          Email: "a@test.ru",
          Phone: "+79031234567",
          EmailCompany: "b@test.ru",
          Taxation: "osn",
          Items: [
            {
              Name: "Наименование товара 1",
              Price: 10000,
              Quantity: 1.0,
              Amount: 10000,
              PaymentMethod: "full_prepayment",
              PaymentObject: "commodity",
              Tax: "vat10",
              Ean13: "0123456789",
            },
            {
              Name: "Наименование товара 2",
              Price: 20000,
              Quantity: 2.0,
              Amount: 40000,
              PaymentMethod: "prepayment",
              PaymentObject: "service",
              Tax: "vat20",
            },
            {
              Name: "Наименование товара 3",
              Price: 30000,
              Quantity: 3.0,
              Amount: 90000,
              Tax: "vat10",
            },
          ],
        },
      })
      .then((res) => {
        this.setState({ paymentId: res.data.PaymentId });
      });

      const tokenText = 'foo'
      const token = window.crypto.subtle.digest('SHA-256', tokenText)

    // getQr
    axios
      .post(`https://securepay.tinkoff.ru/v2/SbpPayTest`,{
        "PaymentId":"10063",
        "TerminalKey": "1623341225522",
        "Token":token
        })
      .then((res) => {
        alert("Result:" + res);
      });

    // alert("A price was submitted: " + this.state.price);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-dark">
            Сумма
            <input
              className="form-control"
              type="number"
              min="1"
              step="any"
              price={this.state.price}
              onChange={this.handleChange}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-success">
          Сгенерировать
        </button>
      </form>
    );
  }
}
