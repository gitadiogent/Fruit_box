import React, { useRef, useEffect } from "react";
import Parallax from "parallax-js";

import Button from "../../Control/Button";
import SectionTitleOne from "../SectionTitle/SectionTitleOne";
import { web_title } from "../../../../config";

export default function IntroductionOne({ data }) {
  // const bg1 = useRef(null);
  // const bg2 = useRef(null);
  // useEffect(() => {
  //   let parallax1 = new Parallax(bg1.current);
  //   let parallax2 = new Parallax(bg2.current);
  //   return () => {
  //     parallax1.disable();
  //     parallax2.disable();
  //   };
  // }, []);

  return (
    <div className="introduction-one">
      <div className="container">
        <div className="row align-items-center">
          {/* <div className="col-12 col-md-6">
            <div className="introduction-one__image">
              <div className="introduction-one__image__detail">
                <img src="/assets/images/ab_2.jpg" alt="background" />
                <img src="/assets/images/ab_1.jpg" alt="background" />
              </div>
              <div className="wrapper">
                <div className="introduction-one__image__background">
                  <div className="background__item">
                    <div ref={bg1} className="wrapper">
                      <img
                        data-depth="0.5"
                        src="/assets/images/introduction/IntroductionOne/bg1.png"
                        alt="background"
                      />
                    </div>
                  </div>
                  <div className="background__item">
                    <div ref={bg2} className="wrapper">
                      <img
                        data-depth="0.3"
                        data-invert-x
                        data-invert-y
                        src="/assets/images/introduction/IntroductionOne/bg2.png"
                        alt="background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="container">
            <div className="introduction-one__content">
              <h5>About {web_title}</h5>
              <p style={{
                textAlign:"justify",
                color:"black"
              }} >
               At WizeMart, our mission is simple: "We Deliver, You Discover." We're your one-stop desƟnaƟon for a
                diverse range of over 4,000 high-quality products across various categories. Whether you're
                searching for the latest tech gadgets, stylish fashion, home essenƟals, or anything in between,
                WizeMart is here to deliver not just products but also a unique discovery experience.
              </p>
              <h5>Our Commitment</h5>
              <ol style={{
                lineHeight:"3em",
                textAlign:"justify"
              }} >
                <li>
                At the heart of WizeMart, we believe in delivering more than just products. We're commiƩed to
delivering value, convenience, and inspiraƟon to our customers. With an extensive selecƟon of
handpicked items, we strive to make your shopping experience effortless and enjoyable. Our
commitment to quality ensures that every product you receive meets our stringent standards. 
                </li>
              </ol>
              <h5>Exploring Possibilities</h5>
              <ol style={{
                lineHeight:"3em",
                textAlign:"justify"
              }} >
                <li>
                WizeMart is more than an e-commerce plaƞorm; it's a hub for exploraƟon. We understand that
every purchase represents a potenƟal discovery, a new experience, or a beƩer way of living. That's
why we constantly curate and update our product offerings to keep you at the forefront of
innovaƟon and style.
                </li>
              </ol>
              <h5>Our Journey</h5>
              <ol style={{
                lineHeight:"3em",
                textAlign:"justify"
              }} >
                <li>
                Founded on the principles of customer-centricity and a passion for discovery, WizeMart has grown
from a small startup into a trusted brand in the world of online shopping. Our journey is marked by a
dedicaton to customer satisfacon, innovation, and a relentless pursuit.
                </li>
              </ol>
             
              {/* <Button
                color={data.btn.color}
                content={data.btn.content}
                action="#"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
