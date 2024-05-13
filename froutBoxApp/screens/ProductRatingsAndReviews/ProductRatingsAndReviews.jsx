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
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { config } from '../../config';
import { UseContextState } from '../../global/GlobalContext';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import imageImport from '../../Constants/imageImport';


function ProductRatingsAndReviews({route,navigation}) {
  const {product_id} = route?.params
  const [ productReview , setProductReview ] = useState();


  useFocusEffect(useCallback(()=>{
   
    axios.get(`${config.BACKEND_URI}/api/app/get/all/product/reviews/by/product_id/${product_id}`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log("PRODUCT REVIEW==>>",res?.data);
      setProductReview([...res?.data?.allreviews])
    })
    .catch(err=>{
      console.log(err)
    })
  },[]))

  const ratingsData =productReview
  // const ratingsData =[
  //   {_id:1,username:'Mayank Singh',rating:4,created_at:'12-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:2,username:'aman Singh',rating:3,created_at:'02-01-2023',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:3,username:'Raman Sharma',rating:5,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:4,username:'Raman Sharma',rating:4,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:5,username:'Raman Sharma',rating:4,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:6,username:'Raman Sharma',rating:5,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:7,username:'Raman Sharma',rating:5,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:8,username:'Raman Sharma',rating:5,created_at:'10-01-2024',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  //   {_id:9,username:'Abhay Rathore',rating:2,created_at:'08-01-2023',rating_description:"Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', it looks readable English."},
  // ]

    const goBack=()=>{
        navigation.goBack()
    }

  const renderProductRatings=({item})=>{
    return(
      <View key={item?._id} style={styles.ratingsMainBox} >
      <View style={styles.ratingsBox} >
             <View style={{flexDirection:'row',alignItems:'center'}} >
              <Image source={imageImport.ratingsImg} style={styles.ratingsImgStyle} />
            <View style={{paddingLeft:8}} >
            <Text style={{...styles.productTableTitleText,paddingBottom:3}} >{item?.username}</Text>
            <View>
              <Text style={styles.ratingsDateText} >{item?.created_at}</Text>
            </View>
            </View>
             </View>
             <Rating
           //  type='star'
            type='custom'
            startingValue={item?.rating}
            ratingCount={5}
            ratingColor="#F5BF1A"
            imageSize={18}
            readonly={true}
             />
            </View>
            <Text style={styles.ratingsDescriptionText} >
        {item?.rating_description}
        </Text>
      </View>
    )
  }



  return (
    <View style={{flex:1,backgroundColor:'white',}} >
    {/* <StatusBar backgroundColor="white" /> */}
    <Surface style={styles.productHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
    <Text style={styles.pageTitleText}>Product Ratings & Reviews</Text> 
    </View>
    
  </Surface>
<View style={{paddingHorizontal:20,paddingTop:8}}  >
      <FlatList
      data={ratingsData}
      renderItem={renderProductRatings}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 140 }}></View>  }
      />
      </View>
  
      {/* <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}} >
      <TouchableOpacity style={styles.writeAReivewButton} >
           <FontAwesome5 name="edit" size={14} style={{color:config.primaryColor,paddingRight:3}} />
              <Text style={styles.writeAReivewText} >Write a Reivew</Text>
           </TouchableOpacity>
        </View> */}
           

  </View>
  )
}


export default ProductRatingsAndReviews


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
        textTransform:'capitalize',
        paddingLeft:2,
        fontWeight: "500",
        color:config.primaryColor,
      },
      ratingsMainBox:{
        borderWidth:0.5,
        borderRadius:8,
        borderColor:'lightgray',
        // paddingHorizontal:12,
        // paddingVertical:8,
        padding:12,
        marginTop:15,
      },
      ratingsBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end',
        borderBottomWidth:0.6,
        borderColor:'lightgray',
        paddingBottom:10
      },
      ratingsImgStyle:{
        width:35,
        height:35,
      },
      ratingsDateText:{
        fontSize:12,
        fontWeight:'400',
        textTransform:'capitalize',
        color:'#767676'
      },
      ratingsDescriptionText:{
        fontSize:responsiveFontSize(1.6),
        fontWeight:'400',
        color:'#777777',
        textAlign:'left',
        textTransform:'capitalize',
        lineHeight:18,
        marginTop:10
      },
      seeAllRatingsText:{
        fontSize:13,
        fontWeight:'500',
        letterSpacing:0.6,
        color:config.primaryColor,
        textTransform:'capitalize',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:2,
      },
      writeAReivewButton:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:8,
        paddingHorizontal:10,
        borderRadius:40,
        borderWidth:0.5,
        borderColor:config.primaryColor
      },
      writeAReivewText:{
        fontSize:12,
        fontWeight:'400',
        letterSpacing:0.3,
        color:config.primaryColor
      },
      productTableTitleText:{
        fontSize:13,
        fontWeight:'500',
        letterSpacing:0.6,
        color:'#1e1e1e',
        textTransform:'capitalize'
      },
      
   
     
})