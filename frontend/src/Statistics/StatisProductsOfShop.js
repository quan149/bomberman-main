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
import { useLocation } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisProductsOfShop(props) {
  let user = props.user;
  let id = JSON.parse(localStorage.getItem("user")).user.quarter.id;
  console.log(id);
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataStatisProduct, setDataStatisProduct] = useState([]);
  var dataProduct = [];
  var labelList = [];

  useEffect(() => {
    axios
      .get(
        "http://localhost:8080/api/v1/order/statistics/shop/" +
          id +
          "/permonth/2022/"
      )
      .then((res) => {
        const products = res.data;
        setDataStatisProduct(products);
      });
  }, []);

  for (let i = 0; i < dataStatisProduct.length; i++) {
    dataProduct.push(dataStatisProduct[i].count);
    labelList.push(dataStatisProduct[i].month);
  }
  console.log(dataProduct);

  const data = {
    labels: labelList,
    datasets: [
      {
        label: "Số lượng sản phẩm bán ra",
        data: dataProduct,
        maxBarThickness: 80,
        backgroundColor: "rgba(255, 60, 60, 0.5)",
      },
    ],
  };

  const dataQuarter = {
    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
    datasets: [
      {
        label: "Số lượng sản phẩm bán ra",
        data: [
          dataProduct[0] + dataProduct[1] + dataProduct[2],
          dataProduct[3] + dataProduct[4] + dataProduct[5],
          dataProduct[6] + dataProduct[7] + dataProduct[8],
          dataProduct[9] + dataProduct[10] + dataProduct[11]
        ],
        maxBarThickness: 80,
        backgroundColor: "rgba(255, 60, 60, 0.5)",
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
      <div className="mx-auto" style={{ width: "90%", height: "80%" }}>
        <h5 className="text-center font-weight-bold pt-3 pb-1">
          SỐ LƯỢNG SẢN PHẨM BÁN RA THEO TỪNG THÁNG
        </h5>
        <Bar
          data={data}
          options={options}
          className="mx-auto"
          style={{ width: "70%", height: "80%" }}
        />
        <hr/>
        <h5 className="text-center font-weight-bold pt-3 pb-1">
          SỐ LƯỢNG SẢN PHẨM BÁN RA THEO TỪNG QUÝ
        </h5>
        <Bar
          data={dataQuarter}
          options={options}
          className="mx-auto"
          style={{ width: "70%", height: "80%" }}
        />
      </div>
    </div>
  );
}
