import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import Link from "next/link";
import SearchBox from "./SearchBox";
import CartItemsSidebar from "./CartItemsSidebar";
import MobileNavSidebar from "./MobileNavSidebar";
import { formatCurrency } from "../../../common/utils";
// import { FaRegUser } from "react-icons/fa";
import { LuUser2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { logoutUser } from "../../../redux/reducers/userReducer";
import { baseUrl } from "../../../../config";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";

import Badge from "@mui/material/Badge";
// import MailIcon from "@mui/icons-material/Mail";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useRouter } from "next/router";
import { RiShoppingBag2Line } from "react-icons/ri";
import { MdLogin, MdLogout } from "react-icons/md";

export default function MenuFunctionIcons(props) {
  const [isShown, setIsShown] = useState(false);
  const [isNShow, setIsNShow] = useState(false);
  const cartState = useSelector((state) => state.cartReducer);
  const hide = props.hide || "";
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  const [showMobileNav, setShowMobileNav] = useState(false);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/website/front/user/logout`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      dispatch(logoutUser());
      router.push("/");
      return toast.success("logout successfully");
    } catch (error) {
      return toast.error("something went wrong");
    }
  };

  function calcalateTotal(arr) {
    let total = 0;
    arr.forEach((item) => (total += item.price * item.cartQuantity));
    return total;
  }
  return (
    <>
      <div
        className={`menu__wrapper__functions ${classNames(props.className)}`}
      >
        {!hide.includes("search") && (
          <a
            href="#"
            className="menu-icon -search"
            onClick={(e) => {
              e.preventDefault();
              setShowSearch(true);
            }}
            style={{ marginRight: hide.includes("cart") && 0 }}
          >
            <img
              src={
                props.white
                  ? process.env.PUBLIC_URL +
                    "/assets/images/header/search-icon-white.png"
                  : process.env.PUBLIC_URL +
                    "/assets/images/header/search-icon.png"
              }
              alt="Search icon"
            />
            {/* <IoSearchOutline /> */}
          </a>
        )}
        {!hide.includes("cart") && (
          <>
            {/* <Link href={process.env.PUBLIC_URL + "/shop/wishlist"}>
              <a className="menu-icon -wishlist">
                <img
                  src={
                    props.white
                      ? process.env.PUBLIC_URL +
                        "/assets/images/header/wishlist-icon-white.png"
                      : process.env.PUBLIC_URL +
                        "/assets/images/header/wishlist-icon.png"
                  }
                  alt="Wishlist icon"
                />
              </a>
            </Link> */}
            <div className="menu__cart_">
              <a
                href="#"
                className="menu-icon -cart"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCart(!showCart);
                }}
              >
                {/* <img
                  src={
                    props.white
                      ? process.env.PUBLIC_URL +
                        "/assets/images/header/cart-icon-white.png"
                      : process.env.PUBLIC_URL +
                        "/assets/images/header/cart-icon.png"
                  }
                  alt="Cart icon"
                />
                <span className="cart__quantity">{cartState.length}</span> */}

                <Badge badgeContent={cartState.length} color="error">
                  <LocalMallOutlinedIcon
                    className="headerMenuIcons"
                  />
                </Badge>
              </a>
              {/* <h5
                onClick={(e) => {
                  e.preventDefault();
                  setShowCart(!showCart);
                }}
              >
                Cart: <span>{formatCurrency(calcalateTotal(cartState))}</span>
              </h5> */}
            </div>

            {isAuthenticated ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  className="dropdown"
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                >
                  <button className="dropbtn p-0">
                    <LuUser2 className="headerMenuIcons" style={{ display: "flex" }} />
                  </button>
                  {isShown ? (
                    <div className="dropdown-content">
                      <Link href="/myprofile">
                        <span>
                          <LuUser2 /> My Accounts
                        </span>
                      </Link>
                      <Link href="/my-orders">
                        <span>
                          <RiShoppingBag2Line /> My Orders
                        </span>
                      </Link>
                      <div onClick={handleLogout} >
                        <span>
                          <MdLogout /> Logout
                        </span>
                      </div>

                      {/* <a onClick={handleLogout}>LogOut</a> */}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="dropdown"
                  onMouseEnter={() => setIsNShow(true)}
                  onMouseLeave={() => setIsNShow(false)}
                >
                  <button className="dropbtn p-0" style={{ marginTop: "0px" }}>
                    <LuUser2 style={{ display: "flex" }} />
                  </button>

                  {isNShow ? (
                    <div className="dropdown-content">
                      <Link href="/login">
                        <span>
                          <MdLogin /> Login
                        </span>
                      </Link>
                      <Link href="/Register">
                        <span>
                          <FiUserPlus /> Register
                        </span>
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </>
            )}

            <div className="menu__cart">
              {/* <Link
              href={`${process.env.PUBLIC_URL}/my-orders`}
              // href={`#`}
              as={`${process.env.PUBLIC_URL}/my-orders`}
            >
                <img
                  style={{
                    width: "30px",
                    height: "auto",
                    borderRadius: "12%",
                    marginLeft: "10px",
                    cursor:"pointer"
                  }}
                  src={
                    props.white
                      ? process.env.PUBLIC_URL + "/user.png"
                      : process.env.PUBLIC_URL + "/user.png"
                  }
                />
              </Link> */}
            </div>
            <a
              href="#"
              className="menu-icon -navbar"
              onClick={(e) => {
                e.preventDefault();
                setShowMobileNav(!showMobileNav);
              }}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </a>
          </>
        )}
      </div>
      {/* Search input */}
      <SearchBox showSearch={showSearch} setShowSearch={setShowSearch} />
      {/* Cart sidebar */}
      <CartItemsSidebar showCart={showCart} setShowCart={setShowCart} />
      {/* Mobile navigation sidebar */}
      <MobileNavSidebar
        showMobileNav={showMobileNav}
        setShowMobileNav={setShowMobileNav}
      />
    </>
  );
}
