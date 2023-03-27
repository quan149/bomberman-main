import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Modal } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMonitor } from "react-icons/ai";
import NavbarPage from "../Component/NavbarPage";

function Products() {
  axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("user")).jwt;
  const [dataList, setDataList] = useState([]);
  const [dataProductLine, setDataProductLine] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [value, setValue] = useState("");
  const [dataShop, setDataShop] = useState([]);
  const [tableFilter, setTableFilter] = useState([]);
  var data = {
    color: dataModel.color,
    engineNumber: dataModel.engineNumber,
    factory: dataModel.factory,
    id: dataModel.id,
    manufactureDate: dataModel.manufactureDate,
    productLine: dataModel.productLine,
    shop: dataModel.shop,
    status: dataModel.status,
    warrantyTime: dataModel.warrantyTime,
  };
  var optionsProductLine = 1;
  var optionsShop = -1;

  var dataAdd = {
    color: "",
    engineNumber: "",
    factory: "",
    id: "",
    manufactureDate: "",
    productLine: "",
    shop: "",
    status: "Mới sãn xuất",
    warrantyTime: "",
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
    let productAdd = {
      color: dataAdd.color,
      engineNumber: dataAdd.engineNumber,
      factory: {
        address: "Đường Phạm Văn Đồng, Xuân Đỉnh, Bắc Từ Liêm, Hà Nội",
        id: 0,
        name: "Công viên Hòa Bình",
        phone: "0964606435",
        role: {
          name: "tập kết phò",
        },
      },
      id: dataAdd.id,
      manufactureDate: "2022-12-29",
      productLine: {
        brand: dataProductLine[optionsProductLine - 1].brand,
        capacity: dataProductLine[optionsProductLine - 1].capacity,
        fuel: dataProductLine[optionsProductLine - 1].fuel,
        height: dataProductLine[optionsProductLine - 1].height,
        id: optionsProductLine,
        length: dataProductLine[optionsProductLine - 1].length,
        model: dataProductLine[optionsProductLine - 1].model,
        warrantyPeriod: dataProductLine[optionsProductLine - 1].warrantyPeriod,
        width: dataProductLine[optionsProductLine - 1].width,
      },
      /*shop: {
        address: null,
        id: null,
        name: null,
        phone: null,
        role: {
          name: null,
        },
      },*/
      shop: null,
      status: dataAdd.status,
      warrantyTime: dataAdd.warrantyTime,
    };
    alert("Thêm thành công");
    axios.post(
      "http://localhost:8080/api/v1/product/add/" + optionsProductLine,
      productAdd
    );
    dataList.push(productAdd);
    handleAddClose();
  };

  const handleEdit = () => {
    alert("Thay đổi thông tin của dòng sản phẩm thành công");
    setShow(false);
    axios.put("http://localhost:8080/api/v1/product/update/" + dataModel.id, {
      color: data.color,
      engineNumber: data.engineNumber,
      factory: data.factory,
      id: data.id,
      manufactureDate: data.manufactureDate,
      productLine: data.productLine,
      shop: data.shop,
      status: data.status,
      warrantyTime: data.warrantyTime,
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
      .get("http://localhost:8080/api/v1/product/")
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDatafromAPI();
    axios.get("http://localhost:8080/api/v1/productline/").then((res) => {
      setDataProductLine(res.data);
    });
    axios.get("http://localhost:8080/api/v1/quarter/shop/").then((res) => {
      setDataShop(res.data);
    });
  }, []);

  const column = [
    {
      dataField: "id",
      text: "Số khung",
    },
    {
      dataField: "engineNumber",
      text: "Số máy",
    },
    {
      dataField: "manufactureDate",
      text: "Ngày sản xuất",
    },
    {
      dataField: "factory.name",
      text: "Nhà máy sản xuất",
    },
    {
      dataField: "productLine.model",
      text: "Dòng sản phẩm",
    },
    {
      dataField: "shop.name",
      text: "Cửa hàng",
    },
    {
      dataField: "status",
      text: "Mô tả",
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
            <InputGroup.Text id="basic-addon1">Số khung</InputGroup.Text>
            <Form.Control defaultValue={dataModel.id} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số máy</InputGroup.Text>
            <Form.Control defaultValue={dataModel.engineNumber} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Màu sắc</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.color}
              type="text"
              onChange={(e) => (data.color = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày sản xuất</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.manufactureDate}
              type="date"
              onChange={(e) => (data.manufactureDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Tên nhà máy sản xuất
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.factory.name} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Địa chỉ nhà máy sản xuất
            </InputGroup.Text>
            <Form.Control defaultValue={dataModel.factory.address} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Tên dòng sản phẩm
            </InputGroup.Text>
            <Form.Control
              defaultValue={
                dataModel.productLine.brand + " " + dataModel.productLine.model
              }
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thông số dòng sản phẩm
            </InputGroup.Text>
            <Form.Control
              defaultValue={
                dataModel.productLine.length +
                "mm - " +
                dataModel.productLine.width +
                "mm - " +
                dataModel.productLine.height +
                "mm"
              }
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Thời gian bảo hành
            </InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.productLine.warrantyPeriod}
              disabled
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Tên cửa hàng</InputGroup.Text>
            <Form.Control
              as="select"
              defaultValue={
                dataModel.shop === null ? -1 : dataModel.shop.id
              }
              onChange={(e) => {
                optionsShop = e.target.value;
                for (let i = 0; i < dataShop.length; i++){
                  if(Number(optionsShop) === Number(dataShop[i].id)) {
                    data.shop = dataShop[i]
                  }
                }
                console.log(data.shop)
              }}
            >
            <option value={-1}>{"Chưa phân phối"}</option>
            {dataShop.map((shop) => (
              <option key = {shop.id} value = {shop.id}>
                {shop.id + " - " + shop.name}
              </option>
            ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số lần bảo hành</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.warrantyTime}
              type="number"
              onChange={(e) => (data.warrantyTime = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mô tả sản phẩm</InputGroup.Text>
            <Form.Control
              defaultValue={dataModel.status}
              type="text"
              onChange={(e) => (data.status = e.target.value)}
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
          <Modal.Title>Thêm sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số khung</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.id = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số máy</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.engineNumber = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Màu sắc</InputGroup.Text>
            <Form.Control
              type="text"
              onChange={(e) => (dataAdd.color = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ngày sản xuất</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) => (dataAdd.manufactureDate = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Tên nhà máy sản xuất
            </InputGroup.Text>
            <Form.Control defaultValue={"Công viên Hòa Bình"} disabled />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              Tên dòng sản phẩm
            </InputGroup.Text>
            <Form.Control
              as="select"
              onChange={(e) => {
                optionsProductLine = e.target.value;
                for (let i = 0; i < dataProductLine.length; i++) {
                  if (dataProductLine[i].id === optionsProductLine) {
                    dataAdd.productLine = dataProductLine[i];
                  }
                }
              }}
            >
              {dataProductLine.map((productLine) => (
                <option key={productLine.id} value={productLine.id}>
                  {productLine.id +
                    " - " +
                    productLine.brand +
                    " " +
                    productLine.model}
                </option>
              ))}
            </Form.Control>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Số lần bảo hành</InputGroup.Text>
            <Form.Control
              type="number"
              onChange={(e) => (dataAdd.warrantyTime = e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Mô tả sản phẩm</InputGroup.Text>
            <Form.Control defaultValue={"Mới sản xuất"} disabled />
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
          <p className="me-5 ms-5 mt-2">DANH MỤC SẢN PHẨM</p>
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
              <span> Thêm sản phẩm</span>
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

export default Products;
