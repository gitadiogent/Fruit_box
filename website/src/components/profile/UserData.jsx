import React from "react";
import { useSelector } from "react-redux";
import { GiTwoCoins } from "react-icons/gi";

import { IconButton } from "@mui/material";
import EditProfile from "./EditProfile";

const UserData = ({ userData, render, setRender }) => {
  // const userData = useSelector((state) => state.userReducer.user.user);

  return (
    <div className="righttnav profile">
      <div
        className="heading d-flex"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <h3 className="heading">My Profile</h3>
        <div className="edit">
          <EditProfile
            userDataMain={userData}
            render={render}
            setRender={setRender}
          />
        </div>
      </div>

      <div className="profilemain d-flex justify-content-between gap-5">
        <div className="profilemain d-flex gap-5">
          {/* <div className="image">
            <img src="/noimage.webp" alt="" />
          </div> */}

          <div className="content">
            <h5 className="name">
              <b>Name: - </b>
              {userData?.username}
            </h5>
            <h5>
              <b>Email: - </b>
              {userData?.email}
            </h5>
            <h5>
              <b>Phone: - </b>
              {userData?.phone_number}
            </h5>

            {/* <div className="address mt-3">
              <h5>
                <b>Your Address</b>
              </h5> */}
            <h5>
              <b>Address: -</b> {userData?.address}
            </h5>
            <h5>
              <b>City: -</b> {userData?.state}
            </h5>
            <h5>
              <b>Pincode: -</b> {userData?.pincode}
            </h5>
            {/* </div> */}

            {/* <h3>
              Your Wallet: - {userData?.wallet}
              <GiTwoCoins style={{ fontSize: 30 }} color="#ff9800" />
            </h3> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
