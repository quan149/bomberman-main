import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState, React } from "react";

export default function NavbarPage(props) {
  const [showCustomers, setshowCustomers] = useState(true);
  const [showOrders, setshowOrders] = useState(true);
  const [showShops, setshowShops] = useState(true);
  const [showFactorys, setshowFactorys] = useState(true);
  const [showWarrantyInfo, setshowWarrantyInfo] = useState(true);
  const [showWarrantyCenter, setshowWarrantyCenter] = useState(true);
  const [showUsers, setshowUsers] = useState(true);
  const [showCallbackInfo, setCallbackInfo] = useState(true);

  const role_acc = JSON.parse(localStorage.getItem("user")).role;
  
  useEffect(() => {
    if (role_acc[0] === "ROLE_ADMIN") {
      setshowCustomers(false);
      setshowWarrantyInfo(false);
      setCallbackInfo(false);
      setshowOrders(false);
    } else if (role_acc[0] === "ROLE_SHOP") {
      setshowUsers(false);
    } else if (role_acc[0] === "ROLE_FACTORY") {
      setshowUsers(false);
      setshowWarrantyCenter(false);
      setshowWarrantyInfo(false);
    } else if (role_acc[0] === "ROLE_WARRANTYCENTER") {
      setshowUsers(false);
      setshowFactorys(false);
      setshowOrders(false);
    }
  }, []);

  const {state} = useLocation()
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container>
        <Navbar.Brand href="/home">Trang chủ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {showUsers ? <Nav.Link href="/users">Tài khoản</Nav.Link> : null}
            <NavDropdown title="Quản lý danh sách" id="basic-nav-dropdown">
              <NavDropdown.Item href="/productlines">
                Danh sách dòng sản phẩm
              </NavDropdown.Item>
              <NavDropdown.Item href="/products">
                Danh sách sản phẩm
              </NavDropdown.Item>
              {showCustomers ? <NavDropdown.Item href="/customers">
                Danh sách khách hàng
              </NavDropdown.Item> : null}
              {showOrders ? <NavDropdown.Item href="/orders">
                Đơn hàng đã mua
              </NavDropdown.Item> : null}
              {showShops ? <NavDropdown.Item href="/shops">
                Danh sách đại lý phân phối
              </NavDropdown.Item> : null}
              {showFactorys ? <NavDropdown.Item href="/factorys">
                Danh sách cơ sở sản xuất
              </NavDropdown.Item> : null}
              {showWarrantyCenter ? <NavDropdown.Item href="/warrantycenters">
                Danh sách trung tâm bảo hành
              </NavDropdown.Item> : null}
            </NavDropdown>
            {showWarrantyInfo ? <Nav.Link href="/warrantyinfo">Thông tin bảo hành</Nav.Link> : null}
            {showCallbackInfo ? <Nav.Link href="/callbackinfo">Triệu hồi sản phẩm lỗi</Nav.Link> : null}
            <Nav.Link href="/login">Đăng xuất</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
