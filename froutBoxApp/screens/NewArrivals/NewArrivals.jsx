import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Surface} from 'react-native-paper';
import ProductCard from '../../components/ProductCard';
// import { StatusBar } from 'expo-status-bar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';

import {config} from '../../config';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import imageImport from '../../Constants/imageImport';
import strings from '../../Constants/strings';
import CustomLoader from '../../components/Loader';
import {UseContextState} from '../../global/GlobalContext';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

function NewArrivals({route, navigation}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [brandSuggestion, setBrandSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadMore, setLoadmore] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const {authState} = UseContextState();

  useFocusEffect(
    useCallback(() => {
      // console.log("MAIN USE EFFECT RUNS")
      setLoading(true);
      axios
        .get(`${config.BACKEND_URI}/api/app/get/products/new/arrivals`, {
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
    }, [render, refreshing]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const loadMoreItems = async () => {
    if (currentPage < totalPagesCount) {
      await setCurrentPage(currentPage + 1);
      // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/products/new/arrivals?&page=${
            currentPage + 1
          }`,
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

  const goBack = () => {
    navigation.goBack();
  };

  // SET EMPTY PRODUCT FOR GRID ALIGNMENT
  let emptyArr = [{empty: true, product_images: []}];
  searchResult?.length % 2 != 0 &&
    setSearchResult([...searchResult, ...emptyArr]);
  // console.log("RESULT",searchResult)
  // console.log("LENGTH=>",searchResult?.length);

  const renderProducts = useCallback(({item, index}) => {
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
            new_arrival={item?.new_arrival}
            product_sale_price={item?.product_sale_price}
            product_regular_price={item?.product_regular_price}
            navigation={navigation}
          />
        )}
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <StatusBar backgroundColor="white" /> */}
      <Surface style={styles.productHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons
            onPress={goBack}
            name="keyboard-arrow-left"
            size={27}
            color={config.primaryColor}
          />
          <Text style={styles.searchResultText}>New Arrivals</Text>
        </View>

        {/* <Text style={styles.searchResultText}>{productCount},{currentPage},{totalPagesCount}</Text>  */}

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)}  >
      <Octicons
        style={{paddingRight: 10}}
        name="search"
        size={20}
        color={config.primaryColor}
      />
      </TouchableOpacity> */}
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate(navigationString.SEARCH_SCREEN)
              }>
              <Octicons
                style={styles.serachIcon}
                name="search"
                size={18}
                color={config.primaryColor}
              />
            </TouchableOpacity>
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
      <View>
        {/* <View style={{alignItems:'center',paddingBottom:10}} >
    <FlatList
      data={brandSuggestion}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={renderbrandSuggestion}
      keyExtractor={(item)=>item._id}
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
        <View style={{alignItems: 'center'}}>
          {loading ? (
            // <ActivityIndicator size='large' color={config.primaryColor} />
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                height: '90%',
                justifyContent: 'center',
              }}>
              {/* <Image
    source={imageImport.LoaderGif}
    style={{width:100,height:100}}
    /> */}
              <CustomLoader />
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              numColumns={2}
              data={searchResult}
              contentContainerStyle={{alignItems: 'center', width: '100%'}}
              ListFooterComponent={() =>
                !loadMore && currentPage < totalPagesCount ? (
                  <View style={{alignItems: 'center', marginVertical: 10}}>
                    <ActivityIndicator
                      size="large"
                      color={config.primaryColor}
                    />
                    <Text style={{color: 'gray'}}>Loading...</Text>
                    <View style={{paddingBottom: 255}}></View>
                  </View>
                ) : (
                  <View style={{paddingBottom: 265}}></View>
                )
              }
              showsVerticalScrollIndicator={false}
              renderItem={renderProducts}
              keyExtractor={(item, index) => index}
              onEndReached={loadMoreItems}
              // onEndReachedThreshold={0.2}
            />
          )}
          {!loading && searchResult.length <= 0 && (
            <View style={{alignItems: 'center', width: '100%', height: '100%'}}>
              <Image
                source={imageImport.NotFoundResult}
                style={{width: 300, height: 300}}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate(navigationString.HOME);
                  setRender(prev => !prev);
                }}
                style={styles.notFoundProduct}>
                <Text style={styles.notFoundText}>Product Not Found</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* <View style={{ paddingBottom: 255 }}></View> */}
      </View>
    </View>
  );
}

export default NewArrivals;

const styles = StyleSheet.create({
  productHeader: {
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 11,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  searchResultText: {
    fontSize: responsiveFontSize(2),
    textTransform: 'capitalize',
    paddingLeft: 2,
    fontWeight: '500',
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingLeft: responsiveWidth(2.9),
    paddingRight: responsiveWidth(2.8),
    paddingTop: responsiveWidth(2.6),
    paddingBottom: responsiveWidth(2.4),
    borderRadius: responsiveWidth(40),
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
    marginLeft: 8,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  brandSuggestion: {
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
  notFoundProduct: {
    backgroundColor: config.primaryColor,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: config.primaryColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 9,
  },
  notFoundText: {
    color: 'white',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '500',
  },
});
