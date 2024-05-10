import axios from "axios";
import { baseUrl } from "../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";

export default function PrivacyPolicy() {
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
      <div className="Privacy_policy">
        <h2>Privacy Policy</h2>
        <div className="bordered-data privacy_policy quil_editor_page">
          {ReactHtmlParser(data?.web_privacy_policy)}
        </div>
      </div>
    </div>
  );
}
