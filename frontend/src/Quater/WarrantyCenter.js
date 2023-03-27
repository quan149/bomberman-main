import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMonitor } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

function WarrantyCenter() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataShop, setDataShop] = useState([]);
  const [dataFactory, setDataFactory] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [value, setValue] = useState("");
  const [tableFilter, setTableFilter] = useState([]);
  var data = {
    id: dataModel.id,
    name: dataModel.name,
    address: dataModel.address,
    phone: dataModel.phone,
    role: dataModel.role,
  };
  console.log(data);

  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const setIdforQuaters = () => {
    if (
      dataList.length === 0 &&
      dataShop.length === 0 &&
      dataFactory.length === 0
    )
      return 0;
    else if (dataList.length === 0 && dataShop.length === 0)
      return dataFactory[dataFactory.length - 1].id;
    else if (dataShop.length === 0 && dataFactory.length === 0)
      return dataList[dataList.length - 1].id;
    else if (dataList.length === 0 && dataFactory.length === 0)
      return dataFactory[dataFactory.length - 1].id;
    else if (dataList.length === 0)
      return Math.max(
        dataFactory[dataFactory.length - 1].id,
        dataShop[dataShop.length - 1].id
      );
    else if (dataShop.length === 0)
      return (
        dataList[dataList.length - 1].id,
        dataFactory[dataFactory.length - 1].id
      );
    else if (dataFactory.length === 0)
      return dataList[dataList.length - 1].id, dataShop[dataShop.length - 1].id;
    else {
      const maxId = Math.max(
        dataList[dataList.length - 1].id,
        dataShop[dataShop.length - 1].id,
        dataFactory[dataFactory.length - 1].id
      );
      return maxId;
    }
  };

  var dataAdd = {
    id: setIdforQuaters() + 1,
    name: "",
    address: "",
    phone: "",
    role: {
      name: "Đại lý",
    },
  };

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
    alert("Thêm thành công");
    axios.post("http://localhost:8080/api/v1/quarter/add/4", {
      id: setIdforQuaters() + 1,
      name: dataAdd.name,
      address: dataAdd.address,
      phone: dataAdd.phone,
      role: {
        id: 4,
        name: "Trung tâm bảo hành"
      },
    });
    dataList.push(dataAdd);
    handleAddClose();
  };

  const handleEdit = () => {
    alert("Thay đổi thông tin của dòng sản phẩm thành công");
    setShow(false);
    axios.put("http://localhost:8080/api/v1/quarter/4/update/" + dataModel.id, {
      id: dataModel.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      role: dataModel.role,
    });
    console.log(dataModel.role)
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id === data.id) {
        dataList[i] = data;
      }
    }
  };

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

  const filterData = (e) => {
    if (e.target.value !== "") {
      setValue(e.target.value);
      const filterData = dataList.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setTableFilter([...filterData]);
    } else {
      setValue(e.target.value);
      setDataList([...dataList]);
    }
  };

  const getDatafromAPI = async () => {
    const data = await axios
      .get("http://localhost:8080/api/v1/quarter/warrantycenter/")
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDatafromAPI();
    axios.get("http://localhost:8080/api/v1/quarter/shop/").then((res) => {
      setDataShop(res.data);
    });
    axios
      .get("http://localhost:8080/api/v1/quarter/factory/")
      .then((res) => {
        setDataFactory(res.data);
      });
  }, []);

  const column = [
    {
      dataField: "id",
      text: "Số ID",
    },
    {
      dataField: "name",
      text: "Tên cửa hàng",
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
          <Modal.Title>Thông tin chi tiết của cơ sở bảo hành</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Cửa hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên cửa hàng</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.name}
              type="text"
              onChange={(e) => (data.name = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Địa chỉ</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.address}
              type="text"
              onChange={(e) => (data.address = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số điện thoại</InputGroup.Text>
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
          <Modal.Title>Thêm cơ sở bảo hành</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID cơ sở bảo hành</InputGroup.Text>
            <Form.Control defaultValue={setIdforQuaters() + 1} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên cơ sở bảo hành</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.name = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Địa chỉ</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.address = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số điện thoại</InputGroup.Text>
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
          <p className="me-5 ms-5 mt-2">DANH MỤC THỐNG KÊ CÁC TRUNG TÂM BẢO HÀNH</p>
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
              <span> Thêm trung tâm bảo hành mới</span>
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

export default WarrantyCenter;
