import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Pressable,
  Linking,
  Image,
  StatusBar,
  Share,
} from 'react-native';
import {config} from '../../config';
// import { StatusBar } from "expo-status-bar";
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import imageImport from '../../Constants/imageImport';
import strings from '../../Constants/strings';
import ProductImageCarousel from './ProductImageCarousel';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import {
  getCartProductCount,
  getAllCartProducts,
  setItemToLocalStorage,
  findProductInCart,
  addToCart,
} from '../../Utils/localstorage';
import {useFocusEffect} from '@react-navigation/native';
import {UseContextState} from '../../global/GlobalContext';
import {useCallback} from 'react';
import CustomLoader from '../../components/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {useToast} from 'react-native-toast-notifications';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Rating, AirbnbRating} from 'react-native-ratings';

function ProductInfo({route, navigation}) {
  const [productDetail, setProductDetail] = useState();
  const [productReview, setProductReview] = useState();
  const [laoding, setLoading] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState();
  const [viewCart, setViewCart] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [productQuantity, setProductQuantity] = useState(
    route.params?.product_quantity ? route.params?.product_quantity : 1,
  );
  const [productSize, setProductSize] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [productColor, setProductColor] = useState();
  const [productVariant1, setProductVariant1] = useState('');
  const [productVariant2, setProductVariant2] = useState('');
  const [render, setRender] = useState(false);
  const {cartState, authState, fetchAdminDetails} = UseContextState();
  const {product_id} = route.params;
  const toast = useToast();

  const showAddedToCartToast = () => {
    toast.show('Product Added To Cart !!', {
      type: 'success',
    });
  };

  // console.log("PRODUCT VARIANTS",productVariant1,productVariant2,",productColor" ,productColor );
  console.log('productDetail', productDetail);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BACKEND_URI}/api/get/product/by/id/${product_id}`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        // console.log("PRODUCT INFO=>",res?.data);
        setProductDetail({...res?.data, product_quantity_by: 'piece'});
        // setProductSize(res?.data?.size[0])
        // setProductColor(res?.data?.color[0])
        // setProductWeight(res?.data?.weight[0])
        if (
          res?.data?.is_variant_true &&
          res?.data?.variant_option?.length == 1
        ) {
          if (res?.data?.variant_option[0]?.option_name == 'color picker') {
            setProductColor(res?.data?.variant_option[0]?.option_values[0]);
          }
          setProductVariant1(res?.data?.variant_option[0]?.option_values[0]);
        }
        if (
          res?.data?.is_variant_true &&
          res?.data?.variant_option?.length == 2
        ) {
          if (res?.data?.variant_option[0]?.option_name == 'color picker') {
            setProductColor(res?.data?.variant_option[0]?.option_values[0]);
          }
          if (res?.data?.variant_option[1]?.option_name == 'color picker') {
            setProductColor(res?.data?.variant_option[1]?.option_values[0]);
          }
          setProductVariant1(res?.data?.variant_option[0]?.option_values[0]);
          setProductVariant2(res?.data?.variant_option[1]?.option_values[0]);
        }
        setRender(prev => !prev);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [product_id, refreshing]);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/4/product/review/${product_id}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          console.log('PRODUCT REVIEW==>>', res?.data);
          setProductReview([...res?.data]);
        })
        .catch(err => {
          console.log(err);
        });
    }, [refreshing]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const checkProductInCart = async product_id => {
    const result = await findProductInCart(product_id);
    // console.log("result=>",result)
    setViewCart(result);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkProductInCart(product_id);
    }, [product_id, updateCart, refreshing]),
  );

  const getItemCount = async () => {
    const count = await getCartProductCount();
    // console.log('ITEM FROM Cart=>',count)
    setCartItemCount(count);
    setRefreshing(false);
  };
  useEffect(() => {
    getItemCount();
  }, [updateCart, refreshing]);

  //  const selectedColorFunc=(value)=>{
  //   setProductColor(value)
  //   setRender(prev=>!prev)
  //  }
  //  const selectedSizeFunc=(value)=>{
  //   setProductSize(value)
  //   setRender(prev=>!prev)
  //  }

  const selectedWeightFunc = value => {
    setProductWeight(value);
    setRender(prev => !prev);
  };

  const selectedProductVariantColorFunc = value => {
    setProductColor(value);
    setRender(prev => !prev);
  };
  const selectedProductVariant1Func = value => {
    setProductVariant1(value);
    setRender(prev => !prev);
  };
  const selectedProductVariant2Func = value => {
    setProductVariant2(value);
    setRender(prev => !prev);
  };

  // ON CHANGE PRODUCT VARIANTS
  useEffect(() => {
    changePriceOfVariant();
  }, [render, productColor, productVariant1, productVariant2]);

  const changePriceOfVariant = () => {
    let newData = productDetail;
    console.log('ENTERED--->');
    // let variantsCombination = [productVariant1,productVariant2]
    let variantsCombination;
    if (newData?.variant_option?.length == 1) {
      // console.log("ENTERED IN COLORS --->")
      if (newData?.variant_option[0]?.option_name == 'color picker') {
        // console.log("ENTERED IN COLORS PICKERS --->")
        variantsCombination = [productColor];
      }
      if (newData?.variant_option[0]?.option_name != 'color picker') {
        // console.log("ENTERED IN COLORS PICKERS --->")
        variantsCombination = [productVariant1];
      }
      // variantsCombination = [productVariant1]
    }
    if (newData?.variant_option?.length == 2) {
      // console.log("LENGTH -2 FOUND")
      if (newData?.variant_option[0]?.option_name == 'color picker') {
        // console.log("?.variant_option[0]?.option_name -")
        variantsCombination = [productColor, productVariant2];
      }
      if (newData?.variant_option[1]?.option_name == 'color picker') {
        // console.log("?.variant_option[1]?.option_name -")
        variantsCombination = [productVariant1, productColor];
      }
      if (
        newData?.variant_option[0]?.option_name != 'color picker' &&
        newData?.variant_option[1]?.option_name != 'color picker'
      ) {
        variantsCombination = [productVariant1, productVariant2];
      }
    }
    // console.log("variantsCombination==>",variantsCombination)
    newData?.available_variants?.map((ele, index) => {
      // console.log("COLOR-- ele",ele)
      // console.log("ele?.attributes --- variantsCombination ===>>>>",ele?.attributes , " --- ",variantsCombination)
      // console.log("JSON.stringify(ele?.attributes) === JSON.stringify(variantsCombination===>>>>",JSON.stringify(ele?.attributes) === JSON.stringify(variantsCombination))
      if (
        JSON.stringify(ele?.attributes) === JSON.stringify(variantsCombination)
      ) {
        // console.log("MATCH FOUND--->",ele?.product_regular_price,  ele?.product_sale_price)
        setProductDetail(prev => ({
          ...prev,
          product_regular_price: ele?.product_regular_price,
          product_sale_price: ele?.product_sale_price,
          selected_variation: variantsCombination,
          product_variant_quantity: ele?.product_variant_quantity,
        }));
      }
    });
  };

  const addToCartButton = async product => {
    await addToCart({
      ...product,
      product_quantity: productQuantity,
      product_color: productColor,
      product_size: productSize,
      product_weight: productWeight,
    });
    // console.log('PRODUCT ADDED TO Cart')
    setUpdateCart(prev => !prev);
    await showAddedToCartToast();
    await cartState();
    // await clearLocalStorage()
  };

  // UPDATE CART BUTTON
  const updateCartButton = async product => {
    const result = await getAllCartProducts();
    // console.log("Newresult=>",result)
    const updateProducts = result;
    await result.filter((value, index) => {
      if (value?._id == product?._id) {
        updateProducts[index] = {...product, product_quantity: productQuantity};
      }
    });
    // console.log("updateProducts",updateProducts)
    await setItemToLocalStorage('@cartproducts', updateProducts);
    navigation.navigate(navigationString?.CART);
    //  await clearLocalStorage()
    // console.log("MAIN PRODUCT=>",{...product,product_quantity:productQuantity})
  };

  // BUY NOW BTN FUNC
  const buynowCartBtn = async product => {
    let result = await getAllCartProducts();
    console.log('buynowProductsnewNewresult=>', result);
    if (result == null) {
      result = [];
    }
    let is_not_found = false;
    // await setItemToLocalStorage('@cartproducts',[]);
    // add to cart if not in cart

    // update cart if product in cart
    const buynowProducts = result;
    await result.filter((value, index) => {
      if (value?._id == product?._id) {
        is_not_found = true;
        buynowProducts[index] = {...product, product_quantity: productQuantity};
      }
    });
    console.log('buynowProductsnew', buynowProducts);

    if (is_not_found) {
      await setItemToLocalStorage('@cartproducts', buynowProducts);
      fetchAdminDetails();
      await cartState();
      navigation.navigate(navigationString.CHECKOUT, {
        checkoutProducts: buynowProducts,
      });
      return;
    }

    if (!is_not_found) {
      await addToCart({
        ...product,
        product_quantity: productQuantity,
        product_color: productColor,
        product_size: productSize,
        product_weight: productWeight,
      });
      const result = await getAllCartProducts();
      fetchAdminDetails();
      await cartState();
      navigation.navigate(navigationString.CHECKOUT, {
        checkoutProducts: result,
      });
      return;
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const selectQuantityBy = async option => {
    if (option == 'piece') {
      setProductDetail(prev => ({...prev, product_quantity_by: option}));
    }
    if (option == 'cartoon') {
      setProductDetail(prev => ({...prev, product_quantity_by: option}));
    }
  };

  const increaseQuantity = async product_id => {
    setProductQuantity(productQuantity + 1);
    setProductDetail(prev => ({
      ...prev,
      product_quantity: productQuantity + 1,
    }));
  };

  const decreaseQuantity = async product_id => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
      setProductDetail(prev => ({
        ...prev,
        product_quantity: productQuantity - 1,
      }));
    }
    return;
  };

  //  const renderProductColors=useCallback(({item})=>{
  //   // console.log("PRODUCTS COLORS",item,)
  //   return(
  //     <TouchableOpacity activeOpacity={0.6} onPress={()=>selectedColorFunc(item)} >
  //     <View style={{padding:3,borderRadius:40,borderWidth:1,marginHorizontal:3,borderColor:(productColor == item )? `${config.primaryColor}` : '#f2f2f2' }} >
  //     <View style={{padding:10,borderRadius:40,backgroundColor:item,}} ></View>
  //     </View>
  //   </TouchableOpacity>
  //   )
  //  },[render])
  const renderProductColors = useCallback(
    ({item}) => {
      console.log('PRODUCTS COLORS', item);
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => selectedProductVariantColorFunc(item)}>
          <View
            style={{
              padding: 3,
              borderRadius: 40,
              borderWidth: 1,
              marginHorizontal: 3,
              borderColor:
                productColor == item ? `${config.primaryColor}` : '#f2f2f2',
            }}>
            <View
              style={{
                padding: 10,
                borderRadius: 40,
                backgroundColor: item,
              }}></View>
          </View>
        </TouchableOpacity>
      );
    },
    [render],
  );

  const renderProductVariant1 = useCallback(
    ({item}) => {
      // console.log("PRODUCTS Sizes",item,)
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => selectedProductVariant1Func(item)}>
          <View
            style={{
              padding: 2,
              borderRadius: 6,
              borderWidth: 1,
              margin: 3,
              borderColor:
                productVariant1 === item
                  ? `${config.primaryColor}`
                  : 'lightgray',
            }}>
            <Text
              style={{
                paddingVertical: 3,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: 'white',
                color:
                  productVariant1 === item
                    ? `${config.primaryColor}`
                    : '#1e1e1e',
                fontSize: 14,
                fontWeight: '500',
              }}>
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [render],
  );

  const renderProductVariant2 = useCallback(
    ({item}) => {
      // console.log("PRODUCTS Sizes",item,)
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => selectedProductVariant2Func(item)}>
          <View
            style={{
              padding: 2,
              borderRadius: 6,
              borderWidth: 1,
              margin: 3,
              borderColor:
                productVariant2 === item
                  ? `${config.primaryColor}`
                  : 'lightgray',
            }}>
            <Text
              style={{
                paddingVertical: 3,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: 'white',
                color:
                  productVariant2 === item
                    ? `${config.primaryColor}`
                    : '#1e1e1e',
                fontSize: 14,
                fontWeight: '500',
              }}>
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [render],
  );

  //  const renderProductWeight=useCallback(({item})=>{
  //   // console.log("PRODUCTS Sizes",item,)
  //   return(
  //     <TouchableOpacity activeOpacity={0.6} onPress={()=>selectedWeightFunc(item)} >
  //       <View style={{padding:2,borderRadius:6,borderWidth:1,margin:3,borderColor:productWeight === item ?`${config.primaryColor}`:'lightgray'}} >
  //       <Text style={{paddingVertical:3,paddingHorizontal:12,borderRadius:6,backgroundColor:'white',color:productWeight === item ?`${config.primaryColor}`:'#1e1e1e',fontSize:14,fontWeight:'500',}} >
  //         {item}
  //       </Text>
  //       </View>
  //     </TouchableOpacity>
  //   )
  //  },[render])

  const ratingsData = productReview;
  // const ratingsData =[
  //   {_id:1,username:'Mayank Singh',rating:4,created_at:'12-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:2,username:'aman Singh',rating:3,created_at:'02-01-2023',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:3,username:'Raman Sharma',rating:5,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:4,username:'Abhay Rathore',rating:2,created_at:'08-01-2023',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  // ]

  function goToProductRatingsScreen() {
    navigation.navigate(navigationString.PRODUCT_RATING_AND_REVIEW, {
      product_id: productDetail?._id,
    });
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar backgroundColor="red" /> */}

      {laoding ? (
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            alignItems: 'center',
            width: '100%',
            height: '70%',
            justifyContent: 'center',
          }}>
          {/* <Image
source={imageImport.LoaderGif}
style={{width:100,height:100}}
/> */}
          <CustomLoader />
        </View>
      ) : (
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              progressViewOffset={40}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.productHeader}>
              <TouchableOpacity
                onPress={goBack}
                activeOpacity={0.6}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 40,
                  padding: 4,
                }}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={27}
                  color={config.primaryColor}
                />
              </TouchableOpacity>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate(navigationString.SEARCH_SCREEN)
                  }>
                  <Octicons
                    style={styles.serachIcon}
                    name="search"
                    size={19}
                    color={config.primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate(navigationString.CART)}>
                  <View style={styles.cartIconContainer}>
                    {authState?.cartCount > 0 && (
                      <Text style={styles.cartCount}>
                        {authState?.cartCount}
                      </Text>
                    )}
                  </View>
                  <Zocial
                    name="cart"
                    size={20}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 40,
                      paddingVertical: 7,
                      paddingHorizontal: 9,
                    }}
                    color={config.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.productImageContainer}>
              <ProductImageCarousel
                productImages={productDetail?.product_images}
              />
            </View>

            <View style={{position: 'absolute', flexDirection: 'row'}}>
              {productDetail?.new_arrival && (
                <View>
                  <Text style={styles.newArrivals}>New</Text>
                </View>
              )}
              {productDetail?.trending_product && (
                <View>
                  <Text style={styles.trendingProduct}>Trending</Text>
                </View>
              )}
              {/* <MaterialIcons style={styles.zoomIcon} color={config.primaryColor}  name="zoom-out-map" size={27}  /> */}
            </View>
            <View
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: 'white'}}>
              <View style={styles.productDetailContainer}>
                <View style={{marginTop: 8}}>
                  <View
                    style={[
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <View>
                      <Text style={styles.discountText}>
                        {Math.round(
                          ((productDetail?.product_regular_price -
                            productDetail?.product_sale_price) /
                            productDetail?.product_regular_price) *
                            100,
                        )}
                        %OFF
                      </Text>

                      <Text style={styles.productName}>
                        {productDetail?.product_name}{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.quantityAndShareContainer}>
                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => decreaseQuantity(product_id)}>
                        <Ionicons
                          style={styles.quantityAddMinusBtn}
                          name="remove"
                          size={22}
                          color="#555"
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{productQuantity}</Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => increaseQuantity(product_id)}>
                        <Ionicons
                          style={styles.quantityAddMinusBtn}
                          name="add-outline"
                          size={22}
                          color="#555"
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                          paddingVertical: 2,
                          paddingRight: 12,
                        }}>
                        <Text
                          style={{
                            color: 'gray',
                            textDecorationLine: 'line-through',
                            fontSize: responsiveFontSize(2.2),
                            fontWeight: '600',
                          }}>
                          ₹{productDetail?.product_regular_price}
                        </Text>
                        <Text
                          style={{
                            color: config.primaryColor,
                            fontSize: responsiveFontSize(2.8),
                            fontWeight: '600',
                          }}>
                          ₹{productDetail?.product_sale_price}
                        </Text>
                      </View>
                    </View>
                    {/* <View style={{flexDirection:'row',alignItems:'center',paddingLeft:20}} >
 <TouchableOpacity onPress={()=>Linking.openURL(`tel:+91${JSON.stringify(authState?.adminDetails?.phone_number)}`)}  activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
   <Feather name="phone-call" size={30}  color={config.primaryColor}/>
  <Text style={styles.chatnowAndCallusText} >Call Us</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>Linking.openURL(authState?.adminDetails?.whatsapp_link)}  activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
 <FontAwesome name="whatsapp" size={32}  color={config.primaryColor}/>
  <Text style={styles.chatnowAndCallusText} >Chat Now</Text>
 </TouchableOpacity>

  </View> */}
                  </View>
                  {productDetail?.is_variant_true &&
                    productDetail?.variant_option?.length &&
                    productDetail?.variant_option[0] && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          paddingTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(1.6),
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            paddingRight: 8,
                            paddingLeft: 4,
                          }}>
                          {productDetail?.variant_option[0]?.option_name ==
                          'color picker'
                            ? 'colors'
                            : productDetail?.variant_option[0]
                                ?.option_name}{' '}
                          :
                        </Text>
                        <FlatList
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          data={productDetail?.variant_option[0]?.option_values}
                          renderItem={
                            productDetail?.variant_option[0]?.option_name ==
                            'color picker'
                              ? renderProductColors
                              : renderProductVariant1
                          }
                        />
                      </View>
                    )}

                  {productDetail?.is_variant_true &&
                    productDetail?.variant_option?.length &&
                    productDetail?.variant_option[1] && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          paddingTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(1.6),
                            textTransform: 'capitalize',
                            fontWeight: '500',
                            paddingRight: 8,
                            paddingLeft: 4,
                          }}>
                          {productDetail?.variant_option[1]?.option_name ==
                          'color picker'
                            ? 'colors'
                            : productDetail?.variant_option[1]
                                ?.option_name}{' '}
                          :
                        </Text>
                        <FlatList
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          data={productDetail?.variant_option[1]?.option_values}
                          renderItem={
                            productDetail?.variant_option[1]?.option_name ==
                            'color picker'
                              ? renderProductColors
                              : renderProductVariant2
                          }
                        />
                      </View>
                    )}
                  {/* if variant not exists */}
                  {!productDetail?.is_variant_true &&
                    productDetail?.product_original_quantity < 1 && (
                      <Text style={styles.productOutOfStockText}>
                        Out of Stock
                      </Text>
                    )}
                  {/* if variant exists */}
                  {productDetail?.is_variant_true &&
                    productDetail?.product_variant_quantity < 1 && (
                      <Text style={styles.productOutOfStockText}>
                        Out of Stock
                      </Text>
                    )}

                  <View
                    showsVerticalScrollIndicator={true}
                    style={styles.DescriptionDetailsBox}>
                    <View>
                      <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                        <Text style={styles.productDetailTitleText}>
                          Product Details
                        </Text>
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={async () => {
                              // navigation.navigate(navigationString.SHARE_PRODUCTS, {
                              //   productDetails: productDetail,
                              // });

                              await Share.share({
                                message: `${config.WEBSITE_URL}/shop/product/${productDetail?.product_slug}`,
                              });
                            }}>
                            <Entypo
                              style={styles.quantityAddMinusBtn}
                              name="share"
                              size={17}
                              color="#555"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.cartTotalBox}>
                        <View style={styles.subtotalbox}>
                          <Text style={styles.productTableTitleText}>
                            Product Name{' '}
                          </Text>
                          <Text style={styles.productTableText}>
                            {productDetail?.product_name?.slice(0, 20)}
                            {productDetail?.product_name?.length > 20 && '...'}
                          </Text>
                        </View>
                        <View style={styles.subtotalbox}>
                          <Text style={styles.productTableTitleText}>
                            Product Code{' '}
                          </Text>
                          <Text style={styles.productTableText}>
                            {productDetail?.product_code}
                          </Text>
                        </View>
                        <View style={styles.subtotalbox}>
                          <Text style={styles.productTableTitleText}>
                            Main Category{' '}
                          </Text>
                          <Text style={styles.productTableText}>
                            {productDetail?.product_main_category}
                          </Text>
                        </View>
                        <View style={styles.subtotalbox}>
                          <Text style={styles.productTableTitleText}>
                            Category{' '}
                          </Text>
                          <Text style={styles.productTableText}>
                            {productDetail?.product_category}
                          </Text>
                        </View>
                        <View
                          style={{...styles.subtotalbox, borderBottomWidth: 0}}>
                          <Text style={styles.productTableTitleText}>
                            Sub-Category{' '}
                          </Text>
                          <Text style={styles.productTableText}>
                            {productDetail?.product_subcategory}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={{
                          ...styles.productDetailTitleText,
                          paddingTop: 15,
                        }}>
                        Product Description
                      </Text>
                      <Text style={styles.productDescriptionText}>
                        {productDetail?.product_description}
                      </Text>
                      <View>
                        {ratingsData?.length > 0 && (
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  ...styles.productDetailTitleText,
                                  paddingTop: 15,
                                }}>
                                Product Rating & Reviews
                              </Text>
                              <TouchableOpacity
                                onPress={goToProductRatingsScreen}>
                                <Text
                                  style={{...styles.productDetailTitleText}}>
                                  See All
                                </Text>
                              </TouchableOpacity>
                            </View>

                            <View>
                              {ratingsData?.map((rat, index) => (
                                <View key={index} style={styles.ratingsMainBox}>
                                  <View style={styles.ratingsBox}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Image
                                        source={imageImport.ratingsImg}
                                        style={styles.ratingsImgStyle}
                                      />
                                      <View style={{paddingLeft: 8}}>
                                        <Text
                                          style={{
                                            ...styles.productTableTitleText,
                                            paddingBottom: 3,
                                          }}>
                                          {rat?.username}
                                        </Text>
                                        <View>
                                          <Text style={styles.ratingsDateText}>
                                            {rat.created_at}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                    <Rating
                                      //  type='star'
                                      type="custom"
                                      startingValue={rat?.rating}
                                      ratingCount={5}
                                      ratingColor="#F5BF1A"
                                      imageSize={18}
                                      readonly={true}
                                    />
                                  </View>
                                  <Text style={styles.ratingsDescriptionText}>
                                    {rat?.rating_description}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <TouchableOpacity
                          style={styles.writeAReivewButton}
                          onPress={() =>
                            navigation.navigate(
                              navigationString.PRODUCT_WRITE_A_REVIEW,
                              {productDetails: productDetail},
                            )
                          }>
                          <FontAwesome5
                            name="edit"
                            size={14}
                            style={{
                              color: config.primaryColor,
                              paddingRight: 3,
                            }}
                          />
                          <Text style={styles.writeAReivewText}>
                            Write a Reivew
                          </Text>
                        </TouchableOpacity>

                        {ratingsData?.length > 0 && (
                          <TouchableOpacity onPress={goToProductRatingsScreen}>
                            <Text style={styles.seeAllRatingsText}>
                              See All Reviews
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{paddingBottom: 10}}></View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <View style={{backgroundColor: 'white', width: '100%', height: 70}}>
        {/* {viewCart ? 

<TouchableOpacity onPress={()=>navigation.navigate(navigationString.CART)}  activeOpacity={0.8} style={styles.viewCartBtn}>

<Zocial
 name="cart"
 size={24}
 style={{ paddingBottom: 2, width: 35 }}
 color="white"
/>
<Text style={styles.viewCartText}>View Cart </Text>
</TouchableOpacity>
:
<TouchableOpacity onPress={()=>addToCartButton(productDetail)}  activeOpacity={0.8} style={styles.addToCartBtn}>
<Zocial
name="cart"
size={24}
style={{ paddingBottom: 2, width: 35 }}
color="white"
/>
<Text style={styles.addToCartText}>Add To Cart </Text>
</TouchableOpacity>
} */}

        {/* CHECKING IF PRODUCT STOCK IS AVAILABLE OR NOT */}
        {(!productDetail?.is_variant_true &&
          productDetail?.product_original_quantity < 1) ||
        (productDetail?.is_variant_true &&
          productDetail?.product_variant_quantity < 1) ? (
          //  when product out of stock
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.outOfStockAddToCartBtn}>
              <Zocial
                name="cart"
                size={24}
                style={{paddingBottom: 2, width: 35}}
                color="#A2ACB8"
              />
              <Text style={styles.outOfStockAddToCartText}>Add To Cart </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.outOfStockBuyNowBtn}>
              <FontAwesome
                name="flash"
                size={24}
                style={{paddingBottom: 2, width: 25}}
                color="#A2ACB8"
              />
              <Text style={styles.outOfStockBuyNowText}>Buy Now </Text>
            </TouchableOpacity>
          </View>
        ) : (
          //  original btns
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            {viewCart ? (
              <TouchableOpacity
                onPress={() => updateCartButton(productDetail)}
                activeOpacity={0.8}
                style={styles.newViewCartBtn}>
                <Zocial
                  name="cart"
                  size={24}
                  style={{paddingBottom: 2, width: 35}}
                  color="white"
                />
                <Text style={styles.newViewCartText}>View Cart </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => addToCartButton(productDetail)}
                activeOpacity={0.8}
                style={styles.newAddToCartBtn}>
                <Zocial
                  name="cart"
                  size={24}
                  style={{paddingBottom: 2, width: 35}}
                  color={'white'}
                />
                <Text style={styles.newAddToCartText}>Add To Cart </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => buynowCartBtn(productDetail)}
              activeOpacity={0.8}
              style={styles.newBuyNowBtn}>
              <FontAwesome
                name="flash"
                size={24}
                style={{paddingBottom: 2, width: 25}}
                color="white"
              />
              <Text style={styles.newBuyNowText}>Buy Now </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WHEN VARIANT IS AVAILABLE */}
        {/* {(productDetail?.is_variant_true && productDetail?.product_variant_quantity < 1 )
?
//  when product out of stock 
<View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20}} >
<TouchableOpacity activeOpacity={0.8} style={styles.outOfStockAddToCartBtn} >
<Zocial
 name="cart"
 size={24}
 style={{ paddingBottom: 2, width: 35 }}
 color='#A2ACB8'
/>
<Text style={styles.outOfStockAddToCartText} >Add To Cart </Text>
</TouchableOpacity>


  <TouchableOpacity activeOpacity={0.8} style={styles.outOfStockBuyNowBtn}  >
<FontAwesome
 name="flash"
 size={24 }
 style={{ paddingBottom: 2, width: 25 }}
 color="#A2ACB8"
/>
    <Text style={styles.outOfStockBuyNowText} >Buy Now </Text>
</TouchableOpacity>
</View>
:
//  original btns
<View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20}} >
{viewCart ? 

<TouchableOpacity onPress={()=>updateCartButton(productDetail)}  activeOpacity={0.8} style={styles.newViewCartBtn} >
<Zocial
 name="cart"
 size={24}
 style={{ paddingBottom: 2, width: 35 }}
 color="white"
/>
<Text style={styles.newViewCartText} >View Cart </Text>
</TouchableOpacity>
:
<TouchableOpacity onPress={()=>addToCartButton(productDetail)}  activeOpacity={0.8} style={styles.newAddToCartBtn} >
<Zocial
 name="cart"
 size={24}
 style={{ paddingBottom: 2, width: 35 }}
 color={'white'}
/>
<Text style={styles.newAddToCartText} >Add To Cart </Text>
</TouchableOpacity>
}

  <TouchableOpacity onPress={()=>buynowCartBtn(productDetail)}  activeOpacity={0.8} style={styles.newBuyNowBtn}  >
<FontAwesome
 name="flash"
 size={24 }
 style={{ paddingBottom: 2, width: 25 }}
 color="white"
/>
    <Text style={styles.newBuyNowText} >Buy Now </Text>
</TouchableOpacity>
</View> 
} */}
      </View>
    </SafeAreaView>
  );
}

export default ProductInfo;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'white',

    flex: 1,
  },
  productHeader: {
    position: 'absolute',
    top: -6,
    zIndex: 9,
    width: '100%',
    // backgroundColor:'white',
    paddingTop: 25,
    paddingBottom: 4,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartIconContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  cartCount: {
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#fff',
    fontWeight: '900',
    borderRadius: 40,
    fontSize: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
    width: 15,
    maxWidth: 16,
    right: -25,
    bottom: -5,
    zIndex: 1,
  },
  accountHeadingText: {
    fontSize: 17,
    paddingLeft: 5,
    fontWeight: '600',
    color: config.primaryColor,
  },
  serachIcon: {
    backgroundColor: 'white',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  productImageContainer: {
    position: 'relative',
    marginTop: -18,
    height: 350,
    backgroundColor: 'white',
    top: 20,
  },
  productDetailContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 8,
    zIndex: 999,
  },
  discountText: {
    paddingTop: 8,
    fontSize: 12,
    // textTransform:'capitalize',
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#dc0000',
  },
  productName: {
    color: '#222',
    textTransform: 'capitalize',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    letterSpacing: 0.7,
  },
  productVariation: {
    color: '#555',
    paddingTop: 5,
    fontSize: 13,
    fontWeight: '600',
  },
  productOutOfStockText: {
    color: '#dc0000',
    paddingTop: 0,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '500',
    paddingTop: 4,
  },
  selectBulkAndSingleBox: {
    flex: 1,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBoxBorder: {
    borderWidth: 1,
    width: '49%',
    borderColor: '#f2f2f2',
    padding: 2,
    borderRadius: 10,
  },
  selectSingleBox: {
    width: '100%',
    borderWidth: 0.4,
    borderColor: '#f2f2f2',
    backgroundColor: '#f5f5f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  selectSingleBoxText: {
    paddingLeft: 10,
    fontSize: 15,
    color: '#555',
    letterSpacing: 1.3,
    fontWeight: '600',
  },

  quantityAndShareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 2,
    borderRadius: 10,
  },
  quantityAddMinusBtn: {
    backgroundColor: '#f5f5f6',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 10,
  },
  quantityText: {
    fontWeight: '600',
    fontSize: responsiveFontSize(2.4),
    paddingHorizontal: 27,
    paddingVertical: 3,
  },
  chatnowAndCallusIconBox: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chatnowAndCallusText: {
    fontSize: 11,
    color: 'gray',
    fontWeight: '500',
    paddingVertical: 2,
  },
  DescriptionDetailsBox: {
    marginTop: 13,
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
  },
  DescriptionHeading: {
    marginVertical: 1,
    color: '#222',
    letterSpacing: 0.7,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  descriptionInnerText: {
    fontSize: responsiveFontSize(1.5),
    // paddingBottom:1,
    color: '#1e1e1e',
    fontWeight: '600',
  },
  addToCartBtn: {
    position: 'absolute',
    width: '90%',
    bottom: 8,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'white',
  },
  viewCartBtn: {
    position: 'absolute',
    width: '90%',
    bottom: 8,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#4cbb17',
    borderRadius: 16,
    shadowColor: '#4cbb17',
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  viewCartText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'white',
  },

  newViewCartBtn: {
    width: '49%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#4cbb17',
    borderRadius: 16,
  },
  newViewCartText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white',
  },
  newAddToCartBtn: {
    width: '49%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: config.primaryColor,
    // borderColor:config.primaryColor,
    // borderWidth:1.5,
    borderRadius: 16,
  },
  newAddToCartText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    // color: config.primaryColor,
    color: 'white',
  },

  newBuyNowBtn: {
    width: '49%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#fb8b24',
    borderRadius: 16,
  },
  newBuyNowText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white',
  },

  outOfStockAddToCartBtn: {
    width: '49%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#E4E8EB',
    // borderColor:config.primaryColor,
    // borderWidth:1.5,
    borderRadius: 16,
  },
  outOfStockAddToCartText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#A2ACB8',
  },

  outOfStockBuyNowBtn: {
    width: '49%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#E4E8EB',
    borderRadius: 16,
  },
  outOfStockBuyNowText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#A2ACB8',
  },

  iconShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.57,
    shadowRadius: 14.65,

    elevation: 10,
  },
  newArrivals: {
    position: 'relative',
    width: responsiveWidth(12),
    textAlign: 'center',
    letterSpacing: 0.6,
    padding: 2,
    fontWeight: '600',
    fontSize: responsiveFontSize(1.5),
    color: 'white',
    backgroundColor: 'red',
    top: 308,
    left: 20,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    // borderRadius:2
  },
  trendingProduct: {
    position: 'relative',
    width: responsiveWidth(20),
    textAlign: 'center',
    letterSpacing: 0.6,
    paddingVertical: 2,
    fontWeight: '600',
    fontSize: responsiveFontSize(1.4),
    color: 'white',
    marginLeft: 5,
    backgroundColor: 'orange',
    top: 308,
    left: 20,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    // borderRadius:2
  },
  zoomIcon: {
    position: 'relative',
    top: 300,
    right: -272,
  },
  productDetailTitleText: {
    fontSize: responsiveFontSize(1.8),
    paddingTop: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#1e1e1e',
  },
  cartTotalBox: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'lightgray',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  subtotalbox: {
    // paddingHorizontal:20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderColor: 'lightgray',
  },
  productTableTitleText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: '#1e1e1e',
    textTransform: 'capitalize',
  },
  productTableText: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'capitalize',
    color: '#767676',
  },
  productDescriptionText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
    color: '#777777',
    textAlign: 'left',
    textTransform: 'capitalize',
    lineHeight: 18,
    marginTop: 10,
  },
  ratingsMainBox: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'lightgray',
    // paddingHorizontal:12,
    // paddingVertical:8,
    padding: 12,
    marginTop: 15,
  },
  ratingsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 0.6,
    borderColor: 'lightgray',
    paddingBottom: 10,
  },
  ratingsImgStyle: {
    width: 35,
    height: 35,
  },
  ratingsDateText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
    color: '#767676',
  },
  ratingsDescriptionText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    color: '#777777',
    textAlign: 'left',
    textTransform: 'capitalize',
    lineHeight: 18,
    marginTop: 10,
  },
  seeAllRatingsText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: config.primaryColor,
    textTransform: 'capitalize',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
  },
  writeAReivewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 40,
    borderWidth: 0.8,
    borderColor: config.primaryColor,
  },
  writeAReivewText: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.3,
    color: config.primaryColor,
  },
});
