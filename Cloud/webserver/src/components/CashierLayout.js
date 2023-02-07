import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  FormOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../Resources/Layout.css";
import { Layout, Menu, theme, Image } from "antd";
import { useSelector } from "react-redux";
import img from "../vaultify.png";

const { Header, Sider, Content } = Layout;

const CashierLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReduceer);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
          items={[
            {
              key: "/orders",
              icon: <FormOutlined />,
              label: <Link to="/orders">Order</Link>,
            },

            {
              key: "/cart",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/cart">Cart</Link>,
            },

            {
              key: "/bills",
              icon: <CopyOutlined />,
              label: <Link to="/bills">Bills</Link>,
            },

            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: (
                <Link
                  to="/login"
                  onClick={() => {
                    //localStorage.removeItem("pos-user");
                    localStorage.clear()
                    navigate("/login");
                  }}
                >
                  Logout{" "}
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            margin: "0 10px",
            display: "flex",
            alignItems: "center",
            borderRadius: "5px",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}{" "}
          <Image
            width={200}
            height={62}
            borderRadius={5}
            src={img}
            preview={false}
         
          />
          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/cart")}
          >
            <b>
              <p className="mt-3 mr-2">{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          style={{
            margin: "10px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default CashierLayout;
