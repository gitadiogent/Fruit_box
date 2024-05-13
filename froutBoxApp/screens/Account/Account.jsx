import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Share,
  SafeAreaView,
  Linking,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Surface, Avatar, Modal, Portal, Provider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import {IoWalletOutline} from 'react-icons/io5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// 

import {config} from '../../config';
import imageImport from '../../Constants/imageImport';
import {UseContextState} from '../../global/GlobalContext';
import navigationString from '../../Constants/navigationString';
import {ScrollView} from 'react-native-gesture-handler';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import axios, {Axios} from 'axios';
import { useFocusEffect } from '@react-navigation/native';

function Account({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const {logoutAuthUser, authState, fetchUserData} = UseContextState();
  console.log(
    'authStateauthStateauthStateauthStateauthStateauthStateauthStateauthState',
    authState?.adminDetails,
  );
  // const clickToLogout =async ()=>{
  //   await logoutAuthUser()
  // }
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: authState?.adminDetails?.app_link,
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

  const [userData, setUserData] = useState({});

  useFocusEffect(
    useCallback(() => {
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
  
  
        fetchUserData(authState?.user?.user_id);
    }, [])
  )

  console.warn(authState.user);

  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          <Surface style={styles.accountHeader}>
            <Text style={styles.accountHeadingText}> My Account</Text>
          </Surface>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarWithUser}>
                  {/* <Avatar.Image style={{backgroundColor:'#fff'}} size={60} source={imageImport.UserDefaultImage} /> */}
                  <Image
                    source={imageImport.AccountProfileImage}
                    style={{width: 54, height: 54}}
                  />
                  {/* <FontAwesome name="user-circle-o" size={44} color={config.primaryColor} /> */}
                  <View style={styles.userTextBox}>
                    <Text style={styles.userText}>
                      {authState?.user?.username?.slice(0, 18)}
                    </Text>
                    {authState?.user?.phone_number && (
                      <Text style={styles.phoneNumber}>
                        +91-{authState?.user?.phone_number}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={{padding: 3}}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate(navigationString.EDIT_PROFILE)
                  }>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={29}
                    color={config.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.listBox_wallet}>
              {authState?.adminDetails?.is_wallet_active ? (
                <View style={styles.listBox_wallet_main_box}>
                  <TouchableOpacity
                    // onPress={() =>
                    //   navigation.navigate(navigationString.REFER_AND_EARN)
                    // }
                    style={styles.boxWallet}>
                    <View
                      style={{marginLeft:responsiveWidth(-10)
                      }}>
                      {/* <Image
                      source={imageImport.dollar}
                      style={{width: 54, height: 54}}
                    /> */}
                      <Text style={[styles.coinText, {fontSize: 30}]}>
                       {userData?.wallet}
                      </Text>
                    </View>
                    <Text style={{...styles.coinText,marginLeft:responsiveWidth(-10)}}>Coins</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // onPress={() =>
                    //   navigation.navigate(navigationString.REFER_AND_EARN)
                    // }
                    style={styles.boxWallet}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Image
                        source={imageImport.moneybag}
                        style={{width: 100, height: 100, marginTop: -60}}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                ''
              )}
            </View>
            <View style={styles.listBox}>
              {authState?.adminDetails?.is_wallet_active ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationString.REFER_AND_EARN)
                  }
                  style={styles.changeLanguageBox}>
                  <FontAwesome5
                    name="users"
                    size={24}
                    color={config.primaryColor}
                  />
                  <Text style={{...styles.languageText,paddingLeft:responsiveWidth(4)}}>Refer & Earn</Text>
                </TouchableOpacity>
              ) : (
                ''
              )}
              {authState?.adminDetails?.is_wallet_active ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationString.REDDEM_SCREEN)
                  }
                  style={styles.changeLanguageBox}>
                  <FontAwesome5
                    name="coins"
                    size={24}
                    color={config.primaryColor}
                  />
                  <Text style={styles.languageText}>Redeem Coins</Text>
                </TouchableOpacity>
              ) : (
                ''
              )}

              <TouchableOpacity
                onPress={() => navigation.navigate(navigationString.ABOUT)}
                style={{...styles.changeLanguageBox,paddingVertical:14}}>
                {/* <Ionicons name="ios-information-circle-outline" size={24} color={config.primaryColor}/> */}
                <Ionicons
                  name="information-circle"
                  size={28}
                  color={config.primaryColor}
                />
                <Text style={{...styles.languageText,marginTop:responsiveWidth(0.5),paddingLeft:responsiveWidth(4)}}>About Us</Text>
              </TouchableOpacity>
              <View style={{...styles.changeLanguageBox,paddingVertical:15}}>
                <MaterialCommunityIcons
                  name="phone-in-talk"
                  size={28}
                  color={config.primaryColor}
                />
                <Text
                  onPress={() =>
                    Linking.openURL(
                      `tel:+91${JSON.stringify(
                        JSON.stringify(authState?.adminDetails?.phone_number),
                      )}`,
                    )
                  }
                  style={{...styles.languageText,marginTop:responsiveWidth(0.5),paddingLeft:responsiveWidth(4)}}>
                  Contact Us
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationString.TERMANDCONDITION)
                }
                style={styles.changeLanguageBox}>
                <MaterialIcons
                  style={styles.headerIcon2}
                  name="security"
                  size={24}
                  color={config.primaryColor}
                />
                <Text style={styles.languageText}>Term & Conditions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationString.PRIVACYPOLICY)
                }
                style={styles.changeLanguageBox}>
                <MaterialIcons
                  style={styles.headerIcon2}
                  name="security"
                  size={24}
                  color={config.primaryColor}
                />
                <Text style={styles.languageText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                style={styles.changeLanguageBox}>
                {/* <MaterialIcons
            style={styles.headerIcon2}
            name="security"
            size={24}
            color={config.primaryColor}
          /> */}
                <Ionicons
                  name="share-social-sharp"
                  style={styles.headerIcon2}
                  size={24}
                  color={config.primaryColor}
                />
                <Text style={styles.languageText}>Share App</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setModalVisible(true)}
                style={styles.changeLanguageBox}>
                <Entypo
                  style={styles.headerIcon2}
                  name="log-out"
                  size={24}
                  color={config.primaryColor}
                />
                <Text style={styles.languageText}>Logout</Text>
              </TouchableOpacity>

              <View
                style={{
                  ...styles.changeLanguageBox,
                  flexDirection: 'row',
                  gap: 6,
                }}>
                {authState?.adminDetails?.whatsapp_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.whatsapp_link)
                    }>
                    <Image
                      source={imageImport.whatsapp}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.facebook_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.facebook_link)
                    }>
                    <Image
                      source={imageImport.facebook}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.instagram_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.instagram_link)
                    }>
                    <Image
                      source={imageImport.instagram}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.linkedin_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.linkedin_link)
                    }>
                    <Image
                      source={imageImport.linkedin}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.twitter_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.twitter_link)
                    }>
                    <Image
                      source={imageImport.twitter}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.telegram_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.telegram_link)
                    }>
                    <Image
                      source={imageImport.telegram}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
                {authState?.adminDetails?.youtube_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(authState?.adminDetails?.youtube_link)
                    }>
                    <Image
                      source={imageImport.youtube}
                      style={{width: 28, height: 28}}
                    />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.logBox}>
              <Image
                style={styles.logoImage}
                source={imageImport.LogoAccountScreen}
              />
              <Text style={styles.versionText}>
                Version: {config.APP_VERSION}
              </Text>
              {/* <Text style={{fontSize:9,color:'gray'}} >Powered by Adiogent</Text> */}
            </View>
            <View style={{paddingBottom: 100}}></View>
          </ScrollView>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
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
                <View style={{paddingTop: 15, paddingBottom: 13}}>
                  <Text
                    style={{textAlign: 'center', fontSize: 14, color: 'gray'}}>
                    {' '}
                    Do you want to Logout?
                  </Text>
                  {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
                </View>
                <View style={{borderTopColor: '#f2f2f2', borderTopWidth: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                    }}>
                    <TouchableOpacity
                      style={{paddingTop: 15, paddingBottom: 4}}
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
                      style={{paddingTop: 12, paddingBottom: 4}}
                      activeOpacity={0.5}
                      onPress={logoutAuthUser}>
                      <View>
                        <Text
                          style={{
                            color: config.primaryColor,
                            fontSize: 14,
                            fontWeight: '700',
                          }}>
                          Log out
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Portal>
    </Provider>
  );
}

export default Account;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  accountHeader: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 12,
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(16),
    // width:responsiveWidth(80),
    // height:responsiveHeight(20),
    borderRadius: 10,
    zIndex: 2,
  },
  accountHeadingText: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '600',
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWithUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextBox: {
    paddingLeft: 10,
  },
  userText: {
    fontWeight: '600',
    fontSize: responsiveFontSize(2.3),
    letterSpacing: 0.5,
    textTransform: 'capitalize',
    color: '#1e1e1e',
  },
  phoneNumber: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    letterSpacing: 0.4,
    color: config.primaryColor,
  },
  listBox: {
    paddingHorizontal: 24,
  },
  listBox_wallet: {
    paddingHorizontal: responsiveWidth(5.5),
    paddingVertical: 0,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 5,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "red"
  },
  listBox_wallet_main_box: {
    backgroundColor: config.primaryColor,
    // borderWidth: 1,
    // borderColor: "red",
    width: '100%',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
  },
  boxWallet: {
    paddingVertical: 10,
    width: responsiveWidth(38),
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#f2f2f2',
    borderRadius: 5,
  },
  changeLanguageBox: {
    flexDirection: 'row',
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
    paddingVertical: 18,
  },
  coinText: {
    fontWeight: '500',
    color: '#fff',
    // fontSize: responsiveFontSize(2),
    // borderWidth: 1
  },
  languageText: {
    paddingLeft: 20,
    fontWeight: '400',
    color: '#3e3e3e',
    fontSize: responsiveFontSize(2),
    // borderWidth: 1
  },
  logBox: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
  },
  versionText: {
    fontSize: responsiveFontSize(1.5),
    color: 'gray',
    paddingTop: 10,
  },
});
