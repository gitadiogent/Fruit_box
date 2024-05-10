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

export default function ClameRefer() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
            toast.success("Profile Updated Successfully!");
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
    <React.Fragment>
      {loading ? <Loading /> : ""}

      <Button variant="contained" onClick={handleClickOpen}>
        Clain Your Refer
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit Your Profile
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
        <DialogContent dividers style={{ width: 500 }}>
          <div className="input mt-2">
            <TextField
              label="Enter Your Refer Id"
              variant="outlined"
              size="default"
              value={typeRefer}
              name="username"
              fullWidth={true}
              onChange={onChangeHandaler}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Discard
          </Button>
          <Button variant="contained" onClick={() => handleEditUser()}>
            Claim Refer
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
