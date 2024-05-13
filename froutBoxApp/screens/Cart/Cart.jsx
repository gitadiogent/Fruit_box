import React,{useEffect,useCallback,useState} from "react";
import { View,RefreshControl, Text, StyleSheet,Image,TouchableOpacity,ScrollView } from "react-native";
import { config } from "../../config";
import { Surface } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCartProductCount,setItemToLocalStorage,getAllCartProducts,removeFromCart, } from "../../Utils/localstorage";
import navigationString from "../../Constants/navigationString";
import imageImport from "../../Constants/imageImport";
import { useFocusEffect } from '@react-navigation/native';
import { UseContextState } from "../../global/GlobalContext";
import CustomLoader from "../../components/Loader";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";



function Cart({navigation}) {
  const [ cartProducts , setCartProducts ] = useState([])
  const [ updateCart , setUpdateCart ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const [ cartItemCount , setCartItemCount ] = useState();
  const [ cartTotalAmount , setCartTotalAmount ] = useState();
  const [ render , setRender ] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const {cartState,authState,fetchAdminDetails,getCartTotal} = UseContextState();

console.log("cartTotalamount",authState.cartTotal)
console.log("cart Products",cartProducts)


  const getAllProducts=async()=>{
    const result =  await getAllCartProducts();
    // console.log("Newresult=>",result)
    if( result != null){
      setCartProducts(result);
    }
    else{
      setCartProducts([]);
    }
    setRefreshing(false)
  }
  const getTotal=async()=>{
        await getCartTotal()
  }

  useFocusEffect(
    useCallback(()=>{
      getAllProducts();
      getTotal()
    },[updateCart,render,navigation,refreshing])
  )
  

  const onRefresh = async()=>{
    setRefreshing(true)
  }
  
  const getItemCount =async ()=>{
    const count = await getCartProductCount();
    // console.log('ITEM FROM Cart=>',count)
     setCartItemCount(count);
  }

 
  useFocusEffect(
    useCallback(()=>{
     getItemCount();
    
  },[updateCart])
  )

  const removeProduct = async(product_id)=>{
    // console.log(product_id)
    const result = await removeFromCart(product_id)
    // console.log(result)
    setUpdateCart(prev =>!prev)
    await cartState()
    setRender(prev=>!prev)
  }

  const increaseQuantity=async(product_id)=>{
    // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts; 
    cartProducts?.map((value,index)=>{
      if(value._id == product_id ){
        // console.log("FIND>>>>")
        updatedCartProduct[index] ={...value,product_quantity:value.product_quantity + 1}
        setCartProducts(updatedCartProduct)
        // console.log(updatedCartProduct,'updated Cart')
      }
    })
     await setItemToLocalStorage('@cartproducts',updatedCartProduct);
     setRender(prev=>!prev)
}
 const decreaseQuantity=async(product_id)=>{
  // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts; 
     cartProducts?.map((value,index)=>{
       if(value._id == product_id ){
        if(value.product_quantity > 1 ){
        // console.log("FIND>>>>")
        updatedCartProduct[index] ={...value,product_quantity:value.product_quantity - 1}
        setCartProducts(updatedCartProduct)
        // console.log(updatedCartProduct,'updated Cart')
      }
     }
    })
    await setItemToLocalStorage('@cartproducts',updatedCartProduct);
    setRender(prev=>!prev)
   
  return;
 }

  const goToCheckout = ()=>{
    fetchAdminDetails()
    navigation.navigate(navigationString.CHECKOUT,{checkoutProducts:cartProducts})
  }

console.log("authState?.adminDetails?.delivery_charges",authState?.adminDetails?.delivery_charges)

  return (
    <View style={styles.cartMainContainer} >
      <Surface  style={styles.cartHeader}>
        <Text style={styles.cartHeadingText} >My Cart</Text>
        <View style={styles.checkoutBtnBox} >
          {cartProducts?.length > 0 ?
         <TouchableOpacity onPress={goToCheckout} activeOpacity={0.8} style={styles.checkoutBtn} >
         <Text style={styles.checkoutText} >
         Checkout
         </Text>
         <MaterialIcons name="arrow-right-alt" size={20} color="white" />
       </TouchableOpacity>
        :
        <TouchableOpacity onPress={()=>navigation.reset({
          index: 0,
          routes: [{ name: navigationString.HOME }],
        })}  activeOpacity={0.8} style={styles.checkoutBtn} >
        {/* <MaterialCommunityIcons name="shopping-outline" size={20} color="white" /> */}
        <Text style={styles.checkoutText} >
        Shop Now
        </Text>
        <MaterialIcons name="arrow-right-alt" size={20} color="white" />
      </TouchableOpacity>

        }
       
    
     </View>
      </Surface>
      <ScrollView 
       refreshControl={
        <RefreshControl   refreshing={refreshing} onRefresh={onRefresh} /> }
      showsVerticalScrollIndicator={false} style={styles.cartListBox} > 
         { cartProducts?.length != 0 && cartProducts?.map((value,index)=>(
          //  <View key={value._id} style={styles.cartItemBox} >
          <View key={value._id} style={ cartProducts?.length != 1  && cartProducts?.length -1 == index  ?
             {...styles.cartItemBox, borderBottomColor:"#fff",
               borderBottomWidth:1 } : {...styles.cartItemBox,}} >
           <View style={{flexDirection:'row'}} >
            <TouchableOpacity onPress={()=>navigation.navigate(navigationString.PRODUCT_INFO,{product_id:value?._id,product_quantity:value?.product_quantity})} activeOpacity={0.7} >
            <View style={{borderWidth:0.6,borderColor:'lightgray',padding:2,borderRadius:10}} >
            <Image 
             source={{uri:value?.product_images[0]?.image_url}}
             style={{width:responsiveWidth(20),height:responsiveHeight(10),borderRadius:8}}
             />
             </View>
            </TouchableOpacity>
               <View style={styles.cartDetails} >
            <TouchableOpacity onPress={()=>navigation.navigate(navigationString.PRODUCT_INFO,{product_id:value?._id,product_quantity:value?.product_quantity})} activeOpacity={0.8} >
            <Text style={styles.productName} >{value.product_name?.slice(0,20)}{value?.product_name?.length > 20 && '...'}</Text>
            </TouchableOpacity>
            
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} >
            <Text style={styles.brandName} >{value.product_main_category}</Text>
  <Text style={styles.discountText}>{Math.round(((value?.product_regular_price - value?.product_sale_price)/value?.product_regular_price)*100)}%OFF</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} >
          {/* { value?.selected_varition[0] && <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}} >
           <Text style={{fontSize:12,fontWeight:'500'}} >Color : </Text>
             <View style={{paddingHorizontal:6,paddingVertical:6,borderRadius:2,backgroundColor:value?.selected_variation[0]}} ></View>
           </View>} */}
            {(value?.selected_variation && value?.selected_variation[0]) &&  <Text style={{fontSize:12,fontWeight:'500'}} >{value?.selected_variation[0]}</Text>}
            {(value?.selected_variation && value?.selected_variation[1]) &&  <Text style={{paddingLeft:6,fontSize:12,fontWeight:'500'}} >{value?.selected_variation[1]}</Text>}
             </View>
             <View style={styles.quantityBox} >
             {/* <AntDesign name="minuscircleo" size={22} color={config.primaryColor} /> */}
             <TouchableOpacity activeOpacity={0.7} onPress={()=>decreaseQuantity(value._id)} >
             <Ionicons style={{backgroundColor:'#f5f5f6',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="remove" size={18} color="#555" />
             </TouchableOpacity>
             <Text style={{fontWeight:'600',fontSize:15,paddingHorizontal:1,width:30,textAlign:'center',paddingVertical:3}}>
             {value.product_quantity ? value.product_quantity : 1}
              </Text>
             <TouchableOpacity activeOpacity={0.7} onPress={()=>increaseQuantity(value._id)} >
             <Ionicons style={{backgroundColor:'#f5f5f6',paddingVertical:6,paddingHorizontal:7,borderRadius:10}} name="add-outline" size={18} color="#555" />
             </TouchableOpacity>
             </View>
           </View>
           </View>
         
           <View style={styles.priceBox} >
            <Text style={{color:'gray',textDecorationLine:'line-through',fontSize:13,fontWeight:'600'}} >₹{value?.product_regular_price}</Text>
            <Text style={{color:config.primaryColor,fontSize:16,fontWeight:'600'}} >₹{value?.product_sale_price}</Text>
            {/* <Text style={{fontSize:12,color:'#555'}} >Remove</Text> */}
          
             </View>
             <TouchableOpacity onPress={()=>removeProduct(value._id)} activeOpacity={0.7} style={styles.removeBox} >
             {/* <AntDesign name="delete" size={12} style={{paddingRight:2,fontWeight:'500'}} color="red" /> */}
             <Text style={{fontSize:12,fontWeight:'500',color:'#dc0000'}} >
               Remove</Text>
           {/* <Text style={{color:config.primaryColor,fontSize:20,fontWeight:'600'}} >₹ {value.productPrice}</Text>  */}
           </TouchableOpacity>
         </View> 
         ))}
        {cartProducts?.length == 0  &&
         <View style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}} >
         <Image 
         source={imageImport.EmptyCart}
         style={{width:230,height:230}}
         />
         <Text style={{fontSize:14,color:config.primaryColor,fontWeight:'600',textAlign:'center',letterSpacing:1}} > Empty Cart </Text>
        </View>
        }
        { cartProducts?.length != 0 && 
        
        <View>

        <View style={styles.cartTotalBox} >
          {authState?.cartTotal 
          ?
          <View>
             <View style={styles.subtotalbox} >
            <Text style={styles.subtotalText} >Subtotal</Text>
            <Text style={styles.subtotalPrice} >₹{authState?.cartTotal}</Text>
          </View>
          <View style={styles.subtotalbox} >
            <Text style={styles.subtotalText} >Delivery & Shipping </Text>
           {authState?.adminDetails?.delivery_charges > 0 && <Text style={styles.subtotalPrice} >{`₹${authState?.adminDetails?.delivery_charges}`}</Text> }
            
            {authState?.adminDetails?.delivery_charges === 0 &&  <Text style={styles.subtotalPrice} >Free</Text> }
           
          </View>
          <View style={styles.totalpayablebox} >
            <Text style={styles.totalpayableText} >Payment Total</Text>
            <Text style={styles.totalpayablePrice} >₹{authState?.adminDetails?.delivery_charges + authState?.cartTotal}</Text>
          </View>
       
      <TouchableOpacity onPress={goToCheckout}  activeOpacity={0.8} style={styles.placeOrderBtn}>
  <Text style={styles.placeOrderBtnText}>Procced To Checkout </Text>
  <MaterialIcons name="arrow-right-alt" size={27} color="white" />
</TouchableOpacity>
          </View>
        :
        <View style={{flex:1,height:'100%',paddingVertical:15,justifyContent:'center',alignItems:'center'}} >
        <CustomLoader />
         </View> 

        }

          {/* <View style={styles.subtotalbox} >
            <Text style={styles.subtotalText} >Subtotal</Text>
            <Text style={styles.subtotalPrice} >₹{authState?.cartTotal}</Text>
          </View>
          <View style={styles.subtotalbox} >
            <Text style={styles.subtotalText} >Delivery & Shipping </Text>
            <Text style={styles.subtotalPrice} >Free</Text>
          </View>
          <View style={styles.totalpayablebox} >
            <Text style={styles.totalpayableText} >Payable Total</Text>
            <Text style={styles.totalpayablePrice} >₹{authState?.cartTotal}</Text>
          </View>
       
      <TouchableOpacity onPress={goToCheckout}  activeOpacity={0.8} style={styles.placeOrderBtn}>
  <Text style={styles.placeOrderBtnText}>Procced To Checkout </Text>
  <MaterialIcons name="arrow-right-alt" size={27} color="white" />
</TouchableOpacity> */}
      </View>
      </View>
        }
         {/* for extra space */}
         <View style={{padding:55}} >

         </View>
      </ScrollView>
     
    </View>
  );
}

export default Cart;

const styles = StyleSheet.create({
  cartMainContainer:{
    flex:1,
  backgroundColor:'white',
  },
  cartHeader: {
    width: "100%",
    paddingTop:10,
    paddingBottom:13,
    paddingHorizontal:20,
    backgroundColor:'white',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  cartHeadingText:{
    fontSize:responsiveFontSize(2.1),
    fontWeight:'600',
    color:config.primaryColor,
  },
  cartListBox:{
    paddingHorizontal:10,
    paddingTop:0
  },
  cartItemBox:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    paddingVertical:16,
    paddingHorizontal:14,
    marginTop:10,
    borderRadius:15,
    position:'relative',
    borderBottomColor:"#f2f2f2",
    borderBottomWidth:1
  },
  discountText:{
    paddingTop:2,
    paddingLeft:5,
    fontSize: 11,
    // textTransform:'capitalize',
     fontWeight: "600",
     letterSpacing:0.4,
     color:'#dc0000' 
  },
  quantityBox:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    marginTop:5
  },
  priceBox:{
    flexDirection:'column',
    alignItems:'flex-end',
  },
  priceText:{
    color:config.primaryColor,
    fontSize:13,
    fontWeight:'600'
  },
  cartDetails:{
    paddingLeft:17
  },
  productName:{
    fontSize:16,
    textTransform:'capitalize',
    fontWeight:'600'
  },
  productId:{
    fontSize:13,
    textTransform:'capitalize',
  },
  brandName:{
    fontSize:13,
    paddingVertical:0,
    textTransform:'capitalize',

  },
  removeBox:{
    position:'absolute',
    bottom:19,
    right:16,
    flexDirection:'row',
    alignItems:'center'
    
  },
  checkoutBtnBox:{
    padding:0,
    // paddingBottom:14,
  },
  checkoutBtn:{
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    // width:'100%',
    alignItems:'center',
    paddingVertical:12,
    paddingHorizontal:20,
    backgroundColor:config.primaryColor,
    // borderRadius:40,
    borderRadius: 16,
    shadowColor:config.primaryColor,
    shadowOffset:{width:50,height:10},
    shadowOpacity:1,
    shadowRadius:30,
    elevation:36
  },
  checkoutText:{
    fontSize:14,
    fontWeight:'600',
    letterSpacing:1.2,
    paddingHorizontal:10,
    color:'white'
  },
  cartTotalBox:{
    marginTop:18,
    borderWidth:1,
    borderRadius:10,
    borderColor:'#f2f2f2',
    paddingHorizontal:16,
    marginHorizontal:12
  },
  subtotalbox:{
    // paddingHorizontal:20,
    paddingVertical:12,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomWidth:0.6,
    borderColor:'#f2f2f2',
},

subtotalText:{
  fontSize:14,
  fontWeight:'500',
  letterSpacing:0.6,
  color:'#1e1e1e'
},
subtotalPrice:{
  fontSize:15,
  fontWeight:'500',
  color:'#767676'

},

totalpayablebox:{
  // paddingHorizontal:20,
  paddingTop:12,
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  // borderBottomWidth:0.6,
  // borderColor:'#f2f2f2',
},
totalpayableText:{
  fontSize:16,
  fontWeight:'600',
  letterSpacing:0.6,
  color:'#1e1e1e'
},
totalpayablePrice:{
  fontSize:18,
  fontWeight:'700',
  color:config.primaryColor

},
  placeOrderBtn: {
    width: '100%',
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 11,
    marginVertical:14,
    backgroundColor: config.primaryColor,
    // borderRadius: 40,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,

  },
  placeOrderBtnText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "white",
  },

});
