import React, { useEffect, useState } from "react";
import Product from "../Product";
import classNames from "classnames";
import Slider from "react-slick";
import { PrevArrow, NextArrow } from "../Other/SliderArrow";
import Link from "next/link";
import { baseUrl } from "../../../config";
import axios from "axios";
import AllProductsCard from "./AllProductCards";

export default function ShopProductLoadMore() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [data, setData] = useState([]);

  const [productData, setProductData] = useState(null);

  const fetchData = async (page__, limit__) => {
    try {
      const url = `${baseUrl}/api/website/front/get/product/load/more?limit=${limit__}&page=${page__}`;

      const res = await axios.get(url, { withCredentials: true });

      console.log(res);

      setData([...data, ...res.data.result]);
      setProductData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page]);

  console.log("Product Data", productData);

  return (
    <>
      <div className="container shop_products_data mt-5 p-0">
        <div className="brand-two">
          <div className="two px-2">
            <h2 className="headingSection">
              All Selling Products
              <span></span>
            </h2>
          </div>
          <div className="ProductsTwo__wrapper" style={{marginTop: "20px"}}>
            <div className="col-12 col-md-12 col-lg-12 col-xl-12 p-0">
              {/* {data?.map((value, index) => (
              <Product key={index} data={value} />
            ))} */}

              <AllProductsCard
                gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                listColClass="col-12 col-xl-6"
                view="grid"
                data={data}
              />
            </div>
          </div>
        </div>

        {productData?.pages == page ? (
          ""
        ) : (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn -red reviewbtn "
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
