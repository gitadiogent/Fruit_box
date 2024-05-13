import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import {config} from '../../config';
import {Button, Checkbox, Modal, Portal, Provider} from 'react-native-paper';
// import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import navigationString from '../../Constants/navigationString';
import strings from '../../Constants/strings';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {UseContextState} from '../../global/GlobalContext';
import imageImport from '../../Constants/imageImport';
import RazorpayCheckout from 'react-native-razorpay';
import CustomLoader from '../../components/Loader';
import {
  getCartProductCount,
  setItemToLocalStorage,
  clearLocalStorage,
  getAllCartProducts,
  removeFromCart,
} from '../../Utils/localstorage';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Toast} from 'react-native-toast-notifications';

function Checkout({route, navigation}) {
  const {checkoutProducts} = route.params;
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [updateCart, setUpdateCart] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [render, setRender] = useState(false);
  const [selectAddress, setSelectAddress] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [paymentMode, setPaymentMode] = React.useState(true);
  const [paymentModeCod, setPaymentModeCod] = React.useState(false);
  const {cartState, authState, getCartTotal, fetchUserData} = UseContextState();
  const [checkoutDetail, setCheckoutDetail] = useState({
    customer_id: authState?.user?.user_id,
    customer_name: '',
    customer_phone_number: `${authState?.user?.phone_number}`,
    customer_email: '',
    customer_business: '',
    customer_gst: '',
    products: checkoutProducts || [],
    order_total: authState.cartTotal,
    shipping_address: '',
    state: '',
    pincode: '',
    transport_detail: '',
  });
  const [userOtherCheckoutDetails, setUserOtherCheckoutDetails] = useState({
    customer_id: authState?.user?.user_id,
    customer_name: '',
    customer_phone_number: '',
    customer_email: '',
    customer_business: '',
    customer_gst: '',
    products: checkoutProducts || [],
    order_total: authState.cartTotal,
    shipping_address: '',
    state: '',
    pincode: '',
    transport_detail: '',
  });
  const [orderCheckoutAddress, setOrderCheckoutAddress] =
    useState(checkoutDetail);
  console.log('setUserOtherCheckoutDetails', orderCheckoutAddress);

  const [giftCoin, setgiftCoin] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/user/by/userid/${authState?.user?.user_id}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          // console.log("RESPONSE=>",res?.data?.user);
          setCheckoutDetail(prev => ({
            ...prev,
            customer_name: res?.data?.user?.username,
            customer_email: res?.data?.user?.email,
            customer_gst: res?.data?.user?.gst_number,
            shipping_address: res?.data?.user?.address,
            customer_business: res?.data?.user?.user_business,
            state: res?.data?.user?.state,
            pincode: `${res?.data?.user?.pincode}`,
            transport_detail: `${res?.data?.user?.transport_detail}`,
          }));
          setOrderCheckoutAddress(prev => ({
            ...prev,
            customer_name: res?.data?.user?.username,
            customer_email: res?.data?.user?.email,
            customer_gst: res?.data?.user?.gst_number,
            shipping_address: res?.data?.user?.address,
            customer_business: res?.data?.user?.user_business,
            state: res?.data?.user?.state,
            pincode: `${res?.data?.user?.pincode}`,
            transport_detail: `${res?.data?.user?.transport_detail}`,
          }));
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/user/checkout/detail/by/userid/${authState?.user?.user_id}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          console.log('RESPONSE=>', res?.data);
          setUserOtherCheckoutDetails(prev => ({
            ...prev,
            customer_email: res?.data?.user?.shipping_address?.email,
            customer_name: res?.data?.user?.shipping_address?.name,
            customer_phone_number: `${res?.data?.user?.shipping_address?.phone_number}`,
            shipping_address: res?.data?.user?.shipping_address?.address,
            state: res?.data?.user?.shipping_address?.state,
            pincode: `${res?.data?.user?.shipping_address?.pincode}`,
            transport_detail: `${res?.data?.user?.shipping_address?.transport_detail}`,
          }));
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    }, []),
  );

  // console.log("checkoutProducts",checkoutProducts)

  const goBack = () => {
    navigation.goBack();
  };
  // console.log("checkout-> ",checkoutDetail)

  const onClickAddress = async (details, status) => {
    setSelectAddress(status);
    await setOrderCheckoutAddress(details);
  };

  //========= HANDLE ORDER NOW BUTTON COD CLICK ==========
  const handleOrderNowCodBtn = async () => {
    let coinUserd = 0;

    if (checkBox) {
      if (paymentMode) {
        coinUserd =
          (authState?.adminDetails?.delivery_charges + authState?.cartTotal) /
          setDetail.one_coin_price;
      }

      if (!paymentMode) {
        if (
          authState?.adminDetails?.delivery_charges + authState?.cartTotal >
          userData.wallet * setDetail.one_coin_price
        ) {
          coinUserd = userData.wallet;
        }
        if (
          authState?.adminDetails?.delivery_charges + authState?.cartTotal <
          userData.wallet * setDetail.one_coin_price
        ) {
          coinUserd =
            (authState?.adminDetails?.delivery_charges + authState?.cartTotal) /
            setDetail.one_coin_price;
        }

        // coinUserd =
        //   authState?.adminDetails?.delivery_charges +
        //   authState?.cartTotal -
        //   userData.wallet * setDetail.one_coin_price;
      }
    }

    console.warn('coinUserd', coinUserd);
    setConfirmLoading(true);

    axios
      .post(
        `${config.BACKEND_URI}/api/app/cart/checkout/products/for/cash/on/delivery`,
        {
          ...orderCheckoutAddress,
          order_total:
            authState?.adminDetails?.delivery_charges + authState?.cartTotal,

          wallet: userData.wallet,
          paymentMode: paymentMode,
          coinUsed: coinUserd,
          user: userData.user_id,
          couponDetail: couponDetail,
          order_from: 'Phone App',
        },
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(async res => {
        if (res?.data?.status === true) {
          // onOrderComplete();
          setItemToLocalStorage('@cartproducts', null);
          cartState();
          // sendEmailAfterOrder(checkoutDetail)

          await fetchUserData(authState?.user?.user_id);

          navigation.navigate(navigationString.ORDER_COMPLETED);
          // navigation.navigate(navigationString.ORDER)
          setConfirmLoading(false);
          setCheckoutDetail({
            customer_name: '',
            customer_phone_number: '',
            customer_email: '',
            customer_business: '',
            customer_gst: '',
            shipping_address: '',
            state: '',
            pincode: '',
          });
        }
      })
      .catch(err => {
        console.log(err);
        setConfirmLoading(false);
      });
  };
  //=========  HANDLE ORDER NOW BUTTON COD CLICK  ==========

  //========= HANDLE PAY NOW BUTTON (PAY WITH UPI PAYMENT) ==========

  //  const reactNativeUpiPayment = async()=>{
  //   RNUpiPayment.initializePayment({
  //     // vpa: authState?.adminDetails?.adiogent_pay?.upi_id,  		//your upi address like 12345464896@okhdfcbank
  //     vpa: 'BHARATPE09899202604@yesbankltd',  		//your upi address like 12345464896@okhdfcbank
  //     // payeeName: config.APP_NAME,   			// payee name
  //     payeeName: 'Raju Cloths',   			// payee name
  //     // amount: `${authState?.adminDetails?.delivery_charges + authState?.cartTotal}`,				//amount
  //     amount: '2',				//amount
  //     transactionNote:'Pay for Buying Products',		//note of transaction
  //     transactionRef: '21412412f-33da2-aoei-fn'	//some refs to aknowledge the transaction
  // },successCallback,failureCallback);
  // }
  // function successCallback(data) {
  //   // do whatever with the data
  //   console.log("PAYMENT SUCCESS BY UPI=>>>",data)
  //   handlePayOnlineWithUpi()
  // }

  // function failureCallback(data) {
  //   // do whatever with the data
  //   console.log("PAYMENT FAILED BY UPI")

  // }

  const handlePayOnlineWithUpi = async () => {
    axios
      .post(
        `${config.BACKEND_URI}/api/app/cart/checkout/products/for/cash/on/delivery`,
        {
          ...orderCheckoutAddress,
          order_total:
            authState?.adminDetails?.delivery_charges + authState?.cartTotal,
        },
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        if (res?.data?.status === true) {
          // onOrderComplete();
          setItemToLocalStorage('@cartproducts', null);
          cartState();
          // sendEmailAfterOrder(checkoutDetail)
          navigation.navigate(navigationString.ORDER_COMPLETED);
          // navigation.navigate(navigationString.ORDER)
          setLoading(false);
          setCheckoutDetail({
            customer_name: '',
            customer_phone_number: '',
            customer_email: '',
            customer_business: '',
            customer_gst: '',
            shipping_address: '',
            state: '',
            pincode: '',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //=========  HANDLE PAY NOW BUTTON (PAY WITH UPI PAYMENT)  ==========

  //========= HANDLE PAY NOW BUTTON CLICK (PAY WITH RAZORPAY) ==========
  const handleCheckOutWithRazorpay = async () => {
    console.log('setUserOtherCheckoutDetails', orderCheckoutAddress);
    await axios
      .post(
        `${config.BACKEND_URI}/api/app/calulate/price/for/razorpay/payment`,
        {
          product: checkoutDetail.products,
          wallet: checkBox ? userData.wallet : 0,
          couponDiscount: discountValue,
        },
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        console.log(res.data, 'RESPONSE');
        if (res.data.status === true) {
          let options = {
            description: 'Online Store',
            // image: 'https://i.imgur.com/3g7nmJC.png',
            // image: `${imageImport.Logo}`,
            order_id: res.data.response.id,
            currency: res.data.response.currency,
            // key: config.Razorpay_Key, // Your api key
            key: res?.data?.razorpay_key_id, // Your api key
            amount: res.data.response?.amount,
            name: strings?.APP_NAME,
            prefill: {
              email: authState?.user?.email,
              contact: authState?.user?.phone_number,
              name: authState?.user?.username,
            },
            theme: {color: config.primaryColor},
          };
          RazorpayCheckout.open(options)
            .then(async data => {
              // handle success
              console.log(data, 'razorpay payment details');
              // alert(`Success: ${data.razorpay_payment_id}`);
              axios
                .post(
                  `${config.BACKEND_URI}/api/app/verify/payment/and/create/order/razorpay`,
                  {
                    ...data,
                    ...orderCheckoutAddress,
                    order_total:
                      authState?.adminDetails?.delivery_charges +
                      authState?.cartTotal,

                    wallet: checkBox ? userData.wallet : 0,
                    user: userData.user_id,
                    couponDiscount: discountValue,
                    couponDetail: couponDetail,
                    order_from: 'Phone App',
                  },
                  {
                    headers: {
                      Authorization: `token ${config.APP_VALIDATOR}`,
                    },
                    withCredentials: true,
                  },
                )
                .then(res => {
                  if (res?.data?.status === true) {
                    // onOrderComplete();
                    // clearLocalStorage();
                    setItemToLocalStorage('@cartproducts', null);
                    cartState();
                    // sendEmailAfterOrder(checkoutDetail)
                    navigation.navigate(navigationString.ORDER_COMPLETED);
                    // navigation.navigate(navigationString.ORDER)
                    setLoading(false);
                    setCheckoutDetail({
                      customer_name: '',
                      customer_phone_number: '',
                      customer_email: '',
                      customer_business: '',
                      customer_gst: '',
                      shipping_address: '',
                      state: '',
                      pincode: '',
                    });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(error => {
              // handle failure
              console.log(error);
              // alert(`Error: ${error.code} | ${error.description}`);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //========= HANDLE PAY NOW BUTTON CLICK (PAY WITH RAZORPAY)==========

  const getAllProducts = async () => {
    const result = await getAllCartProducts();
    // console.log("Newresult=>",result)
    if (result != null) {
      setCartProducts(result);
    } else {
      setCartProducts([]);
    }
    setRefreshing(false);
  };
  const getTotal = async () => {
    await getCartTotal();
  };

  useFocusEffect(
    useCallback(() => {
      getAllProducts();
      getTotal();
    }, [updateCart, render, navigation, refreshing]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const getItemCount = async () => {
    const count = await getCartProductCount();
    // console.log('ITEM FROM Cart=>',count)
    //  setCartItemCount(count);
  };

  useFocusEffect(
    useCallback(() => {
      getItemCount();
    }, [updateCart]),
  );

  const removeProduct = async product_id => {
    // console.log(product_id)
    const result = await removeFromCart(product_id);
    // console.log(result)
    setUpdateCart(prev => !prev);
    await cartState();
    setRender(prev => !prev);
  };

  const increaseQuantity = async product_id => {
    // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts;
    cartProducts?.map((value, index) => {
      if (value._id == product_id) {
        console.log('FIND>>>>');
        updatedCartProduct[index] = {
          ...value,
          product_quantity: value.product_quantity + 1,
        };
        setCartProducts(updatedCartProduct);
        console.log(
          "'updated Cart in CHECKOUT'======>>>>>>",
          updatedCartProduct,
        );
      }
    });
    //  await setItemToLocalStorage('@cartproducts',updatedCartProduct);
    setRender(prev => !prev);
  };
  const decreaseQuantity = async product_id => {
    // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts;
    cartProducts?.map((value, index) => {
      if (value._id == product_id) {
        if (value.product_quantity > 1) {
          // console.log("FIND>>>>")
          updatedCartProduct[index] = {
            ...value,
            product_quantity: value.product_quantity - 1,
          };
          setCartProducts(updatedCartProduct);
          // console.log(updatedCartProduct,'updated Cart')
        }
      }
    });
    await setItemToLocalStorage('@cartproducts', updatedCartProduct);
    setRender(prev => !prev);

    return;
  };

  // Go to edit address
  const goToEditAddress = () => {
    navigation.navigate(navigationString.EDIT_CHECKOUT_DETAIL);
  };

  const [userData, setUserData] = useState({});
  const [walletData, setWalletData] = useState({});

  const [checkBox, setCheckBox] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${config.BACKEND_URI}/api/app/get/user/by/userid/${authState?.user.user_id}`,
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        console.warn('User Data', res.data.user);
        setUserData(res.data.user);
        if (res?.data?.user_exists) {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get(`${config.BACKEND_URI}/api/admin/get/wallet/data`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        setWalletData(res.data);
        setSetDetail(res.data.wallet_data);

        let giftCoin = 0;
        if (res.data.wallet_data?.is_wallet_active) {
          for (let range of res.data.wallet_data?.coin_gift_range) {
            console.warn('Range =>>>>>>>>>', range);
            if (
              range?.min_range < Number(authState?.cartTotal) &&
              range?.max_range > Number(authState?.cartTotal)
            ) {
              giftCoin = range?.gift_coin;
            }
          }
        }
        console.warn('giftCoin', giftCoin);
        setgiftCoin(giftCoin);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  console.warn('walletData ====>', walletData);

  const [setDetail, setSetDetail] = useState({});

  // useEffect(() => {
  //   axios
  //     .get(`${config.BACKEND_URI}/api/admin/get/wallet/data`, {
  //       headers: {
  //         Authorization: `token ${config.APP_VALIDATOR}`,
  //       },
  //       withCredentials: true,
  //     })
  //     .then(res => {
  //       console.warn('User Data', res.data.wallet_data);

  //     })
  //     .catch(err => {
  //       console.warn(err);
  //     });
  // }, []);

  const paramsCouponCode = route.params.appliedCoupon;

  console.warn('paramsCouponCode', paramsCouponCode);

  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    setCouponCode(paramsCouponCode ? `${paramsCouponCode}` : '');
  }, [paramsCouponCode]);

  const [couponDetail, setCouponDetail] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);

  const nullCouponall = () => {
    setCouponDetail(null);
    setDiscountValue(0);
    setCouponCode('');
  };

  const couponCheck = async () => {
    if (couponCode.length < 3) {
      Toast.show('Add a Valid Coupon !', {
        type: 'danger',
      });
      return;
    }

    try {
      axios
        .get(
          `${config.BACKEND_URI}/api/admin/get/coupons/code/${couponCode}/${
            authState?.adminDetails?.delivery_charges + authState?.cartTotal
          }`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          // console.log('coupon Response', res.data);
          if (res.data.status) {
            setCouponDetail(res.data.coupon);

            let couponData = res.data.coupon;

            if (couponData?.discount_type?.toUpperCase() == 'AMOUNT') {
              setDiscountValue(couponData?.discount_value);
            } else {
              const value =
                ((authState?.adminDetails?.delivery_charges +
                  authState?.cartTotal) *
                  couponData?.discount_value) /
                100;

              // setDiscountValue(value);
              setDiscountValue(value);
            }

            Toast.show('Coupon Applied Successfull !', {
              type: 'success',
            });
          } else {
            setDiscountValue(0);
            Toast.show(res.data.message, {
              type: 'danger',
            });
          }
        })
        .catch(err => {
          console.warn('Coupon Area', err);
          Toast.show('Invalid Coupon', {
            type: 'danger',
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          {/* <StatusBar backgroundColor="#fff" /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <MaterialIcons
              onPress={goBack}
              name="keyboard-arrow-left"
              size={27}
              color={config.primaryColor}
            />
            <Text style={styles.headingText}>Checkout</Text>
            <MaterialIcons
              style={{opacity: 0}}
              name="keyboard-arrow-left"
              size={27}
              color="white"
            />
            {/* <View style={{paddingHorizontal:10}} ></View> */}
          </View>
          {loading ? (
            <View
              style={{
                flex: 1,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomLoader />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.cartListBox}>
                {cartProducts?.length != 0 &&
                  cartProducts?.map((value, index) => (
                    //  <View key={value._id} style={styles.cartItemBox} >
                    <View
                      key={value._id}
                      style={{
                        ...styles.cartItemBox,
                        borderBottomColor: '#f2f2f2',
                        borderBottomWidth: 1,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(navigationString.PRODUCT_INFO, {
                              product_id: value?._id,
                              product_quantity: value?.product_quantity,
                            })
                          }
                          activeOpacity={0.7}>
                          <View
                            style={{
                              borderWidth: 0.6,
                              borderColor: 'lightgray',
                              padding: 2,
                              borderRadius: 10,
                            }}>
                            <Image
                              source={{
                                uri: value?.product_images[0]?.image_url,
                              }}
                              style={{
                                width: responsiveWidth(20),
                                height: responsiveHeight(10),
                                borderRadius: 8,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View style={styles.cartDetails}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate(
                                navigationString.PRODUCT_INFO,
                                {
                                  product_id: value?._id,
                                  product_quantity: value?.product_quantity,
                                },
                              )
                            }
                            activeOpacity={0.8}>
                            <Text style={styles.productName}>
                              {value.product_name?.slice(0, 24)}
                              {value?.product_name?.length > 24 && '...'}
                            </Text>
                          </TouchableOpacity>

                          {/* <Text style={styles.productId} >{value.product_code}</Text> */}
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.brandName}>
                              {value.product_category?.slice(0, 17)}
                              {value.product_category?.length > 17 && '...'}
                            </Text>
                            <Text style={styles.discountText}>
                              {Math.round(
                                ((value?.product_regular_price -
                                  value?.product_sale_price) /
                                  value?.product_regular_price) *
                                  100,
                              )}
                              %OFF
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}>
                            {/* { value?.product_color && <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}} >
           <Text style={{fontSize:12,fontWeight:'500'}} >Color : </Text>
             <View style={{paddingHorizontal:6,paddingVertical:6,borderRadius:2,backgroundColor:value?.product_color}} ></View>
           </View>} */}
                            {value?.selected_variation &&
                              value?.selected_variation[0] && (
                                <Text style={{fontSize: 12, fontWeight: '500'}}>
                                  {value?.selected_variation[0]}
                                </Text>
                              )}
                            {value?.selected_variation &&
                              value?.selected_variation[1] && (
                                <Text
                                  style={{
                                    paddingLeft: 6,
                                    fontSize: 12,
                                    fontWeight: '500',
                                  }}>
                                  {value?.selected_variation[1]}
                                </Text>
                              )}
                            {/* {value?.product_size &&  <Text style={{paddingLeft:6,fontSize:12,fontWeight:'500'}} >Size : {value.product_size}</Text>}
            {value?.product_weight &&  <Text style={{paddingLeft:6,fontSize:12,fontWeight:'500'}} >Weight : {value?.product_weight}</Text>} */}
                          </View>
                          <View style={{...styles.quantityBox, marginTop: 0}}>
                            <Text
                              style={{
                                fontWeight: '600',
                                fontSize: 14,
                                paddingHorizontal: 1,
                                textAlign: 'center',
                                paddingVertical: 3,
                              }}>
                              Qty -{' '}
                              {value.product_quantity
                                ? value.product_quantity
                                : 1}
                            </Text>
                          </View>
                          {/* <View style={styles.quantityBox} >
             <TouchableOpacity activeOpacity={0.7} onPress={()=>decreaseQuantity(value._id)} >
             <Ionicons style={{backgroundColor:'#f5f5f6',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="remove" size={18} color="#555" />
             </TouchableOpacity>
             <Text style={{fontWeight:'600',fontSize:15,paddingHorizontal:1,width:30,textAlign:'center',paddingVertical:3}}>
             {value.product_quantity ? value.product_quantity : 1}
              </Text>
             <TouchableOpacity activeOpacity={0.7} onPress={()=>increaseQuantity(value._id)} >
             <Ionicons style={{backgroundColor:'#f5f5f6',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="md-add" size={18} color="#555" />
             </TouchableOpacity>
             </View> */}
                        </View>
                      </View>

                      {/* <View style={styles.priceBox} >
            <Text style={{color:'gray',textDecorationLine:'line-through',fontSize:13,fontWeight:'600'}} >₹{value?.product_regular_price}</Text>
            <Text style={{color:config.primaryColor,fontSize:16,fontWeight:'600'}} >₹{value?.product_sale_price}</Text>
             </View> */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.removeBox}>
                        {/* <AntDesign name="delete" size={12} style={{paddingRight:2,fontWeight:'500'}} color="red" /> */}
                        {/* <Text style={{fontSize:12,fontWeight:'500',color:'red'}} >
               Remove</Text> */}
                        <View style={styles.priceBox}>
                          <Text
                            style={{
                              color: 'gray',
                              textDecorationLine: 'line-through',
                              fontSize: 13,
                              fontWeight: '600',
                            }}>
                            ₹{value?.product_regular_price}
                          </Text>
                          <Text
                            style={{
                              color: config.primaryColor,
                              fontSize: 16,
                              fontWeight: '600',
                            }}>
                            ₹{value?.product_sale_price}
                          </Text>
                          {/* <Text style={{fontSize:12,color:'#555'}} >Remove</Text> */}
                        </View>
                        {/* <Text style={{color:config.primaryColor,fontSize:20,fontWeight:'600'}} >₹ {value.productPrice}</Text>  */}
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
              <View style={{...styles.paymentSummaryBox, paddingTop: 10}}>
                <Text style={styles.paymentSummaryText}>Delivery Location</Text>
                <View style={styles.DeliveryMainBox}>
                  <View style={{...styles.deliveryBox}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialIcons
                        name="location-on"
                        size={19}
                        style={{color: config.primaryColor, paddingRight: 4}}
                      />
                      <Text style={styles.subtotalText}>Your Address</Text>
                    </View>

                    {!checkoutDetail?.shipping_address?.length &&
                      !userOtherCheckoutDetails?.shipping_address?.length && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() =>
                            navigation.navigate(navigationString.EDIT_PROFILE, {
                              fromCheckOut: true,
                            })
                          }
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <FontAwesome5
                            name="edit"
                            size={14}
                            style={{
                              color: config.primaryColor,
                              paddingRight: 4,
                            }}
                          />
                          <Text style={styles.editDeliveryText}>
                            Edit-Address
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>

                  {checkoutDetail?.shipping_address?.length ? (
                    <View>
                      <View
                        style={{
                          borderColor: 'lightgray',
                          borderWidth: 1,
                          borderRadius: 10,
                          backgroundColor: '#f9f9f9',
                          marginVertical: 5,
                        }}>
                        <View style={{flexDirection: 'row', paddingTop: 4}}>
                          <TouchableOpacity
                            onPress={() => onClickAddress(checkoutDetail, true)}
                            activeOpacity={0.6}
                            style={{paddingLeft: 4}}>
                            <MaterialIcons
                              name="radio-button-on"
                              size={17}
                              color={
                                selectAddress
                                  ? config.primaryColor
                                  : 'lightgray'
                              }
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => onClickAddress(checkoutDetail, true)}
                            activeOpacity={0.6}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#767676',
                                    textTransform: 'capitalize',
                                  }}>
                                  {checkoutDetail?.customer_name}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                {checkoutDetail?.customer_phone_number && (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: '400',
                                      color: '#767676',
                                      textTransform: 'capitalize',
                                    }}>
                                    +91-{checkoutDetail?.customer_phone_number}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                {checkoutDetail?.customer_email && (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: '400',
                                      color: '#767676',
                                      textTransform: 'capitalize',
                                    }}>
                                    {checkoutDetail?.customer_email}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: 4,
                                paddingRight: 20,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#767676',
                                    lineHeight: 18,
                                    textTransform: 'capitalize',
                                  }}>
                                  {checkoutDetail?.shipping_address}{' '}
                                  {checkoutDetail?.state}{' '}
                                  {checkoutDetail?.pincode}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {selectAddress && (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              onPress={() =>
                                navigation.navigate(
                                  navigationString.EDIT_PROFILE,
                                  {fromCheckOut: true},
                                  {fromCheckOut: true},
                                )
                              }
                              style={{
                                position: 'absolute',
                                right: 10,
                                top: 5,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}>
                              <FontAwesome5
                                name="edit"
                                size={14}
                                style={{
                                  color: config.primaryColor,
                                  paddingRight: 4,
                                }}
                              />
                              <Text style={styles.editDeliveryText}>Edit</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View></View>
                  )}
                  {userOtherCheckoutDetails?.customer_name &&
                  userOtherCheckoutDetails?.customer_phone_number ? (
                    <View>
                      <View
                        style={{
                          borderColor: 'lightgray',
                          borderWidth: 1,
                          borderRadius: 10,
                          backgroundColor: '#f9f9f9',
                          marginVertical: 5,
                        }}>
                        <View style={{flexDirection: 'row', paddingTop: 4}}>
                          <TouchableOpacity
                            onPress={() =>
                              onClickAddress(userOtherCheckoutDetails, false)
                            }
                            activeOpacity={0.6}
                            style={{paddingLeft: 4}}>
                            <MaterialIcons
                              name="radio-button-on"
                              size={17}
                              color={
                                selectAddress
                                  ? 'lightgray'
                                  : config.primaryColor
                              }
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              onClickAddress(userOtherCheckoutDetails, false)
                            }
                            activeOpacity={0.6}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#767676',
                                    textTransform: 'capitalize',
                                  }}>
                                  {userOtherCheckoutDetails?.customer_name}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                {userOtherCheckoutDetails?.customer_phone_number && (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: '400',
                                      color: '#767676',
                                      textTransform: 'capitalize',
                                    }}>
                                    +91-
                                    {
                                      userOtherCheckoutDetails?.customer_phone_number
                                    }
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                {userOtherCheckoutDetails?.customer_email && (
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: '400',
                                      color: '#767676',
                                      textTransform: 'capitalize',
                                    }}>
                                    {userOtherCheckoutDetails?.customer_email}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: 4,
                                paddingRight: 20,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#767676',
                                    lineHeight: 18,
                                    textTransform: 'capitalize',
                                  }}>
                                  {userOtherCheckoutDetails?.shipping_address}{' '}
                                  {userOtherCheckoutDetails?.state}{' '}
                                  {userOtherCheckoutDetails?.pincode}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {!selectAddress && (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              onPress={goToEditAddress}
                              style={{
                                position: 'absolute',
                                right: 10,
                                top: 5,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}>
                              <FontAwesome5
                                name="edit"
                                size={14}
                                style={{
                                  color: config.primaryColor,
                                  paddingRight: 4,
                                }}
                              />
                              <Text style={styles.editDeliveryText}>Edit</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  ) : checkoutDetail?.shipping_address?.length ? (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={goToEditAddress}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <FontAwesome5
                          name="edit"
                          size={14}
                          style={{color: config.primaryColor, paddingRight: 4}}
                        />
                        <Text style={styles.editDeliveryText}>
                          Add Other Address
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View></View>
                  )}
                  {!checkoutDetail?.shipping_address?.length && (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() =>
                        navigation.navigate(
                          navigationString.EDIT_PROFILE,
                          {fromCheckOut: true},
                          {fromCheckOut: true},
                        )
                      }>
                      <Text
                        style={{
                          paddingTop: 10,
                          color: config.primaryColor,
                          fontWeight: '500',
                          textAlign: 'center',
                        }}>
                        Please Add Your Delivery Address
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={{...styles.paymentSummaryBox, paddingTop: 10}}>
                <Text style={styles.paymentSummaryText}>
                  Choose Payment Method
                </Text>
                {!authState?.adminDetails?.cash_on_delivery &&
                  !authState?.adminDetails?.razorpay_is_installed && (
                    <View style={styles.paymentMethodbox}>
                      <Text>No, Payment Method Available !!</Text>
                    </View>
                  )}

                {
                  authState?.adminDetails?.cash_on_delivery &&
                  authState?.adminDetails?.razorpay_is_installed ? (
                    //=========  WHEN BOTH COD & PAYNOW IS ACTIVE ===========
                    <View>
                      <View>
                        <View style={styles.paymentMethodbox}>
                          <TouchableOpacity
                            onPress={() => setPaymentMode(true)}
                            activeOpacity={0.3}
                            style={{flexDirection: 'row'}}>
                            <MaterialIcons
                              style={{paddingRight: 12}}
                              name="radio-button-on"
                              size={17}
                              color={
                                paymentMode ? config.primaryColor : 'lightgray'
                              }
                            />
                            <Text style={styles.paymentMethodText}>
                              Pay Now{' '}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <View style={styles.paymentMethodbox}>
                          <TouchableOpacity
                            onPress={() => {
                              setPaymentMode(false);
                              setCheckBox(false);
                            }}
                            activeOpacity={0.3}
                            style={{flexDirection: 'row'}}>
                            <MaterialIcons
                              style={{paddingRight: 12}}
                              name="radio-button-on"
                              size={17}
                              color={
                                paymentMode ? 'lightgray' : config.primaryColor
                              }
                            />
                            <Text style={styles.paymentMethodText}>
                              Cash On Delivery
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    //=========  WHEN BOTH COD & PAYNOW IS ACTIVE ===========

                    //=========  WHEN ONLY ONE IS ACTIVE COD OR PAYNOW ===========

                    <View>
                      <View>
                        <View>
                          {authState?.adminDetails?.razorpay_is_installed && (
                            <View style={styles.paymentMethodbox}>
                              <TouchableOpacity
                                activeOpacity={0.3}
                                style={{flexDirection: 'row'}}>
                                <MaterialIcons
                                  style={{paddingRight: 12}}
                                  name="radio-button-on"
                                  size={17}
                                  color={config.primaryColor}
                                />
                                <Text style={styles.subtotalText}>
                                  Pay Now{' '}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <View>
                          {authState?.adminDetails?.cash_on_delivery && (
                            <View style={styles.paymentMethodbox}>
                              <TouchableOpacity
                                activeOpacity={0.3}
                                style={{flexDirection: 'row'}}>
                                <MaterialIcons
                                  style={{paddingRight: 12}}
                                  name="radio-button-on"
                                  size={17}
                                  color={config.primaryColor}
                                />
                                <Text style={styles.subtotalText}>
                                  Cash On Delivery
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  )
                  //=========  WHEN ONLY ONE IS ACTIVE COD OR PAYNOW ===========
                }
              </View>

              <View style={styles.paymentSummaryBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.paymentSummaryText]}>
                    Discount Coupons
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(navigationString.All_COUPONS);
                    }}>
                    <Text style={[styles.paymentSummaryText]}>See All</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  <TextInput
                    maxLength={20}
                    keyboardType="autoCapitalize"
                    autoCapitalize='characters'
                    style={styles.phoneField}
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChangeText={value => {
                      setCouponCode(value.toUpperCase());
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      couponCheck();
                    }}
                    activeOpacity={0.8}
                    style={styles.checkButton}>
                    <MaterialCommunityIcons
                      style={{paddingRight: 4}}
                      name="checkbox-marked-circle-outline"
                      size={16}
                      color="white"
                    />
                    <Text style={styles.checktext}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {couponDetail?.discount_type ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.paymentSummaryText]}>
                      Coupon Applied {couponDetail?.coupon_code}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        nullCouponall();
                      }}>
                      <Text style={[styles.paymentSummaryText]}>X</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  ''
                )}

                <Text style={{...styles.paymentSummaryText, paddingTop: 22}}>
                  Payment Summary
                </Text>
                <View style={styles.cartTotalBox}>
                  <View style={styles.subtotalbox}>
                    <Text style={styles.subtotalText}>Subtotal</Text>
                    <Text style={styles.subtotalPrice}>
                      ₹{authState?.cartTotal}
                    </Text>
                  </View>

                  <View style={styles.subtotalbox}>
                    <Text style={styles.subtotalText}>
                      Delivery & Shipping{' '}
                    </Text>
                    {authState?.adminDetails?.delivery_charges > 0 && (
                      <Text style={styles.subtotalPrice}>
                        {' '}
                        {`+ ₹${authState?.adminDetails?.delivery_charges}`}
                      </Text>
                    )}

                    {authState?.adminDetails?.delivery_charges === 0 && (
                      <Text style={styles.subtotalPrice}>Free</Text>
                    )}
                  </View>

                  {authState.adminDetails.is_wallet_active ? (
                    <View style={{paddingBottom: 0}}>
                      {setDetail?.min_amount_wallet_use != 0 ? (
                        <Text
                          style={[
                            styles.subtotalPrice,
                            {fontSize: responsiveWidth(3.4)},
                            {marginTop: 5},
                          ]}>
                          Min. {setDetail?.min_amount_wallet_use} Coins Required
                          to Use Wallet
                        </Text>
                      ) : (
                        ''
                      )}

                      <View
                        style={[
                          styles.subtotalbox,
                          {paddingVertical: 5, paddingLeft: 0},
                        ]}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            marginLeft: responsiveWidth(-1.9),
                          }}>
                          <Checkbox
                            status={checkBox ? 'checked' : 'unchecked'}
                            value={checkBox}
                            disabled={
                              userData?.wallet <
                              setDetail?.min_amount_wallet_use
                                ? true
                                : false
                            }
                            onPress={() => {
                              setCheckBox(!checkBox);
                            }}
                            color={config.primaryColor}
                          />
                          <Text
                            style={{...styles.subtotalText, paddingLeft: 0}}>
                            Use Wallet Coins{' '}
                          </Text>
                        </View>
                        <Text style={styles.subtotalPrice}>
                          {userData?.wallet} Coins
                        </Text>
                      </View>
                    </View>
                  ) : (
                    ''
                  )}

                  {checkBox ? (
                    <>
                      {checkBox ? (
                        <View style={styles.subtotalbox}>
                          <Text style={styles.subtotalText}>Coin Used </Text>
                          <Text style={styles.subtotalPrice}>
                            -{' '}
                            {userData.wallet <= 0
                              ? 0
                              : authState?.cartTotal -
                                  discountValue +
                                  authState?.adminDetails?.delivery_charges >=
                                userData.wallet
                              ? userData.wallet * setDetail.one_coin_price
                              : authState.cartTotal -
                                discountValue +
                                Number(
                                  authState?.adminDetails?.delivery_charges,
                                )}
                            {/* {userData.wallet * setDetail.one_coin_price >=
                        authState?.adminDetails?.delivery_charges +
                          authState?.cartTotal -
                          discountValue
                          ? 0
                          : (
                              authState?.adminDetails?.delivery_charges +
                              authState?.cartTotal -
                              userData.wallet * setDetail.one_coin_price -
                              discountValue
                            ).toFixed(0)} */}
                          </Text>
                        </View>
                      ) : (
                        ''
                      )}

                      <View style={styles.subtotalbox}>
                        <View
                          style={{
                            display: 'flex',
                            // borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                          }}>
                          <Text style={[styles.subtotalText]}>
                            1 Coin = ₹{setDetail.one_coin_price}
                          </Text>
                        </View>
                        <Text style={styles.subtotalPrice}>
                          {userData?.wallet} x {setDetail.one_coin_price} = ₹
                          {userData?.wallet * setDetail.one_coin_price}
                        </Text>
                      </View>

                      {/* <View style={styles.subtotalbox}>
                        <View
                          style={{
                            display: 'flex',
                            // borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                          }}>
                          <Text style={[styles.subtotalText]}>
                            Gross Amount
                          </Text>
                        </View>
                        <Text style={styles.subtotalPrice}>
                          ₹
                          {userData.wallet * setDetail.one_coin_price >=
                          authState?.adminDetails?.delivery_charges +
                            authState?.cartTotal
                            ? 0
                            : authState?.adminDetails?.delivery_charges +
                              authState?.cartTotal -
                              userData.wallet * setDetail.one_coin_price}
                        </Text>
                      </View> */}
                    </>
                  ) : (
                    ''
                  )}

                  {couponDetail?.discount_type ? (
                    <View style={styles.subtotalbox}>
                      <Text style={styles.subtotalText}>Coupon Discount</Text>

                      {couponDetail?.discount_type?.toUpperCase() ==
                      'AMOUNT' ? (
                        <Text
                          style={
                            styles.subtotalPrice
                          }>{`- ₹${discountValue}`}</Text>
                      ) : (
                        ''
                      )}

                      {couponDetail?.discount_type?.toUpperCase() ==
                      'PERCENTAGE' ? (
                        <Text style={styles.subtotalPrice}>{`- ₹${Math.round(
                          discountValue,
                        )}`}</Text>
                      ) : (
                        ''
                      )}
                    </View>
                  ) : (
                    ''
                  )}

                  <View style={styles.totalpayablebox}>
                    <Text style={styles.totalpayableText}>Payable Total</Text>
                    <Text style={styles.totalpayablePrice}>
                      ₹
                      {/* {authState?.adminDetails?.delivery_charges +
                        authState?.cartTotal} */}
                      {checkBox
                        ? userData.wallet * setDetail.one_coin_price >=
                          authState?.adminDetails?.delivery_charges +
                            authState?.cartTotal -
                            discountValue
                          ? 0
                          : (
                              authState?.adminDetails?.delivery_charges +
                              authState?.cartTotal -
                              userData.wallet * setDetail.one_coin_price -
                              discountValue
                            ).toFixed(0)
                        : (
                            authState?.adminDetails?.delivery_charges +
                            authState?.cartTotal -
                            discountValue
                          ).toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
              {authState?.adminDetails?.is_wallet_active && giftCoin > 0 ? (
                <View style={[styles.totalpayablebox, {paddingVertical: 0}]}>
                  <Text
                    style={[
                      styles.totalpayableText,
                      {
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14
                      },
                    ]}>
                    <Image
                      style={{width: 23, height: 40}}
                      resizeMode="contain"
                      source={imageImport.party}
                    />{' '}
                    Get {giftCoin} Coins{' '}
                    <FontAwesome5
                      name="coins"
                      size={16}
                      color={'rgb(255, 159, 36)'}
                    />{' '}
                    As Gift
                  </Text>
                </View>
              ) : (
                ''
              )}

              {/* for extra spacing */}
              <View style={{paddingBottom: 20}}></View>
              {/* for extra spacing */}
            </ScrollView>
          )}

          <View style={{backgroundColor: 'white', width: '100%', height: 70}}>
            {/* {checkoutDetail?.customer_name && checkoutDetail?.customer_phone_number && checkoutDetail?.shipping_address && checkoutDetail?.pincode && checkoutDetail?.state
    ?
<View  >
{(authState?.adminDetails?.cash_on_delivery && (authState?.adminDetails?.razorpay_is_installed && authState?.adminDetails?.adiogent_pay?.is_installed))
    
    ?
   <View style={{backgroundColor:'white',width:'100%',height:70}} >
    {paymentMode ?
     <TouchableOpacity onPress={handleCheckOutWithRazorpay} activeOpacity={0.8} style={styles.checkoutBtn}>
     <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
     <Text style={styles.checkouttext}>Pay Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
     </TouchableOpacity>
  :  
  <TouchableOpacity onPress={()=>setModalVisible(true)} activeOpacity={0.8} style={styles.checkoutBtn}>
  <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
  <Text style={styles.checkouttext}>Order Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
  </TouchableOpacity>
  }
   </View>
   :
   <View style={{backgroundColor:'white',width:'100%',height:70}} >

   {(authState?.adminDetails?.razorpay_is_installed || authState?.adminDetails?.adiogent_pay?.is_installed) &&

   <TouchableOpacity 
   onPress={authState?.adminDetails?.adiogent_pay?.is_installed ? reactNativeUpiPayment : handleCheckOutWithRazorpay}
    activeOpacity={0.8} style={styles.checkoutBtn}>
   <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
   <Text style={styles.checkouttext}>Pay Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
   </TouchableOpacity>}

   {authState?.adminDetails?.cash_on_delivery &&
   
   <TouchableOpacity onPress={()=>setModalVisible(true)} activeOpacity={0.8} style={styles.checkoutBtn}>
   <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
   <Text style={styles.checkouttext}> Order Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
   </TouchableOpacity>}
   

   </View>

    }
     <View style={{backgroundColor:'white',width:'100%',height:70}} >
    {paymentMode ?
     <TouchableOpacity
     onPress={authState?.adminDetails?.adiogent_pay?.is_installed ? reactNativeUpiPayment : handleCheckOutWithRazorpay}
      activeOpacity={0.8} style={styles.checkoutBtn}>
     <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
     <Text style={styles.checkouttext}>Pay Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
     </TouchableOpacity>
  :  
  <TouchableOpacity onPress={()=>setModalVisible(true)} activeOpacity={0.8} style={styles.checkoutBtn}>
  <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
  <Text style={styles.checkouttext}>Order Now ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
  </TouchableOpacity>
  }
   </View>
</View>
    :

<TouchableOpacity  activeOpacity={0.8} style={styles.checkoutWithoutDetailBtn}>
<Octicons name="info" style={{paddingRight:6}} size={20} color="#A2ACB8" />
<Text style={styles.checkoutWithoutDetailtext}>Please Fill Address</Text>
</TouchableOpacity>
  
  } */}

            {checkoutDetail?.customer_name &&
            checkoutDetail?.customer_phone_number &&
            checkoutDetail?.shipping_address &&
            checkoutDetail?.pincode &&
            checkoutDetail?.state ? (
              <View>
                <View
                  style={{backgroundColor: 'white', width: '100%', height: 70}}>
                  {paymentMode &&
                  authState?.adminDetails?.razorpay_is_installed ? (
                    userData.wallet * setDetail.one_coin_price >=
                      authState?.adminDetails?.delivery_charges +
                        authState?.cartTotal && checkBox ? (
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.8}
                        style={styles.checkoutBtn}>
                        <MaterialCommunityIcons
                          style={{paddingRight: 4}}
                          name="checkbox-marked-circle-outline"
                          size={24}
                          color="white"
                        />
                        <Text style={styles.checkouttext}>
                          Pay With Wallet ₹
                          {checkBox
                            ? (
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                discountValue
                              ).toFixed(0)
                            : (
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                discountValue
                              ).toFixed(0)}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handleCheckOutWithRazorpay}
                        activeOpacity={0.8}
                        style={styles.checkoutBtn}>
                        <MaterialCommunityIcons
                          style={{paddingRight: 4}}
                          name="checkbox-marked-circle-outline"
                          size={24}
                          color="white"
                        />
                        <Text style={styles.checkouttext}>
                          Pay Now ₹
                          {/* {authState?.adminDetails?.delivery_charges +
                          authState?.cartTotal} */}
                          {checkBox
                            ? (
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                userData.wallet * setDetail.one_coin_price -
                                discountValue
                              ).toFixed(0)
                            : (
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                discountValue
                              ).toFixed(0)}
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      activeOpacity={0.8}
                      style={styles.checkoutBtn}>
                      <MaterialCommunityIcons
                        style={{paddingRight: 4}}
                        name="checkbox-marked-circle-outline"
                        size={24}
                        color="white"
                      />
                      <Text style={styles.checkouttext}>
                        {/* Order Now ₹ */}
                        {/* {authState?.adminDetails?.delivery_charges +
                          authState?.cartTotal} */}
                        {checkBox
                          ? userData.wallet * setDetail.one_coin_price >=
                            authState?.adminDetails?.delivery_charges +
                              authState?.cartTotal
                            ? `Pay With Wallet ₹${(
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                discountValue
                              ).toFixed(0)}`
                            : `Order Now ₹${(
                                authState?.adminDetails?.delivery_charges +
                                authState?.cartTotal -
                                userData.wallet * setDetail.one_coin_price -
                                discountValue
                              ).toFixed(0)}`
                          : `Order Now ₹${(
                              authState?.adminDetails?.delivery_charges +
                              authState?.cartTotal -
                              discountValue
                            ).toFixed(0)}`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.checkoutWithoutDetailBtn}>
                <Octicons
                  name="info"
                  style={{paddingRight: 6}}
                  size={20}
                  color="#A2ACB8"
                />
                <Text style={styles.checkoutWithoutDetailtext}>
                  Please Fill Address
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* <TouchableOpacity onPress={reactNativeUpiPayment} activeOpacity={0.8} style={styles.checkoutBtn}>
     <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
     <Text style={styles.checkouttext}>Pay Nosssw ₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
     </TouchableOpacity> */}
        </View>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modelContainerStyle}>
          {/* {!confirmLoading && 
             <View style={{position:'absolute',top:'0%',bottom:'0%',left:'0%',right:'0%',zIndex:2,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)',borderRadius:8}} >
             <View>
             <ActivityIndicator size='large' color={config.primaryColor} />
            <Text style={{ color:'gray',fontWeight:'500',paddingTop:12,paddingLeft:12}} >
              Placing Order...
              </Text>
            </View>
            </View>
            } */}
          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#222',
                textAlign: 'center',
              }}>
              <MaterialIcons name="info-outline" size={24} color="#222" />
            </Text>
            <View>
              <View style={{paddingTop: 12, paddingBottom: 16}}>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 20,
                    color: 'gray',
                    fontSize: 15,
                    paddingHorizontal: 30,
                  }}>
                  {' '}
                  Click on Confirm Order To Place Order !!{' '}
                </Text>
                {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
              </View>

              <View style={{borderTopColor: '#f2f2f2', borderTopWidth: 1}}>
                {confirmLoading ? (
                  <View
                    style={{
                      paddingTop: responsiveWidth(4),
                      paddingBottom: responsiveWidth(2),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator
                        size="small"
                        color={config.primaryColor}
                      />
                      <Text
                        style={{
                          color: 'gray',
                          fontWeight: '500',
                          paddingLeft: 12,
                        }}>
                        Placing Order...
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                    }}>
                    <TouchableOpacity
                      style={{paddingTop: 15, paddingBottom: 8}}
                      activeOpacity={0.5}
                      onPress={() => setModalVisible(false)}>
                      <View>
                        <Text
                          style={{
                            color: '#DE040C',
                            fontSize: 14,
                            fontWeight: '700',
                          }}>
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{paddingTop: 15, paddingBottom: 8}}
                      activeOpacity={0.5}
                      onPress={handleOrderNowCodBtn}>
                      <View>
                        <Text
                          style={{
                            color: config.primaryColor,
                            fontSize: 14,
                            fontWeight: '700',
                          }}>
                          Confirm Order
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default Checkout;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: '600',
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  phoneFieldContainer: {
    position: 'relative',
    width: '100%',
  },
  indiaIcon: {
    position: 'absolute',
    bottom: 14,
    left: 15,
  },
  nineOneText: {
    fontSize: 14,
  },
  phoneField: {
    width: responsiveWidth(70),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: 7,
    fontSize: 14,
    backgroundColor: '#f5f5f6',
    // borderRadius: 16,
    borderTopLeftRadius: responsiveWidth(2.5),
    borderBottomLeftRadius: responsiveWidth(2.5),
    // borderRadius:responsiveWidth(3),
    borderWidth: 0.5,
    borderColor: 'lightgray',
    textTransform: 'uppercase',
  },
  commonFieldContainer: {
    position: 'relative',
    width: '100%',
  },
  commonField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 45,
    paddingVertical: 9,
    fontSize: 14,
    // textTransform:'capitalize',
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray',
  },
  commonIcon: {
    position: 'absolute',
    bottom: 12,
    left: 15,
    color: '#555',
  },
  cartListBox: {
    paddingHorizontal: 10,
  },
  cartItemBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    position: 'relative',
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  priceBox: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priceText: {
    color: config.primaryColor,
    fontSize: 13,
    fontWeight: '600',
  },
  cartDetails: {
    paddingLeft: 17,
  },
  productName: {
    fontSize: responsiveFontSize(1.9),
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  productId: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  brandName: {
    fontSize: responsiveFontSize(1.4),
    paddingVertical: 2,
    textTransform: 'capitalize',
  },
  discountText: {
    paddingTop: 0,
    paddingLeft: 5,
    fontSize: 11,
    // textTransform:'capitalize',
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#dc0000',
  },
  removeBox: {
    position: 'absolute',
    bottom: 19,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  DeliveryMainBox: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'lightgray',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // marginHorizontal:12
  },
  deliveryBox: {
    // paddingHorizontal:20,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  editDeliveryText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    color: config.primaryColor,
  },

  paymentSummaryBox: {
    paddingHorizontal: 20,
  },
  paymentSummaryText: {
    fontSize: responsiveFontSize(1.8),
    paddingVertical: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#1e1e1e',
  },
  cartTotalBox: {
    backgroundColor: '#f9f9f9',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'lightgray',
    paddingHorizontal: 16,
    // marginHorizontal:12
  },
  // paymentMethodMainBox:{
  //   backgroundColor:'#f9f9f9',
  //   borderWidth:0.5,
  //   borderRadius:10,
  //   borderColor:'lightgray',
  //   paddingHorizontal:16,
  //   // marginHorizontal:12
  // },
  subtotalbox: {
    // paddingHorizontal:20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderColor: 'lightgray',
  },
  paymentMethodbox: {
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: 'lightgray',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth:0.6,
    // borderColor:'lightgray',
  },

  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: '#1e1e1e',
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: '#1e1e1e',
  },
  subtotalPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#767676',
  },

  totalpayablebox: {
    // paddingHorizontal:20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth:0.6,
    // borderColor:'#f2f2f2',
  },
  totalpayableText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#1e1e1e',
  },
  totalpayablePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: config.primaryColor,
  },
  checkouttext: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white',
  },
  checktext: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white',
  },
  checkoutBtn: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '91%',
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
    // backgroundColor: config.primaryColor,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  checkoutWithoutDetailtext: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#A2ACB8',
  },
  checkoutWithoutDetailBtn: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '91%',
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
    // backgroundColor: config.primaryColor,
    backgroundColor: '#E4E8EB',
    borderRadius: 16,
    shadowColor: '#E4E8EB',
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  modelContainerStyle: {
    // position:'absolute',
    // width:300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 18,
    paddingBottom: 12,
    marginHorizontal: responsiveWidth(10),
    // marginHorizontal:40,
    borderRadius: 10,
    zIndex: 2,
  },
  checkButton: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveWidth(3.3),
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderBottomRightRadius: responsiveWidth(2.5),
    borderTopRightRadius: responsiveWidth(2.5),
    // borderRadius:responsiveWidth(3),
    borderColor: config.primaryColor,
    borderWidth: 0.3,
  },
});
