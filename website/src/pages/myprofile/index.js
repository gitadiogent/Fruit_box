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
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { logoutUser } from "../../redux/reducers/userReducer";
import UserData from "../../components/profile/UserData";
import ReferEarn from "../../components/profile/ReferEarn";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuUser2 } from "react-icons/lu";
import { RiShoppingBag2Line } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { SlBag, SlShareAlt } from "react-icons/sl";
import Wallet from "../../components/profile/Wallet";
import { IoWalletOutline } from "react-icons/io5";
import { PiShoppingBagThin } from "react-icons/pi";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { TfiWallet } from "react-icons/tfi";

export default function () {
  const [tab, setTab] = useState(0);

  const router = useRouter();

  const dispatch = useDispatch();
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

  const currentUser = useSelector((state) => state?.userReducer?.user?.user);

  const [userData, setUserData] = useState({});
  const [render, setRender] = useState(false);

  const [detail, setDetail] = useState({});

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/website/front/user/get/${currentUser?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${baseUrl}/api/admin/get/wallet/data`, {
        withCredentials: true,
      })
      .then((res) => {
        setDetail(res.data.wallet_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);

  console.log("userData", userData);

  const auth = useSelector((state) => state?.userReducer?.isAuthenticated);
  useEffect(() => {
    if (!auth) {
      router.push("/");
    }
  }, []);

  console.log(detail);

  return (
    <LayoutFour title="My Profile">
      <Breadcrumb title="My Accounts" className={"product_inner"}>
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="My Accounts" current />
      </Breadcrumb>
      <div className="mainContainer container">
        <div className="container-box">
          <div className={` leftnav navigator`}>
            <a
              className={`left-items ${tab == 0 ? "active" : ""}`}
              onClick={() => setTab(0)}
            >
              <LuUser2 /> <span className="profile_main_tab">My Profile</span>
            </a>
            <Link className="left-items" href="/my-orders">
              <a className="left-items">
                <SlBag /> <span className="profile_main_tab">Orders</span>
              </a>
            </Link>
            {/* <a className="left-items">Addresss</a> */}
            {/* <a className="left-items">Account details</a> */}
            {/* <a className="left-items">Wallet</a> */}
            {detail?.is_wallet_active ? (
              <a
                className={`left-items ${tab == 1 ? "active" : ""}`}
                onClick={() => setTab(1)}
              >
                <SlShareAlt /> <span className="profile_main_tab">Refer & Earn</span>
              </a>
            ) : (
              ""
            )}
            {detail?.is_wallet_active ? (
              <a
                className={`left-items ${tab == 2 ? "active" : ""}`}
                onClick={() => setTab(2)}
              >
                <TfiWallet /><span className="profile_main_tab"> Your Wallet</span>
              </a>
            ) : (
              ""
            )}
            <a className="left-items" onClick={handleLogout}>
              <MdLogout /><span className="profile_main_tab">Logout</span>
            </a>
          </div>
          {/* <div className="centernavline"></div> */}

          {tab == 0 ? (
            <UserData
              setRender={setRender}
              render={render}
              userData={userData}
            />
          ) : (
            ""
          )}
          {tab == 1 ? (
            <ReferEarn
              setRender={setRender}
              render={render}
              userData={userData}
              detail={detail}
            />
          ) : (
            ""
          )}
          {tab == 2 ? (
            <Wallet
              setRender={setRender}
              render={render}
              userData={userData}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </LayoutFour>
  );
}
