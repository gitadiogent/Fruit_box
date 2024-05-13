import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import {config} from '../../config';
import BrandCard from '../../components/BrandCard';
import HomeBanner from '../../components/HomeBanner';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import navigationString from '../../Constants/navigationString';
import CategoryCard from '../Category/CategoryCard';
import axios from 'axios';
import {UseContextState} from '../../global/GlobalContext';
import ProductCard from '../../components/ProductCard';
import {useFocusEffect} from '@react-navigation/native';
import imageImport from '../../Constants/imageImport';
import {useToast} from 'react-native-toast-notifications';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import HomeCategoryCard from './HomeCategoryCard';
import {Surface} from 'react-native-paper';

export const SLIDER_WIDTH = Dimensions.get('window').width;

function AllProducts({navigation}) {
  const [brands, setbrands] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [loadMore, setLoadmore] = useState(true);
  const {authState} = UseContextState();
  const toast = useToast();

  const goToAllCategory = () => {
    navigation.navigate(navigationString.CATEGORY);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BACKEND_URI}/api/get/all/categories`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        // console.log(res?.data);
        setData(res?.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.log(err);
        setRefreshing(false);
      });
  }, [render, refreshing]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BACKEND_URI}/api/app/get/all/products/for/home/screen`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        setSearchResult([...res?.data?.result]);
        setCurrentPage(1);
        setTotalPagesCount(res?.data?.pages);
        setProductCount(res?.data?.result?.length);
        setLoading(false);
        if (currentPage === totalPagesCount) {
          setLoadmore(false);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [render, refreshing]);

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const goToSearch = () => {
    navigation.navigate(navigationString.SEARCH_SCREEN);
  };

  const renderCategoryItem = ({item}) => {
    console.log('ITEM _______', item);
    return (
      <HomeCategoryCard
        itemImage={item.main_category_image[0]?.image?.image_url}
        category_id={item._id}
        navigation={navigation}
        itemName={item._id}
      />
    );
  };

  const renderNewArrivalProducts = ({item}) => {
    // console.log("ITEM _______PRODUCTS",item)
    return (
      <View style={styles.productsContainer}>
        <ProductCard
          product_id={item._id}
          product_code={item.product_code}
          product_name={item?.product_name}
          product_main_category={item?.product_category}
          product_category={item?.product_category}
          product_subcategory={item?.product_category}
          product_variant={item?.product_category}
          product_images={item?.product_images}
          new_arrival={item?.new_arrival}
          product_sale_price={item?.product_sale_price}
          product_regular_price={item?.product_regular_price}
          navigation={navigation}
        />
      </View>
    );
  };
  const renderTrendingProducts = useCallback(({item}) => {
    // console.log("ITEM _______PRODUCTS",item)
    return (
      <View style={styles.productsContainer}>
        <ProductCard
          product_id={item._id}
          product_code={item.product_code}
          product_name={item?.product_name}
          product_main_category={item?.product_category}
          product_category={item?.product_category}
          product_subcategory={item?.product_category}
          product_variant={item?.product_category}
          product_images={item?.product_images}
          trending_product={item?.trending_product}
          product_sale_price={item?.product_sale_price}
          product_regular_price={item?.product_regular_price}
          navigation={navigation}
        />
      </View>
    );
  }, []);
  const renderAllProducts = useCallback(({item, index}) => {
    return (
      <View style={{paddingTop: 5}}>
        {item.empty ? (
          <View
            style={{
              backgroundColor: '#fff', //#f2f2f2
              width: 165,
              height: 250,
              borderRadius: 30,
              margin: 5,
              padding: 20,
              overflow: 'hidden',
            }}></View>
        ) : (
          <ProductCard
            product_id={item._id}
            product_code={item.product_code}
            product_name={item?.product_name}
            product_main_category={item?.product_main_category}
            product_category={item?.product_category}
            product_subcategory={item?.product_subcategory}
            product_variant={item?.product_variant}
            product_images={item?.product_images}
            trending_product={item?.trending_product}
            product_sale_price={item?.product_sale_price}
            product_regular_price={item?.product_regular_price}
            navigation={navigation}
          />
        )}
      </View>
    );
  }, []);

  //==============LOAD MORE ITEMS FUNCTIONS==========
  const loadMoreItems = async () => {
    console.log('loadmore called..');
    console.log(
      'Total page -->',
      totalPagesCount,
      'Current page before-->',
      currentPage,
    );

    if (currentPage < totalPagesCount) {
      await setCurrentPage(currentPage + 1);
      // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
      axios
        .get(
          `${
            config.BACKEND_URI
          }/api/app/get/all/products/for/home/screen?&page=${currentPage + 1}`,
          {
            headers: {
              Authorization: `token ${config.APP_VALIDATOR}`,
            },
            withCredentials: true,
          },
        )
        .then(res => {
          setSearchResult([...searchResult, ...res?.data?.result]);
          if (currentPage === totalPagesCount) {
            setLoadmore(false);
          }
          setProductCount(res?.data?.result?.length);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  //=============LOAD MORE ITEMS FUNCTIONS=============

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'white', marginTop: -0}}
        refreshControl={
          <RefreshControl
            progressViewOffset={152}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={() => (
          <View>
            <Surface style={styles.productHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  onPress={goBack}
                  name="keyboard-arrow-left"
                  size={27}
                  color={config.primaryColor}
                />
                <Text style={styles.pageTitleText}>All Products</Text>
              </View>
            </Surface>
            
            {/* <Header navigation={navigation} /> */}

          

            

            {/* {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  size="large"
                  animating={true}
                  color={config.primaryColor}
                />
              </View>
            ) : (
              <View>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={data}
                  contentContainerStyle={{paddingHorizontal: 0}}
                  renderItem={renderCategoryItem}
                  keyExtractor={item => item._id}
                  ListFooterComponent={<View style={{height: 70}}></View>}
                />
              </View>
            )} */}
            {/* <HomeBanner navigation={navigation} /> */}
            {/* ======== NEW ARRIVALS PRODUCTS ========== */}
            {/* {authState?.newArrivalsProducts?.length > 0 && (
              <View style={{marginTop: -5}}>
                <View style={styles.brandHeadingBox}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={styles.brandText}>New Arrivals </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationString.NEW_ARRIVALS)
                    }
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.seeAll}>View All</Text>
                    <Feather
                      name="arrow-right"
                      size={16}
                      color={config.primaryColor}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 0, paddingTop: 10}}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={authState?.newArrivalsProducts}
                    contentContainerStyle={{paddingHorizontal: 10}}
                    renderItem={renderNewArrivalProducts}
                    keyExtractor={item => item._id}
                    ListFooterComponent={<View style={{height: 70}}></View>}
                  />
                </View>
              </View>
            )} */}
            {/* ======== NEW ARRIVALS PRODUCTS ========== */}

            {/* ======== TRENDING PRODUCTS ========== */}
            {/* {authState?.trendingProducts?.length > 0 && (
              <View style={{paddingTop: 15}}>
                <View style={styles.brandHeadingBox}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={styles.brandText}>Trending Products</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationString.TRENDING_PRODUCTS)
                    }
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.seeAll}>View All</Text>
                    <Feather
                      name="arrow-right"
                      size={16}
                      color={config.primaryColor}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 0, paddingTop: 10}}>
                  <FlatList
                    contentContainerStyle={{paddingHorizontal: 10}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={authState?.trendingProducts}
                    renderItem={renderTrendingProducts}
                    keyExtractor={item => item._id}
                    ListFooterComponent={<View style={{height: 70}}></View>}
                  />
                </View>
              </View>
            )} */}
            {/* ======== TRENDING PRODUCTS ========== */}
          </View>
        )}


        ListFooterComponent={
          <View style={{paddingTop: 0}}>
            {/* <View style={styles.brandHeadingBox}>
              <View style={styles.brandHeadingBox}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={styles.brandText}>Showing All Products </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationString.NEW_ARRIVALS)
                  }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.seeAll}>View All</Text>
                  <Feather
                    name="arrow-right"
                    size={16}
                    color={config.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            </View> */}
            <View style={{alignItems: 'center', paddingTop: 10}}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                numColumns={2}
                data={searchResult}
                renderItem={renderAllProducts}
                keyExtractor={item => item._id}
                ListFooterComponent={() =>
                  loadMore && currentPage < totalPagesCount ? (
                    <View style={{alignItems: 'center', marginVertical: 10}}>
                      <ActivityIndicator
                        size="large"
                        color={config.primaryColor}
                      />
                      <Text style={{color: 'gray'}}>Loading...</Text>
                      <View style={{paddingBottom: 100}}></View>
                    </View>
                  ) : (
                    <View style={{paddingBottom: 100}}></View>
                  )
                }
                showsVerticalScrollIndicator={false}
                onEndReached={loadMoreItems}
              />
            </View>
          </View>
        }
      />
    </View>
  );
}

export default AllProducts;

const styles = StyleSheet.create({
  productHeader: {
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 12,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitleText: {
    fontSize: 16,
    textTransform: 'capitalize',
    paddingLeft: 2,
    fontWeight: '500',
    color: config.primaryColor,
  },
  ratingsMainBox: {
    borderWidth: 0.5,
    borderRadius: responsiveWidth(3.3),
    borderColor: 'lightgray',
    padding: 10,
    marginTop: 15,
  },
  ratingsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderWidth: 0.5,
    borderColor: config.primaryColor,
  },
  writeAReivewText: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.3,
    color: config.primaryColor,
  },
  productTableTitleText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    letterSpacing: 0.8,
    color: '#1e1e1e',
    textTransform: 'capitalize',
  },
  checkButton: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveWidth(2.5),
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: responsiveWidth(3.2),
    shadowColor: config.primaryColor,
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  checktext: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white',
  },

  searchBox: {
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  searchBar: {
    paddingVertical: 12,
    backgroundColor: '#f5f5f6',
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 14,
    marginBottom: 2,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarText: {
    fontSize: responsiveFontSize(1.9),
    color: '#999',
    fontWeight: '500',
  },
  serachIcon: {
    color: config.primaryColor,
    paddingRight: 10,
  },
  productsContainer: {
    // paddingLeft:2
  },
  brandHeadingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  brandText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'capitalize',
    color: '#1e1e1e',
  },
  seeAll: {
    // fontWeight:'600',
    // fontSize:12,
    // color:'white',
    // backgroundColor:config.primaryColor,
    // paddingHorizontal:10,
    // paddingVertical:3,
    // borderRadius:12
    fontWeight: '500',
    fontSize: responsiveFontSize(1.5),
    color: config.primaryColor,
  },
});
