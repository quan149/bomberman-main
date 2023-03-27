import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";
import { useLocation } from "react-router-dom";
import Login from "../Component/Login";
import sessionstorage from "sessionstorage";

function ProductLine() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const state = useLocation()
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [value, setValue] = useState("");
  const [tableFilter, setTableFilter] = useState([]);
  console.log(JSON.parse(localStorage.getItem("user")).jwt)
  var data = {
    id: dataModel.id,
    brand: dataModel.brand,
    model: dataModel.model,
    capacity: dataModel.capacity,
    fuel: dataModel.fuel,
    length: dataModel.length,
    width: dataModel.width,
    height: dataModel.height,
    warrantyPeriod: dataModel.warrantyPeriod,
  };
  var dataAdd = {
    id: Number(dataModel.id) + 1,
    brand: "",
    model: "",
    capacity: "",
    fuel: "",
    length: "",
    width: "",
    height: "",
    warrantyPeriod: "",
  };

  console.log(sessionstorage.getItem("user"))
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleAddClose = () => {
    setShowAdd(false);
  };

  const handleShow = () => setShow(true);

  const handleShowAdd = () => {
    setShowAdd(true);
    setDataModel(dataList[dataList.length - 1]);
  };
  const checkedProductLine = (data) => {
    let checked = true;
    for (let i = 0; i < dataList.length; i++) {
      if (
        data.brand != null &&
        data.capacity != null &&
        data.fuel != null &&
        data.height != null &&
        data.width != null &&
        data.length != null
      ) {
        checked = false;
      }
    }
    return checked;
  };

  const handleAdd = () => {
    dataList.push(dataAdd);
    alert("Thêm thành công");
    axios.post("http://localhost:8080/api/v1/productline/add", {
      brand: dataAdd.brand,
      capacity: dataAdd.capacity,
      fuel: dataAdd.fuel,
      height: dataAdd.height,
      length: dataAdd.length,
      width: dataAdd.width,
      model: dataAdd.model,
      warrantyPeriod: dataAdd.warrantyPeriod,
    });
    handleAddClose();
  };

  const handleEdit = () => {
    alert("Thay đổi thông tin của dòng sản phẩm thành công");
    setShow(false);
    axios.put(
      "http://localhost:8080/api/v1/productline/update/" + dataModel.id,
      {
        brand: data.brand,
        capacity: data.capacity,
        fuel: data.fuel,
        height: data.height,
        length: data.length,
        width: data.width,
        model: data.model,
        warrantyPeriod: data.warrantyPeriod,
      }
    );
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id === data.id) {
        dataList[i] = data;
      }
    }
  };

  const rowEvent = {
    onClick: (e, row, rowIndex) => {
      console.log("Hello");
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
            <Form.Control
              defaultValue={dataModel.brand}
              type="text"
              onChange={(e) => (data.brand = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mẫu xe</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.model}
              type="text"
              onChange={(e) => (data.model = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Dung tích thiết kế
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.capacity}
              type="number"
              onChange={(e) => (data.capacity = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">cc</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thể tích nhiên liệu tối đa
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.fuel}
              type="number"
              onChange={(e) => (data.fuel = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">lít</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều dài</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.length}
              type="number"
              onChange={(e) => (data.length = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều rộng</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.width}
              type="number"
              onChange={(e) => (data.width = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều cao</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.height}
              type="number"
              onChange={(e) => (data.height = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thời gian bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.warrantyPeriod}
              type="text"
              onChange={(e) => (data.warrantyPeriod = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">tháng</InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEdit}>
            Lưu
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ModalAddContent = () => {
    return (
      <Modal show={showAdd}>
        <Modal.Header>
          <Modal.Title>Thêm sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Thương hiệu</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.brand = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mẫu xe</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.model = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Dung tích thiết kế
            </InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.capacity = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">cc</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thể tích nhiên liệu tối đa
            </InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.fuel = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">lít</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều dài</InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.length = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều rộng</InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.width = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Chiều cao</InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.height = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">mm</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thời gian bảo hành
            </InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.warrantyPeriod = e.target.value)}
            />
            <InputGroup.Text id="basic-addon1">tháng</InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAdd}>
            Lưu
          </Button>
          <Button variant="secondary" onClick={handleAddClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const filterData = (e) => {
    if (e.target.value !== "") {
      setValue(e.target.value);
      const filterData = dataList.filter(o =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        ));
      setTableFilter([...filterData])
    } else {
      setValue(e.target.value);
      setDataList([...dataList])
    }
  };

  return (
    <div>
      <NavbarPage />
      <div>
        <div className="ft-5 fs-5">
          <p className="me-5 ms-5 mt-2 font-weight-bold">
            DANH MỤC DÒNG SẢN PHẨM
          </p>
        </div>
        <div className={"input group mb-3 me-5 ms-5"}>
          <p>Tìm kiếm</p>
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={filterData}
          />
        </div>
        <div className="me-5 ms-5">
          <div className="mb-2">
            <div className="d-inline p-2 ms-2">
              <AiOutlinePlusCircle size={28} onClick={handleShowAdd} />
              <span> Thêm dòng sản phẩm mới</span>
            </div>
          </div>
          <BootstrapTable
            keyField="id"
            data={value.length > 0 ? tableFilter : dataList}
            columns={column}
            pagination={paginationFactory(options)}
            rowEvents={rowEvent}
            striped
            hover
            condensed
          />
          {show ? <ModalContent /> : null}
          {showAdd ? <ModalAddContent /> : null}
        </div>
      </div>
    </div>
  );
}

export default ProductLine;
