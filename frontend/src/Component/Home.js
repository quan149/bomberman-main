import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import NavbarPage from "./NavbarPage";
import StatisProductsOfFactory from "../Statistics/StatisProductsOfFactory";
import { useLocation } from "react-router-dom";
import App from "../App";
import StatisProductsOfShop from "../Statistics/StatisProductsOfShop";
import StatisMotorbike from "../Statistics/StatisMotorbike";

const hasWindow = typeof window !== 'undefined';
const width = hasWindow ? window.innerWidth : null;

function Home() {
  const {state} = useLocation();
  console.log(JSON.parse(localStorage.getItem("user")).user)
  let role =  JSON.parse(localStorage.getItem("user")).user.role.id;
  console.log(role)
  return (
    <div>
      <NavbarPage user = {state}/>
      {(role === 3) ? <StatisProductsOfFactory user = {state}/> : null}
      {(role === 2) ? <StatisProductsOfShop user = {state}/> : null}
      {(role === 1 || role === 4) ? <StatisMotorbike />:null}
    </div>
  );
}

export default Home;
