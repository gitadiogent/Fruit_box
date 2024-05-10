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
import { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BulkInquiryForm = ({ open, setOpen, data }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [username, setUsername] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);

  const submitInq = async (e) => {
    // e.preventDefault();
    setLoading(true);
    try {
      const url = `${baseUrl}/api/website/front/create/bulk/inquiry`;
      const res = await axios.post(
        url,
        { username, phone_number, message, product: data, quantity },
        { withCredentials: true }
      );
      console.log(res);

      if (res.data.success) {
        toast.success("Inquiry Send Successfull");
        handleClose();
        setUsername("");
        setPhone_number("");
        setMessage("");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //   console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      {loading ? <Loading /> : ""}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{
          // width: window.innerWidth > 724 ? 700 : "100%",
          // minWidth: "100%",
          zIndex: 999999999999,
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Bulk Inquiry
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          // sx={{ width: window.innerWidth > 724 ? 500 : "100%" }}
        >
          <div className="input mt-0">
            <TextField
              label="Your Name"
              variant="outlined"
              size="default"
              value={username}
              name="username"
              fullWidth={true}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="input mt-2">
            <TextField
              label="Your 10 Digit Phone Number"
              variant="outlined"
              size="default"
              value={phone_number}
              name="phone"
              type="number"
              fullWidth={true}
              onChange={(e) => {
                setPhone_number(e.target.value);
              }}
            />
          </div>
          <div className="input mt-2">
            <TextField
              label="Product Quantity"
              variant="outlined"
              size="default"
              value={quantity}
              name="phone"
              type="number"
              fullWidth={true}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div className="input mt-2">
            <TextField
              label="Message"
              variant="outlined"
              size="default"
              value={message}
              name="username"
              fullWidth={true}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              multiline={true}
              rows={5}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              submitInq();
            }}
          >
            Send Inquiry
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default BulkInquiryForm;
