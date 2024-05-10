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
import { useRouter } from "next/router";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function GigtCoin({ open, setOpen, coinGifted }) {
  //payment by razorpay
  const router = useRouter();

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={() => {
          setOpen((prev) => !prev);
          router.push("/profile");
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        // style={{width: 700, minWidth: "100%"}}
      >
        <DialogTitle
          style={{
            padding: "20px 30px",
            fontWeight: "bold",
            textAlign: "center",
          }}
          id="customized-dialog-title"
        >
          {/* You Receive Gift Coins {coinGifted} */}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen((prev) => !prev);
            router.push("/profile");
          }}
          sx={{
            position: "absolute",
            right: "20px",
            top: "15px",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="coupon_content_popup" style={{}}>
          <div
            className="coupons w-100 mb-4 d-flex"
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <h2>Your Receive Coins</h2>
            <h1>
              <b>{coinGifted}</b>
            </h1>

            <button
              className="btn -red"
              onClick={() => {
                router.push("/profile");
              }}
            >
              OK
            </button>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
