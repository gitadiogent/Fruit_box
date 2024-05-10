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



export default function EditProfile({ render, setRender, userDataMain }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log(userDataMain);

  // const userDataMain = useSelector((state) => state.userReducer.user.user);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setUserData(userDataMain);
  }, [userDataMain]);

  const onChangeHandaler = (e) => {
    console.log(e.target);
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //   handle edit profile

  const handleEditUser = async () => {
    if (
      userData?.username != "" &&
      userData?.phone_number != "" &&
      userData?.email != "" &&
      userData?.address != "" &&
      userData?.pincode &&
      userData?.state != ""
    ) {
      setLoading(true);
      await axios
        .patch(
          `${baseUrl}/api/website/front/user/edit/${userDataMain._id}`,
          userData,
          {
            withCredentials: true,
          }
        )
        .then(async (res) => {
          console.log(res);
          if (res.data.success) {
            toast.success("Profile Updated Successfully!");
          }

          setRender(!render);

          setLoading(false);
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast.error("Please fill all The Field");
    }
  };

  console.log(userData);

  return (
    <React.Fragment>
      {loading ? <Loading /> : ""}

      <IconButton onClick={handleClickOpen}>
        <FaEdit />
      </IconButton>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        // style={{width: 700, minWidth: "100%"}}
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
          <div className="input mt-4">
            <TextField
              label="Your Name"
              variant="outlined"
              size="default"
              value={userData.username}
              name="username"
              fullWidth={true}
              onChange={onChangeHandaler}
            />
          </div>
          <div className="input mt-4">
            <TextField
              label="Phone Number"
              variant="outlined"
              size="default"
              fullWidth={true}
              value={`${userData.phone_number ? userData.phone_number : ""}`}
              onChange={onChangeHandaler}
              name="phone_number"
              // disabled={true}
            />
          </div>
          <div className="input mt-4">
            <TextField
              label="Email Address"
              variant="outlined"
              size="default"
              fullWidth={true}
              value={userData.email}
              onChange={onChangeHandaler}
              name="email"
            />
          </div>
          <div className="input mt-4">
            <TextField
              label="Address"
              variant="outlined"
              size="default"
              value={userData.address}
              onChange={onChangeHandaler}
              name="address"
              fullWidth={true}
            />
          </div>
          <div className="input mt-4">
            <TextField
              label="City"
              variant="outlined"
              size="default"
              value={userData.state}
              onChange={onChangeHandaler}
              name="state"
              fullWidth={true}
            />
          </div>
          <div className="input mt-4">
            <TextField
              label="Pincode"
              variant="outlined"
              size="default"
              value={userData.pincode}
              onChange={onChangeHandaler}
              name="pincode"
              fullWidth={true}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Discard
          </Button>
          <Button variant="contained" onClick={() => handleEditUser()}>
            Save Changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
