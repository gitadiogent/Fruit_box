import React, {useReducer, useEffect, useContext} from 'react';
import axios from 'axios';
import {config} from '../config';
import {AuthReducer} from './reducer/AuthReducer';
import {
  clearLocalStorage,
  getAllCartProducts,
  getCartProductCount,
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../Utils/localstorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  adminDetails: null,
  error: null,
  cartCount: null,
  cartTotal: null,
  isAuthenticated: false,
  loading: false,
  homeBanner: null,
  newArrivalsProducts: null,
  trendingProducts: null,
};

// creating global context
const Global = React.createContext(initialState);
export const UseContextState = () => useContext(Global);

function GlobalContext({children}) {
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

  console.log('AuthState ', authState);
  // getting authenticated user
  const fetchAuthuser = async () => {
    try {
      const user = await getItemFromLocalStorage('user');
      if (user != null) {
        dispatch({type: 'LOG_IN', payload: user});
        console.log('LOG IN SUCCESS');
      } else {
        dispatch({type: 'ERROR', payload: 'error'});
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get admin details
  const fetchAdminDetails = async () => {
    try {
      await axios
        .get(`${config.BACKEND_URI}/api/app/get/admin/details`, {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        })
        .then(res => {
          // console.log(res?.data);
          dispatch({type: 'ADMIN_DETAILS', payload: res?.data?.response});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async user_id => {
    if (!user_id) {
      return;
    }
    try {
      await axios
        .get(`${config.BACKEND_URI}/api/app/get/user/by/userid/${user_id}`, {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        })
        .then(res => {
          console.log('Fetchinf User Data', res?.data);
          dispatch({type: 'LOG_IN', payload: res.data.user});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // logout user
  const logoutAuthUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      // auth().signOut();
      dispatch({type: 'LOG_OUT'});
      console.log('LOG OUT SUCCESS');
    } catch (err) {
      console.log(err);
    }
  };

  // get cart state
  const cartState = async () => {
    try {
      const count = await getCartProductCount();
      dispatch({type: 'CART_STATE', payload: count});
    } catch (err) {
      console.log(err);
    }
  };

  // get cart total
  const getCartTotal = async () => {
    const cartProducts = await getAllCartProducts();
    // console.log("Newresult=>",cartProducts)
    if (cartProducts != null) {
      let total = 0;
      if (cartProducts?.length > 0) {
        for (let i = 0; i < cartProducts?.length; i++) {
          console.log(
            'CART RPDUCTS',
            cartProducts[i]?.product_sale_price,
            '--',
            cartProducts[i]?.product_quantity,
          );
          total =
            total +
            cartProducts[i]?.product_sale_price *
              cartProducts[i]?.product_quantity;
          console.log('TOTAL++', total);
          dispatch({type: 'CART_TOTAL', payload: total});
        }
      }
    }
  };

  // get home screen banners
  const getHomeScreenBanner = async () => {
    try {
      await axios
        .get(`${config.BACKEND_URI}/api/app/get/all/home/screen/banner`, {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        })
        .then(res => {
          // console.log(res?.data);
          dispatch({type: 'HOME_SCREEN_BANNER', payload: res?.data});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  // get home screen banners

  // =======get home screen trending products =========
  const getTrendingProductsForHome = async () => {
    await axios
      .get(
        `${config.BACKEND_URI}/api/app/get/trending/products/for/homescreen`,
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        console.log(res?.data);
        dispatch({type: 'HOME_SCREEN_TRENDING_PRODUCTS', payload: res?.data});
      })
      .catch(err => {
        console.log(err);
      });
  };
  // =======get home screen trending products =========

  // =======get home screen new arrivals products =========
  const getNewArrivalProductsForHome = async () => {
    await axios
      .get(
        `${config.BACKEND_URI}/api/app/get/new/arrivals/products/for/homescreen`,
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        console.log(res?.data);
        dispatch({
          type: 'HOME_SCREEN_NEW_ARRIVAL_PRODUCTS',
          payload: res?.data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  // =======get home screen new arrivals products =========

  useEffect(() => {
    fetchAuthuser();
    fetchAdminDetails();
    cartState();
    getHomeScreenBanner();
    getNewArrivalProductsForHome();
    getTrendingProductsForHome();
  }, []);

  const value = {
    authState,
    fetchAuthuser,
    fetchUserData,
    fetchAdminDetails,
    logoutAuthUser,
    cartState,
    getCartTotal,
  };

  return <Global.Provider value={value}>{children}</Global.Provider>;
}

export default GlobalContext;
