import React from "react";
import Product from "../Product";
import classNames from "classnames";
import Slider from "react-slick";
import { PrevArrow, NextArrow } from "../Other/SliderArrow";
import Link from "next/link";

export default function ShopProducts(props) {
  const { gridColClass, listColClass, fiveCol, view, data, brandsData } = props;
  let arr = [5];
  for (var i = 0; i < Math.round(data.length / 5); i++) {
    arr.push(arr[i] + 6);
  }

  const settings = {
    //pauseOnHover: true,
    //className: "",
    dots: false,
    infinite: true,
    // autoplay: false,
    // focusOnSelect: true,

    rows: 1,
    autoplaySpeed: 4000,
    speed: 1000,
    cssEase: "linear",
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // dotsClass: "slider-dots container",
    responsive: [
      {
        breakpoint: 1030,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 844,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  console.log("data", data);
  return (
    <>
      <div className="container shop_products_data">
        {data?.map((brand) => {
          return (
            <div className="productsTwo">
              <div className="two">
                <h2>{brand._id}</h2>
                <Link
                  href={`/shop/search/[slug]`}
                  // href={`#`}
                  as={`/shop/search/${brand._id}`}
                  // as={`#`}
                >
                  <div className="button-37">View All</div>
                </Link>
              </div>
              <div className="ProductsTwo__wrapper">
                <Slider {...settings}>
             
                  {brand?.products?.map((value, index) => (
                    <Product data={value} />
                  ))}
                </Slider>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

//   return (
//     <div className="shop-products">
//       {view === "grid" ? (
//         <div className="shop-products__grid">
//           {data && (
//             <div className="row">
//               {data.map((item, index) => {
//                 if (fiveCol) {
//                   if (arr.includes(index)) {
//                     return <div key={index} className="w-100"></div>;
//                   }
//                 }
//                 return (
//                   <div
//                     key={index}
//                     className={classNames(gridColClass, {
//                       "five-col": fiveCol,
//                     })}
//                   >
//                     <Product data={item} />
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="shop-products__list">
//           {data && (
//             <div className="row">
//               {data.map((item, index) => (
//                 <div key={index} className={listColClass}>
//                   {/* <Product type={view} data={item} type={"list"} /> */}
//                   <Product data={item} type={"list"} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
