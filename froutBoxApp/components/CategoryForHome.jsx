import {Text,View,Image,TouchableOpacity,StyleSheet} from "react-native"
import { config } from "../config"
import React from 'react'

const CategoryForHome = ({itemImage,itemName,navigation,subCategoryInfo}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={goToSearchResult} style={styles.brandCatgory} >
    <View style={styles.brandBox} >
        <Image
style={{width:200,height:200,borderRadius:10}}
source={{
 uri:itemImage}}/>
{/* <Text style={styles.brandName}> {itemName?.slice(0,10)}</Text> */}
<Text style={styles.brandName}> {itemName}</Text>
</View>
</TouchableOpacity>
  )
}

export default CategoryForHome

const styles= StyleSheet.create({
    brandBox:{
        alignItems:'center',
        borderWidth:1,
        borderColor:'#f2f2f2',
        borderRadius:10,
        padding:5,
 
       
      },
      brandName:{
        paddingTop:5,
        paddingBottom:2,
        fontSize:16,
        letterSpacing:1.6,
        color:config.primaryColor,
        fontWeight:'500',
        textTransform:'capitalize'
    
      },
      brandCatgory:{
        paddingHorizontal:15,
       
        paddingTop:15,

        
      },
})