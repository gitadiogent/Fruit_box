import { useState } from "react";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

import Quantity from "../../Control/Quantity";
import AddToCart from "../../Control/AddToCart";
import Button from "../../Control/Button";

import classNames from "classnames";

import {
  getAvaiableQuantityInCart,
  checkProductInWishList,
} from "../../../common/shopUtils";
import { EnquiryForm } from "../../form/EnquiryForm";
import { useRouter } from "next/router";
import BulkInquiryForm from "../../bulkinqForm/BulkInquiryForm";

export default function ProductDetailController({
  data,
  getQuantity,
  quan,
  onAddToCart,
  onAddToWishList,
  color,
  original,
}) {
  const [quantity, setQuantity] = useState();
  const cartState = useSelector((state) => state.cartReducer);
  const wishlistState = useSelector((state) => state.wishlistReducer);
  const [show, setShow] = useState(false);

  const avaiableProduct = getAvaiableQuantityInCart(
    cartState,
    data.id,
    data.quantity
  );

  console.log(quan);
  console.log(quan === 0);

  const router = useRouter();

  const buyNow = (e) => {
    onAddToCart(e);
    router.push("/shop/checkout");
  };

  const [bulkInq, setBulkInq] = useState(false);

  return (
    <>
      <BulkInquiryForm open={bulkInq} setOpen={setBulkInq} data={original} />
      <div
        className="product-detail__controler"
        style={{
          paddingBottom: "17px",
          justifyContent: "initial",
          gap: "20px",
        }}
      >
        {data.quantity === 0 ? (
          <div
            style={{
              fontWeight: "bold",
              color: "red",
            }}
          >
            This Product is currently out of stock
          </div>
        ) : (
          <>
            {/* {data?.is_variant_true && data?.product_variant_quantity > 0 && ( */}
            {/* {!data?.is_variant_true && data?.product_original_quantity > 0 && ( */}
            <Quantity
              className="-border -round"
              getQuantity={(q) => {
                setQuantity(q), getQuantity(q);
              }}
              maxValue={avaiableProduct}
            />
            <div
              className={`add-to-cart ${classNames(
                "-dark button -red"
              )} background_global`}
              onClick={(e) => {
                setBulkInq(!bulkInq);
              }}
            >
              <Button
                height="3.85em"
                width="3.85em"
                color="-dark"
                className="-round darkButton"
                action="#"
                content={
                  <>
                    <i class="fa fa-bolt" aria-hidden="true"></i>
                  </>
                }
              />
              <h5
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Bulk Inquiry
              </h5>
            </div>
            {/* )} */}
          </>
        )}

        <div className="control d-flex" style={{ gap: "15px" }}>
          {/* if variant not exists */}
          {!data?.is_variant_true && data?.product_original_quantity > 0 && (
            <AddToCart
              className={`-dark ${classNames({
                "-disable": data.quantity === 0,
              })}`}
              onClick={onAddToCart}
            />
          )}
          {/* if variant exists */}
          {data?.is_variant_true && data?.product_variant_quantity > 0 && (
            <AddToCart
              className={`-dark ${classNames({
                "-disable": data.quantity === 0,
              })}`}
              onClick={onAddToCart}
            />
          )}

          {!data?.is_variant_true && data?.product_original_quantity > 0 && (
            <div
              className={`add-to-cart ${classNames(
                "-dark button -red"
              )} background_global`}
              onClick={(e) => {
                buyNow(e);
              }}
            >
              <Button
                height="3.85em"
                width="3.85em"
                color="-dark"
                className="-round darkButton"
                action="#"
                content={
                  <>
                    <i class="fa fa-bolt" aria-hidden="true"></i>
                  </>
                }
              />
              <h5
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Buy Now
              </h5>
            </div>
          )}
          {/* if variant exists */}
          {data?.is_variant_true && data?.product_variant_quantity > 0 && (
            <div
              className={`add-to-cart ${classNames(
                "-dark button -red"
              )} background_global`}
              onClick={(e) => {
                buyNow(e);
              }}
            >
              <Button
                height="3.85em"
                width="3.85em"
                color="-dark"
                className="-round darkButton"
                action="#"
                content={
                  <>
                    <i class="fa fa-bolt" aria-hidden="true"></i>
                  </>
                }
              />
              <h5
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Buy Now
              </h5>
            </div>
          )}
        </div>

        {/* <div className="product-detail__controler__actions">
          <div data-tip data-for="add-wishlist">
            {data?.is_variant_true && data?.product_variant_quantity > 0 && (
              <div
                className={`add-to-cart ${classNames(
                  "-dark button -red"
                )} background_global`}
                onClick={() => {}}
              >
                <Button
                  height="3.85em"
                  width="3.85em"
                  color="-dark"
                  className="-round darkButton"
                  action="#"
                  content={
                    <>
                      <i class="fa fa-bolt" aria-hidden="true"></i>
                    </>
                  }
                />
                <h5
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Buy Now
                </h5>
              </div>
            )}
          </div>
        </div> */}
      </div>
      <EnquiryForm show={show} setShow={setShow} data={data} />
    </>
  );
}
