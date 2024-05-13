import React,{useCallback,useEffect,useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
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
    ToastAndroid
  } from "react-native";
import { Surface,Modal, Portal,Provider } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { config } from '../../config';
import { UseContextState } from '../../global/GlobalContext';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';


function PrivacyPolicy({route,navigation}) {
  const {authState} = UseContextState();
  const [data , setData ] = useState()

  useEffect(()=>{
    axios.get(`${config.BACKEND_URI}/api/app/get/admin/privacy_policy/aboutus/term_and_condition`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        // console.log(res?.data)
        setData(res?.data[0]?.privacy_policy)
    })
    .catch(err=>{
        console.log(err)
    })
  },[])

  

    const goBack=()=>{
        navigation.goBack()
    }

  return (
    <View style={{flex:1,backgroundColor:'white',}} >
    {/* <StatusBar backgroundColor="white" /> */}
    <Surface style={styles.productHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
    <Text style={styles.searchResultText}>Privacy Policy</Text> 
    </View>
    <View style={{flexDirection:'row',alignItems:'center'}} >
      {/* <View style={styles.headerIconsContainer} >
        <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)} >
          <Octicons
            style={styles.serachIcon}
            name="search"
            size={20}
            color={config.primaryColor}
          />
        </TouchableOpacity>
          <MaterialIcons
            onPress={()=>Linking.openURL(`tel:+91${JSON.stringify(authState?.adminDetails?.phone_number)}`)}
            style={styles.headerIcon1}
            name="support-agent"
            size={24}
            color={config.primaryColor}
          />
        <FontAwesome name="whatsapp" onPress={()=>Linking.openURL(authState?.adminDetails?.whatsapp_link)} style={styles.headerIcon2} size={24} color={config.primaryColor} />
        </View> */}
    </View>
  </Surface>
<ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal:20,paddingTop:15}}  >
<View>
    <Text style={{textAlign:'left',textTransform:'capitalize'}} >
    {data}
    </Text>
</View>
{/* FOR EXTRA PADDING */}
<View style={{paddingBottom:40}} ></View>
{/* FOR EXTRA PADDING */}
</ScrollView>
  </View>
  )
}

export default PrivacyPolicy


const styles=StyleSheet.create({
    productHeader: {
        width: "100%",
        backgroundColor:'white',
        paddingTop: 12,
        paddingBottom: 15,
        paddingHorizontal: 15, 
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      searchResultText: {
        fontSize: 16,
        textTransform:'capitalize',
        paddingLeft:2,
        fontWeight: "500",
        color:config.primaryColor,
      },
      serachIcon: {
        paddingRight: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderRadius: 40,
      },
      headerIconsContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      },
      headerIcon1: {
        borderColor: "lightgray",
        borderWidth: 1,
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 40,
        marginLeft: 8,
        shadowProp: {
          shadowColor: "#171717",
          shadowOffset: { width: 12, height: 4 },
          shadowOpacity: 0.49,
          shadowRadius: 3,
        },
      },
      headerIcon2:{
        borderColor:'lightgray',
        borderWidth:1,
        backgroundColor:'white',
        paddingLeft:12.5,
        paddingRight:11,
        paddingVertical:10,
        borderRadius:40,
        marginLeft:8,
        shadowProp: {
          shadowColor: '#171717',
          shadowOffset: {width: 12, height: 4},
          shadowOpacity: 0.49,
          shadowRadius: 3,
        },
      
      },
      brandSuggestion:{
        backgroundColor:'#f5f5f6',
        paddingHorizontal:16,
        paddingVertical:6,
        marginVertical:1,
        marginHorizontal:5,
        color:'gray',
        borderRadius:30,
        borderWidth:0.5,
        borderColor:'lightgray',
        textTransform:'capitalize'
      },
      commonFieldContainer:{
        // width:'100%',
      },
      commonField:{
        width:'100%',
        marginTop:10,
        paddingHorizontal:12,
        textAlignVertical:'top',
        paddingVertical:12,
        fontSize:14,
        // backgroundColor:'#f9f9f9',
        // letterSpacing:1.5,
         borderRadius: 16,
        borderWidth:0.5,
        color:'gray',
        fontWeight:'500',
        borderColor:'lightgray'
      },
      checkouttext:{
        fontSize:14,
        fontWeight:'600',
        letterSpacing:1.5,
        color:'white'
      },
      checkoutBtn: {
        width: "50%",
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 12,
        backgroundColor: config.primaryColor,
        borderRadius: 16,
        shadowColor: config.primaryColor,
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.49,
        shadowRadius: 10,
        elevation: 5,
      },
      containerStyle:{
        backgroundColor: 'white',
      paddingTop: 15,
      paddingBottom:12,
      marginHorizontal:50,
      borderRadius:10,
    zIndex:2
    },
     
})