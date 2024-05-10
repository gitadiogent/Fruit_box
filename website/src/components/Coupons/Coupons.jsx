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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Coupons({ setCouponInput }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const userDataMain = useSelector((state) => state?.userReducer?.user?.user);
  const [loading, setLoading] = React.useState(false);

  const [userData, setUserData] = React.useState({});
  React.useEffect(() => {
    setUserData(userDataMain);
  }, []);

  const onChangeHandaler = (e) => {
    console.log(e.target);
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const [couponData, setCouponData] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${baseUrl}/api/website/front/app/get/coupons`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("PRODUCT REVIEW==>>", res?.data);
        setCouponData([...res?.data?.coupons]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(couponData);

  return (
    <React.Fragment>
      {loading ? <Loading /> : ""}

      <Button style={{ color: "#000" }} onClick={handleClickOpen}>
        See All
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        // style={{width: 700, minWidth: "100%"}}
      >
        <DialogTitle
          style={{ padding: "20px 30px", fontWeight: "bold" }}
          id="customized-dialog-title"
        >
          All Coupons
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          <div className="coupons w-100">
            {couponData.length <= 0 ? (
              <>
                <div>
                  <h3>No Coupon Found</h3>
                </div>
              </>
            ) : (
              ""
            )}
            {couponData?.map((ele) => {
              return (
                <div
                  key={ele._id}
                  className="w-100 coupon mb-3"
                  style={{
                    border: "solid 1px #e1e1e1",
                    alignItems: "center",
                    padding: "10px 10px",
                  }}
                >
                  <div
                    className="head d-flex justify-content-between"
                    style={{ alignItems: "start" }}
                  >
                    <div>
                      <h3>{ele?.coupon_code.toUpperCase()}</h3>
                      <p className="mt-2" style={{fontSize: "13px"}}>
                      {ele?.description}
                      </p>
                    </div>

                    <button
                      className="btn -red"
                      variant="contained"
                      style={{ padding: "12px 30px" }}
                      onClick={() => {
                        setCouponInput(ele.coupon_code.toUpperCase());
                        handleClose();
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
