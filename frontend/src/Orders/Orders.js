import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMonitor } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

function Orders() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  var productID, customerID;
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
    buyDate: "",
    product: null,
    customer: null,
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
    const orderData = {
      id: dataList[dataList.length - 1].id + 1,
      buyDate: dataAdd.buyDate,
      product: dataAdd.product,
      customer: dataAdd.customer
    }
    console.log(orderData)
    dataList.push(orderData);
    alert("Thêm thành công");
    axios.post("http://localhost:8080/api/v1/order/customer/" + customerID + "/product/"+ productID + "/add/", {
      id: Number(orderData.id),
      buyDate: dataAdd.buyDate,
      product: dataAdd.product,
      customer: dataAdd.customer
    });
    handleAddClose();
  };

  const handleDeleteClose = () => {
    alert("Xóa đơn hàng thành công");
    setShow(false);
    axios.delete(
      "http://localhost:8080/api/v1/order/delete/" + dataModel.id + "/"
    );
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
      .get("http://localhost:8080/api/v1/order/")
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDatafromAPI();
    axios.get("http://localhost:8080/api/vi/customer/all").then((res) => {
      setDataCustomer(res.data);
    });
    axios.get("http://localhost:8080/api/v1/product/").then((res) => {
      setDataProduct(res.data);
    });
  }, []);

  const column = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "customer.name",
      text: "Tên khách hàng",
    },
    {
      dataField: "product.productLine.model",
      text: "Sản phẩm",
    },
    {
      dataField: "buyDate",
      text: "Ngày mua",
    },
    {
      dataField: "product.shop.name",
      text: "Cửa hàng",
    },
    {
      dataField: "product.shop.address",
      text: "Địa chỉ mua hàng",
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

  const ModalContent = () => {
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Thông tin chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Đơn hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên khách hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.customer.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày mua</InputGroup.Text>
            <Form.Control defaultValue={dataModel.buyDate} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thông số sản phẩm
            </InputGroup.Text>
            <Form.Control
              defaultValue={
                "Số khung: " +
                dataModel.product.id +
                ", số máy: " +
                dataModel.product.engineNumber
              }
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Dòng sản phẩm</InputGroup.Text>
            <Form.Control
              defaultValue={
                dataModel.product.productLine.brand +
                " " +
                dataModel.product.productLine.model
              }
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Nhà máy sản xuất
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.factory.name}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ nhà máy sản xuất
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.factory.address}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Cửa hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.product.shop.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ cửa hàng đã mua
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.shop.address}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thời gian bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.productLine.warrantyPeriod}
              disabled
            />
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

  const ModalAddContent = () => {
    return (
      <Modal show={showAdd}>
        <Modal.Header>
          <Modal.Title>Tạo đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID Đơn hàng</InputGroup.Text>
            <Form.Control
              defaultValue={dataList[dataList.length - 1].id + 1}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày mua</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) => (dataAdd.buyDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thông tin khách hàng
            </InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                customerID = e.target.value;
                for (let i = 0; i < dataCustomer.length; i++) {
                  if (dataCustomer[i].id === customerID) {
                    dataAdd.customer = dataCustomer[i];
                  }
                }
              }}
            >
              {dataCustomer.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.id + " - " + customer.name}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Sản phẩm đã mua</InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                productID = e.target.value;
                for (let i = 0; i < dataProduct.length; i++) {
                  if (dataProduct[i].id === productID) {
                    dataAdd.product = dataProduct[i];
                  }
                }
              }}
            >
              {dataProduct.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.id +
                    " - " +
                    product.productLine.brand +
                    " " +
                    product.productLine.model}
                </option>
              ))}
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
          <p className="me-5 ms-5 mt-2">DANH MỤC CÁC ĐƠN HÀNG ĐÃ MUA</p>
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
              <span> Thêm đơn hàng mới</span>
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

export default Orders;
