import React,{useState} from 'react'
import {View,Text,StyleSheet,ActivityIndicator,ToastAndroid,TextInput,ScrollView,TouchableOpacity} from "react-native"
import { config } from '../../config';
import { Checkbox,Modal, Portal,Provider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import navigationString from '../../Constants/navigationString';
import { useToast } from "react-native-toast-notifications";
import { UseContextState } from '../../global/GlobalContext';

import axios from 'axios';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { setItemToLocalStorage } from '../../Utils/localstorage';


function Register({navigation}) {
    const [checked, setChecked] = useState(true);
    const [ phoneNumber , setPhoneNumber ] = useState('');
    const [ name , setName ] = useState('');
    const [ loading , setLoading ] = useState(false);
    const [ modalVisible , setModalVisible ] = useState(false);
    const {fetchAuthuser} = UseContextState()
    const toast = useToast();
    const goBack = () => {
      navigation.goBack();
    };

    const handleShowToast=()=>{
      toast.show("OTP Sent", {
        type: "success",
      });
    }
    
    const showInvalidErrorToast=(message)=>{
      toast.show(message, {
        type: "danger",
      });
    }

    const handleCreateBtn=async()=>{
      if(!name.length > 0){
       await showInvalidErrorToast('Enter Your Name!!')
        ToastAndroid.showWithGravityAndOffset(
          "Please enter your name!!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50
        );
        return;
      }
      if(phoneNumber.length != 10){
        await showInvalidErrorToast('Invalid Phone Number!!')
        ToastAndroid.showWithGravityAndOffset(
          "Enter a Valid Phone number!!",
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50
        );
        return;
      }
      if(phoneNumber.length >= 10 && name.length > 0 && checked ){
        setLoading(true)
       await axios.get(`${config.BACKEND_URI}/api/app/check/user/exists/${phoneNumber}`,{headers: {
        'Authorization': `token ${config.APP_VALIDATOR}`,
      },withCredentials:true})
        .then(res=>{
          console.log(res?.data)
          if(res?.data?.reach_user_limit){
            setLoading(false);
            return showInvalidErrorToast('Users Limit Reached!!')
          }
          if(!res?.data?.user_exists){
                setLoading(false);
                sendOtpToUser()
            //  navigation.navigate(navigationString.OTP_SCREEN,{user_exists:false,user_name:name,phoneNumber:`+91 ${phoneNumber}`});
          }else{
            setLoading(false);
            setModalVisible(true);
          }
        })
        .catch(err=>{
          console.log(err);
          setLoading(false);
        })
        


      }
      // else{
      //   ToastAndroid.showWithGravityAndOffset(
      //     "Enter a Valid Phone number!!",
      //     ToastAndroid.LONG,
      //     ToastAndroid.CENTER,
      //     25,
      //     50
      //   );
  
      // }
    }


  // send OTP for users
  const sendOtpToUser=async()=>{
    await axios.get(`${config.BACKEND_URI}/api/send/otp/for/app/user/to/number/+91${phoneNumber}`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
     console.log(res?.data);
     if(res?.data?.status == true){
      //  navigation.navigate(navigationString.OTP_SCREEN);
      handleShowToast()
       navigation.navigate(navigationString.OTP_SCREEN,{phoneNumber:phoneNumber,user_name:name,user_exists:false});
    }
    if(res?.data?.status == false){
      showInvalidErrorToast('Something went wrong!!')
    }

    })
    .catch(err=>{
     console.log(err);
    })
  }




  // REGISTER USER FUCNC
//   const registerUser=async()=>{
//     let data = {
//       username:name,
//       phone_number:`+91 ${phoneNumber}`,
//   }
//  await axios.post(`${config.BACKEND_URI}/api/app/create/user`,data,{headers: {
//   'Authorization': `token ${config.APP_VALIDATOR}`,
// },withCredentials:true})
//  .then(res=>{
//   console.log(res?.data);
//   if(res?.data?.status){
//       setItemToLocalStorage('user',res?.data?.user);
//       fetchAuthuser()
//       handleShowToast()
//       // navigation.navigate(navigationString.HOME);
//   }
//  })
//  .catch(err=>{
//   console.log(err);
//  })
//   }


    const goToLogin = ()=>{
      navigation.navigate(navigationString.LOGIN)
    }
  return (
    <Provider>
      <Portal>
     
    <View style={{flex:1,backgroundColor:'#fff'}}  >

       <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:25,paddingTop:15,paddingBottom:10}} >
<MaterialIcons  onPress={goToLogin} name="close" size={24} color={config.primaryColor} />
<Text style={styles.headingText} >Sign Up</Text>
<MaterialIcons style={{opacity:0}} name="keyboard-arrow-left" size={27} color='white' />
</View>
    


   {loading ?
   <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
    <ActivityIndicator size='large' color={config.primaryColor} />
   </View>
    :
    <View style={styles.registerContainer}  >
     
    {/* <Text style={{color:config.primaryColor,paddingVertical:10,fontSize:30,fontWeight:'600'}} >LOGO</Text> */}
      <Text style={styles.registerHeading} >
     Create New Account
      </Text>
     <View style={styles.commonFieldMainBox} >
     <View style={styles.commonFieldContainer} >
      <TextInput  
      value={name}
      onChangeText={(value)=>setName(value.replace(/[^a-zA-Z ]/g,''))}
      maxLength={20}
       style={styles.commonField} placeholder='Full Name' />
        <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20}  />
      </View>
      {/* <View style={styles.commonFieldContainer} >
      <TextInput   style={styles.commonField} placeholder='Business Name' />
        <MaterialIcons style={styles.commonIcon} name="business-center" size={20} />
      </View> */}
      <View style={styles.phoneFieldContainer} >
      <TextInput
         maxLength={10}
        keyboardType="numeric"
        style={styles.phoneField}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(value)=>setPhoneNumber(value.replace(/[^0-9]/g,''))}
      />
      <View style={styles.indiaIcon} >
        <Text style={styles.nineOneText}  >🇮🇳  + 9 1</Text>
      </View>
      </View>
      {/* <View style={styles.commonFieldContainer} >
      <TextInput 
        value={email}
        onChangeText={(value)=>setEmail(value)}
        style={styles.commonField} placeholder='Email (Optional)' />
        <MaterialIcons style={styles.commonIcon} name="email" size={20}  />
      </View> */}
    
      {/* <View style={styles.commonFieldContainer} >
      <TextInput   style={styles.commonField} placeholder='Gst In' />
        <FontAwesome5 style={{...styles.commonIcon,bottom:15}} name="money-check" size={15}  />
      </View> */}
    
{/* address ,state, pincode */}
      {/* <View style={styles.commonFieldContainer} >
      <TextInput keyboardType='numeric'  style={styles.commonField} placeholder='Address' />
        <FontAwesome name="address-card" size={21} style={styles.commonIcon}  />
      </View>
      <View style={styles.commonFieldContainer} >
      <TextInput keyboardType='numeric'  style={styles.commonField} placeholder='State' />
        <FontAwesome5 name="globe" size={20} style={styles.commonIcon}  />
      </View>
      <View style={styles.commonFieldContainer} >
      <TextInput keyboardType='numeric'  style={styles.commonField} placeholder='Pincode' />
      <Entypo name="location-pin" size={26}  style={styles.commonIcon} />
      </View> */}
{/* address ,state, pincode */}

     </View>
   <View style={styles.termsAndCondition} >
   <Checkbox
     color={config.primaryColor}
    status={checked ? 'checked' : 'unchecked'}
    onPress={() => {
      setChecked(!checked);
    }}
  />
  <Text style={{fontSize:12}} >Accept Terms & Conditions</Text>
   </View>
     
    <TouchableOpacity
    onPress={handleCreateBtn}
     activeOpacity={0.8} style={styles.signUpBtn} >
      <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
      <Text style={styles.signInText} >
       Create Account
      </Text>
    </TouchableOpacity>
    <Text style={styles.orText} >or</Text>
    <View style={styles.dontHaveAccountBox} >
      <Text style={{color:'gray'}} >Already have an account? </Text>
      <Text onPress={goToLogin} style={{color:config.primaryColor,fontWeight:'600'}} >Sign in </Text>
    </View>
      </View>
  }
        </View>
        <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
         <View>
         <Text style={{fontSize:16,fontWeight:'700',color:'#222',textAlign:'center'}} > User Already Exists </Text>
           <View  >
           <View style={{paddingTop:8,paddingBottom:13}} >
           <Text style={{textAlign:'center',color:'gray'}} > Phone number you entered</Text>
           <Text style={{textAlign:'center',color:'gray'}}  >is already registered</Text>
           </View>
          <TouchableOpacity activeOpacity={0.5} onPress={()=>setModalVisible(false)} >
            <View style={{paddingTop:6,borderTopColor:'#f2f2f2',borderTopWidth:1}} >
              <Text style={{color:config.primaryColor,textAlign:'center',fontSize:14,fontWeight:'700'}} >OK</Text>
            </View>
            </TouchableOpacity>
           </View>
         </View>
        </Modal>
        </Portal>
    </Provider>
   
  )
}

export default Register

const styles = StyleSheet.create({
  registerContainer:{
    flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'white',
      paddingHorizontal:30,
  },
  containerStyle:{
    backgroundColor: 'white',
  paddingTop: 15,
  paddingBottom:12,
  marginHorizontal:80,
  borderRadius:10,
zIndex:2
},
   
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 95,
    paddingVertical:60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  headingText:{
    color:config.primaryColor,
    fontSize:17,
    letterSpacing:1,
    fontWeight:'500',
  },
  registerHeading:{
    fontSize:responsiveFontSize(2.1),
    fontWeight:'600'
  },
  commonFieldMainBox:{
    marginTop:12,
    width:'100%'
  },
  phoneFieldContainer:{
    position:'relative',
    width:'100%'
  },
  indiaIcon:{
    position:'absolute',
    bottom:14,
    left:15
  },
  nineOneText:{
    fontSize:14,
  },
  phoneField:{
    width:'100%',
    marginTop:15,
    // paddingLeft:responsiveWidth(19),
    // paddingVertical:responsiveWidth(2),
    paddingHorizontal: 79,
    paddingVertical: 9,
    fontSize:15,
    backgroundColor:'#f5f5f6',
    // letterSpacing:1.5,
     borderRadius: 16,
    borderWidth:0.5,
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
    fontSize:15,
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
  signUpBtn:{
    flexDirection:'row',
    justifyContent:'center',
    width:'100%',
    marginTop:10,
    alignItems:'center',
    paddingVertical:12,
    paddingHorizontal:10,
    backgroundColor:config.primaryColor,
    borderRadius: 16,
    shadowColor:config.primaryColor,
    shadowOffset:{width:0,height:1},
    shadowOpacity:1,
    shadowRadius:90,
    elevation:9
  },
  signInText:{
    fontSize:responsiveFontSize(1.9),
    fontWeight:'600',
    letterSpacing:1,
    color:'white'
  },
  orText:{
    marginVertical:20,
    color:'gray'
  },
  dontHaveAccountBox:{
    flexDirection:'row',
    // marginTop:10,
  },
  termsAndCondition:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    width:'100%',
    marginTop:10
}
})