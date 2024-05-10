import { useForm } from "react-hook-form";
import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import LayoutFour from "../../components/Layout/LayoutOne";
import InstagramTwo from "../../components/Sections/Instagram/InstagramTwo";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import ContactInfoItem from "../../components/Pages/Contact/ContactInfoItem";
import contactData from "../../data/pages/contact.json";
import Loading from "../../components/Other/Loading";
import { baseUrl } from "../../../config";
import axios from "axios";
import { toast } from "react-toastify";

export default function () {
  const { register, handleSubmit, watch, errors } = useForm();
  const [success, setSuccess] = useState(false);
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

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone_number: "",
    message: "",
  });

  const onchangeHandeler = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_phone_number ||
      !formData.message
    ) {
      return toast.error("Please Fill All The Field");
    }
    try {
      const res = await axios.post(
        `${baseUrl}/api/website/front/send/contact/enquiry/mail`,
        { ...formData },
        { withCredentials: true }
      );
      console.log(res);

      if (res.data.success) {
        toast.success("Thank You For Contacting Us !!");

        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone_number: "",
          message: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LayoutFour title="Contact us">
      <Breadcrumb title="Contact us">
        <BreadcrumbItem name="Home" path={"/"} />
        <BreadcrumbItem name="Contact us" current />
      </Breadcrumb>
      {success && <Loading />}
      {/* {data?.phone_number} */}
      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <h3 className="contact-title">Contact info</h3>
              {/* {contactData &&
                contactData.map((item, index) => (
                  <ContactInfoItem
                    key={index}
                    iconClass={item.iconClass}
                    title={item.title}
                    detail={item.detail}
                  />
                ))} */}
              <ContactInfoItem
                // key={index}
                iconClass={"fas fa-phone-alt"}
                title={"Phone"}
                detail={data?.phone_number}
              />
              <ContactInfoItem
                // key={index}
                iconClass={"far fa-envelope"}
                title={"Email"}
                detail={data?.contact_email_address}
              />
              <ContactInfoItem
                // key={index}
                iconClass={"fas fa-map-marker-alt"}
                title={"Address"}
                detail={data?.contact_address}
              />
            </div>
            <div className="col-12 col-md-6">
              <h3 className="contact-title">Get in touch</h3>
              <div className="contact-form">
                <form onSubmit={onSubmit}>
                  <div className="input-validator">
                    <input
                      type="text"
                      name="customer_name"
                      placeholder="Name"
                      value={formData.customer_name}
                      onChange={onchangeHandeler}
                    />
                  </div>
                  <div className="input-validator">
                    <input
                      type="text"
                      name="customer_email"
                      placeholder="Email"
                      value={formData.customer_email}
                      onChange={onchangeHandeler}
                    />
                  </div>
                  <div className="input-validator">
                    <input
                      type="tel"
                      name="customer_phone_number"
                      placeholder="Phone"
                      value={formData.customer_phone_number}
                      onChange={onchangeHandeler}
                    />
                  </div>
                  <div className="input-validator">
                    <textarea
                      name="message"
                      id=""
                      cols="30"
                      rows="3"
                      placeholder="Message"
                      value={formData.message}
                      onChange={onchangeHandeler}
                    />
                  </div>
                  <button className="btn -dark">SEND MESSAGE</button>
                </form>
              </div>
            </div>
            {/* <div className="col-12">
              <iframe
                className="contact-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14412.962923590754!2d81.77599883093208!3d25.43021413289322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398534b258c11777%3A0xcd939a92827890ef!2sKalindipuram%20Telephone%20Exchange!5e0!3m2!1sen!2sin!4v1694772290731!5m2!1sen!2sin"
                width="100%"
                height="450"
                frameBorder="0"
                allowFullScreen
              />
            </div> */}
          </div>
        </div>
      </div>
      {/* <InstagramTwo /> */}
    </LayoutFour>
  );
}
