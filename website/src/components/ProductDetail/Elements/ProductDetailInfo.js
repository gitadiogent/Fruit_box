import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import classNames from "classnames";
// import Button from "../../Control/Button";

import { formatCurrency } from "../../../common/utils";
import { addToCart } from "../../../redux/actions/cartActions";
import { addToWishlist } from "../../../redux/actions/wishlistActions";
import ProductDetailController from "./ProductDetailController";
import ProductDetailInfoTab from "./ProductDetailInfoTab";
import Rate from "../../Other/Rate";
import { checkProductInWishList } from "../../../common/shopUtils";
import { Button, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

import { Dialog } from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaCopy } from "react-icons/fa6";
import { MdCopyAll } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ProductDetailInfo({
  data,
  onReviewSubmit,
  productColor,
  productVariant1,
  productVariant2,
  selectedProductVariantColorFunc,
  selectedProductVariant1Func,
  selectedProductVariant2Func,
  hideTab,
  original,
}) {
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlistReducer);
  const [quantity, setQuantity] = useState(0);
  const [otherColor, setOtherColor] = useState();
  const [confirmCancleOrder, setConfirmCancleOrder] = useState(false);
  const getQuantity = (q) => {
    setQuantity(q);
  };

  const onAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(data, quantity, otherColor));
    toast.success("Product added to cart");
  };
  const onAddToWishList = (e) => {
    e.preventDefault();
    let product = checkProductInWishList(wishlistState, data._id);
    dispatch(addToWishlist(data));
    toast.dismiss();
    if (!product) {
      return toast.success("Product added to wishlist !");
    } else {
      return toast.error("Product removed from wishlist !");
    }
  };

  console.log(
    "productColor,productVariant1,productVariant2===>>",
    productColor,
    productVariant1,
    productVariant2
  );

  return (
    <>
      <div className="product-detail__content">
        <div className="product-detail__content__header">
          <div
            className="d-flex"
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <h5 className="product_category">{data.category}</h5>
              <h2 className="product_name">{data.name}</h2>
            </div>
            <div className="shareIcons">
              {/* <FacebookShareButton url={window.location.href} title="facebook"> */}
              <IconButton
                onClick={() => {
                  setConfirmCancleOrder(true);
                }}
              >
                <BsFillShareFill />
              </IconButton>
            </div>
          </div>
          {/* <div className="product-detail__content__header__comment-block">
          <Rate currentRate={data.rate} />
          <p>03 Reviews</p>
          <Link href={process.env.PUBLUC_URL + "#"}>
            <a>Write a reviews</a>
          </Link>
        </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className="product_top_details">
              {!data.discount && (
                <h5 className="product-price--discount">
                  {formatCurrency(data?.regular_price)}
                </h5>
              )}

              <h3 className="product-price--main">
                {!data.discount
                  ? formatCurrency(data?.price)
                  : formatCurrency(data?.price)}
              </h3>
            </div>
            <h3 className="offer_percentage button-92" role="button">
              {(
                ((data.regular_price - data.price) / data.regular_price) *
                100
              ).toFixed(0)}
              % OFF
            </h3>
          </div>
          {/* <h3>
          {formatCurrency(data.price)}
          {!data.discount
            ? formatCurrency(data.price)
            : formatCurrency(data.price)}
          {!data.discount && (
            <span>{formatCurrency(data.regular_price)}</span>
          )}
        </h3> */}
        </div>
        <div className="divider"></div>
        <div className="product-detail__content__footer">
          {/* product variant 1 */}
          {data?.is_variant_true &&
          data?.variant_option?.length &&
          data?.variant_option[0] &&
          data?.variant_option[0]?.option_name == "color picker" ? (
            <div className="main_variant_div">
              <span
                className="varient_name"
                style={{ textTransform: "capitalize" }}
              >
                {data?.variant_option[0]?.option_name == "color picker"
                  ? "colors"
                  : data?.variant_option[0]?.option_name}
              </span>
              <div className="variant_list_color ">
                {data?.variant_option[0]?.option_values?.map((value) => (
                  <div
                    className={
                      productColor == value
                        ? "selected_variant_color_style"
                        : "variant_color_style"
                    }
                    onClick={() => selectedProductVariantColorFunc(value)}
                  >
                    <div
                      className="variant_color_style_inner"
                      style={{ backgroundColor: value }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="main_variant_div">
              <span
                className="varient_name"
                style={{ textTransform: "capitalize" }}
              >
                {data?.variant_option &&
                data?.variant_option[0]?.option_name == "color picker"
                  ? "colors"
                  : data?.variant_option[0]?.option_name}{" "}
              </span>
              {data?.variant_option[0]?.option_values?.map((value) => (
                // <div className={productVariant1 == value ? "selected_variant_list " : "variant_list " } onClick={()=>selectedProductVariant1Func(value)} >
                <div
                  className="variant_list "
                  onClick={() => selectedProductVariant1Func(value)}
                >
                  <p
                    className={
                      productVariant1 == value
                        ? "selected_variant_list_inner"
                        : "variant_list_inner"
                    }
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* product variant 2 */}
          {data?.is_variant_true &&
          data?.variant_option?.length &&
          data?.variant_option[1] &&
          data?.variant_option[1]?.option_name == "color picker" ? (
            <div className="main_variant_div">
              <span
                className="varient_name"
                style={{ textTransform: "capitalize" }}
              >
                {data?.variant_option[1]?.option_name == "color picker"
                  ? "colors"
                  : data?.variant_option[1]?.option_name}{" "}
              </span>
              <div className="variant_list_color ">
                {data?.variant_option[1]?.option_values?.map((value) => (
                  <div
                    className={
                      productColor == value
                        ? "selected_variant_color_style"
                        : "variant_color_style"
                    }
                    onClick={() => selectedProductVariantColorFunc(value)}
                  >
                    <div
                      className="variant_color_style_inner"
                      style={{ backgroundColor: value }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="main_variant_div">
              <span
                className="varient_name"
                style={{ textTransform: "capitalize" }}
              >
                {data?.variant_option[1]?.option_name == "color picker"
                  ? "colors"
                  : data?.variant_option[1]?.option_name}
              </span>
              {data?.variant_option[1]?.option_values?.map((value) => (
                <div
                  className="variant_list "
                  onClick={() => selectedProductVariant2Func(value)}
                >
                  <p
                    className={
                      productVariant2 == value
                        ? "selected_variant_list_inner"
                        : "variant_list_inner"
                    }
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* if variant not exists */}
          {!data?.is_variant_true && data?.product_original_quantity < 1 && (
            <p className="out_stock_product">Out of Stock</p>
          )}
          {/* if variant exists */}
          {data?.is_variant_true && data?.product_variant_quantity < 1 && (
            <p className="out_stock_product">Out of Stock</p>
          )}

          <ProductDetailController
            data={data}
            quan={data?.quantity}
            getQuantity={getQuantity}
            onAddToCart={onAddToCart}
            onAddToWishList={onAddToWishList}
            color={otherColor}
            original={original}
          />

          <div className="table_detailPage mt-2 mb-3">
            <div className="border" border="1">
              <div className="p-2"> Product code:</div>
              <div className="p-2" style={{ textTransform: "initial" }}>
                {" "}
                {data.id}
              </div>
            </div>
            <div className="border" border="1">
              <div className="p-2"> Product Main Category:</div>
              <div className="p-2"> {data.category}</div>
            </div>
            <div className="border" border="1">
              <div className="p-2"> Product Category: </div>
              <div className="p-2"> {data.innercategory}</div>
            </div>
            <div className="border" border="1">
              <div className="p-2"> Product Sub-Category:</div>
              <div className="p-2"> {data.subcategory}</div>
            </div>
          </div>

          {/* <ul>
          <li>
            Product code: <span>{data.id}</span>
          </li>
          <li>
            Product Main Category: <span>{data?.category}</span>
          </li>
          <li>
            Product Category: <span>{data?.innercategory}</span>
          </li>
          <li>
            Product Sub-Category: <span>{data?.subcategory}</span>
          </li>
        </ul> */}

          {/* <button className="btn -red">
          Make an enquiry
        </button> */}
        </div>
        {/* {!hideTab && (
        <>
          <div className="divider"></div>
          <div className="product-detail__content__tab">
            <ProductDetailInfoTab original={original} data={data} onReviewSubmit={onReviewSubmit} />
          </div>
        </>
      )} */}
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
            <WhatsappShareButton url={window.location.href} title={data.name}>
              <img src="/whatsapp.png" alt="" style={{ width: "40px" }} />
            </WhatsappShareButton>

            <FacebookShareButton url={window.location.href} title={data.name}>
              <img src="/faceboo.png" alt="" style={{ width: "40px" }} />
            </FacebookShareButton>

            <TwitterShareButton url={window.location.href} title={data.name}>
              <img src="/twitter.png" alt="" style={{ width: "35px" }} />
            </TwitterShareButton>

            <Tooltip title={"Copy"}>
              <IconButton
                style={{ width: "53px", fontSize: "50px" }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
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
}
