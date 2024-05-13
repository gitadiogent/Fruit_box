import React,{useState,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import { config } from "../../config";
import { Checkbox } from 'react-native-paper';
// import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage,setItemToLocalStorage } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UseContextState } from "../../global/GlobalContext";
import imageImport from "../../Constants/imageImport";
import { useToast } from "react-native-toast-notifications";


function EditCheckoutDetail({ route,navigation }) {
    const [ loading , setLoading ] = useState(false)
    const [ formError , setFormError ] = useState('')
    const {authState,fetchAuthuser} = UseContextState();
    const toast = useToast();

       
    const showErrorToast=(message)=>{
      toast.show(message, {
        type: "danger",
      });
    }
    const showSuccessToast=(message)=>{
      toast.show("Changes Saved !!", {
        type: "success",
      });
    }
    // console.log(authState,"authState")
    const [ editUserDetails , setEditUserDetails ] = useState({
        customer_id:authState?.user?.user_id,
        username:'',
        customer_phone_number:'',
        email:'',
        customer_business:'',
        gst_number:'',
        products: [],
        address:'',
        state:'',
        pincode:'',
        transport_detail:''
    })


    useFocusEffect(
        useCallback(()=>{
            axios.get(`${config.BACKEND_URI}/api/app/get/user/checkout/detail/by/userid/${authState?.user?.user_id}`,{headers: {
              'Authorization': `token ${config.APP_VALIDATOR}`,
            },withCredentials:true})
            .then(res=>{
                console.log("RESPONSE=>",res?.data);
                setEditUserDetails((prev)=>({...prev,
                    email:res?.data?.user?.shipping_address?.email,
                    username:res?.data?.user?.shipping_address?.name,
                    customer_phone_number:res?.data?.user?.shipping_address?.phone_number ? `${res?.data?.user?.shipping_address?.phone_number}` : '',
                    address:res?.data?.user?.shipping_address?.address,
                    state:res?.data?.user?.shipping_address?.state,
                    pincode:res?.data?.user?.shipping_address?.pincode ?  `${res?.data?.user?.shipping_address?.pincode}` : '',
                    transport_detail:`${res?.data?.user?.shipping_address?.transport_detail}`,
                }))
            })
            .catch(err=>{
                console.log(err);
            })
        },[])
    )
   

 
    const goBack = () => {
        navigation.goBack();
      };
      // console.log("checkout-> ",editUserDetails)

      const handleChange=(form,name)=>{
        // setEditUserDetails(value => ({
        //     ...value,
        //     [name]: form
        //   }))
        if(name == 'username'){
            setEditUserDetails(value => ({
                ...value,
                username: form.replace(/[^a-zA-Z ]/g,'')
              }))
        }
        if(name == 'customer_phone_number'){
            setEditUserDetails(value => ({
                ...value,
                customer_phone_number: form.replace(/[^0-9]/g,'')
              }))
        }
        if(name == 'pincode'){
            setEditUserDetails(value => ({
                ...value,
                pincode: form.replace(/[^0-9]/g,'')
              }))
        }
        if(name == 'email'){
            setEditUserDetails(value => ({
                ...value,
                email: form
              }))
        }
        // if(name == 'gst_number'){
        //     setEditUserDetails(value => ({
        //         ...value,
        //         gst_number: form
        //       }))
        // }
        if(name == 'address'){
            setEditUserDetails(value => ({
                ...value,
                address: form
              }))
        }
        if(name == 'state'){
            setEditUserDetails(value => ({
                ...value,
                state: form
              }))
        }
        if(name == 'transport_detail'){
          setEditUserDetails(value => ({
              ...value,
              transport_detail: form
            }))
      }
        
      }

      // HANDLE ADDRESS FORM DETAILS
      const handleFormDetail=async()=>{
        // console.log("HANDLE CHNAGE ADDRESS CALLED")
        if(editUserDetails?.username == ''){
          // console.log("HANDLE CHNAGE ADDRESS CALLED")
          setFormError('Please Enter Your Name')
          await showErrorToast('Please Enter Your Name')
           return
          
        }
        if(editUserDetails?.customer_phone_number == ''){
          setFormError('Please Enter Your Phone Number')
          await showErrorToast('Please Enter Your Phone Number')
           return
        }    
        if(editUserDetails?.address == ''){
          setFormError('Please Enter Your Address')
          await showErrorToast('Please Enter Your Address')
           return
        }
        if(editUserDetails?.pincode == ''){
          setFormError('Please Enter Your Pincode')
          await showErrorToast('Please Enter Your Pincode')
           return
          
        }
        if(editUserDetails?.state == ''){
          setFormError('Please Enter Your State')
          await showErrorToast('Please Enter Your State')
          return
          
        }
      }


    //   handle check out 
      const handleEditUser = async(userid)=>{
        // console.log("HANDLE CHNAGE ADDRESS CALLED")
         await handleFormDetail()
            
            if(editUserDetails?.username != '' && editUserDetails?.customer_phone_number != ''
             && editUserDetails?.address != '' && editUserDetails?.pincode && editUserDetails?.state != ''){
              setLoading(true)
           await axios.patch(`${config.BACKEND_URI}/api/app/edit/user/shipping/address/${userid}`,editUserDetails,{headers: {
            'Authorization': `token ${config.APP_VALIDATOR}`,
          },withCredentials:true})
            .then(async res=>{
                console.log(res?.data);
                showSuccessToast()
                  navigation.goBack()

                setLoading(false)
                setEditUserDetails({
                   username:'',
                   customer_phone_number:'',
                   email:'',
                   gst_number:'',
                   address:'',
                   state:'',
                   pincode:'',
                   transport_detail:''
                })

            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
            })
          }
       
      }


  return (
    <View style={styles.screenContainer}>
{/* <StatusBar backgroundColor="#fff" /> */}
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingTop:10,paddingBottom:10}} >
<MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
<Text style={styles.headingText} >Edit Other Address</Text>
<MaterialIcons style={{opacity:0}}  name="keyboard-arrow-left" size={27} color='white' />
</View>
<ScrollView showsVerticalScrollIndicator={false}
>
{ loading && <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
    <ActivityIndicator color={config.primaryColor} size='large' />
    </View> 
    }

<View style={styles.commonFieldMainBox} >
<View style={{...styles.commonFieldContainer , marginTop:-10}} >
<TextInput  onChangeText={value=>handleChange(value,'username')} value={editUserDetails?.username} keyboardType={'default'} style={styles.commonField} placeholder='Full Name' />
  <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20}  />
</View>
<View style={styles.phoneFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'customer_phone_number')} value={editUserDetails?.customer_phone_number} maxLength={10} keyboardType='numeric'  style={styles.phoneField} placeholder='Phone Number*' />
{/* <Text style={styles.phoneField} >{editUserDetails?.customer_phone_number}</Text> */}
<View style={styles.indiaIcon} >
  <Text style={styles.nineOneText}  >🇮🇳  + 9 1</Text>
</View>
</View>
{/* <View style={styles.commonFieldContainer} >
<TextInput  onChangeText={value=>handleChange(value,'customer_business')} value={editUserDetails?.customer_business}  style={styles.commonField} placeholder='Business Name*' />
  <MaterialIcons style={styles.commonIcon} name="business-center" size={20} />
</View> */}
<View style={styles.commonFieldContainer} >
<TextInput  onChangeText={value=>handleChange(value,'email')} value={editUserDetails?.email} textContentType='emailAddress'  style={{...styles.commonField,paddingRight:16,textTransform:'lowercase' }} placeholder='Email Address ' />
  <MaterialIcons style={styles.commonIcon} name="email" size={20}  />
</View>
{/* <View style={styles.commonFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'gst_number')} value={editUserDetails?.gst_number}  style={{...styles.commonField}} placeholder='Gst In ' />
  <FontAwesome5 style={{...styles.commonIcon,bottom:15}} name="money-check" size={15}  />
</View> */}

{/* address ,state, pincode */}
<View style={styles.commonFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'address')} value={editUserDetails?.address} keyboardType='default'  style={styles.commonField} placeholder='Address' />
  <FontAwesome name="address-card" size={21} style={styles.commonIcon}  />
</View>
<View style={styles.commonFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'state')} value={editUserDetails?.state} keyboardType='default'  style={styles.commonField} placeholder='State' />
  <FontAwesome5 name="globe" size={20} style={styles.commonIcon}  />
</View>
<View style={styles.commonFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'pincode')} value={editUserDetails?.pincode} keyboardType='numeric' maxLength={6}  style={styles.commonField} placeholder='Pincode' />
<Entypo name="location-pin" size={26}  style={styles.commonIcon} />
</View>
{/* <View style={styles.commonFieldContainer} >
<TextInput onChangeText={value=>handleChange(value,'transport_detail')} value={editUserDetails?.transport_detail} keyboardType='default'  style={styles.commonField} placeholder='Transport Details' />
<MaterialCommunityIcons name="truck-minus" size={25}  style={styles.commonIcon} />
</View> */}

{/* address ,state, pincode */}
<TouchableOpacity onPress={()=>handleEditUser(authState?.user?._id)} activeOpacity={0.8} style={styles.checkoutBtn}>
<MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
<Text style={styles.checkouttext}>Save Changes </Text>
</TouchableOpacity>

</View>

{/* for extra spacing */}
<View style={{paddingBottom:20}} ></View>
{/* for extra spacing */}
</ScrollView>



</View>
   
  );
}

export default EditCheckoutDetail;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,    
  },
  headingText:{
    color:config.primaryColor,
    fontSize:17,
    letterSpacing:1,
    fontWeight:'600',
  },
  commonFieldMainBox:{
    marginTop:12,
    width:'100%',
    paddingHorizontal:20,
  },
  phoneFieldContainer:{
    position:'relative',
    width:'100%'
  },
  indiaIcon:{
    position:'absolute',
    bottom:15.5,
    left:15
  },
  nineOneText:{
    fontSize:14,
    // color:'gray',

  },
  phoneField:{
    width:'100%',
    marginTop:15,
    paddingHorizontal:79,
    paddingVertical:10,
    fontSize:14,
    backgroundColor:'#f5f5f6',
    // letterSpacing:1.5,
     borderRadius: 16,
    borderWidth:0.5,
    // color:'#555',
    borderColor:'lightgray'

  },
  commonFieldContainer:{
    position:'relative',
    width:'100%'
  },
  commonField:{
    width:'100%',
    marginTop:15,
    paddingHorizontal:45,
    paddingVertical:9,
    fontSize:14,
    // textTransform:'capitalize',
    backgroundColor:'#f5f5f6',
    // letterSpacing:1.5,
     borderRadius: 16,
    borderWidth:0.5,
    borderColor:'lightgray'
  },
  commonIcon:{
    position:'absolute',
    bottom:12,
    left:15,
    color:'#555'
  },

  checkouttext:{
    fontSize:15,
    fontWeight:'600',
    letterSpacing:1.5,
    color:'white'
  },
  checkoutBtn: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  
  }
});
