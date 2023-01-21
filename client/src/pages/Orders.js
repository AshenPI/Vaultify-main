import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import CashierLayout from "../components/CashierLayout";
import axios from "axios";
import { Col, Row } from "antd";
import Item from "../components/Item";
import "../Resources/items.css";
import { useDispatch } from "react-redux";

function Orders() {
  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();
  const newdata = []
 

  
  const getallItems = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/items/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data
        console.log(data)
        data.map((datas)  => {
          if(datas.user  ===  JSON.parse(localStorage.getItem("pos-user"))._id){
            newdata.push(datas)
          }
          else if(datas.user  ===  JSON.parse(localStorage.getItem("pos-user")).user){
            
          newdata.push(datas)
          }
        })
        setItemsData(newdata);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });

        console.log(error);
      });
  };

  useEffect(() => {
    getallItems();
  }, []);

  if(JSON.parse(localStorage.getItem('pos-user')).isAdmin === true){
  return (
    
    <DefaultLayout>


      <Row gutter={20}>
        {itemsData.map((item) => {
          return (
            <Col xs={24} lg={6} md={12} sm={6}>
              <Item item={item} />
            </Col>
          );
        })}
      </Row>
    </DefaultLayout>
  )
}
else if (JSON.parse(localStorage.getItem('pos-user')).isAdmin !== true){

  return (
    
    <CashierLayout>


      <Row gutter={20}>
        {itemsData.map((item) => {
          return (
            <Col xs={24} lg={6} md={12} sm={6}>
              <Item item={item} />
            </Col>
          );
        })}
      </Row>
    </CashierLayout>
  )

}
}
export default Orders;
