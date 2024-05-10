import React from "react";
import SectionTitleOne from "../../SectionTitle/SectionTitleOne";
import { PrevArrow, NextArrow } from "../../../Other/SliderArrow";
import ProductSlider from "../Elements/ProductSlider";

export default function ProductSlideTwo({ data }) {

  return (
    <div className="product-slide -style-2">
      <div className="container">
        {/* <SectionTitleOne align="center" hideDecoration>
          Related Products
        </SectionTitleOne> */}

        <div className="brand-two">
          <div className="two d-flex justify-content-between w-100">
            <h2 className="headingSection">Related Products
              <span></span>
            </h2>
          </div>
        </div>

        <ProductSlider data={data} />
      </div>
    </div>
  );
}
