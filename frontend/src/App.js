import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Component/Home";
import ProductLine from "./Products/ProductLine";
import Customer from "./Customer/Customer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products from "./Products/Products";
import Orders from "./Orders/Orders";
import Shop from "./Quater/Shop";
import Factory from "./Quater/Factory";
import WarrantyCenter from "./Quater/WarrantyCenter";
import User from "./User/user";
import WarrantyInfo from "./Products/WarrantyInfo";
import Callback from "./Products/Callback";
import StatisticProductSold from "./Statistics/StatisticProductSold";
import Login from "./Component/Login";
import { useEffect, useState } from "react";

export default function App() {
  const [showProductLine, setshowProductLine] = useState(true);
  const [showCustomers, setshowCustomers] = useState(true);
  const [showProducts, setshowProducts] = useState(true);
  const [showOrders, setshowOrders] = useState(true);
  const [showShops, setshowShops] = useState(true);
  const [showFactorys, setshowFactorys] = useState(true);
  const [showWarrantyInfo, setshowWarrantyInfo] = useState(true);
  const [showWarrantyCenter, setshowWarrantyCenter] = useState(true);
  const [showUsers, setshowUsers] = useState(true);
  const [showCallbackInfo, setCallbackInfo] = useState(true);

  const role_acc = JSON.parse(localStorage.getItem("user")).role;

  useEffect(() => {
    if (role_acc[0] === "ROLE_ADMIN") {
      setshowCustomers(false);
      setshowWarrantyInfo(false);
      setCallbackInfo(false);
      setshowOrders(false);
    } else if (role_acc[0] === "ROLE_SHOP") {
      setshowUsers(false);
    } else if (role_acc[0] === "ROLE_FACTORY") {
      setshowUsers(false);
      setshowWarrantyCenter(false);
      setshowWarrantyInfo(false);
    } else if (role_acc[0] === "ROLE_WARRANTYCENTER") {
      setshowUsers(false);
      setshowFactorys(false);
      setshowOrders(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {showProductLine ? (
          <Route path="/productlines" element={<ProductLine />} />
        ) : null}
        {showCustomers ? (
          <Route path="/customers" element={<Customer />} />
        ) : null}
        {showProducts ? (
          <Route path="/products" element={<Products />} />
        ) : null}
        {showOrders ? <Route path="/orders" element={<Orders />} /> : null}
        {showShops ? <Route path="/shops" element={<Shop />} /> : null}
        {showFactorys ? <Route path="/factorys" element={<Factory />} /> : null}
        {showWarrantyCenter ? (
          <Route path="/warrantycenters" element={<WarrantyCenter />} />
        ) : null}
        {showUsers ? <Route path="/users" element={<User />} /> : null}
        {showWarrantyInfo ? (
          <Route path="/warrantyinfo" element={<WarrantyInfo />} />
        ) : null}
        {showCallbackInfo ? (
          <Route path="/callbackinfo" element={<Callback />} />
        ) : null}
      </Routes>
    </BrowserRouter>
  );
}
