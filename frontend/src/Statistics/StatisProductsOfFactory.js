import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BorderWidth } from "react-bootstrap-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisProductsOfFactory(props) {
  let id =  JSON.parse(localStorage.getItem("user")).user.quarter.id;
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataStatisProduct, setDataStatisProduct] = useState([]);
  const [dataStatisProductofShop, setDataStatisProductofShop] = useState([]);
  var dataProduct = [];
  var dataProductofShop = [];
  var dataErrorProduct = [];
  var dataErrorProductofShop = [];
  var labelList = [];
  var labelListofShop = [];

  useEffect(() => {
    axios
      .get(
        "http://localhost:8080/api/v1/product/statistics/factory/errorperline/" +
          id
      )
      .then((res) => {
        const products = res.data;
        setDataStatisProduct(products);
      });
    axios
      .get(
        "http://localhost:8080/api/v1/product/statistics/factory/errorpershop/" +
          id
      )
      .then((res) => {
        const products = res.data;
        setDataStatisProductofShop(products);
      });
  }, []);

  for (let i = 0; i < dataStatisProduct.length; i++) {
    dataProduct.push(dataStatisProduct[i].total);
    dataErrorProduct.push(dataStatisProduct[i].count);
    labelList.push(dataStatisProduct[i].line);
  }
  for (let i = 0; i < dataStatisProductofShop.length; i++) {
    dataProductofShop.push(dataStatisProductofShop[i].total);
    dataErrorProductofShop.push(dataStatisProductofShop[i].count);
    labelListofShop.push(dataStatisProductofShop[i].line);
  }

  const data = {
    labels: labelList,
    datasets: [
      {
        label: "Tổng số lượng sản phẩm",
        data: dataProduct,
        maxBarThickness: 80,
        backgroundColor: "rgba(152, 249, 162, 0.7)",
      },
      {
        label: "Số lượng sản phẩm lỗi",
        data: dataErrorProduct,
        maxBarThickness: 80,
        backgroundColor: "rgba(255, 60, 60, 0.7)",
      },
    ],
  };

  const dataofShop = {
    labels: labelListofShop,
    datasets: [
      {
        label: "Tổng số lượng sản phẩm",
        data: dataProductofShop,
        maxBarThickness: 80,
        backgroundColor: "rgba(152, 249, 162, 0.7)",
      },
      {
        label: "Số lượng sản phẩm lỗi",
        data: dataErrorProductofShop,
        maxBarThickness: 80,
        backgroundColor: "rgba(255, 60, 60, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  return (
    <div>
      <div>
        <h5 className="text-center font-weight-bold pt-3 pb-1">
          TỈ LỆ SẢN PHẨM BỊ LỖI THEO TỪNG DÒNG SẢN PHẨM
        </h5>
        <Bar
          data={data}
          options={options}
          className="mx-auto"
          style={{ width: "60%", height: "80%" }}
        />
      </div>
      <hr />
      <div>
        <h5 className="text-center font-weight-bold pt-3 pb-1">
          TỈ LỆ SẢN PHẨM BỊ LỖI THEO TỪNG CƠ SỞ PHÂN PHỐI
        </h5>
        <Bar
          data={dataofShop}
          options={options}
          className="mx-auto"
          style={{ width: "60%", height: "0%" }}
        />
      </div>
    </div>
  );
}
