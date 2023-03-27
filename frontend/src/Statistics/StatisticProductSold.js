import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import NavbarPage from "../Component/NavbarPage";

function StatisticProductSold(props) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  let quarter_id = JSON.parse(localStorage.getItem("user")).user.quarter.id
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState();

  var textFind;
  console.log(props.quarter_id);
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const rowEvent = {
    onClick: (e, row, rowIndex) => {
      setDataModel(row);
      console.log(row);
      toggleTrueFalse();
    },
  };

  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };

  const getDatafromAPI = async () => {
    const data = await axios
      .get("http://localhost:8080/api/v1/productline/")
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDatafromAPI();
  }, []);

  const column = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "brand",
      text: "Thương hiệu",
    },
    {
      dataField: "model",
      text: "Mẫu xe",
    },
    {
      dataField: "capacity",
      text: "Dung tích (cc)",
    },
    {
      dataField: "fuel",
      text: "Thể tích nhiên liệu (lít)",
    },
    {
      dataField: "warrantyPeriod",
      text: "Thời gian bảo hành (tháng)",
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    style: { backgroundColor: "#c8e6c9" },
  };

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {" "}
      Hiển thị từ hàng {from} đến {to} trong tổng số {size} kết quả
    </span>
  );

  const options = {
    paginationSize: 3,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: "<<",
    prePageText: "<",
    nextPageText: ">",
    lastPageText: ">>",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "30",
        value: 30,
      },
      {
        text: "Tất cả",
        value: dataList.length,
      },
    ],
  };

  const StaticsProduct = () => {
    setYear(textFind);
    console.log(textFind);
  };

  const ModalContent = () => {
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Thông tin chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Sản phẩm</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Thương hiệu</InputGroup.Text>
            <Form.Control defaultValue={dataModel.brand} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mẫu xe</InputGroup.Text>
            <Form.Control defaultValue={dataModel.model} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Dung tích thiết kế
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.capacity} disabled />
            <InputGroup.Text id="basic-addon1">cc</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thể tích nhiên liệu tối đa
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.fuel} disabled />
            <InputGroup.Text id="basic-addon1">lít</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều dài</InputGroup.Text>
            <Form.Control defaultValue={dataModel.length} disabled />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều rộng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.width} disabled />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều cao</InputGroup.Text>
            <Form.Control defaultValue={dataModel.height} disabled />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thời gian bảo hành
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.warrantyPeriod} disabled />
            <InputGroup.Text id="basic-addon1">tháng</InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <NavbarPage />
      <div>
        <div className="ft-5 fs-5">
          <p className="me-5 ms-5 mt-2 font-weight-bold">
            THỐNG KẾ SẢN PHẨM BÁN RA THEO NĂM
          </p>
        </div>
        <div className={"input group mb-3 me-5 ms-5"}>
          <p>Năm thống kê</p>
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              textFind = e.target.value;
            }}
          />
          <Button className="mt-3" onClick={StaticsProduct}>
            Xác nhận
          </Button>
        </div>
        <div className="me-5 ms-5">
          <BootstrapTable
            keyField="id"
            data={dataList}
            columns={column}
            pagination={paginationFactory(options)}
            rowEvents={rowEvent}
            striped
            hover
            condensed
          />
          {show ? <ModalContent /> : null}
        </div>
      </div>
    </div>
  );
}

export default StatisticProductSold;
