import LayoutOne from "../components/Layout/LayoutOne";
import SliderTwo from "../components/Sections/Slider/SliderTwo";
import { SlideThree } from "../components/Sections/Slider/slideThree";
import sliderData from "../data/slider/sliderOne.json";
import IntroductionOne from "../components/Sections/Introduction/IntroductionOne";
import introductionOneData from "../data/introduction/introductionOne.json";
import IntroductionTwo from "../components/Sections/Introduction/IntroductionTwo";
import introductionTwoData from "../data/introduction/introductionTwo.json";
import ProductSlideOne from "../components/Sections/ProductThumb/ProductSlide/ProductSlideOne";
import productSlideOneData from "../data/products.json";
import TestimonialOne from "../components/Sections/Testimonial/TestimonialOne";
import testimonialOneData from "../data/testimonial/data.json";
import TeamOne from "../components/Sections/Team/TeamOne";
import teamOneData from "../data/team/teamOne.json";
import CTAOne from "../components/Sections/CallToAction/CTAOne";
import { useState } from "react";
import { baseUrl, web_title } from "../../config";
import axios from "axios";
import ShopProducts from "../components/Shop/ShopProducts";
import BrandsTwo from "../components/Sections/Brands/BrandsTwo";
import ProductCategories from "../components/Sections/ProductCategories/ProductCategories";
import CategoriesTwo from "../components/Sections/Categories/CategoriesTwo";
import MenuFive from "../components/Header/Menu/MenuFive";
import DoctorSection from "../components/Doctor/DoctorSection";
import ShopProductLoadMore from "../components/Shop/ShopProductLoadMore";
import NewArrival from "../components/Sections/NewArrival/NewArrival";
import TrendingProd from "../components/Sections/TrendingProd/TrendingProd";
import SliderOne from "../components/Sections/Slider/SliderOne";
import { useMediaQuery } from "react-responsive";
// import Playstore from "../../public/playstore.webp";

export default function homepage1() {
  console.log(sliderData);

  const [data, setData] = useState([]);
  const [webBanner, setWebBanner] = useState([]);
  const [product, setProduct] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState([]);

  const fetchBrands = async () => {
    try {
      const url = `${baseUrl}/api/website/front/get/all/categories`;
      const res = await axios.get(url, { withCredentials: true });
      console.log("categories ---> ", res?.data);
      const uniqueCategories = {};

      const uniqueData = res?.data?.filter((item) => {
        if (!uniqueCategories[item.main_category_name]) {
          uniqueCategories[item.main_category_name] = true;
          return true;
        }
        return false;
      });
      setCategories(res?.data);
      setCat(uniqueData);
    } catch (error) {
      console.log(error);
    }
  };

  const [detal, setDetail] = useState({});

  console.log("detal", detal);

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/website/front/get/all/banners`;
      const res = await axios.get(url, { withCredentials: true });
      setData(res.data);

      const mobileurl = `${baseUrl}/api/website/front/get/all/web/banners`;
      const resmobile = await axios.get(mobileurl, { withCredentials: true });
      setWebBanner(resmobile.data.allbanners);

      const url_pro = `${baseUrl}/api/website/front/gethome`;
      const res_pro = await axios.get(url_pro, { withCredentials: true });
      console.log("res_pro.datares_pro.data===>", res_pro.data);
      setProduct(res_pro.data?.data);

      axios
        .get(`${baseUrl}/api/admin/get/wallet/data`, {
          withCredentials: true,
        })
        .then((res) => {
          setDetail(res.data.wallet_data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useState(() => {
    fetchBrands();
    fetchData();
  }, []);
  console.log(data);

  //=========== PLEASE REMOVE IN DEVELOPMENT ==============
  // console.log=()=>{}
  //=========== PLEASE REMOVE IN DEVELOPMENT ==============

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  

  return (
    <>
      <LayoutOne title={web_title} data={sliderData} className="-style-1">
        {/* <MenuFive data={categories} /> */}
        {/* <ProductCategories data={brandsData}/> */}
        {/* <CategoriesTwo data={brandsData}/> */}
        {/* <SliderOne data={data} className="-style-1" showDots /> */}

        {isTabletOrMobile ? (
          <SliderTwo data={data} className="-style-1" showDots />
          // <SlideThree data={data} />
        ) : (
          <SliderTwo data={webBanner} className="-style-1" showDots />
        )}

        {/* <IntroductionOne data={introductionOneData} /> */}
        {/* <IntroductionTwo data={introductionTwoData} /> */}
        {/* <ProductSlideOne data={productSlideOneData} /> */}
        {/* <BrandsTwo
          mainHeading={"Our Brands"}
          description={"The Brands you can count upon"}
          data={brandsData}
        /> */}

        <BrandsTwo
          mainHeading={"Shop By Category"}
          // description={
          //   "Explore wide range of products from various categories."
          // }
          data={cat}
        />

        <NewArrival mainHeading={"New Arrivals"} data={cat} />
        <TrendingProd mainHeading={"Trending Products"} data={cat} />

        {/* <div className="container"> */}
        {/* <ShopProducts brandsData={categories} data={product} /> */}
        <ShopProductLoadMore />

        {/* <div className="container">
             <div className="three">
                <h1>Our Doctorss</h1>
             </div>
        </div> */}
        {/* <DoctorSection data={doctorsData} /> */}
        {/* </div> */}
        {/* <TestimonialOne data={testimonialOneData} /> */}
        {/* <TeamOne data={teamOneData} />  */}
        {/* <CTAOne /> */}

        {detal?.app_link || detal?.app_ios_link ? (
          <div className="download_app_section px-3" id="app_section">
            <div className="container">
              <div className="row download_app_cta">
                <div className="download_app_content col-12 col-sm-8 col-md-8 col-lg-9 p-0">
                  <h5>Download our mobile app </h5>
                  <p style={{ width: "100%", maxWidth: "410px" }}>
                    Thousands of people are shopping from our mobile app. you
                    just download and shop from our mobile app
                  </p>
                </div>
                <div className="Download_app_btn col-12 col-sm-4 col-md-4 col-lg-3">
                  {detal?.app_link ? (
                    <a href={detal?.app_link} target="_blank">
                      <img src="/playstore.webp" />
                    </a>
                  ) : (
                    ""
                  )}

                  {detal?.app_ios_link ? (
                    <a href={detal?.app_ios_link} target="_blank">
                      <img src="/appstore.webp" />
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </LayoutOne>
    </>
  );
}
