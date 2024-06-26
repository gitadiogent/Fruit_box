import React from "react";
import Product from "../Product";
import classNames from "classnames";

export default function AllProductsCard(props) {
  const { gridColClass, listColClass, fiveCol, view, data } = props;
  let arr = [5];
  for (var i = 0; i < Math.round(data.length / 5); i++) {
    arr.push(arr[i] + 6);
  }

  console.log(data);
  return (
    <div className="w-100">
      <div className="w-100 p-0 m-0 d-flex flex-wrap">
        {data.map((item, index) => {
          return (
            // <div key={index} className="col-6 col-sm-6 col-md-2 col-lg-2 p-0" >
            <div key={index} className="p-0 product_cointener m-0">
              <Product data={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
