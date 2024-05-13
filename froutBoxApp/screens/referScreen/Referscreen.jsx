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
  Alert,
  Share,
} from 'react-native';
import {config} from '../../config';
// import { StatusBar } from "expo-status-bar";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import imageImport from '../../Constants/imageImport';
import strings from '../../Constants/strings';
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

function Referscreen({route, navigation}) {
  const [productDetail, setProductDetail] = useState();
  const [laoding, setLoading] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState();
  const [viewCart, setViewCart] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productColor, setProductColor] = useState();
  const [productSize, setProductSize] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [render, setRender] = useState(false);
  const {logoutAuthUser, authState} = UseContextState();
  const product_id = '234567';
  const toast = useToast();

  const showAddedToCartToast = () => {
    toast.show('Product Added To Cart !!', {
      type: 'success',
    });
  };

  console.log('PRODUCT COLOR SIZE', productSize, productColor);
  console.log('productDetail', productDetail);

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const checkProductInCart = async product_id => {
    const result = await findProductInCart(product_id);
    // console.log("result=>",result)
    setViewCart(result);
    setRefreshing(false);
  };

  useEffect(() => {
    checkProductInCart(product_id);
  }, [product_id, updateCart, refreshing]);

  const getItemCount = async () => {
    const count = await getCartProductCount();
    // console.log('ITEM FROM Cart=>',count)
    setCartItemCount(count);
    setRefreshing(false);
  };
  useEffect(() => {
    getItemCount();
  }, [updateCart, refreshing]);

  const selectedColorFunc = value => {
    setProductColor(value);
    setRender(prev => !prev);
  };
  const selectedSizeFunc = value => {
    setProductSize(value);
    setRender(prev => !prev);
  };
  const selectedWeightFunc = value => {
    setProductWeight(value);
    setRender(prev => !prev);
  };

  const handleClickReferNow = async () => {
    try {
      const result = await Share.share({
        message: `Hi, I am inviting you to download ${config.APP_NAME} and get reward points. Use refer id to redeem reward points.
Refer ID: ${userData.user_refer_id} 
App Link: ${setDetail?.app_link}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
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

  const [userData, setUserData] = useState({});
  const [setDetail, setSetDetail] = useState({});

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
        // console.warn('User Data', res.data.user);
        setUserData(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${config.BACKEND_URI}/api/admin/get/wallet/data`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        // console.log('User Data', res.data.wallet_data);
        setSetDetail(res.data.wallet_data);
      })
      .catch(err => {
        console.warn(err);
      });
  }, []);

  console.warn('setDetail', setDetail);

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
                <Ionicons
                  name="arrow-back"
                  size={27}
                  color={config.primaryColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.productImageContainer}>
              <View style={styles.container}>
                <Image
                  source={imageImport.refer_earn_screen}
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                  }}
                />
              </View>
            </View>

            <View
              showsVerticalScrollIndicator={false}
              style={{backgroundColor: 'white'}}>
              <View style={styles.productDetailContainer}>
                <View style={{marginTop: 18}}>
                  <Text style={styles.productName}>
                    Refer Your Friends & Earn{' '}
                    <Text style={{color: config.primaryColor}}>
                      {setDetail?.coins_per_refer} Coin.{' '}
                    </Text>{' '}
                  </Text>
                  <View>
                    <Text style={styles.refer_code}>
                      {userData?.user_refer_id}
                    </Text>
                  </View>

                  <View
                    showsVerticalScrollIndicator={true}
                    style={styles.DescriptionDetailsBox}>
                    <View style={{marginTop: 10}}>
                      <Text style={styles.DescriptionHeading}>
                        How Does It Work?
                      </Text>
                      <View
                        style={{
                          paddingVertical: 14,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={imageImport.share}
                          resizeMode="contain"
                          style={{
                            width: 35,
                            height: 35,
                            backgroundColor: 'white',
                            marginRight: 10,
                          }}
                        />
                        <Text style={styles.innerText}>
                          Share & Invite Your Friend To Register on{' '}
                          {config.APP_NAME}.{' '}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingVertical: 14,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={imageImport.signup}
                          resizeMode="contain"
                          style={{
                            width: 35,
                            height: 35,
                            backgroundColor: 'white',
                            marginRight: 10,
                          }}
                        />
                        <Text style={styles.innerText}>
                          When Your Friend Registers on App & Redeem Refer Code,
                          Both of You Will Get {setDetail?.coins_per_refer}{' '}
                          Coins.{' '}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingVertical: 14,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={imageImport.moneybag}
                          resizeMode="contain"
                          style={{
                            width: 35,
                            height: 35,
                            backgroundColor: 'white',
                            marginRight: 10,
                          }}
                        />
                        <Text style={styles.innerText}>
                          Reward Coins Can Be Used To Buy Anything From The
                          Store.{' '}
                        </Text>
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
        <TouchableOpacity
          onPress={handleClickReferNow}
          activeOpacity={0.8}
          style={styles.addToCartBtn}>
          <AntDesign
            name="sharealt"
            size={24}
            style={{paddingBottom: 2, width: 35}}
            color="white"
          />
          <Text style={styles.addToCartText}>Invite & Refer Now </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Referscreen;

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
    height: 320,
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
    lineHeight: 28,
  },
  productVariation: {
    color: '#555',
    paddingTop: 5,
    fontSize: 13,
    fontWeight: '600',
  },
  productBulkDetail: {
    color: config.primaryColor,
    paddingTop: 0,
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    paddingBottom: 10,
  },
  innerText: {
    fontSize: responsiveFontSize(1.7),
    color: '#555',
    fontWeight: '500',
    paddingRight: 40,
    lineHeight: 20,
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

  refer_code: {
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    // fontWeight: 600,
    backgroundColor: 'yellow',
    marginTop: 16,
    paddingVertical: 8,
    letterSpacing: 2,
    borderRadius: responsiveWidth(3),
    borderWidth: 1,
    borderStyle: 'dashed',
    textTransform: 'uppercase',
  },
});
