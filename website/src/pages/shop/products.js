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
import { baseUrl, web_title } from "../../../config";
import axios from "axios";
import Loading from "../../components/Other/Loading";
import { useMediaQuery } from "react-responsive";
import { MobileSidebar } from "../../components/Shop/MobileSidebar";
import { Button, IconButton } from "@mui/material";
import { CiFilter } from "react-icons/ci";

import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function () {
  // const filterData = useSelector((state) => state.shopReducers.filter);
  // const pageLimit = 12;
  // const [offset, setOffset] = useState(0);
  // const [currentView, setCurrentView] = useState();
  // const [currentSort, setCurrentSort] = useState();
  // const [count, setCount] = useState(12);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [currentData, setCurrentData] = useState([]);
  // const [productData, setProductData] = useState([]);
  // const [categoriesData, setCategoriesData] = useState([]);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  // const [loading, setLoading] = useState(false);
  // const [total, setTotal] = useState(0);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const url_pro = `${baseUrl}/api/website/front/all/products?page=${currentPage}&size=12`;
  //     const res_pro = await axios.get(url_pro, { withCredentials: true });
  //     setProductData(res_pro.data.allProducts);
  //     setTotal(res_pro?.data?.count);
  //     setCurrentPage(res_pro?.data?.page);
  //     const url = `${baseUrl}/api/website/front/get/all/brands`;
  //     const arr = await axios.get(url, { withCredentials: true });
  //     const res = arr.data.filter(
  //       (arr, index, self) =>
  //         index ===
  //         self.findIndex((t) => t.main_category_name === arr.main_category_name)
  //     );
  //     setCategoriesData(res);
  //     setLoading(false);
  //     console.log("productData---", res_pro.data.allProducts);
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // };

  // useState(() => {
  //   fetchData();
  // }, []);

  // async function PageData(page) {
  //   try {
  //     setLoading(true);
  //     const url_pro = `${baseUrl}/api/website/front/all/products?page=${page}&size=12`;
  //     const res_pro = await axios.get(url_pro, { withCredentials: true });
  //     setProductData(res_pro.data.allProducts);

  //     setTotal(res_pro.data.count);

  //     console.log("productData---", res_pro.data.allProducts);
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   let sortedProduct = getProductbyFilter(
  //     productData,
  //     currentSort,
  //     filterData.category,
  //     filterData.priceRange.from,
  //     filterData.priceRange.to,
  //     filterData.brand,
  //     10
  //   );

  //   console.log(sortedProduct);

  //   setCurrentData(sortedProduct);
  // }, [offset, currentSort, filterData]);

  // console.log(total);
  // console.log(currentPage === Math.round(total / 12));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [productData, setProductData] = useState(null);

  const [rander, setRander] = useState(false);

  const [category, setCategory] = useState([]);
  const [sortPrice, setSortPrice] = useState("all");

  const [cate_input, setCate_input] = useState("");
  const [price_input, setPrice_input] = useState({
    minPrice: 0,
    maxPrice: 1000000,
  });

  const fetchData = async (page__, limit__) => {
    try {
      const url = `${baseUrl}/api/website/front/get/product/load/more?sortPrice=${sortPrice}&limit=${limit__}&page=${page__}&cate=${cate_input}&min_price=${price_input.minPrice}&max_price=${price_input.maxPrice}`;
      const res = await axios.get(url, { withCredentials: true });
      setData([...data, ...res.data.result]);
      setProductData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page]);

  const fetchWithCate = async (page__, limit__) => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/website/front/get/product/load/more?sortPrice=${sortPrice}&limit=${limit__}&page=${page__}&cate=${cate_input}&min_price=${price_input.minPrice}&max_price=${price_input.maxPrice}`;
      const res = await axios.get(url, { withCredentials: true });
      setData([...res.data.result]);
      setProductData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWithCate(page, limit);
  }, [cate_input, rander, sortPrice]);

  const fetchCate = async () => {
    const url_cate = `${baseUrl}/api/website/front/get/all/categories`;
    const res = await axios.get(url_cate, { withCredentials: true });

    const uniqueCategories = {};
    const uniqueData = res?.data?.filter((item) => {
      if (!uniqueCategories[item.main_category_name]) {
        uniqueCategories[item.main_category_name] = true;
        return true;
      }
      return false;
    });

    setCategory(uniqueData);
  };
  useEffect(() => {
    fetchCate();
  }, []);

  console.log("Product Data", productData);

  const [filterShow, setFilterShow] = useState(false);

  console.log("sortPrice", sortPrice);

  return (
    <LayoutOne title={web_title}>
      <Breadcrumb title="Shop Products">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="Shop" current />
      </Breadcrumb>

      <div className="phone_button" style={{ justifyContent: "space-between" }}>
        <Button
          onClick={() => setFilterShow(true)}
          variant="outlined"
          startIcon={<CiFilter />}
        >
          Filter
        </Button>

        {/* Menu Short Start */}
        <div>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="outlined"
            disableElevation
            onClick={handleClick}
            startIcon={<KeyboardArrowDownIcon />}
          >
            Sort
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                setSortPrice(true);
              }}
              disableRipple
              className="d-flex"
              style={{ alignItems: "center", gap: 10 }}
            >
              <FaSortAmountDown />
              Price (High to Lower)
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClose();
                setSortPrice(false);
              }}
              disableRipple
              className="d-flex"
              style={{ alignItems: "center", gap: 10 }}
            >
              <FaSortAmountUp />
              Price (Lower to High)
            </MenuItem>
            {/* <Divider sx={{ my: 0.5 }} /> */}
          </StyledMenu>
        </div>
        {/* Menu Short end */}
      </div>

      {isTabletOrMobile ? (
        <div>
          {/* <MobileSidebar
            setCate_input={setCate_input}
            cate_input={cate_input}
            categoriesData={category}
          /> */}
          <ShopSidebar
            cate_input={cate_input}
            setCate_input={setCate_input}
            categoriesData={category}
            setRander={setRander}
            setPrice_input={setPrice_input}
            price_input={price_input}
            filterShow={filterShow}
            setFilterShow={setFilterShow}
            setPage={setPage}
            sortPrice={sortPrice}
            setSortPrice={setSortPrice}
          />
          {loading ? (
            <Loading />
          ) : (
            <div className="col-12 col-md-12 col-lg-12 col-xl-12">
              {!data || data.length === 0 ? (
                <h1>No product found</h1>
              ) : (
                <>
                  <h2 className="mb-3">Total Products: {productData?.count}</h2>
                  <div className="row">
                    {/* {sortPrice == "all"
                      ? data.map((item, index) => {
                          return (
                            // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                            <div key={index} className="p-0 product_cointener">
                              <Product data={item} />
                            </div>
                          );
                        })
                      : data
                          .sort((ele1, ele2) =>
                            sortPrice
                              ? ele1.product_sale_price >
                                ele2.product_sale_price
                                ? -1
                                : 1
                              : ele1.product_sale_price >
                                ele2.product_sale_price
                              ? 1
                              : -1
                          )
                          .map((item, index) => {
                            return (
                              // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                              <div
                                key={index}
                                className="p-0 product_cointener"
                              >
                                <Product data={item} />
                              </div>
                            );
                          })} */}
                    {data.map((item, index) => {
                      return (
                        // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                        <div key={index} className="p-0 product_cointener">
                          
                          <Product data={item} />
                        </div>
                      );
                    })}
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
                  {/* <AllProductsCard
                    gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                    listColClass="col-12 col-xl-6"
                    view="grid"
                    data={currentData.length === 0 ? productData : currentData}
                  /> */}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="shop -five-col">
            <div className="container-full-half">
              <div className="row">
                <div className="col-12 col-md-4 col-lg-3 col-xl-2">
                  <ShopSidebar
                    cate_input={cate_input}
                    setCate_input={setCate_input}
                    categoriesData={category}
                    setRander={setRander}
                    setPrice_input={setPrice_input}
                    price_input={price_input}
                    filterShow={filterShow}
                    setFilterShow={setFilterShow}
                    setPage={setPage}
                    sortPrice={sortPrice}
                    setSortPrice={setSortPrice}
                  />
                </div>
                {loading ? (
                  <>
                    <Loading />{" "}
                  </>
                ) : (
                  <div className="col-12 col-md-8 col-lg-9 col-xl-10">
                    {!data || data.length === 0 ? (
                      <h1>No product found</h1>
                    ) : (
                      <>
                        <h2 className="mb-3">
                          Total Products: {productData?.count}
                        </h2>
                        <div className="row">
                          {/* {sortPrice == "all"
                            ? data.map((item, index) => {
                                return (
                                  // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                                  <div
                                    key={index}
                                    className="p-0 product_cointener"
                                  >
                                    hi
                                    <Product data={item} />
                                  </div>
                                );
                              })
                            : data
                                .sort((ele1, ele2) =>
                                  sortPrice
                                    ? ele1.product_sale_price >
                                      ele2.product_sale_price
                                      ? -1
                                      : 1
                                    : ele1.product_sale_price >
                                      ele2.product_sale_price
                                    ? 1
                                    : -1
                                )
                                .map((item, index) => {
                                  return (
                                    // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                                    <div
                                      key={index}
                                      className="p-0 product_cointener"
                                    >
                                      <Product data={item} />
                                    </div>
                                  );
                                })} */}
                          {data.map((item, index) => {
                            return (
                              // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
                              <div
                                key={index}
                                className="p-0 product_cointener"
                              >
                                
                                <Product data={item} />
                              </div>
                            );
                          })}
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
                        {/* <AllProductsCard
                          gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                          listColClass="col-12 col-xl-6"
                          view="grid"
                          data={
                            currentData.length === 0 ? productData : currentData
                          }
                        /> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutOne>
  );
}
