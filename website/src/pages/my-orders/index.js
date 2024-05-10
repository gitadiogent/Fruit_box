import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LayoutFour from "../../components/Layout/LayoutOne";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import IntroductionOne from "../../components/Sections/Introduction/IntroductionOne";
import IntroductionEleven from "../../components/Sections/Introduction/IntroductionEleven";
import axios from "axios";
import { baseUrl } from "../../../config";
import Loading from "../../components/Other/Loading";
import { formatDate } from "../../common/utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Dialog, IconButton } from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { loginUser } from "../../redux/reducers/userReducer";
import { FaCopy } from "react-icons/fa6";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  gap: "20px";
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Card = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 15px 0px
    rgba(17, 30.999999999999996, 98.00000000000001, 0.1);
  border-radius: 10px;
  padding: 20px 2em 20px 2em;
  margin-bottom: 20px;
  @media only screen and (max-width: 553px) {
    width: 100%;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const OrderDate = styled.div`
  font-weight: bold;
  @media only screen and (max-width: 553px) {
    font-size: 10px;
  }
`;

const Status = styled.div`
  border-radius: 22px;
  color: white;
  background-color: green;
  width: max-content;
  padding: 12px 25px;
  font-size: 15px;
  height: auto;
  text-transform: capitalize;
  @media only screen and (max-width: 553px) {
    font-size: 12px;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  overflow-x: auto;
`;

const ProductTableHead = styled.thead`
  background-color: #f2f2f2;
`;

const ProductTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const ProductTableHeader = styled.th`
  text-align: left;
  padding: 10px;
`;

const ProductTableData = styled.td`
  padding: 10px;
  @media only screen and (max-width: 553px) {
    text-align: justify;
    font-size: 10px;
    line-height: normal;
  }
`;

const Price = styled.span``;

const TotalInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const TotalLabel = styled.p`
  font-weight: bold;
`;

const TotalAmount = styled.span``;

const AddressInfo = styled.div`
  margin-top: 10px;
  line-height: 2;
`;

const ProductImage = styled.div`
  padding: 10px;
  width: 65px;
  height: 65px;
  border-radius: 10px;
  ${"" /* border: 1px solid black; */}
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 55px;
    height: 55px;
    object-fit: contain;
  }
`;

export default function () {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.userReducer.user);

  const [order, setOrder] = useState({});
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [rander, setRander] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/website/front/get/all/orders/user/${currentUser?.user?.user_id}?limit=${limit}&page=${page}`,
        {
          withCredentials: true,
        }
      );

      console.log("ALL ORDERS", res);

      if (res?.data?.success === false) {
        setData([]);
        setLoading(false);
        return toast.error(res?.data?.message);
      }

      setData([...data, ...res?.data?.allOrders]);
      setOrder(res?.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [page]);

  async function fetchOrders_rander() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/website/front/get/all/orders/user/${currentUser?.user?.user_id}?limit=${limit}&page=${page}`,
        {
          withCredentials: true,
        }
      );

      console.log("ALL ORDERS", res);

      if (res?.data?.success === false) {
        setData([]);
        setLoading(false);
        return toast.error(res?.data?.message);
      }

      setData([...res?.data?.allOrders]);
      setOrder(res?.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders_rander();
  }, [rander]);

  const [confirmCancleOrder, setConfirmCancleOrder] = useState(false);

  const [orderId, setOrderID] = useState("");

  const handleOrderNowCodBtn = async () => {
    try {
      // setLoading(true);

      if (!orderId) {
        return toast.error("Please Select Order ID");
      }

      const url = `${baseUrl}/api/website/front/web/cancel/order/by/id/${orderId}`;
      const res = await axios.patch(
        url,
        { user_id: currentUser?.user?.user_id },
        { withCredentials: true }
      );

      console.log("Data Res", res.data);
      if (res.data.status) {
        setRander((prev) => !prev);
        toast.success("Order Cancel Successfull !!");
        setConfirmCancleOrder(false);
        setOrderID("");
      }
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log("Rander", rander);

  return (
    // <LayoutFour title="About us">
    //   <Breadcrumb title="About us">
    //     <BreadcrumbItem name="Home" />
    //     <BreadcrumbItem name="About us" current />
    //   </Breadcrumb>
    //   <IntroductionEleven />
    // </LayoutFour>
    <>
      <LayoutFour title="Order History">
        <Breadcrumb title="My Orders">
          <BreadcrumbItem name="Home" path={"/"} />
          <BreadcrumbItem name="My Orders" current />
        </Breadcrumb>
        {loading ? (
          <>
            <Loading />
          </>
        ) : (
          ""
        )}
        <div className="container">
          {data.length === 0 ? (
            <>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <iframe
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    height: "400px",
                    width: "100%",
                  }}
                  src="https://lottie.host/?file=591b9b0c-8270-47e1-89bf-e4c20d9be7a4/fE5YV4HSPk.json"
                ></iframe>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  You don't have any orders{" "}
                </span>
              </div>
            </>
          ) : (
            <Container>
              {/* <Title>My Orders</Title> */}
              {data?.map((item) => {
                return (
                  <Card className="myorder_items_details">
                    <div className="order_top_status_id_box">
                      <OrderInfo>
                        <div>
                          <OrderDate className="order_date">
                            Tracking ID:{" "}
                            <span spa>
                              {item?.order_id?.replace("#", "")}{" "}
                              <IconButton
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    item?.order_id?.replace("#", "")
                                  );
                                  toast.success("ID Copied !!");
                                }}
                              >
                                <FaCopy fontSize={15} />
                              </IconButton>
                            </span>
                          </OrderDate>
                          <OrderDate className="order_date mt-2">
                            Ordered On:{" "}
                            <span>{formatDate(item?.createdAt)}</span>
                          </OrderDate>
                        </div>
                      </OrderInfo>
                      <div
                        className="d-flex"
                        style={{ alignItems: "center", gap: "10px" }}
                      >
                        <h4>Status: -</h4>
                        {item?.order_status == "cancelled" && (
                          <Status style={{ background: "#F05152" }}>
                            {item?.order_status}
                          </Status>
                        )}
                        {item?.order_status == "delivered" && (
                          <Status style={{ background: "#26A475" }}>
                            {item?.order_status}
                          </Status>
                        )}
                        {item?.order_status == "shipped" && (
                          <Status style={{ background: "#3f83f8" }}>
                            {item?.order_status}
                          </Status>
                        )}
                        {item?.order_status == "pending" && (
                          <Status style={{ background: "#ff9800" }}>
                            {item?.order_status}
                          </Status>
                        )}
                      </div>
                    </div>
                    <ProductTable>
                      <ProductTableHead>
                        <ProductTableRow>
                          <ProductTableHeader className="orders_table_heading">
                            Product
                          </ProductTableHeader>
                          <ProductTableHeader className="orders_table_heading">
                            Quantity
                          </ProductTableHeader>
                          <ProductTableHeader className="orders_table_heading">
                            Price
                          </ProductTableHeader>
                        </ProductTableRow>
                      </ProductTableHead>
                      <tbody>
                        {item?.products?.map((i) => {
                          return (
                            <ProductTableRow>
                              <ProductTableData className="orders_table_details order_table_productname_img">
                                <ProductImage>
                                  <img
                                    src={i?.product_images[0]?.image_url}
                                    alt="Product"
                                  />
                                </ProductImage>
                                <p>{i?.product_name}</p>
                              </ProductTableData>
                              <ProductTableData className="orders_table_details">
                                x {i?.product_quantity}
                              </ProductTableData>
                              <ProductTableData className="orders_table_details">
                                ₹ {i?.product_sale_price * i?.product_quantity}
                              </ProductTableData>
                            </ProductTableRow>
                          );
                        })}
                        {/* Add more product rows as needed */}
                        <ProductTableRow>
                          <ProductTableData className="orders_table_heading order_total_table_bar">
                            <TotalLabel>Sub Total :</TotalLabel>
                          </ProductTableData>
                          <ProductTableData></ProductTableData>

                          <ProductTableData>
                            <TotalAmount>
                              ₹{" "}
                              {parseInt(item?.order_total) -
                                item?.delivery_charges}
                            </TotalAmount>
                          </ProductTableData>
                        </ProductTableRow>

                        <ProductTableRow>
                          <ProductTableData className="orders_table_heading order_total_table_bar">
                            <TotalLabel>Delivery & Shipping :</TotalLabel>
                          </ProductTableData>
                          <ProductTableData></ProductTableData>

                          <ProductTableData>
                            <TotalAmount>
                              {" "}
                              {item?.delivery_charges
                                ? `+ ₹${item?.delivery_charges}`
                                : "Free"}
                            </TotalAmount>
                          </ProductTableData>
                        </ProductTableRow>

                        {item.used_wallet_amount.coins_used ? (
                          <>
                            <ProductTableRow>
                              <ProductTableData className="orders_table_heading order_total_table_bar">
                                <TotalLabel>Coins Used :</TotalLabel>
                              </ProductTableData>
                              <ProductTableData></ProductTableData>

                              <ProductTableData>
                                <TotalAmount>
                                  ₹ {item.used_wallet_amount.coins_used}
                                </TotalAmount>
                              </ProductTableData>
                            </ProductTableRow>
                            <ProductTableRow>
                              <ProductTableData className="orders_table_heading order_total_table_bar">
                                <TotalLabel>
                                  {" "}
                                  {item?.used_wallet_amount?.coins_used} X coin
                                  value is{" "}
                                  {item?.used_wallet_amount?.coin_value} :
                                </TotalLabel>
                              </ProductTableData>
                              <ProductTableData></ProductTableData>

                              <ProductTableData>
                                <TotalAmount>
                                  - ₹{" "}
                                  {item?.used_wallet_amount?.coins_used *
                                    item?.used_wallet_amount?.coin_value}
                                </TotalAmount>
                              </ProductTableData>
                            </ProductTableRow>
                          </>
                        ) : (
                          ""
                        )}

                        {item?.coupon_discount ? (
                          <>
                            <ProductTableRow>
                              <ProductTableData className="orders_table_heading order_total_table_bar">
                                <TotalLabel>Coupon Discount :</TotalLabel>
                                <span style={{ fontSize: "13px" }}>
                                  ( {item?.coupon_discount?.coupon_code} )
                                </span>
                              </ProductTableData>
                              <ProductTableData></ProductTableData>

                              <ProductTableData>
                                <TotalAmount>
                                  - ₹{" "}
                                  {item?.coupon_discount?.discount_type?.toLowerCase() ==
                                  "amount"
                                    ? item?.coupon_discount.discount_value
                                    : (
                                        (item?.coupon_discount.discount_value /
                                          100) *
                                        parseInt(item?.order_total)
                                      ).toFixed(1)}
                                </TotalAmount>
                              </ProductTableData>
                            </ProductTableRow>
                          </>
                        ) : (
                          ""
                        )}

                        <ProductTableRow>
                          <ProductTableData className="orders_table_heading order_total_table_bar">
                            <TotalLabel>Total</TotalLabel>
                          </ProductTableData>
                          <ProductTableData></ProductTableData>

                          <ProductTableData>
                            <TotalAmount>
                              ₹{" "}
                              {(item?.coupon_discount?.discount_value
                                ? parseInt(item?.order_total) -
                                  item?.used_wallet_amount?.coins_used *
                                    item?.used_wallet_amount?.coin_value -
                                  Number(
                                    item?.coupon_discount?.discount_type?.toLowerCase() ==
                                      "amount"
                                      ? item?.coupon_discount.discount_value
                                      : (item?.coupon_discount.discount_value /
                                          100) *
                                          parseInt(item?.order_total)
                                  )
                                : parseInt(item?.order_total) -
                                  item?.used_wallet_amount?.coins_used *
                                    item?.used_wallet_amount?.coin_value)?.toFixed(1)}
                            </TotalAmount>
                          </ProductTableData>
                        </ProductTableRow>
                      </tbody>
                    </ProductTable>
                    <div
                      className="d-flex justify-content-between mt-3"
                      style={{ alignItems: "center" }}
                    >
                      <AddressInfo style={{ marginTop: 0 }}>
                        {" "}
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Address :
                        </span>{" "}
                        {item?.shipping_address}
                      </AddressInfo>

                      {item?.order_status == "delivered" ||
                      item?.order_status == "cancelled" ||
                      item?.order_status == "shipped" ? (
                        ""
                      ) : (
                        <Button
                          variant="text"
                          color="error"
                          sx={{ textTransform: "capitalize" }}
                          onClick={() => {
                            setOrderID(item?._id);
                            setConfirmCancleOrder((prev) => !prev);
                          }}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                    <div
                      className="d-flex justify-content-between mt-3"
                      style={{ alignItems: "center" }}
                    >
                      <AddressInfo style={{ marginTop: 0 }}>
                        {" "}
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Track Your Order :
                        </span>{" "}
                        <a
                          href="https://www.shiprocket.in/shipment-tracking/"
                          target="_blank"
                          className="btn -red "
                        >
                          Click Here
                        </a>
                      </AddressInfo>
                    </div>
                  </Card>
                );
              })}
            </Container>
          )}
        </div>

        {order?.pages == page || data.length <= 0 ? (
          ""
        ) : (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn -red reviewbtn "
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Load More
            </button>
          </div>
        )}
      </LayoutFour>

      <React.Fragment>
        <Dialog
          open={confirmCancleOrder}
          onClose={() => {
            setConfirmCancleOrder(false);
          }}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Cancel Order"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are You Sure, You Want to Cancel Order?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              color="error"
              onClick={() => {
                setConfirmCancleOrder(false);
              }}
            >
              Cancel
            </Button>
            <button
              onClick={() => {
                handleOrderNowCodBtn();
              }}
              className="btn -red"
              style={{ padding: "7px 15px" }}
            >
              Cancel Order
            </button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}
