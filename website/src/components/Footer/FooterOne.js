import Link from "next/link";
import SubcribeEmail from "../Other/SubcribeEmail";

import SocialIcons from "../Other/SocialIcons";
import footerLinks from "../../data/footer/links.json";
import footerInfomation from "../../data/footer/info.json";
import imageImport from "../../../imageImport";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, web_title } from "../../../config";
// import facebookimg from "../../../src/assests/facebook.png"

export default function FooterOne() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/admin/get/wallet/data`;
      const response = await axios.get(url, { withCredentials: true });
      console.log(response.data.wallet_data);
      setData(response.data.wallet_data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="footer-one">
      <div className="container">
        <div className="footer-one__header"></div>
        <div className="footer-one__body">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="footer__section -info">
                <img
                  src={process.env.PUBLIC_URL + imageImport.logo}
                  alt="Logo"
                  className="footer_logo_main"
                />
              </div>

              <p className="mt-3">
                {data?.aboutus?.slice(0, 150)}
                {data?.aboutus?.length > 150 ? "..." : ""}
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="footer__section -links">
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <h5 className="footer-title">Quick Links</h5>
                    <ul>
                      <li>
                        <Link href={"/"}>
                          <a>Home</a>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/about"}>
                          <a>About</a>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/shop/products"}>
                          <a>Shop</a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6">
                    <h5 className="footer-title">Infomation</h5>
                    <ul>
                      <li>
                        <Link href={"/contact"}>
                          <a
                            style={{
                              textAlign: "left",
                              width: "max-content",
                            }}
                          >
                            Contact
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/term-and-condition"}>
                          <a
                            style={{
                              textAlign: "left",
                              width: "max-content",
                            }}
                          >
                            Terms & Conditions
                          </a>
                        </Link>
                      </li>

                      <li>
                        <Link href={"/privacy-policy"}>
                          <a
                            style={{
                              textAlign: "left",
                              width: "max-content",
                            }}
                          >
                            Privacy Policy
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="footer__section -payment socalIcons">
                <h5 className="footer-title">Socal Links</h5>

                <div className="main d-flex">
                  <div className="socal_main" style={{ width: "50%" }}>
                    {data?.whatsapp_link ? (
                      <a
                        href={data?.whatsapp_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.whatsapp}
                          alt="Logo"
                        />{" "}
                        Whatsapp
                      </a>
                    ) : (
                      ""
                    )}

                    {data?.facebook_link ? (
                      <a
                        href={data?.facebook_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.facebook}
                          alt="Logo"
                        />{" "}
                        Facebook
                      </a>
                    ) : (
                      ""
                    )}

                    {data?.instagram_link ? (
                      <a
                        href={data?.instagram_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.instagram}
                          al3="Logo"
                        />{" "}
                        Instagram
                      </a>
                    ) : (
                      ""
                    )}
                    {data?.twitter_link ? (
                      <a
                        href={data?.twitter_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.twitter}
                          al3="Logo"
                        />{" "}
                        Twitter
                      </a>
                    ) : (
                      ""
                    )}
                    {data?.linkedin_link ? (
                      <a
                        href={data?.linkedin_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.linkedin}
                          alt="Logo"
                        />{" "}
                        Linkedin
                      </a>
                    ) : (
                      ""
                    )}
                    {data?.telegram_link ? (
                      <a
                        href={data?.telegram_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.telegram}
                          alt="Logo"
                        />{" "}
                        Telegram
                      </a>
                    ) : (
                      ""
                    )}
                    {data?.youtube_link ? (
                      <a
                        href={data?.youtube_link}
                        target="_blank"
                        className="d-flex"
                        style={{ alignItems: "center" }}
                      >
                        <img
                          src={process.env.PUBLIC_URL + imageImport.youtube}
                          al3="Logo"
                        />{" "}
                        Youtube
                      </a>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="Download_app_btn_">
                    {/* <h3 className="mb-3">Download App</h3> */}

                    {data?.app_link ? (
                      <a
                        href={data?.app_link}
                        target="_blank"
                        className="socalImg"
                      >
                        <img src="/playstore.webp" />
                      </a>
                    ) : (
                      ""
                    )}

                    {data?.app_ios_link ? (
                      <a
                        href={data?.app_ios_link}
                        target="_blank"
                        className="socalImg"
                      >
                        <img src="/appstore.webp" />
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="col-12 col-md-12 col-lg-12">
              <div className="footer_logo">
                <img
                  src={process.env.PUBLIC_URL + imageImport.logo}
                  alt="Logo"
                  width="74px"
                  height="100%"
                />
              </div>
              <div className="footer_menu_list">
                <ul>
                  {footerLinks.informationLinks.map((link, index) => (
                        <li key={index}>
                          <Link href={link.to}>
                            <a
                              style={{
                                textAlign: "left",
                                width: "max-content",
                              }}
                            >
                              {link.name}
                            </a>
                          </Link>
                        </li>
                      ))}

                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/term-and-condition">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
              <div className="footer_social_icon">
                {data?.whatsapp_link ? (
                  <a href={data?.whatsapp_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.whatsapp}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}

                {data?.facebook_link ? (
                  <a href={data?.facebook_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.facebook}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}

                {data?.instagram_link ? (
                  <a href={data?.instagram_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.instagram}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}
                {data?.twitter_link ? (
                  <a href={data?.twitter_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.twitter}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}
                {data?.linkedin_link ? (
                  <a href={data?.linkedin_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.linkedin}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}
                {data?.telegram_link ? (
                  <a href={data?.telegram_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.telegram}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}
                {data?.youtube_link ? (
                  <a href={data?.youtube_link} target="_blank">
                    <img
                      src={process.env.PUBLIC_URL + imageImport.youtube}
                      alt="Logo"
                      width="74px"
                      height="100%"
                    />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="footer-one__footer">
        <div className="container">
          <div className="footer-one__footer__wrapper justify-content-center">
            <p>© Copyright {new Date().getFullYear()} | {web_title}</p>
            {/* <ul>
              {footerLinks.creditLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.to}>
                    <a>{link.name}</a>
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
}
