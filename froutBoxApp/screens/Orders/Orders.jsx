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
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import strings from '../../Constants/strings';
import {config} from '../../config';
import {Surface, Modal, Portal, Provider} from 'react-native-paper';
import imageImport from '../../Constants/imageImport';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {convertDate, convertDateForOrder} from '../../Utils/helperFunctions';
import axios from 'axios';
import navigationString from '../../Constants/navigationString';
import {UseContextState} from '../../global/GlobalContext';
import CustomLoader from '../../components/Loader';
import {useToast} from 'react-native-toast-notifications';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

function Orders({navigation}) {
  const [allOrders, setAllOrders] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [orderStatusForFilter, setOrderStatusForFilter] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [render, setRender] = useState(false);
  const [loadMore, setLoadmore] = useState(true);
  const [modalVisible, setModalVisible] = useState({
    state: false,
    order_id: '',
  });
  const {authState} = UseContextState();
  const toast = useToast();

  // console.log("ORDER CANCELLED=>",modalVisible)

  const goToViewOrder = (orderId, clickedOrder) => {
    navigation.navigate(navigationString.VIEW_ORDER, {
      order_id: orderId,
      order: [clickedOrder],
    });
  };
  const handleShowOrderCancelToast = () => {
    toast.show('Order Cancelled Successfully !!', {
      type: 'success',
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/all/user/orders/${authState?.user?.user_id}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          // console.log(res?.data);
          setAllOrders([...res?.data?.all_orders]);
          setOrderStatusForFilter(res?.data?.order_status);
          setCurrentPage(1);
          setTotalPagesCount(res?.data?.pages);
          setLoading(false);
          setRefreshing(false);
          if (currentPage === totalPagesCount) {
            setLoadmore(false);
          }
        })
        .catch(err => {
          console.log(err);
          setRefreshing(false);
        });
    }, [refreshing, render]),
  );

  const cancelOrderFunc = async order_id => {
    await axios
      .patch(
        `${config.BACKEND_URI}/api/app/cancel/order/by/id/${order_id}`,
        {user_id: authState?.user?.user_id},
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
        handleShowOrderCancelToast();
        setRender(prev => !prev);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const loadMoreItems = async () => {
    // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
    if (currentPage < totalPagesCount) {
      await setCurrentPage(currentPage + 1);
      // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/all/user/orders/${
            authState?.user?.user_id
          }?&page=${currentPage + 1}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          setAllOrders([...allOrders, ...res?.data?.all_orders]);
          if (currentPage === totalPagesCount) {
            setLoadmore(false);
          }
          //  setProductCount( res?.data?.result?.length)
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const renderItems = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          borderWidth: 0.5,
          padding: 2,
          borderRadius: 8,
          borderColor: 'lightgray',
        }}>
        {/* <Text style={{color:'black'}} >{item.products[index]?.product_name}</Text> */}
        <Image
          source={{uri: item?.product_images[0]?.image_url}}
          style={{
            width: responsiveWidth(12),
            height: responsiveHeight(6.5),
            borderRadius: 6,
          }}
        />
      </View>
    );
  };

  const searchWithorderStatusSuggestion = item => {
    // navigation.navigate(navigationString.SEARCH_RESULT,
    //   {searchThroughCategory:item._id})
    // setCurrentPage(1);
  };

  const renderOrderStatusForFilter = useCallback(({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => searchWithorderStatusSuggestion(item)}
        activeOpacity={0.6}>
        {/* <Text style={item?.name ? {...styles.orderStatusSuggestion} : {...styles.orderStatusSuggestion,color:config.primaryColor}}  >{item?.name}</Text> */}
        <Text style={styles.orderStatusSuggestion}>{item?.name}</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <Provider>
      <Portal>
        <View style={styles.orderMainContainer}>
          <Surface style={styles.orderHeader}>
            <Text style={styles.orderHeadingText}>My Orders</Text>
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
          </Surface>
          {allOrders?.length <= 0 && !loading && (
            <View
              style={{
                marginTop: 80,
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
              {/* <Image
    source={imageImport.LoaderGif}
    style={{width:100,height:100,}}
    /> */}
              <CustomLoader />
            </View>
          ) : (
            <View>
              {/* <View style={{alignItems:'center',paddingTop:14,flexDirection:'row'}} >
  
    <FlatList
      data={orderStatusForFilter}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={renderOrderStatusForFilter}
      keyExtractor={(item)=>item.name}
      ItemSeparatorComponent={() => {
        return (
            <View
                style={{
                    height: "100%",
                  
                }} />
        );
    }}
    />
  </View> */}
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 10}}
                data={allOrders}
                keyExtractor={(item, index) => item._id}
                ListFooterComponent={() =>
                  !loadMore && currentPage < totalPagesCount ? (
                    <View style={{alignItems: 'center', marginVertical: 10}}>
                      <ActivityIndicator
                        size="large"
                        color={config.primaryColor}
                      />
                      <Text style={{color: 'gray'}}>Loading...</Text>
                      <View style={{paddingBottom: 195}}></View>
                    </View>
                  ) : (
                    <View style={{paddingBottom: 195}}></View>
                  )
                }
                onEndReached={loadMoreItems}
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
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => goToViewOrder(item?.order_id, item)}>
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
                              {item?.products?.length} Product
                            </Text>
                          </TouchableOpacity>
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

                            {item?.order_status ==
                            'delivered' ? null : item?.order_status ==
                              'cancelled' ? null : (
                              <TouchableOpacity
                                onPress={() =>
                                  setModalVisible(prev => ({
                                    ...prev,
                                    state: true,
                                    order_id: item?._id,
                                  }))
                                }
                                activeOpacity={0.6}
                                style={styles.cancelOrder}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: '#e24243',
                                  }}>
                                  Cancel Order
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => goToViewOrder(item?.order_id, item)}
                          style={{paddingTop: 10}}>
                          <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={item?.products}
                            renderItem={renderItems}
                            keyExtractor={(item, index) => index}
                            ItemSeparatorComponent={() => {
                              return (
                                <View style={{width: 15, height: '100%'}} />
                              );
                            }}
                          />
                        </TouchableOpacity>

                        <View
                          style={{...styles.listOrderDetail, paddingTop: 10}}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Order Status{' '}
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
                        <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: '600',
                              color: '#555',
                              fontSize: 14,
                            }}>
                            Order Date{' '}
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
                            Order Total{' '}
                          </Text>
                          <Text style={styles.orderTotal}>
                            ₹
                            {parseInt(item.order_total) 
                              // parseInt(item.delivery_charges)
                              }
                          </Text>
                        </View>

                        {/* <View style={styles.listOrderDetail}>
              <Text style={{ fontWeight: "600", color: "#555", fontSize: 14 }}>
               Delivery Date{" "}:
              </Text>
              <Text style={styles.orderDate}>30-Aug-2022</Text>
            </View> */}
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
              <View style={{paddingTop: 12, paddingBottom: 13}}>
                <Text style={{textAlign: 'center', color: 'gray'}}>
                  {' '}
                  Do you want to cancel order?
                </Text>
                {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
              </View>
              <View style={{borderTopColor: '#f2f2f2', borderTopWidth: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 25,
                  }}>
                  <TouchableOpacity
                    style={{paddingTop: 8}}
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
                        No, I Don't
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{paddingTop: 12}}
                    onPress={() => cancelOrderFunc(modalVisible?.order_id)}
                    activeOpacity={0.5}>
                    <View>
                      <Text
                        style={{
                          color: config.primaryColor,
                          fontSize: 14,
                          fontWeight: '700',
                        }}>
                        Yes, I Want
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
    paddingTop: 8,
    paddingBottom: 11,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderHeadingText: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '600',
    color: config.primaryColor,
  },
  headerIconsContainer: {
    flexDirection: 'row',
  },
  headerIcon1: {
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: responsiveWidth(2.6),
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
  orderStatusSuggestion: {
    backgroundColor: '#f5f5f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 1,
    marginHorizontal: 5,
    color: 'gray',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    textTransform: 'capitalize',
  },
  orderCardMainBox: {
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 5,
  },
  orderDate: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  orderTotal: {
    color: config.primaryColor,
    fontSize: 15,
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
    paddingTop: 18,
    paddingBottom: 12,
    marginHorizontal: 50,
    borderRadius: 10,
    zIndex: 2,
  },
});

export default Orders;
