import Slider from "react-slick";
import Product from "../../../Product";
import Carousel from "react-multi-carousel";

export default function ProductSlider({ data, sliderSettings }) {
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

  return (
    <div className="product-slider">
      <Carousel infinite={true} responsive={responsive}>
        {data.map((p, index) => (
          <div key={index} className="product-slide__item">
            <Product data={p} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
