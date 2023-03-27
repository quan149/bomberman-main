import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, FormSelect, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMonitor } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

export default function WarrantyInfo() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [dataWarrantyCenter, setDataWarrantyCenter] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataShop, setDataShop] = useState([]);
  var data = {
    completed: dataModel.completed,
  };
  var dataAdd = {
    warrantyDate: "",
    completedDate: "",
    returnDate: "",
    completed: "",
    product: "",
    warrantyCenter: "",
    shop: "",
  };

  var optionsProduct = -1;
  var optionsWarrantyCenter = -1;
  var optionsShop = -1;
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
    data = {
      id: dataList[dataList.length - 1].id + 1,
      warrantyDate: dataAdd.warrantyDate,
      completedDate: dataAdd.completedDate,
      returnDate: dataAdd.returnDate,
      completed: dataAdd.completed,
      product: dataAdd.product,
      warrantyCenter: dataAdd.warrantyCenter,
      shop: dataAdd.shop,
    };
    dataList.push(data);
    axios.post(
      "http://localhost:8080/api/v1/warrantyinfo/add/product/" +
        dataAdd.product.id +
        "/shop/" +
        dataAdd.shop.id +
        "/warrantycenter/" +
        dataAdd.warrantyCenter.id +
        "/",
      {
        id: dataList[dataList.length - 1].id + 1,
        warrantyDate: dataAdd.warrantyDate,
        completedDate: dataAdd.completedDate,
        returnDate: dataAdd.returnDate,
        completed: dataAdd.completed,
        product: dataAdd.product,
        warrantyCenter: dataAdd.warrantyCenter,
        shop: dataAdd.shop,
      }
    );
    alert("Thêm thành công");
    handleAddClose();
  };

  const handleEdit = () => {
    console.log(dataAdd)
    setShow(false);
    console.log(data);
    axios.put(
      "http://localhost:8080/api/v1/warrantyinfo/update/" + dataModel.id + "/",
      {
        id: dataModel.id,
        warrantyDate: dataModel.warrantyDate,
        completedDate: dataModel.completedDate,
        returnDate: dataModel.returnDate,
        completed: data.completed,
        product: dataModel.product,
        warrantyCenter: dataModel.warrantyCenter,
        shop: dataModel.shop,
      }
    );
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id === dataModel.id) {
        dataList[i].completed = data.completed;
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
      .get("http://localhost:8080/api/v1/warrantyinfo/")
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
      .get("http://localhost:8080/api/v1/quarter/warrantycenter/")
      .then((res) => setDataWarrantyCenter(res.data));
    axios
      .get("http://localhost:8080/api/v1/product/")
      .then((res) => setDataProduct(res.data));
    axios
      .get("http://localhost:8080/api/v1/quarter/shop/")
      .then((res) => setDataShop(res.data));
  }, []);

  const column = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "product.id",
      text: "Mã khung",
    },
    {
      dataField: "product.productLine.model",
      text: "Dòng sản phẩm",
    },
    {
      dataField: "warrantyDate",
      text: "Bắt đầu",
    },
    {
      dataField: "completedDate",
      text: "Hoàn thành",
    },
    {
      dataField: "returnDate",
      text: "Trả hàng",
    },
    {
      dataField: "warrantyCenter.name",
      text: "Trung tâm bảo hành",
    },
    {
      dataField: "shop.name",
      text: "Cửa hàng",
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
    return {
      backgroundColor:
        Number(row.completed) === 1
          ? "#8BF3A0"
          : Number(row.completed) === 0
          ? "#F38B8B"
          : null,
    };
  }

  const ModalContent = () => {
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Thông tin chi tiết của tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Mã khung sản phẩm
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.product.id} disabled />
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
              Ngày bắt đầu bảo hành
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.warrantyDate} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Ngày kết thúc bảo hành
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.completedDate} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày trả hàng</InputGroup.Text>
            <Form.Control defaultValue={dataModel.returnDate} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Trạng thái</InputGroup.Text>
            <Form.Control
              as="select"
              defaultValue={dataModel.completed}
              onChange={(e) => {
                data.completed = e.target.value;
              }}
            >
              <option></option>
              <option value={2}>Đang bảo hành</option>
              <option value={0}>Bảo hành không thành công</option>
              <option value={1}>Bảo hành thành công</option>
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Trung tâm bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.warrantyCenter.name}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ trung tâm bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.warrantyCenter.address}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Số điện thoại trung tâm bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.warrantyCenter.phone}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Cửa hàng nhận sản phẩm
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.product.shop.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ cửa hàng nhận
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.shop.address}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Số điện thoại cửa hàng nhận
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.product.shop.phone}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Cửa hàng trả sản phẩm
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.shop.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ cửa hàng trả
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.shop.address} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Số điện thoại cửa hàng trả
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.shop.phone} disabled />
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
          <Modal.Title>Thông tin chi tiết của tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">ID</InputGroup.Text>
            <Form.Control
              defaultValue={dataList[dataList.length - 1].id + 1}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Ngày bắt đầu bảo hành
            </InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) => (dataAdd.warrantyDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Ngày kết thúc bảo hành
            </InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) => (dataAdd.completedDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày trả hàng</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) => (dataAdd.returnDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Trạng thái</InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                dataAdd.completed = e.target.value;
              }}
            >
              <option></option>
              <option value={2}>Đang bảo hành</option>
              <option value={0}>Bảo hành không thành công</option>
              <option value={1}>Bảo hành thành công</option>
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Trung tâm bảo hành
            </InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                optionsWarrantyCenter = e.target.value;
                console.log(optionsWarrantyCenter);
                console.log(dataWarrantyCenter);
                for (let i = 0; i < dataWarrantyCenter.length; i++) {
                  if (
                    Number(dataWarrantyCenter[i].id) ===
                    Number(optionsWarrantyCenter)
                  ) {
                    console.log(1);
                    dataAdd.warrantyCenter = dataWarrantyCenter[i];
                  }
                }
                console.log(dataAdd.warrantyCenter);
              }}
            >
              <option></option>
              {dataWarrantyCenter.map((quarter) => (
                <option key={quarter.id} value={quarter.id}>
                  {quarter.id + " - " + quarter.name}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Sản phẩm bảo hành
            </InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                optionsProduct = e.target.value;
                for (let i = 0; i < dataProduct.length; i++) {
                  if (dataProduct[i].id === optionsProduct) {
                    dataAdd.product = dataProduct[i];
                  }
                }
                console.log(dataAdd.product);
              }}
            >
              <option></option>
              {dataProduct.map((quarter) => (
                <option key={quarter.id} value={quarter.id}>
                  {"Mã khung - " + quarter.id}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Cửa hàng trả hàng
            </InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                optionsShop = e.target.value;
                for (let i = 0; i < dataShop.length; i++) {
                  if (Number(dataShop[i].id) === Number(optionsShop)) {
                    dataAdd.shop = dataShop[i];
                  }
                }
                console.log(dataAdd.shop);
              }}
            >
              <option></option>
              {dataShop.map((quarter) => (
                <option key={quarter.id} value={quarter.id}>
                  {quarter.id + " - " + quarter.name}
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
          <p className="me-5 ms-5 mt-2">
            DANH SÁCH THÔNG TIN SẢN PHẨM BẢO HÀNH
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
              <span> Thêm sản phẩm bảo hành mới</span>
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
