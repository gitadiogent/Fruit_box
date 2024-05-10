import axios from "axios";
import { baseUrl } from "../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";

export default function TermsAndConditions() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/website/front/web/get/web/data`;
      const response = await axios.get(url, { withCredentials: true });

      console.log(response);

      if (response.data.success) {
        setData(response.data.webData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="terms_n_conditions">
        <h2>Terms & Conditions</h2>
        <div className="bordered-data terms_and_conditions quil_editor_page">
          {ReactHtmlParser(data?.web_term_and_condition)}
        </div>
      </div>
    </div>
  );
}
