import React from "react";
import Link from "next/link";

import Navigator from "../Elements/Navigator";
import MenuFunctionIcons from "../Elements/MenuFunctionIcons";
import { renderContainer } from "../../../common/utils";
import imageImport from "../../../../imageImport";
import { useDispatch, useSelector } from "react-redux";

export default function MenuOne({ container }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/website/front/user/logout`, {
        withCredentials: true,
      });
      console.log(response);
      dispatch(logoutUser());
      return toast.success("logout successfully");
    } catch (error) {
      return toast.error("something went wrong");
    }
  };


  return (
    <div className="menu -style-1">
      <div className={renderContainer(container)}>
        <div className="menu__wrapper">
          <Link href="/">
            <a className="menu__wrapper__logo">
              <img src={process.env.PUBLIC_URL + imageImport.logo} alt="Logo" />
              {/* <img src={`${imageImport.logo}`} alt="Logo" /> */}
            </a>
          </Link>
          <Navigator />
          <MenuFunctionIcons />
          {/* <div className="top-nav__wrapper__selectors">

            {isAuthenticated ? (
              <div style={{
                display:'flex', justifyContent:"space-between",alignItems:"center",gap:20
              }}>
              <Link
                  href={`${process.env.PUBLIC_URL}/my-orders`}
                  as={`${process.env.PUBLIC_URL}/my-orders`}
                >
                  <a className="top-nav__auth" >Your Orders</a>
                </Link>
              <button onClick={handleLogout} className="logoutbutton">
                logout
              </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <a className="top-nav__auth">Login/Register</a>
                </Link>
              </>
            )}
          </div> */}


        </div>
      </div>
    </div>
  );
}
