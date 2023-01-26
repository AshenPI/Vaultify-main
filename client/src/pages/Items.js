import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import Resizer from "react-image-file-resizer";


function Items() {
  const [itemsData, setItemsData] = useState([]);
  const [imageText, setImageText] = useState({ image: "" });
  const [editText, setEditText] = useState({ image: "" });

  const [addEditModalVisabilty, setAddEditModalVisabilty] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const dispatch = useDispatch();
  const newdata = [];
  const getallItems = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/items/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;
        console.log(response.data);
        if (
          JSON.parse(localStorage.getItem("pos-user"))._id === response.data._id
        ) {
          setItemsData(response.data);
        }

        data.map((datas) => {
          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            // console.log(datas)
            newdata.push(datas);
          }
        });

        setItemsData(newdata);
        
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });

        console.log(error);
      });
  };

  const deleteItem = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/items/delete-item", { itemId: record._id })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("item deleted successfully");
        getallItems();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("something went wrong");

        console.log(error);
      });
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
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {

              setEditText({image :record.image});

              console.log(record);
              setEditingItem({
    "_id": record._id,
    "user": record.user ,
    "name": record.name,
    "image": editText.image,
    "price": record.price,
    "itemId": record.itemId
});
              
              setAddEditModalVisabilty(true);
            }}
          />

          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
        </div>
      ),
    },
  ];

console.log(editingItem);
  useEffect(() => {
    getallItems();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if (editingItem == null) {
      axios
        .post("/api/items/add-item", {
          name: values.name,
          price: values.price,
          image: imageText.image,
          user: JSON.parse(localStorage.getItem("pos-user"))._id,
        })
        .then((response) => {
          

          dispatch({ type: "hideLoading" });
          message.success("Item added successfully");
          setAddEditModalVisabilty(false);
          getallItems();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");

          console.log(error);
        });
    } else {
      axios
        .post("/api/items/edit-item", {
          name: values.name,
          price: values.price,
          image: editText.image,
          itemId: editingItem._id,
        })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success("Item Edited successfully");
          setEditingItem(null);
          setAddEditModalVisabilty(false);
          getallItems();
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");

          console.log(error);
        });
    }
  };

  const fileChangedHandler = (event) =>  {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            setImageText({ image: uri });
            setEditText({image :uri});

          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
        <Button
          type="primary"
          onClick={() => setAddEditModalVisabilty(true)}
          set
        >
          Add an Item
        </Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered></Table>

      {addEditModalVisabilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisabilty(false);
          }}
          open={addEditModalVisabilty}
          title={`${editingItem !== null ? "Edit item" : "Add new item"}`}
          footer={false}
        >
          <Form
            initialValues={editingItem}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name="name" label="Name">
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name="price" label="Price">
              <Input placeholder="Price" />
            </Form.Item>

            <Form.Item name="image" label="Image">
            <Input hidden type="text" value={imageText.image} />
            <Input  type="file" placeholder="image url" onChange={fileChangedHandler}/>

            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default Items;
