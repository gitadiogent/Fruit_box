import React, { useEffect, useState } from "react";
import Head from "next/head";

import FooterOne from "../Footer/FooterOne";
import withScrollFixed from "../../common/withScrollFixed";
import HeaderOne from "../Header/HeaderOne";
import { baseUrl, web_title } from "../../../config";
import axios from "axios";

let ScrollFixedHeader = withScrollFixed(HeaderOne);

export default function LayoutOne(props) {
  const [detail, setDetail] = useState({});

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Head>
        <title>{props.title || web_title}</title>
      </Head>
      <ScrollFixedHeader container={props.container} />
      {props.children}
      <FooterOne />

      <div className="whatsapp">
        <a href={detail?.whatsapp_link}>
          <img src="/assets/chat.png" alt="" />
        </a>
      </div>
    </>
  );
}
