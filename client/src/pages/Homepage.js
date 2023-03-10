import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import BarChart from "../components/BarChart";
import DoughnutCart from "../components/DoughnutCart";
import { Col, Row } from "antd";
import Bills from "./Bills";

function Homepage() {
  const [datac, setData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();

  // const dispatch = useDispatch();

  const [cashierDataa, setCashierDataa] = useState([]);

  const newdata = [];
  const cashiersA = [];

  const getallCashiers = () => {
    // dispatch({ type: "showLoading" });
    axios
      .get("/api/cashiers/get-all-cashiers")
      .then((response) => {
        // dispatch({ type: "hideLoading" });
        const data = response.data;

        data.map((datas) => {
          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            cashiersA.push(datas);
          }
        });

        setCashierDataa(cashiersA);

      })
      .catch((error) => {
        // dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  localStorage.setItem("pos-gaga", JSON.stringify(cashierDataa));


  const getAllBills = () => {
    //dispatch({ type: "showLoading" });

    axios
      .get("/api/bills/get-all-bills")
      .then((response) => {
        //  dispatch({ type: "hideLoading" });
        const data = response.data;

        data.map((datas) => {
          JSON.parse(localStorage.getItem("pos-gaga")).map((a) => {
            if (datas.user === a._id) {
              newdata.push(datas);
            }
          });

          if (datas.user === JSON.parse(localStorage.getItem("pos-user"))._id) {
            newdata.push(datas);
          }
        });
        newdata.reverse();
        setData(newdata);
      })
      .catch((error) => {
        // dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  console.log(datac);

  useEffect(() => {
    getallCashiers();
    getAllBills();
  }, []);


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////          MOST ORDERD CHART /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////          highest Cashier order /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///  highest Cashier order ///

  let cc = 0;
  const cashierNo_Orders = [];
  cashierDataa.map((d) =>
    cashierNo_Orders.push({
      namo: d.name,
      noOrders: 0,
    })
  );

  for (let i = 0; i < cashierNo_Orders.length; i++) {
    for (let j = 0; j < datac.length; j++) {
      if (cashierNo_Orders[i].namo === datac[j].cashierName) {
        cashierNo_Orders[i].noOrders += 1;
      }
    }
  }
  ///  highest Cashier order ///


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////         highest Cashier order  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const objLoaded = [];
  let numItemsInStore = [];

  datac.map((d) =>
    d.cartItems.map((j) =>
      objLoaded.push({
        name: j.name,
        quantity: j.quantity,
      })
    )
  );

  datac.map((d) =>
    d.cartItems.map((j) =>
      numItemsInStore.push({
        name: j.name,
        quantity: 0,
      })
    )
  );

  for (let i = 0; i < numItemsInStore.length; i++) {
    for (let j = i + 1; j < numItemsInStore.length; j++) {
      if (numItemsInStore[i].name === numItemsInStore[j].name) {
        numItemsInStore[j] = 0;
      }
    }
  }

  for (let i = 0; i < numItemsInStore.length; i++) {
    if (numItemsInStore[i] !== 0) {
      for (let j = 0; j < objLoaded.length; j++) {
        if (numItemsInStore[i].name === objLoaded[j].name) {
          numItemsInStore[i].quantity += objLoaded[j].quantity;
        }
      }
    }
  }

  const gg = [];

  for (let i = 0; i < numItemsInStore.length; i++) {
    if (numItemsInStore[i] !== 0) {
      gg.push(numItemsInStore[i]);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////          MOST ORDERD CHART /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////TotalSalesBeforeTax///////////
  let arrTotalSalesBeforeTax = [0];
  datac.map((j) => arrTotalSalesBeforeTax.push(j.totalAmount));
  ////////TotalSalesBeforeTax//////////

  //////////TotalSalesAfterTax/////////
  let arrTotalSalesAfterTax = [0];
  datac.map((j) => arrTotalSalesAfterTax.push(j.subTotal));
  ///////TotalSalesAfterTax//////////

  ////////avgOrderPrice///////////////////////////////////
  let avgSum = arrTotalSalesBeforeTax.reduce((a, b) => a + b);
  let avgOrderPrice = avgSum / (arrTotalSalesBeforeTax.length - 1);
  ////////avgOrderPrice///////////////////////////////////

  /////////////leastOrderdItemName//////////////////////
  let leastOrderdItemName = "";

  for (let i = 0; i < gg.length; i++) {
    if (gg[i].quantity === Math.min(...gg.map((d) => d.quantity))) {
      leastOrderdItemName = gg[i].name;
      break;
    }
  }
  /////////////leastOrderdItemName//////////////////////

  /////////////nonOrderdItems//////////////////////
  const allBillItems = objLoaded;
  const allItemsNames = itemsData.map((d) => d.name);
  const jjj = [];

  for (let i = 0; i < allItemsNames.length; i++) {
    if (allItemsNames[i] !== allBillItems[i].name) {
      jjj.push(allItemsNames[i]);
    }
  }
  /////////////nonOrderdItems//////////////////////

  //////////////Total ITEMS sold///////////////
  const calctotalItemsSold = [0];
  for (let i = 0; i < gg.length; i++) {
    calctotalItemsSold.push(gg[i].quantity);
  }
  const totalItemsSold = calctotalItemsSold.reduce((a, b) => a + b);
  //////////////Total ITEMS sold///////////////

  if (JSON.parse(localStorage.getItem("pos-user")).isAdmin === true) {
    return (
      <DefaultLayout>
        <h3>Welcome {JSON.parse(localStorage.getItem("pos-user")).name}</h3>{" "}
        <br />
        <Row gutter={20}>
          <Col span={12} xs={24} lg={12} md={12} sm={12}>
            <BarChart
              chartData={{
                labels: gg.map((d) => d.name),
                datasets: [
                  {
                    label: "Most Orderd Items",
                    data: gg.map((d) => d.quantity),
                    backgroundColor: ["#46B6B8"],
                    borderColor: "black",
                    borderWidth: 0.2,
                  },
                ],
              }}
            />
          </Col>

          <Col span={12} xs={24} lg={12} md={12} sm={12}>
            <DoughnutCart
              chartData={{
                labels: cashierNo_Orders.reverse().map((d) => d.namo),
                datasets: [
                  {
                    label: "No of sales per Cashier ",
                    data: cashierNo_Orders.map((d) => d.noOrders),
                    backgroundColor: ["Green"],
                    borderColor: "black",
                    borderWidth: 0.2,
                  },
                ],
              }}
            />
          </Col>
        </Row>
        <hr />
        <hr />
        <Row gutter={20}>
          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Total sales: <br /> Before tax{" "}
              </h4>
              <h4 className="price">
                {" "}
                <h3 style={{ color: "#46B6B8" }}>
                  {" "}
                  <b>
                    {" "}
                    {arrTotalSalesBeforeTax
                      .reduce((a, b) => a + b)
                      .toFixed(2)}{" "}
                  </b>{" "}
                  SAR
                </h3>{" "}
              </h4>
            </div>
          </Col>

          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Total sales: <br /> After tax{" "}
              </h4>
              <h4 className="price">
                {" "}
                <h3 style={{ color: "#46B6B8" }}>
                  {" "}
                  <b>
                    {" "}
                    {arrTotalSalesAfterTax
                      .reduce((a, b) => a + b)
                      .toFixed(2)}{" "}
                  </b>{" "}
                  SAR
                </h3>
              </h4>
            </div>
          </Col>

          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Average : <br /> Order price{" "}
              </h4>
              <h4 className="price">
                {" "}
                {
                  <h3 style={{ color: "#46B6B8" }}>
                    {" "}
                    <b> {avgOrderPrice.toFixed(2)}</b> SAR{" "}
                  </h3>
                }
              </h4>
            </div>
          </Col>

          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Least Orderd Item <br />
              </h4>
              <h4 className="price">
                {" "}
                {
                  <h3 style={{ color: "#46B6B8" }}>
                    {" "}
                    <b> {leastOrderdItemName}</b>{" "}
                  </h3>
                }
              </h4>
            </div>
          </Col>

          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Total number of <br />
                Orders :
              </h4>
              <h4 className="price">
                {" "}
                {
                  <h3 style={{ color: "#46B6B8" }}>
                    {" "}
                    <b> {datac.length}</b>{" "}
                  </h3>
                }
              </h4>
            </div>
          </Col>

          <Col span={8} xs={24} lg={8} md={12} sm={12}>
            <div className="item">
              <h4 className="name">
                Total number of <br />
                Items sold :
              </h4>
              <h4 className="price">
                {" "}
                {
                  <h3 style={{ color: "#46B6B8" }}>
                    {" "}
                    <b> {totalItemsSold}</b>{" "}
                  </h3>
                }
              </h4>
            </div>
          </Col>
        </Row>
      </DefaultLayout>
    );
  }
}

export default Homepage;