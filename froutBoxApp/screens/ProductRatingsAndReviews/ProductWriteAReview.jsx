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
import imageImport from '../../Constants/imageImport';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useToast } from "react-native-toast-notifications";


function ProductWriteAReview({route,navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [ rating , setRating ] = useState(0)
  const [ rating_description , setRating_description ] = useState('')
  const {authState} = UseContextState();
  const {productDetails} = route?.params;
  const toast = useToast();
console.log(rating_description);
console.log(rating);
function goBack(){
  navigation.goBack()
}



  
const showErrorToast=(message)=>{
  toast.show(message, {
    type: "danger",
  });
}


const handleSubmitReview=async()=>{
  // let reviewData={
  //   user_id:authState?.user?._id,
  //   username:'Raman Singh',
  //   rating:rating,
  //   rating_description:rating_description,          
  // }
  // showErrorToast('give rating!!')
  if(parseInt(rating) < 1){
    // console.log("entered");
   await showErrorToast('give rating!!')
    return
 }
  if(rating_description?.length < 9){
     await showErrorToast('Add atleast 10 character!!')
     return
  }
  let reviewData={
    user_id:authState?.user?._id,
    username:authState?.user?.username,
    rating:rating,
    rating_description:rating_description,          
  }
  await axios.post(`${config.BACKEND_URI}/api/app/add/product/review/from/user/by/product_id/${productDetails?._id}`,{...reviewData},{headers: {
    'Authorization': `token ${config.APP_VALIDATOR}`,
  },withCredentials:true})
  .then(res=>{
    // console.log("SUCCESS SAVE REVIEW==>",res);
    setModalVisible(true)
  })
  .catch(err=>{
    console.log("ERROR REVIEW==>",err);
  })
}

  return (
    <Provider>
    <Portal>
    <View style={{flex:1,backgroundColor:'white',}} >
    {/* <StatusBar backgroundColor="white" /> */}
    <Surface style={styles.productHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons  onPress={goBack} name="close" size={23} color={config.primaryColor} />
    <Text style={styles.pageTitleText}>Write a Review</Text> 
    </View>
  </Surface>
<View style={{paddingHorizontal:20,paddingTop:12,}}  >
<Text style={{...styles.productDetailTitleText,paddingBottom:10}} >Product Details</Text>
<View style={{flexDirection:'row',justifyContent:'flex-start',}} >
            <TouchableOpacity onPress={()=>navigation.navigate(navigationString.PRODUCT_INFO)} activeOpacity={0.7} >
            <View style={{borderWidth:0.6,borderColor:'lightgray',padding:2,borderRadius:10}} >
            <Image 
             source={{uri:productDetails?.product_images[0]?.image_url}}
             style={{width:responsiveWidth(18),height:responsiveHeight(9),borderRadius:8}}
             />
             </View>
            </TouchableOpacity>
               <View style={styles.cartDetails} >
            <View style={{paddingLeft:8}} >
            <Text style={styles.productName} >{productDetails?.product_name?.slice(0,20)}{productDetails?.product_name?.length > 20 && '...'}</Text>
            <Text style={styles.brandName} >Tell others what you think about our product</Text>
            </View>

           </View>
           </View>
<Text style={{...styles.productDetailTitleText,paddingTop:25}} >Rate us</Text>
              <Rating
              //  type='star'
               type='custom'
               startingValue={0}
               ratingCount={5}
               ratingColor="#F5BF1A"
               imageSize={25}
               onStartRating={setRating}
               onSwipeRating={setRating}
               onFinishRating={setRating}
               style={{alignItems:'flex-start',paddingTop:12,paddingBottom:3}}
                />
<Text style={{...styles.productDetailTitleText}} >Write a Comment...</Text>
<View style={{...styles.commonFieldContainer}} >
<TextInput autoFocus  value={rating_description} onChangeText={value=>setRating_description(value)}     style={styles.commonField} placeholder='Add your comments here*' />
<TouchableOpacity   activeOpacity={0.8} style={styles.checkoutBtn} onPress={handleSubmitReview} >
<Text style={styles.checkouttext}>Submit Review </Text>
</TouchableOpacity>
</View>
</View>
  </View>
  <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
          <Text style={{fontSize:16,fontWeight:'700',color:'#222',textAlign:'center'}} >
          <MaterialIcons name="info-outline" size={24} color="#222" />
            </Text>
            <View  >
            <View style={{paddingTop:8,paddingHorizontal:20,paddingBottom:13}} >
            <Text style={{textAlign:'center',color:'gray'}} > 
            Thanks for your valuable review !!
            </Text>
            {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
            </View>
            <View style={{paddingTop:8,borderTopColor:'#f2f2f2',borderTopWidth:1}} >
            <View style={{alignItems:'center',paddingHorizontal:0}} >
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{setModalVisible(false)
            goBack()
            }} >
             <View >
               <Text style={{color: config.primaryColor,textAlign:'center' ,fontSize:14,fontWeight:'700'}} >OK</Text>
             </View>
             </TouchableOpacity>
            </View>
            </View>
            </View>
          </View>
         </Modal>
         </Portal>
         </Provider>
  )
}

export default ProductWriteAReview


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
      pageTitleText: {
        fontSize: 16,
        // textTransform:'capitalize',
        paddingLeft:5,
        fontWeight: "500",
        color:config.primaryColor,
      },

      commonFieldContainer:{
        // width:'100%',
        
      },
      commonField:{
        width:'100%',
        marginTop:10,
        paddingHorizontal:12,
        // textAlignVertical:'top',
        paddingVertical:15,
        fontSize:14,
         borderRadius: 16,
        borderWidth:0.5,
        color:'gray',
        fontWeight:'500',
        borderColor:'lightgray',
        // height:120,
        // maxHeight:120
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
        // shadowColor: config.primaryColor,
        // shadowOffset: { width: 10, height: 0 },
        // shadowOpacity: 0.49,
        // shadowRadius: 10,
        // elevation: 5,
      },
      containerStyle:{
        backgroundColor: 'white',
      paddingTop: 15,
      paddingBottom:12,
      marginHorizontal:50,
      borderRadius:10,
    zIndex:2
    },
    productName:{
      fontSize:16,
      textTransform:'capitalize',
      fontWeight:'600',
    },
    brandName:{
      fontSize:responsiveFontSize(1.6),
      color:'gray',
      paddingTop:2,
      paddingLeft:2,
      paddingRight:responsiveWidth(36),
      // textTransform:'capitalize',
  
    },
    productDetailTitleText:{
      fontSize:responsiveFontSize(1.8),
      paddingTop:12,
      fontWeight:'600',
      letterSpacing:0.6,
      color:'#1e1e1e'
    },
     
})