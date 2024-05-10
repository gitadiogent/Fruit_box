import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ClameRefer from "./ClameRefer";
import { toast } from "react-toastify";
import { IconButton, Tooltip } from "@mui/material";
import { IoCopyOutline } from "react-icons/io5";

import CloseIcon from "@mui/icons-material/Close";

import { Dialog } from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaCopy } from "react-icons/fa6";
import { MdCopyAll } from "react-icons/md";

import { Button } from "@mui/material";

import { BsFillShareFill } from "react-icons/bs";
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import { baseUrl } from "../../../config";
import axios from "axios";

const UserData = ({ userData, render, setRender, detail }) => {
  const [confirmCancleOrder, setConfirmCancleOrder] = useState(false);

  // const [detail, setDetail] = useState({});

  // useEffect(() => {
  //   axios
  //     .get(`${baseUrl}/api/admin/get/wallet/data`, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setDetail(res.data.wallet_data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const message = `Hi, I am inviting you to visit our website or download Our App and get reward points. Use refer id to redeem reward points. \n
  Refer ID: ${userData?.user_refer_id} \n
  Our Website: ${window.location.host} \n
  App Link: ${detail?.app_link}`;

  return (
    <>
      <div className="righttnav profile refer">
        <h3 className="heading">Refer & Earn</h3>
        <div className="profilemain d-flex gap-5">
          <div className="image">
            <img src="/cost.png" alt="" />
          </div>

          {/* <div className="content">
          <h2 className="name">{userData?.username}</h2>
          <h5>{userData?.email}</h5>
          <h5>{userData?.phone_number}</h5>
        </div> */}
        </div>

        <div className="stesps">
          <div className="step d-flex heading mt-4">How Does It Work?</div>
          <div className="step d-flex">
            <img src={"/share.png"} alt="" />
            Share & Invite Your Friend To Register on Website
          </div>
          <div className="step d-flex">
            <img src={"/signup.png"} alt="" />
            When Your Friend Registers on App, both of you will get {detail?.coins_per_refer} Coins.
          </div>
          <div className="step d-flex">
            <img src={"/money-bag.png"} alt="" />
            Reward Points Can Be Used To Buy Anything From Store.
          </div>
        </div>

        <div className="address mt-3">
          <div className="step d-flex heading mt-3 mb-2">
            Your Referral Code
          </div>
          <Tooltip title="Click to Share" arrow={true}>
            <div
              className="d-flex"
              style={{ alignItems: "center", width: "fit-content", gap: 10 }}
            >
              <h2
                className="refer_code"
                onClick={() => {
                  //   const message = `Hi, I am inviting you to visit our website or download Our App and get reward points. Use refer id to redeem reward points. \n
                  // Refer ID: ${userData?.user_refer_id} \n
                  // Our Website: ${window.location.host} \n
                  // App Link: https://play.google.com/store/apps/details?id=com.yourapp`;
                  //   navigator.clipboard.writeText(message);
                  //   toast.success("Copy Successfull");

                  setConfirmCancleOrder(true);
                }}
              >
                {userData?.user_refer_id}
              </h2>

              <IconButton
                style={{ width: "fit-content" }}
                onClick={() => {
                  //   const message = `Hi, I am inviting you to visit our website or download Our App and get reward points. Use refer id to redeem reward points. \n
                  // Refer ID: ${userData?.user_refer_id} \n
                  // Our Website: ${window.location.host} \n
                  // App Link: https://play.google.com/store/apps/details?id=com.yourapp`;
                  //   navigator.clipboard.writeText(message);
                  //   toast.success("Copy Successfull");

                  setConfirmCancleOrder(true);
                }}
              >
                {/* <IoCopyOutline /> */}
                <BsFillShareFill />
              </IconButton>
            </div>
          </Tooltip>

          <div className="area">{/* <ClameRefer /> */}</div>
        </div>
      </div>

      <Dialog
        open={confirmCancleOrder}
        onClose={() => {
          setConfirmCancleOrder(false);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setConfirmCancleOrder(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id="responsive-dialog-title">Share Product</DialogTitle>
        <DialogContent>
          <div className="copy"></div>
          <div
            className="socalShare d-flex"
            style={{ gap: 20, minWidth: "300px" }}
          >
            <WhatsappShareButton title={message}>
              <img src="/whatsapp.png" alt="" style={{ width: "40px" }} />
            </WhatsappShareButton>

            <FacebookShareButton title={message}>
              <img src="/faceboo.png" alt="" style={{ width: "40px" }} />
            </FacebookShareButton>

            <TwitterShareButton title={message}>
              <img src="/twitter.png" alt="" style={{ width: "35px" }} />
            </TwitterShareButton>

            <Tooltip title={"Copy"}>
              <IconButton
                style={{ width: "53px", fontSize: "50px" }}
                onClick={() => {
                  navigator.clipboard.writeText(message);
                  toast.success("Copied Successfull !!");
                }}
              >
                <MdCopyAll />
              </IconButton>
            </Tooltip>
            {/* <InstapaperShareButton url={window.location.href} title={data.name}>
              <img src="/instagram.png" alt="" style={{ width: "40px" }} />
            </InstapaperShareButton> */}
          </div>
        </DialogContent>

        <DialogActions>
          {/* <Button
            variant="contained"
            onClick={() => {
              setConfirmCancleOrder(false);
            }}
          >
            OK
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserData;
