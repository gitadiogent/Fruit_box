// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import Typography from "@mui/material/Typography";
// import { FaEdit } from "react-icons/fa";
// import { TextField } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Loading from "../Other/Loading";
// import { baseUrl } from "../../../config";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import {
//   setFilterCategory,
//   setFilterBrand,
//   setFilterPriceRange,
//   resetFilter,
// } from "../../redux/actions/shopActions";

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// export const MobileSidebar = ({ categoriesData, setCate_input }) => {
//   const [isOptionMenuActive, setOptionMenuActive] = useState(false);

//   const toggleOptionMenu = () => {
//     setOptionMenuActive(!isOptionMenuActive);
//   };

//   const dispatch = useDispatch();
//   const filterData = useSelector((state) => state.shopReducers.filter);
//   useEffect(() => {
//     dispatch(resetFilter());
//   }, []);

//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <>
//       {/* <Button type="button" onClick={handleOpen}>
//         Filter by Categories
//       </Button> */}

//       <div
//         onClick={handleOpen}
//         className="select-btn d-flex mb-3 px-2"
//         style={{ width: "100%", justifyContent: "space-between" }}
//       >
//         <span className="sBtn-text">Filter by Categories</span>
//         <i className="fa fa-angle-down"></i>
//       </div>

//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={open}
//         // style={{width: 700, minWidth: "100%"}}
//       >
//         <DialogTitle sx={{ m: 0, p: 1, px:2 }} id="customized-dialog-title">
//           Filter by Categories
//         </DialogTitle>
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//         <DialogContent dividers sx={{padding: 0}}>
//           <div
//             className={`select-menu active p-0  ${
//               isOptionMenuActive ? "active" : ""
//             }`}
//           >
//             <ul className="options">
//               <li className="option mt-0">
//                 <button
//                   style={{ background: "none", border: "none" }}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setCate_input("");
//                   }}
//                 >
//                   <span className="option-text">All</span>
//                 </button>
//               </li>
//               {categoriesData.map((it, index) => (
//                 <li className="option" key={index}>
//                   <button
//                     style={{ background: "none", border: "none" }}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       // dispatch(setFilterCategory(it.main_category_name));
//                       setCate_input(it.main_category_name);
//                       handleClose();
//                     }}
//                   >
//                     <span className="option-text">{it.main_category_name}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </DialogContent>
//       </BootstrapDialog>
//     </>
//   );
// };


import React, { useState } from "react";
import {
  setFilterCategory,
  setFilterBrand,
  setFilterPriceRange,
  resetFilter,
} from "../../redux/actions/shopActions";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const MobileSidebar = ({ categoriesData, setCate_input }) => {
  const [isOptionMenuActive, setOptionMenuActive] = useState(false);

  const toggleOptionMenu = () => {
    setOptionMenuActive(!isOptionMenuActive);
  };

  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.shopReducers.filter);
  useEffect(() => {
    dispatch(resetFilter());
  }, []);

  return (
    <div className={`select-menu ${isOptionMenuActive ? "active" : ""}`}>
      <div onClick={toggleOptionMenu} className="select-btn d-flex" style={{alignItems: "center", justifyContent: "space-between"}}>
        <span className="sBtn-text">Filter by Categories</span>
        <i className="fa fa-angle-down"></i>
      </div>
      <ul className="options">
        <li className="option">
          <button
            style={{ background: "none", border: "none" }}
            onClick={(e) => {
              e.preventDefault();
              setCate_input("");
            }}
          >
            <span className="option-text">All</span>
          </button>
        </li>
        {categoriesData.map((it, index) => (
          <li className="option" key={index}>
            <button
              style={{ background: "none", border: "none" }}
              onClick={(e) => {
                e.preventDefault();
                // dispatch(setFilterCategory(it.main_category_name));
                setCate_input(it.main_category_name);
              }}
            >
              <span className="option-text">{it.main_category_name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};