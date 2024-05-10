import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paginator from "react-hooks-paginator";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import { getProductbyFilter } from "../../common/productSelect";
import LayoutOne from "../../components/Layout/LayoutOne";
// import productData from "../../data/products.json";
import ShopProducts from "../../components/Shop/ShopProducts";
import ShopHeader from "../../components/Shop/ShopHeader";
import Product from "../../components/Product";
import InstagramTwo from "../../components/Sections/Instagram/InstagramTwo";
import ShopSidebar from "../../components/Shop/ShopSidebar";
import AllProductsCard from "../../components/Shop/AllProductCards";
import { baseUrl } from "../../../config";
import axios from "axios";
import Loading from "../../components/Other/Loading";
import { useMediaQuery } from "react-responsive";
import { MobileSidebar } from "../../components/Shop/MobileSidebar";
import { useRouter } from "next/router";
import Link from "next/link";

export default function () {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(28);

  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);

  const fetchData = async (limit__, page__) => {
    try {
      // setLoading(true);
      const url = `${baseUrl}/api/website/front/get/all/categories`;

      const res = await axios.get(url, { withCredentials: true });

      console.log("Data Response", res);
      const uniqueCategories = {};

      const uniqueData = res?.data?.filter((item) => {
        if (!uniqueCategories[item.main_category_name]) {
          uniqueCategories[item.main_category_name] = true;
          return true;
        }
        return false;
      });

      // setData([...data, ...uniqueData]);
      setData(uniqueData);
      // setProductData(res.data);

      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  console.log("data", data);

  useEffect(() => {
    fetchData(limit, page);
  }, [page]);

  return (
    <LayoutOne title="Shop Fullwidth Left Sidebar">
      <Breadcrumb title="All Category">
        <BreadcrumbItem name="Home"  path={"/"} />
        <BreadcrumbItem name="All Category" current />
      </Breadcrumb>

      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className="col-12 col-md-12 col-lg-12 col-xl-12 p-0">
            <div className="container">
              <div className="allCategory mb-5">
                <h3
                  style={{
                    margin: "10px 0",
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: "24px",
                  }}
                >
                  Total Category: {data.length}
                </h3>
              </div>

              {!data || data === 0 ? (
                <h1>No product found</h1>
              ) : (
                <>
                  <div className="row gap-2">
                    {data.map((brand) => {
                      return (
                        <div
                          key={brand._id}
                          className="col-6 col-sm-6 col-md-3 col-lg-2 p-2"
                        >
                          <Link
                            // href={`${process.env.PUBLIC_URL}/shop/category/${brand.main_category_name}`}
                            href={`${process.env.PUBLIC_URL}/shop/category/[categoryName]`}
                            as={`${process.env.PUBLIC_URL}/shop/category/${brand.main_category_name}`}
                          >
                            <div>
                              <img
                                style={{ borderRadius: "50%", display: "flex" }}
                                src={brand.main_category_image?.image_url}
                                alt="Yummix cup cake"
                                className="card-img curselink"
                              />

                              <h4
                                className="text-center mt-3"
                                style={{
                                  textTransform: "capitalize",
                                  lineHeight: "24px",
                                }}
                              >
                                {brand?.category_name}
                              </h4>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* {productData?.pages == page ? (
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
            )} */}
          </div>
        )}
      </div>
    </LayoutOne>
  );
}
