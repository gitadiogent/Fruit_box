import React from 'react'
import {Text,View,Image,TouchableOpacity,StyleSheet} from "react-native"
import { Avatar } from 'react-native-paper'
import navigationString from '../../Constants/navigationString'
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

function HomeCategoryCard({itemImage,itemName,category_id,navigation}) {
  // const goToSubCategory=(value,cateId)=>{
  //   console.log(value,cateId)
  //   navigation.navigate(navigationString.SUB_CATEGORY,{category_id:cateId,brand_name:value});

  // }
  const goToSearch=(value,cateId)=>{
    console.log(value,cateId)
    navigation.navigate(navigationString.SEARCH_RESULT,{searchThroughCategory:itemName});

  }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={()=>goToSearch(itemName,category_id)} style={styles.brandCatgory} >
         <View style={styles.brandBox} >
            <View style={{borderWidth:0.6,borderColor:'lightgray',padding:responsiveWidth(0.5),borderRadius:responsiveWidth(40)}} >
            <Image
    style={{width:responsiveWidth(15),height:responsiveWidth(15), borderRadius:responsiveWidth(40)}}
    source={{
      uri:itemImage}}/>
            </View>
  {/* <Text style={styles.brandName}> {itemName?.slice(0,10)}</Text> */}
  <Text style={styles.brandName}> {itemName?.slice(0,10)}</Text>
   </View>
   </TouchableOpacity>


  )
}

export default HomeCategoryCard

const styles= StyleSheet.create({
    brandBox:{
        // alignItems:'center',
       width:responsiveWidth(16.4),
        // borderRadius:40
       
      },
      brandName:{
        paddingTop:5,
        fontSize:responsiveWidth(3),
        fontWeight:'500',
        textAlign:'center',
        textTransform:'capitalize'
    
      },
      brandCatgory:{
        // paddingHorizontal:15,
        // paddingTop:15,
        borderColor:'gray',
        paddingHorizontal:responsiveWidth(3),
        paddingVertical:12,
        // paddingTop:10,
      },
})