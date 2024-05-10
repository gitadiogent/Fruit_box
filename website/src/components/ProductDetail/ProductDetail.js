import React from "react";

import ProductDetailInfo from "./Elements/ProductDetailInfo";
import ProductDetailSlideTwo from "./Elements/ProductDetailSlideTwo";
import ProductDetailSlideOne from "./Elements/ProductDetailSlideOne";
import ProductDetailInfoTab from "./Elements/ProductDetailInfoTab";

export default function ProductDetail({
  data,
  onReviewSubmit,
  original,
  productColor,
  productVariant1,
  productVariant2,
  selectedProductVariantColorFunc,
  selectedProductVariant1Func,
  selectedProductVariant2Func,
  setRender
}) {
  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail__wrapper">
          <div className="row">
            <div className="col-12 col-md-5">
              <ProductDetailSlideTwo
                data={data}
                product_images={data?.images}
              />
            </div>
            <div className="col-12 col-md-7">
              <ProductDetailInfo
                original={original}
                data={data}
                productColor={productColor}
                productVariant1={productVariant1}
                productVariant2={productVariant2}
                selectedProductVariantColorFunc={
                  selectedProductVariantColorFunc
                }
                selectedProductVariant1Func={selectedProductVariant1Func}
                selectedProductVariant2Func={selectedProductVariant2Func}
                onReviewSubmit={onReviewSubmit}
              />
            </div>
          </div>

          <div className="product-detail__content__tab">
            <ProductDetailInfoTab
              original={original}
              data={data}
              onReviewSubmit={onReviewSubmit}
              setRender={setRender}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
