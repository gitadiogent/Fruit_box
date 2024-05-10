import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config";
import axios from "axios";
import { useDispatch } from "react-redux";
import Loading from "../../components/Other/Loading";
import { loginUser } from "../../redux/reducers/userReducer";

import { auth, provider } from "../../configure/firebase_config";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";
import config from "../../../imageImport"

export default function () {
  const [
    { numInputs, separator, minLength, maxLength, placeholder, inputType },
    setConfig,
  ] = React.useState({
    numInputs: 4,
    separator: "-",
    minLength: 0,
    maxLength: 40,
    placeholder: "",
    inputType: "number",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState();
  const dispatch = useDispatch();

  const handlelogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/website/front/user/login_by_number`,
        {
          phone_number: phoneNumber,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoading(false);
      if (response.data.success) {
        setShowOtp(true);
        return toast.success("Otp send successfully!");
      } else if (response.data.success === false) {
        setError(response.data.message);
        return toast.error(response.data.message);
      }
      setError(response.data);
      return toast.error(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Something went wrong");
      return toast.error(error.message);
    }
  };

  const handleOtpVerification = async () => {
    try {
      // Send a POST request to the "/user/register_verify" API endpoint with the OTP
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/website/front/user/verify_login`,
        {
          otp: otp,
          phone_number: phoneNumber,
        },
        { withCredentials: true }
      );

      console.log(response);
      // Handle success or failure as needed
      if (response.data.success) {
        dispatch(loginUser(response.data));
        setLoading(false);
        window.location.replace("/");
        //console.log(response.data);
        return toast.success("verification successful");
      } else {
        // OTP verification failed, handle the error
        console.log(response.data);
        setLoading(false);
        setError(response.data.message);
        return toast.error(response.data.message);
      }
      setError(response.data);
      return toast.error(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Something went wrong");
      return toast.success(error.message);
    }
  };

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const clearOtp = () => {
    setOtp("");
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then(async (res) => {
      console.log("Response", res.user);
      try {
        // Send a POST request to the "/user/register_verify" API endpoint with the OTP
        setLoading(true);
        const response = await axios.post(
          `${baseUrl}/api/website/front/user/verify_login/google/single/api`,
          {
            username: res?.user?.displayName,
            email: res?.user?.email,
          },
          { withCredentials: true }
        );

        if (!response.data.success) {
          setLoading(false);
          setError("Please Register and Try Again !!");
          return toast.error(response.data.message);
        }

        // Handle success or failure as needed
        if (response.data.success) {
          dispatch(loginUser(response.data));
          setLoading(false);
          window.location.replace("/");
          return toast.success("Login successful");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Something went wrong!");
        return;
      }
    });
  };

  const handleGoogleLogin_node = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/website/front/user/login/google/node`
      );
      console.log("Main Response", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="appContainer hOXwLy">
      {loading && <Loading />}
      <div className="logincontainer">
        <div className="form-container sign-in-container">
          {/* {!showOtp ? ( */}
          <div className="loginform">
            {/* <p> error idhar hai </p> */}
            <img
              className="responsive_logo_img"
              src={process.env.PUBLIC_URL + config?.logo}
            />

            <h5 className="loginheading">Continue with Phone Number</h5>
            <div className="social-container">
              <h5
                style={{
                  color: "red",
                }}
              >
                {error}
              </h5>
            </div>
            {/* <div className="input-wrapper">
                <input
                  className="logininput"
                  type="number"
                  required={true}
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div> */}
            {/* <input
                className="logininput"
                type="password"
                placeholder="Password"
              /> */}
            {/* <Link
              href={`${process.env.PUBLIC_URL}/Register`}
              as={`${process.env.PUBLIC_URL}/Register`}
            >
                <p className="loginlink">Don't have account?</p>
              </Link> */}
            {/* <button className="lgbtn" onClick={handlelogin}>
                Login
              </button> */}

            <div className="googleAuth">
              <Button variant="contained" onClick={handleGoogleLogin}>
                Signin With Google
              </Button>
              {/* <Button variant="contained" onClick={handleGoogleLogin_node}>
                Signin With Google Node
              </Button> */}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
