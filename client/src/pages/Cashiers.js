import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import CashierLayout from "../components/CashierLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";

function Cashiers() {
  const [cashierDate, setCashierDate] = useState([]);
  const [addEditModalVisabilty, setAddEditModalVisabilty] = useState(false);
  const [editingCashier, setEditingCashiers] = useState(null);
  const dispatch = useDispatch();

  const getallCashiers = () => {
    const newdata = [];
    dispatch({ type: "showLoading" });
    axios
      .get("/api/cashiers/get-all-cashiers")
      .then((response) => {
        dispatch({ type: "hideLoading" });

        const data = response.data;

        data.map((datas) => {
          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            newdata.push(datas);
          }
        });
        setCashierDate(newdata);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });

        console.log(error);
      });
  };

  const deleteCashier = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/cashiers/delete-cashier", { cashierId: record._id })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("cashier deleted successfully");
        getallCashiers();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("something went wrong");

        console.log(error);
      });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },

    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },

    // {
    //   title: "Password",
    //   dataIndex: "password",
    // },
    {
      title: "added in ",
      dataIndex: "name",
      render: (id, record) => (
        <b>{record.createdAt.toString().substring(0, 10)}</b>
      ),
    },
    {
      title: "added at ",
      dataIndex: "name",
      render: (id, record) => (
        <b>{record.createdAt.toString().substring(11, 16)}</b>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {
              setEditingCashiers(record);
              setAddEditModalVisabilty(true);
            }}
          />

          <DeleteOutlined
            className="mx-2"
            onClick={() => deleteCashier(record)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getallCashiers();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if (editingCashier == null) {
      axios
        .post("/api/cashiers/add-cashier", {
         ...values,
          user: JSON.parse(localStorage.getItem("pos-user"))._id
        })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success("cashiers added successfully");
          setAddEditModalVisabilty(false);
          getallCashiers();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");

          console.log(error);
        });
    } else {
      axios
        .put("/api/cashiers/edit-cashier", {
          ...values,
          cashierId: editingCashier._id,
        })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success("cashier Edited successfully");
          setEditingCashiers(null);
          setAddEditModalVisabilty(false);
          getallCashiers();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");

          console.log(error);
        });
    }
  };

  //regex expression Minimum eight characters, at least one letter and one number
  if (JSON.parse(localStorage.getItem("pos-user")).isAdmin === true) {
    return (
      <DefaultLayout>
        <div className="d-flex justify-content-between">
          <h3>Cashier</h3>
          <Button
            type="primary"
            onClick={() => setAddEditModalVisabilty(true)}
            
          >
            Add new employee
          </Button>
        </div>
        <Table columns={columns} dataSource={cashierDate} bordered></Table>

        {addEditModalVisabilty && (
          <Modal
            onCancel={() => {
              setEditingCashiers(null);
              setAddEditModalVisabilty(false);
            }}
            open={addEditModalVisabilty}
            title={`${
              editingCashier !== null
                ? "Edit employee info"
                : "Add new employee"
            }`}
            footer={false}
          >
            <Form
              // initialValues={editingCashier}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item name="name" label="Name">
                <Input
                  defaultValue={`${
                    editingCashier !== null ? editingCashier.name : ""
                  }`}
                  placeholder="Name"
                />
              </Form.Item>

              <Form.Item name="userName" label="username">
                <Input
                  placeholder="username"
                  defaultValue={`${
                    editingCashier !== null ? editingCashier.userName : ""
                  }`}
                />
              </Form.Item>

              <Form.Item name="password" label="password">
                <Input
                  minLength="8"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  placeholder="password"
                    
                />
              
              </Form.Item>
              <p>
                  Minimum eight characters, at least one letter and one number
                </p>   

                
              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary">
                  {`${
                    editingCashier !== null
                      ? "Edit employee info"
                      : "Add new employee"
                  }`}
                </Button>
              </div>
            </Form>
          </Modal>
        )}
      </DefaultLayout>
    );
  } else if (JSON.parse(localStorage.getItem("pos-user")).isAdmin !== true) {
    <CashierLayout>
      return (
      <DefaultLayout>
        <div className="d-flex justify-content-between">
          <h3>Cashier</h3>
          <Button
            type="primary"
            onClick={() => setAddEditModalVisabilty(true)}
            set
          >
            Add new employee
          </Button>
        </div>
        <Table columns={columns} dataSource={cashierDate} bordered></Table>

        {addEditModalVisabilty && (
          <Modal
            onCancel={() => {
              setEditingCashiers(null);
              setAddEditModalVisabilty(false);
            }}
            open={addEditModalVisabilty}
            title={`${
              editingCashier !== null
                ? "Edit employee info"
                : "Add new employee"
            }`}
            footer={false}
          >
            <Form
              initialValues={editingCashier}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item name="name" label="Name">
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item name="userName" label="usrename">
                <Input placeholder="usrename" />
              </Form.Item>

              <Form.Item name="password" label="password">
                <Input
                  minLength="8"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  placeholder="password"
                />
                <p>
                  Minimum eight characters, at least one letter and one number
                </p>
              </Form.Item>

              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary">
                  {`${
                    editingCashier !== null
                      ? "Edit employee info"
                      : "Add new employee"
                  }`}
                </Button>
              </div>
            </Form>
          </Modal>
        )}
      </DefaultLayout>
      )
    </CashierLayout>
  }
}

export default Cashiers;
