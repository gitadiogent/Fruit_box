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
      const url = `${baseUrl}/api/website/front/get/product/arrivals/all?limit=${limit__}&page=${page__}`;

      const res = await axios.get(url, { withCredentials: true });

      console.log("Data Response", res);

      setData([...data, ...res.data.result]);
      setProductData(res.data);

      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(limit, page);
  }, [page]);

  // console.log("Main Data => ", data);

  return (
    <LayoutOne title="Shop Fullwidth Left Sidebar">
      <Breadcrumb title="New Arrivals">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="New Arrivals" current />
      </Breadcrumb>

      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className="col-12 col-md-12 col-lg-12 col-xl-12 p-0">
            <div className="container p-0">
              <div className="allCategory mb-3">
                <h3
                  style={{
                    margin: "10px 0",
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: "24px",
                    padding: "0 5px"
                  }}
                >
                  Showing Products: {data.length}
                </h3>
              </div>

              {!productData || productData.length === 0 ? (
                <h1>No product found</h1>
              ) : (
                <>
                  <AllProductsCard
                    gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                    listColClass="col-12 col-xl-6"
                    view="grid"
                    data={data}
                  />
                </>
              )}
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
        )}
      </div>
    </LayoutOne>
  );
}
