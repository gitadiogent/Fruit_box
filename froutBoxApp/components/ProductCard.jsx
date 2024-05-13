import React,{useEffect,useCallback,useState} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet,Image ,Text, TouchableOpacity } from "react-native";
import { config } from "../config";
import Entypo from 'react-native-vector-icons/Entypo';
import imageImport from "../Constants/imageImport";
import navigationString from "../Constants/navigationString";
import { UseContextState } from "../global/GlobalContext";
import { getCartProductCount,clearLocalStorage,findProductInCart,addToCart } from "../Utils/localstorage";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

function ProductCard({item,product_name,product_id,product_images,product_code,product_main_category,product_category,product_subcategory,new_arrival,trending_product,product_variant,product_sale_price,product_regular_price,navigation}) {
  const [ viewCart , setViewCart] = useState(false);
  const [ updateCart , setUpdateCart] = useState(false);
  const {authState,cartState} = UseContextState();

  const checkProductInCart=async(product_id)=>{
    const result =  await findProductInCart(product_id);
    console.log("result=>",result)
    setViewCart(result);
  }
  useFocusEffect(
    useCallback(()=>{
     checkProductInCart(product_id)
    },[product_id,viewCart])
   )
  // useEffect(()=>{
  //   checkProductInCart(product_id);
  // },[product_id,viewCart]);

  
  // const getItemCount =async ()=>{
  //   const count = await getCartProductCount();
  //   // console.log('ITEM FROM Cart=>',count)
  //    setCartItemCount(count);
  // }
  // useEffect(()=>{
  //    getItemCount();
  // },[updateCart]);

 

  const addToCartButton = async (product)=>{
    await addToCart(product);
    console.log('PRODUCT ADDED TO Cart')
    // setUpdateCart(prev=>!prev)
    await cartState()
    setViewCart(true)
    // await clearLocalStorage()
  }

  const goToProductInfoScreen=(productId)=>{
    navigation.navigate(navigationString.PRODUCT_INFO,{product_id:productId})
  }
  return (
    <View>
      <View style={styles.productBox}  >
      <View style={{position:'absolute',zIndex:99,flexDirection:'row'}} >
       {new_arrival &&  <View ><Text style={styles.newArrivals} >New</Text></View>}
        {trending_product && <View ><Text style={styles.trendingProduct} >Trending</Text></View>}
      </View>
      <TouchableOpacity activeOpacity={0.6}  onPress={()=>goToProductInfoScreen(product_id)} >
        {/* ========== NEW ARRIVALS & TRENIDNG PRODUCTS TAG */}
        {/* { new_arrival == true && <View style={{position:'absolute'}} >
          <Image style={{width:40,height:40,left:103,top:-20}} source={imageImport.ProductNewArrivals} />
        </View>}
        { trending_product == true && <View style={{position:'absolute'}} >
          <Image style={{width:26,height:26,left:109,top:-12}} source={imageImport.TrendingProducts} />
        </View>} */}
        
        {/* ========== NEW ARRIVALS & TRENIDNG PRODUCTS TAG */}
        
        {/* <Text style={styles.brandName}>{product_category}</Text> */}
        {/* <Text style={styles.productName} >{product_name} </Text> */}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} style={styles.imageBox} onPress={()=>goToProductInfoScreen(product_id)} >
        {product_images[0]?.image_url  
        ?
        <Image
        style={{width:responsiveWidth(40),height:responsiveWidth(40),borderRadius:14 }}
        source={{uri:product_images[0]?.image_url }}
      // resizeMode='stretch'
      />
        :

        <Image
        style={{width:responsiveWidth(40),height:responsiveWidth(21),borderRadius:4 }}
        source={imageImport.noProductImage}
      // resizeMode='stretch'
      />
        
        }
         
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}  onPress={()=>goToProductInfoScreen(product_id)} >

        <Text style={styles.discountText}>{Math.round(((product_regular_price - product_sale_price)/product_regular_price)*100)}%OFF</Text>
        <Text style={styles.productName} >{product_name?.slice(0,15)}{product_name?.length > 15 &&'...'} </Text>
        <Text style={styles.brandName}>{product_category.slice(0,15)}{product_name?.length > 15 &&'...'}</Text>
      <View style={{flexDirection:'row',paddingTop:1,alignItems:'center'}} >
          <Text style={{color:'gray',textDecorationLine:'line-through',paddingRight:5,paddingLeft:2,fontSize:12,fontWeight:'500'}} >₹{product_regular_price}</Text>
          <Text style={{color:config.primaryColor,fontSize:16,paddingLeft:1,paddingRight:6,fontWeight:'600'}} >₹{product_sale_price}</Text>
          </View>
        </TouchableOpacity>
      {/* <TouchableOpacity style={styles.quantityMainBox} activeOpacity={0.7} >
      <View style={styles.cartDetails} >
             <View style={styles.quantityBox} >
             <TouchableOpacity activeOpacity={0.7} onPress={()=>decreaseQuantity(product_id)} >
             <Ionicons style={{backgroundColor:'#f5f5f5',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="remove" size={18} color="#555" />
             </TouchableOpacity>
             <Text style={{fontWeight:'600',fontSize:15,paddingHorizontal:1,width:30,textAlign:'center',paddingVertical:3}}>
             
             1
              </Text>
             <TouchableOpacity activeOpacity={0.7} onPress={()=>increaseQuantity(product_id)} >
             <Ionicons style={{backgroundColor:'#f5f5f5',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="md-add" size={18} color="#555" />
             </TouchableOpacity>
             </View>
           </View>
        </TouchableOpacity> */}
          <TouchableOpacity 
       onPress={()=>goToProductInfoScreen(product_id)}
         activeOpacity={0.6} style={styles.addToCart}>
          <Entypo name="plus" size={21} color="white" />
        </TouchableOpacity>
        {/* {viewCart
        ?
        <TouchableOpacity 
        onPress={()=>navigation.navigate(navigationString.CART)}
         activeOpacity={0.6} style={styles.addToCart}>
    <Feather name="check-circle" size={21} color="white" />
         
        </TouchableOpacity>
        :
        <TouchableOpacity 
        onPress={()=>addToCartButton({product_name,_id:product_id,
          product_quantity:1,
          product_images,
          product_code,
          product_main_category,
          product_subcategory,
          product_variant,
          product_category,
          product_regular_price,
          product_sale_price
        
        })}
         activeOpacity={0.6} style={styles.addToCart}>
          <Entypo name="plus" size={21} color="white" />
        </TouchableOpacity>
        }
       */}
      </View>
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  productBox: {
    // backgroundColor: "#f9f9f9", //#f2f2f2
    backgroundColor: "#fff", //#f2f2f2
    borderWidth:1,
    borderColor:'#f2f2f2',
    width: responsiveWidth(45),
    height: responsiveWidth(68),
    borderRadius: responsiveWidth(5),
    marginHorizontal: responsiveWidth(1.5),
    marginVertical: responsiveWidth(1),
    padding: 8,
    overflow: "hidden",
  },
  imageBox: {
    marginTop:0,
    alignItems: "center",
    // justifyContent: "center",
     borderRadius:responsiveWidth(3),
  },
  brandName:{
    fontSize: responsiveFontSize(1.3),
    paddingLeft:2,
    textTransform:'capitalize',
     fontWeight: "600",
     letterSpacing:0.4,
     color:'gray' 
  },
  discountText:{
    // position:'absolute',
    paddingTop:8,
    // top:-20,
    fontSize: 11,
    paddingLeft:2,
    // textTransform:'capitalize',
     fontWeight: "600",
     letterSpacing:0.4,
     color:'#dc0000' 
  },
  productName:{
    paddingTop:1,
    paddingLeft:2,
    textTransform:'capitalize',
    fontSize:responsiveFontSize(1.8),
    letterSpacing:0.4,
    fontWeight:'500',
    color:'#222'
  },
  quantityMainBox:{
    position: "absolute",
    flexDirection:'row',
    alignItems:'center',
    bottom:9,
    left:10
  },
  priceText:{
   
    fontSize:responsiveFontSize(6),
    fontWeight:'500',
    color:'#555',
  },
  quantityBox:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    marginTop:5
  },
  addToCart: {
    flexDirection:'row',
    position: "absolute",
    bottom: 0,
    padding: 13,
    right: 0,
    backgroundColor: config.primaryColor,
    borderTopLeftRadius: 10,
  },
  newArrivals:{
    position:'relative',
    width:responsiveWidth(11),
    textAlign:'center',
    letterSpacing:0.6,
    padding:2,
    fontWeight:'600',
    fontSize:responsiveFontSize(1.2),
    color:'white',
    backgroundColor:'red',
    top:8,
    left:9,
    borderTopLeftRadius:10,
    borderBottomRightRadius:10,
  },
  trendingProduct:{
    position:'relative',
    width:responsiveWidth(15),
    textAlign:'center',
    letterSpacing:0.2,
    paddingVertical:2,
    fontWeight:'600',
    fontSize:responsiveFontSize(1.2),
    color:'white',
    marginLeft:5,
    backgroundColor:'orange',
    top:8,
    left:4,
    borderTopLeftRadius:10,
    borderBottomRightRadius:10,
  }
});
