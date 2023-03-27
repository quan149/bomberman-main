import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, FormSelect, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMonitor } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

export default function User() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [dataShop, setDataShop] = useState([]);
  const [dataFactory, setDataFactory] = useState([]);
  const [dataWarranty, setDataWarranty] = useState([]);
  var data = {
    id: dataModel.id,
    username: dataModel.username,
    password: dataModel.password,
    role: dataModel.role,
    quarter: dataModel.quarter,
    status: dataModel.status,
  };
  var dataAdd = {
    id: dataModel.id + 1,
    username: "",
    password: "",
    role: {
      name: "",
    },
    quarter: "",
    status: "",
  };
  let dataQuarter = [];
  let role
  var optionsQuarter = -1;
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleAddClose = () => {
    setShowAdd(false);
  };

  const [value, setValue] = useState("");
  const [tableFilter, setTableFilter] = useState([]);

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

  const handleShow = () => setShow(true);

  const handleShowAdd = () => {
    setShowAdd(true);
    setDataModel(dataList[dataList.length - 1]);
  };

  const handleAdd = () => {
    dataAdd.role = dataAdd.quarter.role
    dataList.push(dataAdd);
    axios.post("http://localhost:8080/api/v1/user/role/" + role + '/quarter/' + dataAdd.quarter.id + '/add', {
      id: dataAdd.id,
      username: dataAdd.username,
      password: dataAdd.password,
      role: {
        name: dataAdd.quarter.role.name,
      },
      quarter: {
        address: dataAdd.quarter.address,
        id: dataAdd.quarter.id,
        name: dataAdd.quarter.name,
        phone: dataAdd.quarter.phone,
        role: {
          name: dataAdd.quarter.role.name,
        },
      },
      status: dataAdd.status,
    });
    alert("Thêm thành công");
    handleAddClose();
  };

  const handleEdit = () => {
    setShow(false);
    axios.put("http://localhost:8080/api/v1/user/update/" + dataModel.id, {
      id: dataModel.id,
      username: dataModel.username,
      password: data.password,
      role: {
        name: dataModel.role.name,
      },
      quarter: {
        address: dataModel.quarter.address,
        id: dataModel.quarter.id,
        name: dataModel.quarter.name,
        phone: dataModel.quarter.phone,
        role: {
          name: dataModel.quarter.role.name,
        },
      },
      status: data.status,
    });
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
      .get("http://localhost:8080/api/v1/user/")
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDatafromAPI();
    axios
      .get("http://localhost:8080/api/v1/quarter/shop/")
      .then((res) => setDataShop(res.data));
    axios
      .get("http://localhost:8080/api/v1/quarter/factory/")
      .then((res) => setDataFactory(res.data));
    axios
      .get("http://localhost:8080/api/v1/quarter/warrantycenter/")
      .then((res) => setDataWarranty(res.data));
  }, []);

  const column = [
    {
      dataField: "id",
      text: "id",
    },
    {
      dataField: "username",
      text: "Tên đăng nhập",
    },
    {
      dataField: "role.name",
      text: "Vai trò",
    },
    {
      dataField: "quarter.name",
      text: "Bộ phận",
    },
    {
      dataField: "status",
      text: "Trạng thái",
    },
  ];

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

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: row.status === "0" ? "#F7B5B5" : null };
  }

  for (let i = 0; i < dataShop.length; i++) {
    dataQuarter.push(dataShop[i]);
  }
  for (let i = 0; i < dataFactory.length; i++) {
    dataQuarter.push(dataFactory[i]);
  }
  for (let i = 0; i < dataWarranty.length; i++) {
    dataQuarter.push(dataWarranty[i]);
  }

  const ModalContent = () => {
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Thông tin chi tiết của tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID tài khoản</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên tài khoản</InputGroup.Text>
            <Form.Control defaultValue={dataModel.username} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mật khẩu</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.password}
              type="password"
              onChange={(e) => (data.password = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Vai trò</InputGroup.Text>
            <Form.Control defaultValue={dataModel.role.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Bộ phận</InputGroup.Text>
            <Form.Control defaultValue={dataModel.quarter.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Trạng thái</InputGroup.Text>
            <Form.Control
              as="select"
              defaultValue={dataModel.status}
              onChange={(e) => (data.status = e.target.value)}
            >
              <option value={"0"}>Đã vô hiệu</option>
              <option value={"1"}>Đang hoạt động</option>
            </Form.Control>
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
          <Modal.Title>Tạo tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID tài khoản</InputGroup.Text>
            <Form.Control
              defaultValue={dataList[dataList.length - 1].id + 1}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên tài khoản</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.username = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mật khẩu</InputGroup.Text>
            <Form.Control
              type="password"
              onChange={(e) => (dataAdd.password = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Bộ phận</InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                optionsQuarter = e.target.value;
                for (let i = 0; i < dataQuarter.length; i++) {
                  if (Number(dataQuarter[i].id) === Number(optionsQuarter)) {
                    dataAdd.quarter = dataQuarter[i]
                  }
                }
              
                if(dataAdd.quarter.role.name==="Đại lý phân phối") role = 2
                else if (dataAdd.quarter.role.name==="Cơ sở sản xuất") role = 3
                else if(dataAdd.quarter.role.name==="Trung tâm bảo hành") role = 4
                console.log(role)
              }}
            >
              <option></option>
              {dataQuarter.map((quarter) => (
              <option key={quarter.id} value={quarter.id}>{quarter.id + " - " + quarter.name}</option>
            ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Trạng thái</InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                dataAdd.status = e.target.value
              }}
            >
              <option></option>
              <option value={'0'}>Bị vô hiệu</option>
              <option value={'1'}>Sẵn sàng hoạt động</option>
            </Form.Control>
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
          <p className="me-5 ms-5 mt-2">DANH SÁCH TÀI KHOẢN</p>
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
              <span> Thêm tài khoản</span>
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
            rowStyle={rowStyleFormat}
          />
          {show ? <ModalContent /> : null}
          {showAdd ? <ModalAddContent /> : null}
        </div>
      </div>
    </div>
  );
}
