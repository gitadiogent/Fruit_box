import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FaEdit } from "react-icons/fa";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../Other/Loading";
import { baseUrl } from "../../../config";
import { toast } from "react-toastify";
import { IoCopyOutline } from "react-icons/io5";

const Wallet = ({ userData, render, setRender }) => {
  const userDataMain = useSelector((state) => state.userReducer.user.user);
  const [loading, setLoading] = React.useState(false);
  const [typeRefer, setTypeRefer] = React.useState("");

  const onChangeHandaler = (e) => {
    setTypeRefer(e.target.value.toUpperCase());
  };

  //   handle edit profile

  const handleEditUser = async () => {
    if (!typeRefer || typeRefer == userDataMain.user_refer_id) {
      return toast.error("Invalid Refer Id");
    }

    if (typeRefer) {
      setLoading(true);
      await axios
        .post(
          `${baseUrl}/api/website/front/refer/coin/claim`,
          { refer_id: typeRefer, userData: userDataMain },
          {
            withCredentials: true,
          }
        )
        .then(async (res) => {
          console.log(res);

          if (res.data.success == false) {
            toast.error(res.data.message);
          }

          if (res.data.success) {
            setRender((prev) => !prev);
            toast.success("Refer Claimed Successfully!");
          }

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="righttnav profile refer">
      <h3 className="heading">Your Wallet</h3>
      <div className="profilemain d-flex gap-5">
        <div className="image">
          <img src="/purse.png" alt="" />
        </div>

        {/* <div className="content">
          <h2 className="name">{userData?.username}</h2>
          <h5>{userData?.email}</h5>
          <h5>{userData?.phone_number}</h5>
        </div> */}
      </div>

      <div className="stesps walletTab">
        <div className="step d-flex heading mt-4">Wallet Coins</div>
        <div className="step d-flex">
          <img src={"/coin_wallet.png"} alt="" />
          <h2 className="coins">
            {userData.wallet} <span>Coins</span>
          </h2>
        </div>
        {/* <div className="step d-flex">
          <img src={"/signup.png"} alt="" />
          When Your Friend Registers on App, both of you will get ₹500 worth
          points.
        </div>
        <div className="step d-flex">
          <img src={"/money-bag.png"} alt="" />
          Reward Points Can Be Used To Buy Anything From Store.
        </div> */}
      </div>

      {userData?.isReferClamed ? (
        ""
      ) : (
        <div className="address mt-3">
          <div className="step d-flex heading mt-3 mb-2">
            Do You Have any Referral Code?
          </div>

          <div className="area referMain">
            <div className="input">
              <input
                label="Enter Your Refer Id"
                variant="outlined"
                fullWidth={true}
                size="default"
                value={typeRefer}
                name="username"
                onChange={onChangeHandaler}
                placeholder="Enter Your Refer Id"
              />
            </div>
            <button
              className="btn -red reviewbtn"
              variant="contained"
              onClick={() => handleEditUser()}
            >
              Claim Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
