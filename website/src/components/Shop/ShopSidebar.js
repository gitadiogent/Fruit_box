import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import classNames from "classnames";

import SectionTitleOne from "../Sections/SectionTitle/SectionTitleOne";
import { shop } from "../../common/variables";
import { formatCurrency } from "../../common/utils";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import {
  setFilterCategory,
  setFilterBrand,
  setFilterPriceRange,
  resetFilter,
} from "../../redux/actions/shopActions";
import { Button, IconButton, TextField } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";

export default function ShopSidebar({
  categoriesData,
  setCate_input,
  cate_input,
  setRander,
  setPrice_input,
  price_input,
  filterShow,
  setFilterShow,
  setPage,
  sortPrice,
  setSortPrice,
}) {
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.shopReducers.filter);
  useEffect(() => {
    dispatch(resetFilter());
  }, []);

  const [priceActive, setPriceActive] = useState(true);

  let priceFil = [
    {
      minPrice: 0,
      maxPrice: 300,
    },
    {
      minPrice: 300,
      maxPrice: 500,
    },
    {
      minPrice: 500,
      maxPrice: 700,
    },
    {
      minPrice: 700,
      maxPrice: 1000,
    },
  ];

  return (
    <div className={`shop-sidebar phoneSideBar ${filterShow ? "active" : ""}`}>
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

      <div className="shop-sidebar__content">
        <div className="shop-sidebar__section -categories">
          <SectionTitleOne className="-medium" spaceBottom={30 / 16 + "em"}>
            Categories
          </SectionTitleOne>
          <ul>
            <li key={5345}>
              <button
                style={{ background: "none", border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  // dispatch(resetFilter());
                  setPage(1);
                  setCate_input("");
                  setFilterShow((prev) => !prev);
                }}
              >
                <a className={cate_input == "" ? "active" : ""}>All</a>
              </button>
            </li>
            {categoriesData.map((it, index) => (
              <li key={index}>
                <button
                  style={{ background: "none", border: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    // dispatch(setFilterCategory(it.main_category_name));
                    setCate_input(it.main_category_name);
                    setPage(1);

                    setFilterShow((prev) => !prev);
                  }}
                >
                  <a
                    className={
                      cate_input == it.main_category_name ? "active" : ""
                    }
                  >
                    {it.main_category_name}
                  </a>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="shop-sidebar__section -categories">
          <SectionTitleOne className="-medium" spaceBottom={30 / 16 + "em"}>
            Sort Product
          </SectionTitleOne>
          <ul>
            <li key={5345}>
              <button
                style={{ background: "none", border: "none" }}
                onClick={(e) => {
                  if (sortPrice == "all") {
                    return;
                  }
                  e.preventDefault();
                  setPage(1);
                  setSortPrice("all");
                  setFilterShow((prev) => !prev);
                }}
              >
                <a className={sortPrice == "all" ? "active" : ""}>All</a>
              </button>
            </li>
            <li key={5345}>
              <button
                style={{ background: "none", border: "none" }}
                onClick={(e) => {
                  if (sortPrice == false) {
                    return;
                  }

                  e.preventDefault();
                  setPage(1);
                  setSortPrice(false);
                  setFilterShow((prev) => !prev);
                }}
              >
                <a
                  className={
                    sortPrice == "all" ? "" : !sortPrice ? "active" : ""
                  }
                >
                  Price (Lower To High)
                </a>
              </button>
            </li>
            <li key={5345}>
              <button
                style={{ background: "none", border: "none" }}
                onClick={(e) => {
                  if (sortPrice == true) {
                    return;
                  }
                  e.preventDefault();
                  setPage(1);
                  setSortPrice(true);
                  setFilterShow((prev) => !prev);
                }}
              >
                <a
                  className={
                    sortPrice == "all" ? "" : sortPrice ? "active" : ""
                  }
                >
                  Price (High To Lower)
                </a>
              </button>
            </li>
          </ul>
        </div>
        <div className="shop-sidebar__section -categories">
          <SectionTitleOne className="-medium" spaceBottom={30 / 16 + "em"}>
            Price
          </SectionTitleOne>
          <ul>
            <li key={5345}>
              <button
                style={{ background: "none", border: "none" }}
                onClick={async (e) => {
                  setPrice_input({
                    minPrice: 0,
                    maxPrice: 1000000,
                  });
                  setPage(1);
                  setRander((prev) => !prev);
                  setFilterShow((prev) => !prev);
                }}
              >
                <a className={priceActive ? "active" : ""}>All</a>
              </button>
            </li>

            {priceFil?.map((ele, i) => {
              return (
                <li key={i}>
                  <button
                    style={{ background: "none", border: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      // dispatch(resetFilter());
                      setPrice_input({
                        minPrice: ele?.minPrice,
                        maxPrice: ele?.maxPrice,
                      });

                      setPage(1);
                      setRander((prev) => !prev);
                      setFilterShow((prev) => !prev);
                    }}
                  >
                    <a
                      className={`${ele.active == true ? "active" : ""} d-flex`}
                      style={{ gap: 10, alignItems: "center" }}
                    >
                      ₹ {ele?.minPrice} <MdOutlineArrowRightAlt /> ₹
                      {ele?.maxPrice}
                    </a>
                  </button>
                </li>
              );
            })}

            <div className="input">
              <div className="priceInput d-flex" style={{ gap: 10 }}>
                <TextField
                  id="outlined-basic"
                  label="Min Price"
                  variant="outlined"
                  style={{ width: "50%" }}
                  defaultValue={0}
                  size="small"
                  value={price_input.minPrice}
                  onChange={(e) => {
                    setPrice_input({
                      ...price_input,
                      minPrice: e.target.value,
                    });
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Max Price"
                  variant="outlined"
                  defaultValue={100000}
                  value={price_input.maxPrice}
                  style={{ width: "50%" }}
                  size="small"
                  onChange={(e) => {
                    setPrice_input({
                      ...price_input,
                      maxPrice: e.target.value,
                    });
                  }}
                />
              </div>
              <button
                className="btn -red"
                style={{ width: "100%", marginTop: "10px", padding: "10px 0" }}
                onClick={() => {
                  setPage(1);
                  setRander((prev) => !prev);
                  setFilterShow((prev) => !prev);
                }}
              >
                Search
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
