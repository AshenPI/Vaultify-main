import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import CashierLayout from "../components/CashierLayout";
import "../Resources/items.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

function CartPage() {
  const { cartItems } = useSelector((state) => state.rootReduceer);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity + -1 },
      });
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
    },

    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
          />
        </div>
      ),
    },

    {
      title: "action",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });
    setSubTotal(temp);
  }, [cartItems]);

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      totalAmount: Number(
        subTotal + Number(((subTotal / 100) * 10).toFixed(2))
      ),
      user: JSON.parse(localStorage.getItem("pos-user"))._id,
    };

    axios
      .post("/api/bills/charge-bill", reqObject)
      .then(() => {
        message.success("Bill Charged Successfully");
        localStorage.removeItem("cartItems")
     
        navigate("/bills");
      })
      .catch(() => {
        message.error("Something went wrong");
      });

      dispatch({ type: "emptyCart" });


  };

  const empty = () => {
    message.error("Cart is Empty!")
  }

   const whoIssuedBill = JSON.parse(localStorage.getItem("pos-user")).name
   console.log(whoIssuedBill)

  if (JSON.parse(localStorage.getItem("pos-user")).isAdmin === true) {
    return (
      <DefaultLayout>
        <h3>Cart</h3>
        <Table
          columns={columns}
          dataSource={cartItems}
          bordered
          pagination={false}
        />
        <hr />
        <div className="d-flex justify-content-end flex-coulmn align-items-end">
          <div className="subtotal">
            <h3>
              Sub Total : <b> {subTotal} SAR </b>
            </h3>
          </div>

          <Button type="primary" onClick={() => setBillChargeModal(true)}>
            {" "}
            Charge Bill{" "}
          </Button>
        </div>

        <Modal
          title="Charge Bill"
          open={billChargeModal}
          footer={false}
          onCancel={() => setBillChargeModal(false)}
        >
          <Form layout="vertical" onFinish={cartItems.length !== 0 ? onFinish : empty} >
          <Form.Item name="cashierName" label="Cashier Name" initialValue={whoIssuedBill} >
              {whoIssuedBill}
            </Form.Item>

            <Form.Item   name="customerName" label="Customer Name" >
              <Input  placeholder="Customer name" />
            </Form.Item>

            <Form.Item  name="customerPhoneNumber" label="Phone Number">
              <Input  placeholder="05*********" />
            </Form.Item>

              <Form.Item
              validateStatus="error"
              help="Must choose Payment Mode." 
              rules={[{ required: true }]} required name="paymentMode" label="Payment Mode">
              <Select  >
                <Select.Option value="cash"> Cash </Select.Option>
                <Select.Option value="card"> Card/Mada </Select.Option>
              </Select>
            </Form.Item>

            <div className="charge-bill-amount">
              <h5>
                Subtotal : <b>{subTotal}</b>{" "}
              </h5>
              <h5>
                Tax 15% : <b>{((subTotal / 100) * 15).toFixed(2)}</b>
              </h5>
              <h2>
                Grand Total : <b>{subTotal + (subTotal / 100) * 10}</b>
              </h2>
            </div>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                Generate Bill
              </Button>
            </div>
          </Form>
        </Modal>
      </DefaultLayout>
    );
  } else if (JSON.parse(localStorage.getItem("pos-user")).isAdmin !== true) {
    return (
      <CashierLayout>
        <h3>Cart</h3>
        <Table
          columns={columns}
          dataSource={cartItems}
          bordered
          pagination={false}
        />
        <hr />
        <div className="d-flex justify-content-end flex-coulmn align-items-end">
          <div className="subtotal">
            <h3>
              Sub Total : <b> {subTotal} SAR </b>
            </h3>
          </div>

          <Button type="primary" onClick={() => setBillChargeModal(true)}>
            
            Charge Bill
          </Button>
        </div>

        <Modal
          title="Charge Bill"
          open={billChargeModal}
          footer={false}
          onCancel={() => setBillChargeModal(false)}
        >
          <Form layout="vertical" onFinish={cartItems.length !== 0 ? onFinish : empty}>
          <Form.Item name="cashierName" label="Cashier Name" initialValue={whoIssuedBill} >
              {whoIssuedBill}
            </Form.Item>

            <Form.Item   name="customerName" label="Customer Name" >
              <Input  placeholder="Customer name" />
            </Form.Item>

            <Form.Item   name="customerPhoneNumber" label="Phone Number">
              <Input placeholder="05*********" />
            </Form.Item>

              <Form.Item
              validateStatus="error"
              help="Must choose Payment Mode." 
              rules={[{ required: true }]} required name="paymentMode" label="Payment Mode">
              <Select  >
                <Select.Option value="cash"> Cash </Select.Option>
                <Select.Option value="card"> Card/Mada </Select.Option>
              </Select>
            </Form.Item>

            <div className="charge-bill-amount">
              <h5>
                Subtotal : <b>{subTotal}</b>{" "}
              </h5>
              <h5>
                Tax 15% : <b>{((subTotal / 100) * 15).toFixed(2)}</b>
              </h5>
              <h2>
                Grand Total : <b>{subTotal + (subTotal / 100) * 10}</b>
              </h2>
            </div>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                Generate Bill
              </Button>
            </div>
          </Form>
        </Modal>
      </CashierLayout>
    );
  }
}

export default CartPage;
