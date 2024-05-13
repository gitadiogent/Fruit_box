import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  RefreshControl,
} from 'react-native';
import strings from '../../Constants/strings';
import {config} from '../../config';
import {Surface, Modal, Portal, Provider} from 'react-native-paper';
import imageImport from '../../Constants/imageImport';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {convertDate, convertDateForOrder} from '../../Utils/helperFunctions';
import axios from 'axios';
import navigationString from '../../Constants/navigationString';
import {UseContextState} from '../../global/GlobalContext';
import {responsiveWidth} from 'react-native-responsive-dimensions';

function ViewOrders({route, navigation}) {
  const [allOrders, setAllOrders] = React.useState(route?.params?.order);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [render, setRender] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    state: false,
    order_id: '',
  });
  const {authState} = UseContextState();

  console.log('ORDER ID=>', route?.params);
  const cancelOrderFunc = async order_id => {
    console.log('CANCEL ORDER=', order_id);
    await axios
      .patch(
        `${config.BACKEND_URI}/api/app/cancel/order/by/id/${order_id}`,
        {},
        {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        },
      )
      .then(res => {
        console.log(res?.data);
        setModalVisible(prev => ({...prev, state: false, order_id: ''}));
        setRender(prev => !prev);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
  };
  const goBack = () => {
    navigation.goBack();
  };

  const renderItems = ({item, index}) => {
    return (
      <View key={index} style={{padding: 5}}>
        <View key={item._id} styles={{...styles.cartItemBox}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                borderWidth: 0.6,
                borderColor: 'lightgray',
                padding: 2,
                borderRadius: 10,
              }}>
              <Image
                source={{uri: item?.product_images[0]?.image_url}}
                style={{width: 70, height: 70, borderRadius: 8}}
              />
            </View>
            <View style={styles.cartDetails}>
              <View>
                {/* <Text style={styles.productName} >{value.product_name?.slice(0,20)}{value?.product_name?.length > 20 && '...'}</Text> */}
                <Text style={styles.productName}>{item?.product_name}</Text>
              </View>

              <Text style={styles.productId}>{item?.product_category}</Text>
              {/* <Text style={styles.brandName} >{item?.product_category}</Text> */}
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: '#555',
                    fontSize: 15,
                    paddingHorizontal: 1,
                    width: 48,
                    textAlign: 'center',
                    paddingVertical: 3,
                  }}>
                  Qty - {item?.product_quantity}
                </Text>
                {/* <Text style={styles.productQuantityBy} >{item?.product_quantity_by ? item?.product_quantity_by : 'piece' }</Text> */}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <Provider>
      <Portal>
        <View style={styles.orderMainContainer}>
          <Surface style={styles.orderHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcons
                onPress={goBack}
                name="keyboard-arrow-left"
                size={27}
                color={config.primaryColor}
              />
              <Text style={styles.headingText}>View Order</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.headerIconsContainer}>
                <MaterialIcons
                  onPress={() =>
                    Linking.openURL(
                      `tel:+91${JSON.stringify(
                        authState?.adminDetails?.phone_number,
                      )}`,
                    )
                  }
                  style={styles.headerIcon1}
                  name="support-agent"
                  size={20}
                  color={config.primaryColor}
                />
                <FontAwesome
                  name="whatsapp"
                  onPress={() =>
                    Linking.openURL(authState?.adminDetails?.whatsapp_link)
                  }
                  style={styles.headerIcon2}
                  size={20}
                  color={config.primaryColor}
                />
              </View>
            </View>
          </Surface>
          {allOrders?.length <= 0 && (
            <View
              style={{
                marginTop: 0,
                paddingHorizontal: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={imageImport.OrderNotFound}
                style={{width: 200, height: 200}}
              />
              <Text
                style={{
                  color: 'gray',
                  fontWeight: '500',
                  marginTop: -10,
                  paddingBottom: 20,
                  letterSpacing: 1,
                }}>
                No Order Founds
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{name: navigationString.HOME}],
                  })
                }
                activeOpacity={0.8}
                style={styles.checkoutBtn}>
                <Text style={styles.checkoutText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '70%',
              }}>
              <Image
                source={imageImport.LoaderGif}
                style={{width: 100, height: 100}}
              />
            </View>
          ) : (
            <View>
              <FlatList
                //   refreshControl={
                //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                //   }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 10}}
                data={allOrders}
                keyExtractor={(item, index) => item._id}
                ListFooterComponent={() => (
                  <View style={{paddingBottom: 195}}></View>
                )}
                renderItem={({item, index}) => {
                  // setAllProducts(item.products)
                  return (
                    <View style={styles.orderCardMainBox}>
                      {/* {item?.order_status == 'cancelled' &&
          <View style={{position:'absolute',backgroundColor: 'lightgray',opacity:0.1,borderRadius:12,width:'100%',height:'100%',zIndex:1}} >
          <Text style={{fontSize:32,color:'black',opacity:100,zIndex:3,opacity:1,paddingVertical:10,backgroundColor:'gray',fontWeight:'700',top:'30%',textAlign:'center'}} >Order Cancelled</Text>
        </View>
       } */}
                      <View style={styles.orderAndPriceBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}>
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#555',
                              }}>
                              # Your Order
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '500',
                                color: '#222',
                              }}>
                              ID : {item?.order_id}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: '500',
                                color: '#222',
                              }}>
                              {item?.products?.length} Products
                            </Text>
                          </View>
                          {/* <MaterialIcons name="keyboard-arrow-right" size={26} color="#555" /> */}
                          <View>
                            {item?.order_status != 'cancelled' && (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate(
                                    navigationString.SEND_ENQUIRY,
                                    {order_id: item?.order_id},
                                  )
                                }
                                activeOpacity={0.6}
                                style={styles.sendEnquiry}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: '#222',
                                  }}>
                                  Send Enquiry
                                </Text>
                              </TouchableOpacity>
                            )}

                            {/* { item?.order_status == 'delivered' ?
              null
            : item?.order_status == 'cancelled' ?  
            null
            :
            <TouchableOpacity onPress={()=>setModalVisible((prev)=>({...prev,state:true,order_id:route?.params?.order[0]?._id}))} activeOpacity={0.6} style={styles.cancelOrder} >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#e24243" ,}}>
              Cancel Order
            </Text>
            </TouchableOpacity>
            } */}
                          </View>
                        </View>
                        <View style={{paddingTop: 10}}>
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            data={item?.products}
                            renderItem={renderItems}
                            keyExtractor={(item, index) => index}
                            //   ItemSeparatorComponent={() => {
                            //     return <View style={{ width: 15, height: "100%" }} />;
                            //   }}
                          />
                        </View>

                        <View
                          style={{...styles.listOrderDetail, paddingTop: 10}}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Order Status :
                          </Text>
                          <Text
                            style={{
                              color:
                                item?.order_status == 'cancelled'
                                  ? '#e24243'
                                  : config.primaryColor,
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              fontSize: 13,
                            }}>
                            {item?.order_status}
                          </Text>
                        </View>
                        <View
                          style={{...styles.listOrderDetail, paddingTop: 1}}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Payment Mode :
                          </Text>
                          <Text
                            style={{
                              color:
                                item?.order_status == 'cancelled'
                                  ? '#e24243'
                                  : config.primaryColor,
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              fontSize: 13,
                            }}>
                            {item?.payment_mode}
                          </Text>
                        </View>
                        <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Order Date :
                          </Text>
                          <Text style={styles.orderDate}>
                            {convertDate(item?.createdAt)}
                          </Text>
                        </View>
                        <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Sub Total :
                          </Text>
                          <Text style={styles.orderTotal}>
                            
                          ₹{parseInt(item?.order_total) -
                                item?.delivery_charges}
                          </Text>
                        </View>
                        <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Delivery & Shipping :
                          </Text>
                          {item?.delivery_charges > 0 ? (
                            <Text style={styles.orderTotal}>
                             + ₹{item?.delivery_charges}
                            </Text>
                          ) : (
                            <Text style={styles.orderTotal}>Free</Text>
                          )}
                        </View>
                        
                        
                       {item?.coupon_discount ? 
                        <View style={styles.listOrderDetail}>
                        <Text
                          style={{
                            fontWeight: '600',
                            color: '#555',
                            fontSize: 14,
                          }}>
                          Coupon Discount :
                        </Text>
                        <Text style={styles.orderTotal}>
                          - ₹{item?.coupon_discount.discount_value}
                        </Text>
                      </View>
                      :
                     ("")
                      }
                       
                       
                      {item?.used_wallet_amount?.coins_used > 0 ?
                   <View>
                     <View style={styles.listOrderDetail}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: '#555',
                        fontSize: 14,
                      }}>
                      Coins Used :
                    </Text>
                      <Text style={styles.orderTotal}>
                        {item.used_wallet_amount.coins_used}
                      </Text>
                  </View>
                     <View style={styles.listOrderDetail}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: '#555',
                        fontSize: 14,
                      }}>
                      {item?.used_wallet_amount?.coins_used} x coin
                        value is {item?.used_wallet_amount?.coin_value} :
                    </Text>
                      <Text style={styles.orderTotal}>
                      - ₹{item?.used_wallet_amount?.coins_used *
                          item?.used_wallet_amount?.coin_value}
                      </Text>
                  </View>
                  {/* <View
                    style={[
                      styles.listOrderDetail,
                    ]}>
                      <Text style={[styles.orderTotal, {fontSize: 13}]}>
                        {' '}
                        {item?.used_wallet_amount?.coins_used} x coin
                        value is {item?.used_wallet_amount?.coin_value} ={' '}
                        {item?.used_wallet_amount?.coins_used *
                          item?.used_wallet_amount?.coin_value}
                      </Text>
                  </View> */}
                   </View>
                    :
                    ""
                    
                    }
                         <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Order Total :
                          </Text>
                          <Text style={styles.orderTotal}>
                            
                            {/* {parseInt(item.order_total) +
                              parseInt(item.delivery_charges)} */}
                              ₹{item?.coupon_discount?.discount_value
                                ? parseInt(item?.order_total) -
                                  item?.used_wallet_amount?.coins_used *
                                    item?.used_wallet_amount?.coin_value -
                                  item?.coupon_discount?.discount_value
                                : parseInt(item?.order_total) -
                                  item?.used_wallet_amount?.coins_used *
                                    item?.used_wallet_amount?.coin_value}
                          </Text>
                        </View>

                        <Text
                          style={{
                            paddingTop: 10,
                            color: '#555',
                            fontWeight: '500',

                          }}>
                          Delivery Location
                        </Text>
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
                              <View style={{paddingLeft: 4}}>
                                {/* <MaterialIcons name="radio-button-on" size={17} color={config.primaryColor} /> */}
                              </View>
                              <View>
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
                                      Name : {item?.customer_name}
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
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: '#767676',
                                        textTransform: 'capitalize',
                                      }}>
                                      Mobile No. : {item?.customer_phone_number}
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
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: '#767676',
                                      }}>
                                      E-mail : {item?.customer_email}
                                    </Text>
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
                                      Address : {item?.shipping_address}{' '}
                                      {item?.state} {item?.pincode}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
        <Modal
          visible={modalVisible?.state}
          onDismiss={() => setModalVisible(prev => ({...prev, state: false}))}
          contentContainerStyle={styles.containerStyle}>
          <View>
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
              <View style={{paddingTop: 8, paddingBottom: 13}}>
                <Text style={{textAlign: 'center', color: 'gray'}}>
                  {' '}
                  Do you want to cancel order?
                </Text>
                {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
              </View>
              <View
                style={{
                  paddingTop: 8,
                  borderTopColor: '#f2f2f2',
                  borderTopWidth: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 50,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() =>
                      setModalVisible(prev => ({...prev, state: false}))
                    }>
                    <View>
                      <Text
                        style={{
                          color: '#e24243',
                          fontSize: 14,
                          fontWeight: '700',
                        }}>
                        No
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => cancelOrderFunc(modalVisible?.order_id)}
                    activeOpacity={0.5}>
                    <View>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 14,
                          fontWeight: '700',
                        }}>
                        Yes
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  orderMainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  orderHeader: {
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 11,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 16,
    textTransform: 'capitalize',
    paddingLeft: 2,
    fontWeight: '500',
    color: config.primaryColor,
  },
  headerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon1: {
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: responsiveWidth(2.6),
    paddingVertical: responsiveWidth(2.5),
    borderRadius: responsiveWidth(40),
    marginLeft: 8,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  headerIcon2: {
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: responsiveWidth(3.3),
    paddingRight: responsiveWidth(2.7),
    paddingVertical: responsiveWidth(2.5),
    borderRadius: responsiveWidth(40),
    marginLeft: 14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartDetails: {
    paddingLeft: 17,
  },
  productName: {
    fontSize: 15,
    textTransform: 'capitalize',
    letterSpacing: 0.6,
    maxWidth: 250,
    color: '#555',
    fontWeight: '500',
  },
  productId: {
    fontSize: 13,
    color: '#555',
    textTransform: 'capitalize',
  },
  brandName: {
    fontSize: 13,
    color: '#555',
    textTransform: 'capitalize',
  },
  productQuantityBy: {
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginLeft: 8,
    paddingVertical: 4,
    width: 70,
    // paddingHorizontal:9,
    borderRadius: 40,
    color: '#555',
  },
  orderCardMainBox: {
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 5,
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
  orderDate: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  orderTotal: {
    color: config.primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },

  orderAndPriceBox: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  reveived: {
    color: config.primaryColor,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontSize: 13,
  },
  listOrderDetail: {
    paddingVertical: 2,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkoutBtn: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: config.primaryColor,
    borderRadius: 40,
    shadowColor: config.primaryColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 9,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'white',
  },
  sendEnquiry: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 40,
    marginBottom: 6,
  },
  cancelOrder: {
    backgroundColor: '#fce8e7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 40,
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2,
  },
});

export default ViewOrders;
