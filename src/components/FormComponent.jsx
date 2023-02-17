import React from "react";
import axios from "axios";
import * as shajs from "sha.js";
import { TERMINAL_KEY, ORDER_ID, PASSWORD } from "../constants/const";
import { api, getQr, getState, init } from "../constants/urls";


const sendStatusRequest = async (paymentId) => {
  const tokenText = PASSWORD + paymentId + TERMINAL_KEY;
  const token = shajs("sha256").update(tokenText).digest("hex");
  const resp = await axios.post(`${api}/${getState}`, {
    TerminalKey: TERMINAL_KEY,
    PaymentId: paymentId,
    Token: token,
  });
  console.log( resp.data);
  alert(resp.data.Status)
};

export class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { price: 0 , paymentId: ''};

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
      .post(`${api}/${init}`, {
        TerminalKey: TERMINAL_KEY,
        Amount: this.state.price * 100,
        OrderId: ORDER_ID,
      })
      .then((res) => {
        const tokenText = PASSWORD + res.data.PaymentId + TERMINAL_KEY;
        const token = shajs("sha256").update(tokenText).digest("hex");
        this.setState({ paymentId: res.data.PaymentId});

        // getQr
        axios
          .post(`${api}/${getQr}`, {
            TerminalKey: TERMINAL_KEY,
            PaymentId: res.data.PaymentId,
            Token: token,
          })
          .then((res) => {
            alert("Result:" + res.data.Data);

          });
      });

    event.preventDefault();
  }

  render() {
    return (
      <>
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
          Сгенерировать ссылку
        </button>
       
      </form>
       <button  className="btn btn-primary" onClick={() => sendStatusRequest(this.state.paymentId)}>
       узнать статус вот этой оплаты
      </button>
      </>
    );
  }
}
