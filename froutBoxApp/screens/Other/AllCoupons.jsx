import React, {useCallback, useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  TextInput,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from 'react-native';
import {Surface, Modal, Portal, Provider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {config} from '../../config';
import {UseContextState} from '../../global/GlobalContext';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import imageImport from '../../Constants/imageImport';

function AllCoupons({route, navigation}) {
  // const {product_id} = route?.params
  const [allCoupons, setAllCoupons] = useState([]);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${config.BACKEND_URI}/api/app/get/coupons`, {
          headers: {
            Authorization: `token ${config.APP_VALIDATOR}`,
          },
          withCredentials: true,
        })
        .then(res => {
          console.log('PRODUCT REVIEW==>>', res?.data);
          setAllCoupons([...res?.data?.coupons]);
        })
        .catch(err => {
          console.log(err);
        });
    }, []),
  );

  const allCouponsData = allCoupons;
  // const allCouponsData = [];
  
  const goBack = () => {
    navigation.goBack();
  };

  const setCouponMain = item => {
    navigation.navigate(navigationString.CHECKOUT, {appliedCoupon: item});
  };

  const renderProductRatings = ({item}) => {
    return (
      <View key={item?._id} style={styles.ratingsMainBox}>
        <View style={styles.ratingsBox}>
            <View style={{paddingLeft: 0}}>
              <Text
                style={{
                  ...styles.productTableTitleText,
                  textTransform: 'uppercase',
                }}>
                {item?.coupon_code}
              </Text>
            </View>

          <TouchableOpacity
            onPress={() => {
              setCouponMain(item?.coupon_code);
            }}
            activeOpacity={0.8}
            style={styles.checkButton}>
            {/* <MaterialCommunityIcons
              style={{paddingRight: 4}}
              name="checkbox-marked-circle-outline"
              size={16}
              color="white"
            /> */}
            <Text style={styles.checktext}>Use Coupon</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.ratingsDescriptionText}>{item?.description}</Text> */}
      </View>
    );
  };

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
          <Text style={styles.pageTitleText}>All Available Coupons</Text>
        </View>
      </Surface>
      <View style={{paddingHorizontal: 20, paddingTop: 8}}>
        <FlatList
          data={allCouponsData}
          renderItem={renderProductRatings}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{height: 140}}></View>}
        />
        {allCouponsData?.length == 0 &&
        <View style={{justifyContent:'center',alignSelf:'center'}} >
          <Text style={{fontSize:responsiveFontSize(2)}} >Sorry, Right Now We Don't Have Any Coupons...</Text>


        </View>
        }
      </View>
    </View>
  );
}

export default AllCoupons;

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
    paddingVertical:responsiveWidth(2.5),
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
});
