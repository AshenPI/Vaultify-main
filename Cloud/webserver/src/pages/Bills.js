import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import CashierLayout from "../components/CashierLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Table, message } from "antd";
import { useReactToPrint } from "react-to-print";
function Bills() {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibilty] =
    useState(false);
  const dispatch = useDispatch();

  const [selectedBill, setSelectedBill] = useState(null);
  const [cashierDataa, setCashierDataa] = useState([]);

  const newdata = [];
  const cashiersA = [];
  const temp = [];

  const getallCashiers = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/cashiers/get-all-cashiers")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;

        data.map((datas) => {
          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            cashiersA.push(datas._id);
          }
        });

        setCashierDataa(cashiersA);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  //const aaa = JSON.parse(localStorage.getItem("pos-gaga"));

  const getAllBills = () => {
    dispatch({ type: "showLoading" });

    axios
      .get("/api/bills/get-all-bills")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;
        console.log(data);
        data.map((datas) => {
          if (JSON.parse(localStorage.getItem("pos-gaga")) !== null) {
            JSON.parse(localStorage.getItem("pos-gaga")).map((a) => {
              if (datas.user === a._id) {
                newdata.push(datas);
              }
            });
          }

          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            newdata.push(datas);
          }
        });
        newdata.reverse();
        setBillsData(newdata);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  const deleteItem = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/bills/delete-bill", { _id: record._id })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("bill deleted successfully");
        getAllBills();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("something went wrong");

        console.log(error);
      });
  };

  useEffect(() => {
    getallCashiers();
    getAllBills();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Cashier Name",
      dataIndex: "cashierName",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
    },
    {
      title: "Tax",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibilty(true);
            }}
          />

          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
        </div>
      ),
    },
  ];

  const columnsCashier = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Cashier Name",
      dataIndex: "cashierName",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
    },
    {
      title: "Tax",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibilty(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
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
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: "Total fare",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.price}</b>
        </div>
      ),
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (JSON.parse(localStorage.getItem("pos-user")).isAdmin === true) {
    return (
      <DefaultLayout>
        <div className="d-flex justify-content-between">
          <h3>Bills</h3>
        </div>
        <Table columns={columns} dataSource={billsData} bordered />

        {printBillModalVisibility && (
          <Modal
            onCancel={() => {
              setPrintBillModalVisibilty(false);
            }}
            open={printBillModalVisibility}
            title="Bill Details"
            footer={false}
            width={800}
          >
            <div className="bill-model p-3" ref={componentRef}>
              <div className="d-flex justify-content-between bill-header pb-2">
                <div>
                  <h1>
                    <b>Vaultify</b>
                  </h1>
                </div>
                <div>
                  <p>Riyadh</p>
                  <p>Imamu</p>
                  <p>9989649278</p>
                </div>
              </div>
              <div className="bill-customer-details my-2">
                <p>
                  <b>Customer Name</b> : {selectedBill.customerName}
                </p>
                <p>
                  <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
                </p>
                <p>
                  <b>Date</b> :{" "}
                  {selectedBill.createdAt.toString().substring(0, 10)}
                </p>
                <p>
                  <b>Cashier Name</b> : {selectedBill.cashierName}
                </p>
              </div>
              <Table
                dataSource={selectedBill.cartItems}
                columns={cartcolumns}
                pagination={false}
              />

              <div className="dotted-border">
                <p>
                  <b>SUB TOTAL</b> : {selectedBill.subTotal}
                </p>
                <p>
                  <b>Tax</b> : {selectedBill.tax}
                </p>
              </div>

              <div>
                <h2>
                  <b>GRAND TOTAL : {selectedBill.totalAmount}</b>
                </h2>
              </div>
              <div className="dotted-border"></div>

              <div className="text-center">
                <p>Thanks</p>
                <p>Visit Again </p>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Button type="primary" onClick={handlePrint}>
                Print Bill
              </Button>
            </div>
          </Modal>
        )}
      </DefaultLayout>
    );
  } else if (JSON.parse(localStorage.getItem("pos-user")).isAdmin !== true) {
    return (
      <CashierLayout>
        <div className="d-flex justify-content-between">
          <h3>Bills</h3>
        </div>
        <Table columns={columnsCashier} dataSource={billsData} bordered />

        {printBillModalVisibility && (
          <Modal
            onCancel={() => {
              setPrintBillModalVisibilty(false);
            }}
            open={printBillModalVisibility}
            title="Bill Details"
            footer={false}
            width={800}
          >
            <div className="bill-model p-3" ref={componentRef}>
              <div className="d-flex justify-content-between bill-header pb-2">
                <div>
                  <h1>
                    <b>Vaultify</b>
                  </h1>
                </div>
                <div>
                  <p>Riyadh</p>
                  <p>Imamu</p>
                  <p>9989649278</p>
                </div>
              </div>
              <div className="bill-customer-details my-2">
                <p>
                  <b>Customer Name</b> : {selectedBill.customerName}
                </p>
                <p>
                  <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
                </p>
                <p>
                  <b>Date</b> :{" "}
                  {selectedBill.createdAt.toString().substring(0, 10)}
                </p>
                <p>
                  <b>Cashier Name</b> : {selectedBill.cashierName}
                </p>
              </div>
              <Table
                dataSource={selectedBill.cartItems}
                columns={cartcolumns}
                pagination={false}
              />

              <div className="dotted-border">
                <p>
                  <b>SUB TOTAL</b> : {selectedBill.subTotal}
                </p>
                <p>
                  <b>Tax</b> : {selectedBill.tax}
                </p>
              </div>

              <div>
                <h2>
                  <b>GRAND TOTAL : {selectedBill.totalAmount}</b>
                </h2>
              </div>
              <div className="dotted-border"></div>

              <div className="text-center">
                <p>Thanks</p>
                <p>Visit Again </p>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Button type="primary" onClick={handlePrint}>
                Print Bill
              </Button>
            </div>
          </Modal>
        )}
      </CashierLayout>
    );
  }
}

export default Bills;
