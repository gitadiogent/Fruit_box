import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paginator from "react-hooks-paginator";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "../../../components/Other/Breadcrumb";
import { getProductbyFilter } from "../../../common/productSelect";
import LayoutOne from "../../../components/Layout/LayoutOne";
// import productData from "../../data/products.json";
import ShopProducts from "../../../components/Shop/ShopProducts";
import ShopHeader from "../../../components/Shop/ShopHeader";
import Product from "../../../components/Product";
import InstagramTwo from "../../../components/Sections/Instagram/InstagramTwo";
import ShopSidebar from "../../../components/Shop/ShopSidebar";
import AllProductsCard from "../../../components/Shop/AllProductCards";
import { baseUrl } from "../../../../config";
import axios from "axios";
import Loading from "../../../components/Other/Loading";
import { useMediaQuery } from "react-responsive";
import { MobileSidebar } from "../../../components/Shop/MobileSidebar";
import { useRouter } from "next/router";
import SectionTitleOne from "../../../components/Sections/SectionTitle/SectionTitleOne";
import { Button, IconButton } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
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
  const [loading, setLoading] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const router = useRouter();
  const { categoryName } = router.query;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(28);

  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [rander, setRander] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchData = async (limit__, page__) => {
    try {
      // setLoading(true);
      const url = `${baseUrl}/api/website/front/get/product/category?limit=${limit__}&page=${page__}&category=${categoryName}&subcategory=${selectedCategory}`;
      // const url = `${baseUrl}/api/website/front/get/product/load/more?limit=${limit__}&page=${page__}`;=
      const res = await axios.get(url, { withCredentials: true });
      setData([...data, ...res.data.result]);
      setProductData(res.data);

      // setLoading(true);
      const cateUrl = `${baseUrl}/api/website/front/category/by/name/${categoryName}`;
      // const url = `${baseUrl}/api/website/front/get/product/load/more?limit=${limit__}&page=${page__}`;=
      const cateRes = await axios.get(cateUrl, { withCredentials: true });

      console.log("cateRes", cateRes);
      setCategoryData(cateRes.data.result);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(limit, page);
  }, [page]);

  const fetchDatasubCategroy = async (limit__, page__) => {
    try {
      // setLoading(true);
      const url = `${baseUrl}/api/website/front/get/product/category?limit=${limit__}&page=${page__}&category=${categoryName}&subcategory=${selectedCategory}`;
      // const url = `${baseUrl}/api/website/front/get/product/load/more?limit=${limit__}&page=${page__}`;=
      const res = await axios.get(url, { withCredentials: true });
      setData([...res.data.result]);
      setProductData(res.data);

      // setLoading(true);
      const cateUrl = `${baseUrl}/api/website/front/category/by/name/${categoryName}`;
      // const url = `${baseUrl}/api/website/front/get/product/load/more?limit=${limit__}&page=${page__}`;=
      const cateRes = await axios.get(cateUrl, { withCredentials: true });

      console.log("cateRes", cateRes);
      setCategoryData(cateRes.data.result);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasubCategroy(limit, page);
  }, [selectedCategory]);

  const [filterShow, setFilterShow] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [sortPrice, setSortPrice] = useState(false);

  console.log("sortPrice", sortPrice, data);

  return (
    <LayoutOne title="Shop Fullwidth Left Sidebar">
      <Breadcrumb title="Shop By Category">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name={categoryName} current />
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
          {/* <div className="col-12 col-md-4 col-lg-3 col-xl-2">
            
          </div> */}

          <div
            className={`shop-sidebar phoneSideBar w-100 ${
              filterShow ? "active" : ""
            }`}
          >
            <div
              className="closeFilter d-flex"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <IconButton
                color="primary"
                onClick={() => setFilterShow((prev) => !prev)}
              >
                <FaArrowLeft />
              </IconButton>

              <h3>Filters</h3>

              <span></span>
            </div>

            <div className="shop-sidebar__section -categories p-2">
              <SectionTitleOne className="-medium" spaceBottom={30 / 16 + "em"}>
                Filter Products
              </SectionTitleOne>
              <ul>
                <li className="mb-0">
                  <button
                    style={{ background: "none", border: "none" }}
                    onClick={async (e) => {
                      e.preventDefault();
                      setSelectedCategory("");
                      setPage(1);
                      setFilterShow((prev) => !prev);
                    }}
                  >
                    <a className={`${selectedCategory == "" ? "active" : ""}`}>
                      All
                    </a>
                  </button>
                </li>

                {categoryData?.map((ele, i) => {
                  return (
                    <li key={i} className="mb-0">
                      <button
                        style={{ background: "none", border: "none" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(ele);
                          setPage(1);
                          setFilterShow((prev) => !prev);
                        }}
                      >
                        <a
                          className={`${
                            selectedCategory == ele ? "active" : ""
                          }`}
                          style={{ gap: 10, alignItems: "center" }}
                        >
                          {ele}
                        </a>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
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
                    {!productData || productData.length === 0 ? (
                      <h1>No product found</h1>
                    ) : (
                      <>
                        <AllProductsCard
                          gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                          listColClass="col-12 col-xl-6"
                          view="grid"
                          data={data.sort((ele1, ele2) =>
                            sortPrice
                              ? ele1.product_sale_price >
                                ele2.product_sale_price
                                ? -1
                                : 1
                              : ele1.product_sale_price >
                                ele2.product_sale_price
                              ? 1
                              : -1
                          )}
                          sortPrice={sortPrice}
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
                  <div className="shop-sidebar__section -categories">
                    <SectionTitleOne
                      className="-medium"
                      spaceBottom={30 / 16 + "em"}
                    >
                      Filter Products
                    </SectionTitleOne>
                    <ul>
                      <li className="mb-0">
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSelectedCategory("");
                            setPage(1);
                          }}
                        >
                          <a className={`${sortPrice == "" ? "active" : ""}`}>
                            All
                          </a>
                        </button>
                      </li>

                      {categoryData?.map((ele, i) => {
                        return (
                          <li key={i} className="mb-0">
                            <button
                              style={{ background: "none", border: "none" }}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(ele);
                                setPage(1);
                              }}
                            >
                              <a
                                className={`${
                                  selectedCategory == ele ? "active" : ""
                                }`}
                                style={{ gap: 10, alignItems: "center" }}
                              >
                                {ele}
                              </a>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="shop-sidebar__section -categories">
                    <SectionTitleOne
                      className="-medium"
                      spaceBottom={30 / 16 + "em"}
                    >
                      Sort Products
                    </SectionTitleOne>
                    <ul>
                      <li className="mb-0">
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSortPrice(false);
                            setPage(1);
                          }}
                        >
                          <a className={`${!sortPrice ? "active" : ""}`}>
                            Price (Lower To High)
                          </a>
                        </button>
                      </li>
                      <li className="mb-0">
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={async (e) => {
                            e.preventDefault();
                            setSortPrice(true);
                            setPage(1);
                          }}
                        >
                          <a className={`${sortPrice ? "active" : ""}`}>
                            Price (High To Lower)
                          </a>
                        </button>
                      </li>
                    </ul>
                  </div>
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
                          {!productData || productData.length === 0 ? (
                            <h1>No product found</h1>
                          ) : (
                            <>
                              <AllProductsCard
                                gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                                listColClass="col-12 col-xl-6"
                                view="grid"
                                data={data.sort((ele1, ele2) =>
                                  sortPrice
                                    ? ele1.product_sale_price >
                                      ele2.product_sale_price
                                      ? -1
                                      : 1
                                    : ele1.product_sale_price >
                                      ele2.product_sale_price
                                    ? 1
                                    : -1
                                )}
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
