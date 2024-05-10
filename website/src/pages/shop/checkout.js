import Link from "next/link";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { baseUrl, web_title } from "../../../config";
import LayoutFour from "../../components/Layout/LayoutFour";
import LayoutOne from "../../components/Layout/LayoutOne";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import InstagramTwo from "../../components/Sections/Instagram/InstagramTwo";
import {
  formatCurrency,
  formatDate,
  formatSingleNumber,
} from "../../common/utils";
import CloseIcon from "@mui/icons-material/Close";
import {
  calculateTotalPriceAfterCoupon,
  calculateDiscountPrice,
  calculateSubTotalPrice,
  calculateDiscountPriceAfterCoupon,
  calculateTotalPrice,
} from "../../common/shopUtils";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/Other/Loading";
import { removeAllFromCart } from "../../redux/actions/cartActions";
import styled, { useTheme } from "styled-components";
import Swal from "sweetalert2";
import { FaCircleDot, FaCoins } from "react-icons/fa6";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  TextField,
  fabClasses,
} from "@mui/material";
import Coupons from "../../components/Coupons/Coupons";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GigtCoin from "../../components/GigtCoin/GigtCoin";

export default function () {
  const cartState = useSelector((state) => state.cartReducer);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponType, setCouponType] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [show, setShow] = useState(false);
  const [paymentType, setPaymentType] = useState(true);
  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );

  const currentUser = useSelector((state) => state.userReducer.user);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const {
    register: couponRegister,
    handleSubmit: couponHandleSubmit,
    errors: couponErrors,
  } = useForm();

  const [apiUser, setApiUser] = useState({});
  const [walletData, setWalletData] = useState({});
  const [giftCoin, setgiftCoin] = useState(0);
  useEffect(() => {
    if (currentUser?.user._id) {
      axios
        .get(`${baseUrl}/api/website/front/user/get/${currentUser?.user._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setApiUser(res.data);

          setCheckoutDetail({
            customer_id: res.data?.user_id,
            customer_name: res.data.username,
            customer_phone_number: `${res.data?.phone_number}`,
            customer_email: res.data.email,
            customer_business: res.data.user_business,
            customer_gst: res.data.gst_number,
            order_total: Number(
              calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              )
            ),
            transport_detail: apiUser.transport_detail,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axios
      .get(`${baseUrl}/api/admin/get/wallet/data`, {
        withCredentials: true,
      })
      .then((res) => {
        setWalletData(res.data.wallet_data);

        let giftCoin = 0;

        console.log(
          "Total Amount",
          Number(
            calculateTotalPriceAfterCoupon(
              cartState,
              true,
              couponAmount,
              couponType
            )
          ),
          res.data?.coin_gift_range
        );

        if (res.data.wallet_data?.is_wallet_active) {
          for (let range of res.data.wallet_data?.coin_gift_range) {
            console.log("Range =>>>>>>>>>", range);
            if (
              range?.min_range <
                Number(
                  calculateTotalPriceAfterCoupon(
                    cartState,
                    true,
                    couponAmount,
                    couponType
                  )
                ) &&
              range?.max_range >
                Number(
                  calculateTotalPriceAfterCoupon(
                    cartState,
                    true,
                    couponAmount,
                    couponType
                  )
                )
            ) {
              giftCoin = range?.gift_coin;
            }
          }
        }

        setgiftCoin(giftCoin);

        console.log(res.data.wallet_data);
        if (res.data.wallet_data.razorpay_key_id && razorpay_key_secret) {
          setPaymentType(true);
        } else {
          setPaymentType(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log("Api User", apiUser);
  console.log("wallet Data", walletData);

  console.log("cartState =>", cartState);
  console.log("currentUser =>", currentUser);

  //payment by razorpay
  const router = useRouter();

  //razorpay details of key id and secret

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [useData, setUserData] = useState({
    username: "",
    address: "",
    email: "",
    pincode: "",
    state: "",
    phone_number: "",

    lastName: "",
    country: "India",
    town: "",
  });

  useEffect(() => {
    setUserData({
      ...useData,
      username: currentUser?.user?.username ? currentUser?.user?.username : "",
      address: currentUser?.user?.address ? currentUser?.user?.address : "",
      email: currentUser?.user?.email ? currentUser?.user?.email : "",
      pincode: currentUser?.user?.pincode ? currentUser?.user?.pincode : "",
      state: currentUser?.user?.state ? currentUser?.user?.state : "",
      phone_number: currentUser?.user?.phone_number
        ? currentUser?.user?.phone_number
        : "",
    });
  }, []);

  const onChangeHandeler = (e) => {
    setUserData({ ...useData, [e.target.name]: e.target.value });
  };

  const [useWallet, setUseWallet] = useState(false);

  const [giftedCoin, setGiftedCoin] = useState(0);
  const [open, setOpen] = useState(false);

  console.log(" ksldjflkjsadf", cartState);

  const [checkoutDetail, setCheckoutDetail] = useState({
    customer_id: apiUser?.user_id,
    customer_business: apiUser?.user_business,
    customer_gst: apiUser?.gst_number,
    products: cartState || [],
    order_total: Number(
      calculateTotalPriceAfterCoupon(cartState, true, couponAmount, couponType)
    ),
    transport_detail: apiUser?.transport_detail,
  });

  const handleOrderNowCodBtn = async () => {
    console.log(
      useData?.username,
      useData?.address,
      useData?.email,
      useData?.pincode,
      useData?.state,
      useData?.country
    );

    if (
      !useData?.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      return toast.error("Please Enter Valid Email");
    }

    if (
      !useData?.username ||
      !useData?.address ||
      !useData?.email ||
      !useData?.pincode ||
      !useData?.state ||
      !useData?.country
    ) {
      return toast.error("Please fill all The Field");
    }

    let coinUserd = 0;

    if (useWallet) {
      if (paymentType) {
        coinUserd =
          (walletData?.delivery_charges +
            Number(
              calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              ) - discountValue
            )) /
          walletData.one_coin_price;
      }

      if (!paymentType) {
        if (
          walletData?.delivery_charges +
            Number(
              calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              ) - discountValue
            ) >
          apiUser.wallet * walletData.one_coin_price
        ) {
          coinUserd = apiUser.wallet;
        }
        if (
          walletData?.delivery_charges +
            Number(
              calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              ) - discountValue
            ) <
          apiUser.wallet * walletData.one_coin_price
        ) {
          coinUserd =
            (walletData?.delivery_charges +
              Number(
                calculateTotalPriceAfterCoupon(
                  cartState,
                  true,
                  couponAmount,
                  couponType
                ) - discountValue
              )) /
            walletData.one_coin_price;
        }
      }
    }

    console.warn("coinUserd", coinUserd);

    let newProd = [];

    for (let prod of cartState) {
      console.log("pord =>  ", prod);

      const product = await axios.get(
        `${baseUrl}/api/website/front/get/single/product/by/product/name/${prod.slug}`
      );

      newProd.push({
        ...product.data,
        product_quantity: prod?.cartQuantity,
        product_sale_price: prod.price,
        product_regular_price: prod.regular_price,
        selected_variation: prod?.selected_variation
          ? prod?.selected_variation
          : [],
      });
    }

    axios
      .post(
        `${baseUrl}/api/website/front/cart/checkout/products/for/cash/on/delivery`,
        {
          ...checkoutDetail,
          order_total:
            walletData?.delivery_charges +
            Number(
              calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              )
            ),

          products: newProd || [],
          order_from: "website",

          wallet: apiUser.wallet,
          paymentMode: paymentType,
          coinUsed: coinUserd,
          user: apiUser.user_id,
          couponDetail: couponDetail,

          customer_name: useData?.username,
          customer_phone_number: `${useData?.phone_number}`,
          customer_email: useData?.email,
          shipping_address: useData?.address,
          state: useData?.state,
          pincode: useData?.pincode,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        if (res?.data?.status === true) {
          dispatch(removeAllFromCart());

          setGiftedCoin(res.data.giftCoin);
          // setOpen(true);

          toast.success("Your Order Placed Successfull");

          router.push("/my-orders");

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("walletData", walletData);

  console.log("useData", useData);

  const handleCheckOutWithRazorpay = async () => {
    if (
      !useData?.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      return toast.error("Please Enter Valid Email");
    }

    if (useData.phone_number.length > 10) {
      return toast.error("Please Fill 10 Digit Phone Number");
    }

    if (
      !useData?.username ||
      !useData?.address ||
      !useData?.email ||
      !useData?.pincode ||
      !useData?.state ||
      !useData?.country
    ) {
      return toast.error("Please fill all The Field");
    }

    let newProd = [];

    for (let prod of cartState) {
      console.log("pord =>  ", prod);

      const product = await axios.get(
        `${baseUrl}/api/website/front/get/single/product/by/product/name/${prod.slug}`
      );

      newProd.push({
        ...product.data,
        product_quantity: prod?.cartQuantity,
        product_sale_price: prod.price,
        product_regular_price: prod.regular_price,
        selected_variation: prod?.selected_variation
          ? prod?.selected_variation
          : [],
      });
    }

    console.log(
      "Order Total",
      walletData.delivery_charges +
        Number(
          calculateTotalPriceAfterCoupon(
            cartState,
            true,
            couponAmount,
            couponType
          )
        )
    );

    await axios
      .post(
        `${baseUrl}/api/website/front/calulate/price/for/razorpay/payment`,
        {
          product: newProd,
          wallet: paymentType && useWallet ? apiUser.wallet : 0,
          couponDiscount: discountValue,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data, "RESPONSE");
        if (res.data.status === true) {
          let options = {
            description: "Online Store",

            order_id: res.data.response.id,
            currency: res.data.response.currency,
            key: walletData.razorpay_key_id, // Your api key
            amount: res.data.response?.amount,
            name: web_title,
            order_from: "website",
            prefill: {
              email: apiUser?.email,
              contact: apiUser?.phone_number,
              name: apiUser?.username,
            },
            // theme: { color: config.primaryColor },
            handler: async (data) => {
              // handle success
              console.log(data, "razorpay payment details");
              // alert(`Success: ${data.razorpay_payment_id}`);
              axios
                .post(
                  `${baseUrl}/api/website/front/verify/payment/and/create/order/razorpay`,
                  {
                    ...data,
                    ...checkoutDetail,
                    order_total:
                      walletData.delivery_charges +
                      Number(
                        calculateTotalPriceAfterCoupon(
                          cartState,
                          true,
                          couponAmount,
                          couponType
                        )
                      ),

                    user: apiUser.user_id,
                    couponDiscount: discountValue,
                    couponDetail: couponDetail,

                    products: newProd || [],

                    wallet: paymentType && useWallet ? apiUser.wallet : 0,
                    paymentMode: paymentType,
                    order_from: "website",

                    customer_name: useData?.username,
                    customer_phone_number: `${useData?.phone_number}`,
                    customer_email: useData?.email,
                    shipping_address: useData?.address,
                    state: useData?.state,
                    pincode: useData?.pincode,
                  },
                  {
                    withCredentials: true,
                  }
                )
                .then((res) => {
                  if (res?.data?.status === true) {
                    dispatch(removeAllFromCart());

                    toast.success("Your Order Placed Successfull");

                    router.push("/my-orders");

                    setLoading(false);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            },
          };

          const rzpay = new Razorpay(options);

          rzpay.open(options);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [couponInput, setCouponInput] = useState("");

  const [couponDetail, setCouponDetail] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);
  const couponCheck = async () => {
    if (couponInput.length < 3) {
      toast.warning("Add a Valid Coupon !");
      return;
    }

    try {
      axios
        .get(
          `${baseUrl}/api/website/front/get/coupons/code/${couponInput}/${Number(
            calculateTotalPriceAfterCoupon(
              cartState,
              true,
              couponAmount,
              couponType
            )
          )}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          // console.log('coupon Response', res.data);
          if (res.data.status) {
            setCouponDetail(res.data.coupon);

            let couponData = res.data.coupon;

            if (couponData?.discount_type?.toUpperCase() == "AMOUNT") {
              setDiscountValue(couponData?.discount_value);
            } else {
              const value =
                ((walletData?.delivery_charges +
                  Number(
                    calculateTotalPriceAfterCoupon(
                      cartState,
                      true,
                      couponAmount,
                      couponType
                    )
                  )) *
                  couponData?.discount_value) /
                100;

              // setDiscountValue(value);
              setDiscountValue(value);
            }

            toast.success("Coupon Applied Successfull !");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.warn("Coupon Area", err);
          toast.error("Invalid Coupon");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const [confirmOrder, setConfirmOrder] = useState(false);

  const removeCoupon = () => {
    setCouponDetail(null);
    setDiscountValue(0);
    setCouponInput("");
  };

  console.log("walletData", walletData);

  return (
    <>
      <LayoutOne title="Checkout">
        <Breadcrumb title="Checkout">
          <BreadcrumbItem name="Home" path={"/"} />
          <BreadcrumbItem name="Shop" path={"/shop/products"} />
          <BreadcrumbItem name="Checkout" current />
        </Breadcrumb>
        {loading ? (
          <Loading />
        ) : (
          <div className="checkout">
            <div className="container">
              <div className="row">
                <div className="col-12  col-lg-8">
                  <form>
                    <div className="checkout__form">
                      {!isAuthenticated && (
                        <div className="checkout__form__contact__title">
                          <Link href="/login">
                            <p
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              Please login to place your order!
                              <button
                                className="btn -red"
                                style={{
                                  // fontWeight: "bold",
                                  padding: "9px 15px",
                                  marginLeft: "10px",
                                }}
                              >
                                Login
                              </button>
                            </p>
                          </Link>
                        </div>
                      )}
                      {/* <div className="checkout__form__contact"> */}
                      {/* <div className="input-validator">
                        <input
                          type="text"
                          onChange={onChangeHandeler}
                          placeholder="Email"
                          name="email"
                          value={useData?.email}
                        />
                        {errors.contact && (
                          <span className="input-error">
                            Please provide a name or email
                          </span>
                        )}
                      </div> */}
                      {/* <div className="input-validator">
                        <input
                          type="number"
                          onChange={onChangeHandeler}
                          placeholder="Phone Number"
                          name="phone_number"
                          value={useData?.phone_number}
                        />
                        {errors.contact && (
                          <span className="input-error">
                            Please provide a name or email
                          </span>
                        )}
                      </div> */}
                      {/* </div> */}
                      <div className="checkout__form__shipping">
                        <h5 className="checkout-title">Shipping Details</h5>
                        <div className="row">
                          <div className="col-12 col-md-12">
                            <div className="input-validator">
                              <label>
                                Name <span>*</span>
                                <input
                                  type="text"
                                  onChange={onChangeHandeler}
                                  name="username"
                                  value={useData?.username}
                                  placeholder="Your Name"
                                />
                              </label>
                            </div>
                          </div>
                          <div className="col-12 col-md-12">
                            <div className="input-validator">
                              <label>
                                Email <span>*</span>
                                <input
                                  type="text"
                                  onChange={onChangeHandeler}
                                  placeholder="Email"
                                  name="email"
                                  value={useData?.email}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="col-12 col-md-12">
                            <div className="input-validator">
                              <label>
                                Phone Number <span>*</span>
                                <input
                                  type="number"
                                  onChange={onChangeHandeler}
                                  placeholder="Phone Number"
                                  name="phone_number"
                                  value={useData?.phone_number}
                                />
                              </label>
                            </div>
                          </div>
                          {/* <div className="col-12 col-md-6">
                          <div className="input-validator">
                            <label>
                              Last name <span>*</span>
                              <input
                                type="text"
                                name="lastName"
                                onChange={onChangeHandeler}
                                value={useData?.lastName}
                              />
                            </label>
                          </div>
                        </div> */}
                          <div className="col-12">
                            <div className="input-validator">
                              <label>
                                Country <span>*</span>
                                <input
                                  type="text"
                                  name="country"
                                  onChange={onChangeHandeler}
                                  value={useData?.country}
                                />
                              </label>
                              {errors.country && (
                                <span className="input-error">
                                  Please provide your country
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-validator">
                              <label>
                                Address <span>*</span>
                                <input
                                  type="text"
                                  onChange={onChangeHandeler}
                                  placeholder="Steet address"
                                  name="address"
                                  value={useData?.address}
                                />
                              </label>
                              {errors.streetAddress || errors.apartment ? (
                                <span className="input-error">
                                  Please provide your address
                                </span>
                              ) : null}
                            </div>
                          </div>
                          {/* <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Town/City <span>*</span>
                              <input
                                type="text"
                                name="town"
                                onChange={onChangeHandeler}
                                value={useData?.town}
                              />
                            </label>
                            {errors.town && (
                              <span className="input-error">
                                Please provide your town/city
                              </span>
                            )}
                          </div>
                        </div> */}
                          <div className="col-12">
                            <div className="input-validator">
                              <label>
                                Country/State <span>*</span>
                                <input
                                  type="text"
                                  name="state"
                                  onChange={onChangeHandeler}
                                  value={useData?.state}
                                  placeholder="Country/State"
                                />
                              </label>
                              {errors.state && (
                                <span className="input-error">
                                  Please provide your country/State
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-validator">
                              <label>
                                Postcode/ZIP <span>*</span>
                                <input
                                  type="number"
                                  onChange={onChangeHandeler}
                                  name="pincode"
                                  value={useData?.pincode}
                                  placeholder="Postcode/ZIP"
                                />
                              </label>
                              {errors.zip && (
                                <span className="input-error">
                                  Please provide your postcode/ZIP
                                </span>
                              )}
                            </div>
                          </div>

                          {/* <div className="col-12">
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              marginRight: "5px",
                            }}
                            src={
                              process.env.PUBLIC_URL + "/assets/images/ch.jpeg"
                            }
                          />
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-12 ml-auto">
                      <div className="checkout__total">
                        <h5 className="checkout-title">Your order</h5>

                        <div className="checkout__total__price">
                          <h5>Product</h5>
                          <table>
                            <colgroup>
                              <col style={{ width: "70%" }} />
                              <col style={{ width: "30%" }} />
                            </colgroup>
                            <tbody>
                              {cartState.map((item) => (
                                <tr key={item.cartId}>
                                  <td>
                                    <span>
                                      {formatSingleNumber(item.cartQuantity)}
                                    </span>{" "}
                                    x {item.name}
                                    <div
                                      style={{ display: "flex", paddingTop: 2 }}
                                    >
                                      {item?.selected_variation &&
                                        item?.selected_variation[0] && (
                                          <h5
                                            style={{
                                              fontSize: 12,
                                              fontWeight: "500",
                                            }}
                                          >
                                            {item?.selected_variation[0]}
                                          </h5>
                                        )}
                                      {item?.selected_variation &&
                                        item?.selected_variation[1] && (
                                          <h5
                                            style={{
                                              paddingLeft: 6,
                                              fontSize: 12,
                                              fontWeight: "500",
                                            }}
                                          >
                                            {item?.selected_variation[1]}
                                          </h5>
                                        )}
                                    </div>
                                  </td>
                                  <td>
                                    <h3 className="product-price--main">
                                      <h3
                                        style={{
                                          marginBottom: 10,
                                        }}
                                        className="product-price--discount"
                                      >
                                        {formatCurrency(item.regular_price)}
                                      </h3>
                                      {formatCurrency(item.price)}
                                    </h3>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="checkout__total__price__total-count">
                            <table>
                              <tbody>
                                {coupon !== "" && couponAmount > 0 && (
                                  <tr>
                                    <td>Coupon Applied : </td>
                                    <td
                                      style={{
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {" "}
                                      {coupon}{" "}
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td>Subtotal</td>
                                  <td>
                                    {calculateSubTotalPrice(cartState, true)}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Discount</td>
                                  <td>
                                    {" "}
                                    - {calculateDiscountPrice(
                                      cartState,
                                      true
                                    )}{" "}
                                  </td>
                                </tr>
                                {couponAmount > 0 && (
                                  <tr>
                                    <td>Coupon Discount</td>
                                    <td>
                                      {" "}
                                      -{" "}
                                      ₹{calculateDiscountPriceAfterCoupon(
                                        cartState,
                                        true,
                                        couponAmount,
                                        couponType
                                      )}{" "}
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td>Total</td>
                                  <td>
                                    {calculateTotalPriceAfterCoupon(
                                      cartState,
                                      true,
                                      couponAmount,
                                      couponType
                                    )}
                                  </td>
                                </tr>

                                <tr>
                                  <td>Delivery & Shipping </td>

                                  {walletData.delivery_charges > 0 && (
                                    <td>{`+ ₹${walletData?.delivery_charges}`}</td>
                                  )}

                                  {walletData?.delivery_charges === 0 && (
                                    <td>Free</td>
                                  )}
                                </tr>

                                {walletData.is_wallet_active &&
                                currentUser?.user._id ? (
                                  <>
                                    {walletData?.min_amount_wallet_use == 0 ? (
                                      ""
                                    ) : (
                                      <tr>
                                        <td colSpan={2}>
                                          <p
                                            className="mb-0"
                                            style={{
                                              fontSize: "13px",
                                              textAlign: "left",
                                              fontWeight: "500",
                                            }}
                                          >
                                            Min.{" "}
                                            {walletData.min_amount_wallet_use}{" "}
                                            Coin Required to Use Wallet
                                          </p>
                                        </td>
                                      </tr>
                                    )}
                                    <tr>
                                      <td className="mt-0 pb-0 flex" style={{}}>
                                        <Checkbox
                                          style={{ marginLeft: "-2px" }}
                                          disabled={
                                            apiUser?.wallet <
                                            walletData?.min_amount_wallet_use
                                              ? true
                                              : false
                                          }
                                          className="p-0"
                                          select={useWallet}
                                          onChange={() => {
                                            setUseWallet(!useWallet);
                                          }}
                                        />
                                        <span
                                          style={{
                                            transform: "translateY(-2px)",
                                          }}
                                        >
                                          Use Wallet Coins
                                        </span>
                                      </td>
                                      <td className="pb-0">
                                        {apiUser?.wallet} Coins
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        {" "}
                                        1 Coin = ₹{walletData.one_coin_price}
                                      </td>
                                      <td>
                                        {apiUser?.wallet} X{" "}
                                        {walletData.one_coin_price} = ₹
                                        {apiUser?.wallet *
                                          walletData.one_coin_price}
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  ""
                                )}

                                {discountValue > 0 ? (
                                  <tr>
                                    <td>Coupon Discount</td>
                                    <td>- ₹{discountValue}</td>
                                  </tr>
                                ) : (
                                  ""
                                )}

                                {walletData.is_wallet_active && useWallet ? (
                                  <tr>
                                    <td>Coin Used</td>
                                    <td>
                                      -
                                      {apiUser.wallet <= 0
                                        ? 0
                                        : calculateTotalPriceAfterCoupon(
                                            cartState,
                                            true,
                                            couponAmount,
                                            couponType
                                          ) -
                                            discountValue +
                                            Number(
                                              walletData?.delivery_charges
                                            ) >=
                                          apiUser.wallet
                                        ? apiUser.wallet *
                                          walletData.one_coin_price
                                        : calculateTotalPriceAfterCoupon(
                                            cartState,
                                            true,
                                            couponAmount,
                                            couponType
                                          ) -
                                          discountValue +
                                          Number(walletData?.delivery_charges)}
                                    </td>
                                  </tr>
                                ) : (
                                  ""
                                )}

                                <tr>
                                  <td>Payable Total </td>

                                  <td>
                                    ₹
                                    {useWallet
                                      ? apiUser.wallet *
                                          walletData.one_coin_price >=
                                        walletData?.delivery_charges +
                                          Number(
                                            calculateTotalPriceAfterCoupon(
                                              cartState,
                                              true,
                                              couponAmount,
                                              couponType
                                            )
                                          ) -
                                          discountValue
                                        ? 0
                                        : (
                                            walletData?.delivery_charges +
                                            Number(
                                              calculateTotalPriceAfterCoupon(
                                                cartState,
                                                true,
                                                couponAmount,
                                                couponType
                                              )
                                            ) -
                                            Number(
                                              apiUser.wallet *
                                                walletData.one_coin_price
                                            ) -
                                            discountValue
                                          ).toFixed(0)
                                      : (
                                          walletData?.delivery_charges +
                                          Number(
                                            calculateTotalPriceAfterCoupon(
                                              cartState,
                                              true,
                                              couponAmount,
                                              couponType
                                            )
                                          ) -
                                          discountValue
                                        ).toFixed(0)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {walletData?.is_wallet_active && giftCoin > 0 ? (
                              <div className="coin_received mt-4 text-center">
                                {/* <h4>On This Order You Receive {giftCoin} Coin</h4> */}

                                <h4
                                  className="d-flex"
                                  style={{
                                    alignItems: "center",
                                    gap: 10,
                                    justifyContent: "center",
                                  }}
                                >
                                  <span>
                                    {" "}
                                    <img
                                      style={{ width: "27px" }}
                                      src="/party.png"
                                      alt=""
                                    />
                                  </span>{" "}
                                  Get {giftCoin} Coins{" "}
                                  <FaCoins color="#ff9f24" /> as Gift{" "}
                                </h4>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div
                            className="d-flex justify-content-between mb-3"
                            style={{ alignItems: "center" }}
                          >
                            <p>Discount Coupons</p>

                            <Coupons setCouponInput={setCouponInput} />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              gap: 5,
                            }}
                            className="mb-3"
                          >
                            <input
                              label="Enter Coupon Code"
                              variant="outlined"
                              fullWidth={true}
                              placeholder="Enter Coupon Code"
                              size="small"
                              style={{
                                width: "100%",
                                padding: "11px 15px",
                                border: "1px solid #e1e1e1",
                                background: "transparent",
                              }}
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                              }}
                            />{" "}
                            <button
                              className="btn -red"
                              style={{
                                padding: "10px 20px",
                                width: "fit-content",
                              }}
                              onClick={couponCheck}
                              variant="contained"
                            >
                              Apply
                            </button>
                          </div>

                          {couponDetail ? (
                            <div
                              className="rmCoupon mb-2 d-flex"
                              style={{
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <h4>
                                {couponDetail?.coupon_code} Coupon Applied
                              </h4>

                              <IconButton
                                onClick={() => {
                                  removeCoupon();
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="checkout__total__price__payment">
                            <label className="checkbox-label" htmlFor="payment">
                              Payment Mode :{" "}
                              {paymentType ? "Online Payment" : "COD"}
                            </label>
                          </div>
                        </div>
                        {!isAuthenticated ? (
                          <>
                            <Link href="/login">
                              <button className="btn -red">Login</button>
                            </Link>
                          </>
                        ) : (
                          <>
                            {walletData?.cash_on_delivery ? (
                              <div
                                className="delivery_mode_radio_button d-flex"
                                style={{ alignItems: "center", gap: 10 }}
                              >
                                <input
                                  type="radio"
                                  id="payNowOption"
                                  name="paymentOption"
                                  checked={!paymentType}
                                  select={!paymentType}
                                  onChange={() => {
                                    setPaymentType(false);
                                  }}
                                />
                                <label
                                  htmlFor="payNowOption"
                                  style={{
                                    marginLeft: "0px",
                                    marginTop: "-4px",
                                  }}
                                >
                                  Cash On Delivery
                                </label>
                              </div>
                            ) : (
                              ""
                            )}

                            <div>
                              {walletData?.razorpay_key_id &&
                              walletData?.razorpay_key_secret ? (
                                <div
                                  className="delivery_mode_radio_button d-flex"
                                  style={{ alignItems: "center", gap: 10 }}
                                >
                                  <input
                                    type="radio"
                                    id="payNowOption__"
                                    name="paymentOption"
                                    checked={paymentType}
                                    select={paymentType}
                                    onChange={() => {
                                      setPaymentType(true);
                                    }}
                                  />
                                  <label
                                    htmlFor="payNowOption__"
                                    style={{
                                      marginLeft: "0px",
                                      marginTop: "-4px",
                                    }}
                                  >
                                    Online Payment
                                  </label>
                                </div>
                              ) : (
                                ""
                              )}

                              {(walletData?.razorpay_key_id &&
                                walletData?.razorpay_key_secret) ||
                              walletData?.cash_on_delivery ? (
                                <>
                                  {paymentType &&
                                    (apiUser.wallet *
                                      walletData.one_coin_price >=
                                      walletData?.delivery_charges +
                                        Number(
                                          calculateTotalPriceAfterCoupon(
                                            cartState,
                                            true,
                                            couponAmount,
                                            couponType
                                          )
                                        ) && useWallet ? (
                                      <button
                                        style={{ marginTop: "10px" }}
                                        className="btn -red"
                                        onClick={() => {
                                          handleOrderNowCodBtn();
                                        }}
                                      >
                                        Pay With Wallet{" "}
                                        <span>
                                          {calculateTotalPriceAfterCoupon(
                                            cartState,
                                            true,
                                            couponAmount,
                                            couponType
                                          ) -
                                            discountValue +
                                            Number(
                                              walletData?.delivery_charges
                                            )}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        style={{ marginTop: "10px" }}
                                        className="btn -red"
                                        onClick={() => {
                                          handleCheckOutWithRazorpay();
                                        }}
                                      >
                                        Pay Now{" "}
                                        <span>
                                          {/* {calculateTotalPriceAfterCoupon(
                                      cartState,
                                      true,
                                      couponAmount,
                                      couponType
                                    ) - discountValue} */}

                                          {useWallet
                                            ? apiUser.wallet *
                                                walletData.one_coin_price >=
                                              walletData?.delivery_charges +
                                                Number(
                                                  calculateTotalPriceAfterCoupon(
                                                    cartState,
                                                    true,
                                                    couponAmount,
                                                    couponType
                                                  )
                                                ) -
                                                discountValue
                                              ? 0
                                              : (
                                                  walletData?.delivery_charges +
                                                  Number(
                                                    calculateTotalPriceAfterCoupon(
                                                      cartState,
                                                      true,
                                                      couponAmount,
                                                      couponType
                                                    )
                                                  ) -
                                                  Number(
                                                    apiUser.wallet *
                                                      walletData.one_coin_price
                                                  ) -
                                                  discountValue
                                                ).toFixed(0)
                                            : (
                                                walletData?.delivery_charges +
                                                Number(
                                                  calculateTotalPriceAfterCoupon(
                                                    cartState,
                                                    true,
                                                    couponAmount,
                                                    couponType
                                                  )
                                                ) -
                                                discountValue
                                              ).toFixed(0)}
                                        </span>
                                      </button>
                                    ))}

                                  {!paymentType &&
                                    (apiUser.wallet *
                                      walletData.one_coin_price >=
                                    walletData?.delivery_charges +
                                      Number(
                                        calculateTotalPriceAfterCoupon(
                                          cartState,
                                          true,
                                          couponAmount,
                                          couponType
                                        )
                                      ) ? (
                                      <button
                                        style={{ marginTop: "10px" }}
                                        className="btn -red"
                                        onClick={() => {
                                          handleOrderNowCodBtn();
                                        }}
                                      >
                                        Pay With Wallet{" "}
                                        <span>
                                          {calculateTotalPriceAfterCoupon(
                                            cartState,
                                            true,
                                            couponAmount,
                                            couponType
                                          )}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        style={{ marginTop: "10px" }}
                                        className="btn -red"
                                        onClick={() => {
                                          setConfirmOrder(true);
                                        }}
                                      >
                                        Cash on delivery{" "}
                                        <span>
                                          {useWallet
                                            ? apiUser.wallet *
                                                walletData.one_coin_price >=
                                              walletData?.delivery_charges +
                                                Number(
                                                  calculateTotalPriceAfterCoupon(
                                                    cartState,
                                                    true,
                                                    couponAmount,
                                                    couponType
                                                  )
                                                ) -
                                                discountValue
                                              ? 0
                                              : (
                                                  walletData?.delivery_charges +
                                                  Number(
                                                    calculateTotalPriceAfterCoupon(
                                                      cartState,
                                                      true,
                                                      couponAmount,
                                                      couponType
                                                    )
                                                  ) -
                                                  Number(
                                                    apiUser.wallet *
                                                      walletData.one_coin_price
                                                  ) -
                                                  discountValue
                                                ).toFixed(0)
                                            : (
                                                walletData?.delivery_charges +
                                                Number(
                                                  calculateTotalPriceAfterCoupon(
                                                    cartState,
                                                    true,
                                                    couponAmount,
                                                    couponType
                                                  )
                                                ) -
                                                discountValue
                                              ).toFixed(0)}
                                        </span>
                                      </button>
                                    ))}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AllCoupons show={show} setShow={setShow} />
          </div>
        )}
        {/* <InstagramTwo /> */}

        <React.Fragment>
          <Dialog
            open={confirmOrder}
            onClose={() => {
              setConfirmOrder(false);
            }}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Place Your Order"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To Place Your Order Click on Confirm Order Button.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  setConfirmOrder(false);
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
                Confirm Order
              </button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </LayoutOne>

      <GigtCoin open={open} setOpen={setOpen} coinGifted={giftedCoin} />
    </>
  );
}

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50vh;
  width: 30vw;
  padding: 20px;
  background-color: white;
  //box-shadow: -2px 3px 22px 8px rgba(201, 201, 201, 1);
  color: black;
  z-index: 10;
  display: flex;
  flex-direction: column;
  //align-items: center;
  // justify-content: center;

  @media (max-width: 576px) {
    width: 80%;
  }
`;

function AllCoupons({ show, setShow }) {
  const [data, setData] = useState([]);

  async function getCoupons() {
    try {
      const res = await axios.get(`${baseUrl}/api/website/front/coupon/to`);
      // console.log(res);
      setData(res?.data?.coupons);
    } catch (error) {
      //  console.log(error);
    }
  }

  const copyToClipboard = (title) => {
    const el = document.createElement("textarea");
    el.value = title;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return toast.success("Coupon Code copied");
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      // Click outside the component, close it
      setShow(!show);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  if (show) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          zIndex: 10,
        }}
        onClick={handleBackdropClick} // Call setShow(false) on click outside the component
      >
        <Modal>
          {data.map((item) => (
            <div
              key={item.id} // Add a unique key for each item
              style={{
                marginBottom: "10px",
                boxShadow: "-2px 3px 22px 8px rgba(201, 201, 201, 1)",
                width: "100%",
                padding: 10,
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(item.title)}
            >
              <div
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {item?.title}
              </div>
              <div style={{}}>{item?.description.toLowerCase()}</div>
            </div>
          ))}
        </Modal>
      </div>
    );
  } else {
    return <></>;
  }
}
