import Slider from "react-slick";
import { PrevArrow, NextArrow } from "../../Other/SliderArrow";
import Link from "next/link";
import Loading from "../../Other/Loading";

import Carousel from "react-multi-carousel";

export default function BrandsTwo({ data, mainHeading, description }) {
  const settings = {
    //pauseOnHover: true,
    //className: "",
    dots: false,
    infinite: true,
    autoplay: true,
    //focusOnSelect: true,
    //autoplaySpeed: 4000,
    speed: 800,
    cssEase: "ease-in",
    slidesToShow: 5,
    slidesToScroll: 2,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // dotsClass: "slider-dots container",
    responsive: [
      {
        breakpoint: 844,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

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
      items: 3,
    },
  };

  console.log(data);

  if (!data) return <Loading />;

  return (
    <div className="container p-0">
      <div className="brand-two">
        {/* <div className="two">
          <h2 className="headingSection">
            {mainHeading}
            <span>{description}</span>
          </h2>
        </div> */}

        <div className="two d-flex justify-content-between w-100 px-2">
          <h2 className="headingSection">
            {mainHeading}
            <span>{description}</span>
          </h2>

          <Link
            href={`${process.env.PUBLIC_URL}/all-category`}
            // href={`#`}NewArrival
            as={`${process.env.PUBLIC_URL}/all-category`}
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
            {data.map((brand) => {
              return (
                <div>
                  <Link
                    // href={`${process.env.PUBLIC_URL}/shop/category/${brand.main_category_name}`}
                    href={`${process.env.PUBLIC_URL}/shop/category/[categoryName]`}
                    as={`${process.env.PUBLIC_URL}/shop/category/${brand.main_category_name}`}
                  >
                    <img
                      src={brand.main_category_image?.image_url}
                      alt="Yummix cup cake"
                      className="card-img curselink d-flex"
                    />
                  </Link>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
