import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import {
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import {
  AiOutlinePlusCircle,
  AiOutlineMonitor,
} from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

export default function Customer() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  var data = {
    id: dataModel.id,
    name: dataModel.name,
    yearOfBirth: dataModel.yearOfBirth,
    address: dataModel.address,
    phone: dataModel.phone,
    sex: dataModel.sex,
  };
  var dataAdd = {
    id: "",
    name: "",
    yearOfBirth: "",
    address: "",
    phone: "",
    sex: "",
  };
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

  const handleAdd = () => {
    dataList.push(dataAdd);
    alert("Thêm thành công");
    axios.post("http://localhost:8080/api/vi/customer/add/", dataAdd);
    handleAddClose();
  };

  const handleEdit = () => {
    setShow(false);
    axios.put(
      "http://localhost:8080/api/vi/customer/update/" + dataModel.id,
      data
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
      .get("http://localhost:8080/api/vi/customer/all")
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
      dataField: "name",
      text: "Họ và tên",
    },
    {
      dataField: "yearOfBirth",
      text: "Năm sinh",
    },
    {
      dataField: "sex",
      text: "Giới tính"
    },
    {
      dataField: "address",
      text: "Địa chỉ",
    },
    {
      dataField: "phone",
      text: "Số điện thoại",
    },
  ];

  const [value, setValue] = useState("");
  const [tableFilter, setTableFilter] = useState([]);

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
          <Modal.Title>Thông tin chi tiết của khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Khách hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Họ và tên</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.name}
              type="text"
              onChange={(e) => (data.name = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Năm sinh</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.yearOfBirth}
              type="number"
              onChange={(e) => (data.yearOfBirth = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Giới tính</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.sex}
              type="text"
              onChange={(e) => (data.sex = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.address}
              type="text"
              onChange={(e) => (data.address = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Số điện thoại
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.phone}
              type="text"
              onChange={(e) => (data.phone = e.target.value)}
            />
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
          <Modal.Title>Thêm khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Khách hàng</InputGroup.Text>
            <Form.Control type="text"
              onChange={(e) => (dataAdd.id = e.target.value)}/>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Họ và tên</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.name = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Năm sinh</InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.yearOfBirth = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ
            </InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.address = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Giới tính</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.sex = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Số điện thoại
            </InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.phone = e.target.value)}
            />
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

  return (
    <div>
      <NavbarPage />
      <div>
        <div className="ft-5 fs-5">
          <p className="me-5 ms-5 mt-2">DANH SÁCH KHÁCH HÀNG</p>
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
              <span> Thêm khách hàng</span>
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
