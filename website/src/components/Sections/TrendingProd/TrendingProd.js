import Slider from "react-slick";
import { PrevArrow, NextArrow } from "../../Other/SliderArrow";
import Link from "next/link";
import Loading from "../../Other/Loading";

import Carousel from "react-multi-carousel";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../../../../config";
import axios from "axios";
import Product from "../../Product";

export default function TrendingProd({ data, mainHeading, description }) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const [productData, setProductData] = useState([]);

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/website/front/get/product/trending`;

      const res = await axios.get(url, { withCredentials: true });

      console.log("afsaf;djfl >>>>>>>>>", res.data);

      setProductData(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <Loading />;

  return (
    <>
      {productData.length <= 0 ? (
        ""
      ) : (
        <div className="container mt-5 p-0">
          <div className="brand-two">
            <div className="two d-flex justify-content-between w-100 px-2">
              <h2 className="headingSection">
                {mainHeading}
                <span>{description}</span>
              </h2>

              <Link
                href={`${process.env.PUBLIC_URL}/trending-products`}
                // href={`#`}
                as={`${process.env.PUBLIC_URL}/trending-products`}
                // as={`#`}
              >
                <div className="button-37 p-0">View All</div>
              </Link>
            </div>
            <div className="brand-two__wrapper">
              <Carousel
                responsive={responsive}
                swipeable={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={3000}
              >
                {productData?.reverse()?.map((brand) => {
                  return <Product data={brand} />;
                })}
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
