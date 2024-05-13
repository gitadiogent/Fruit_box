import React,{useState,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Button,
  ToastAndroid,
} from "react-native";
import { config } from "../../config";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage, setItemToLocalStorage } from "../../Utils/localstorage";
import { useToast } from "react-native-toast-notifications";
import { UseContextState } from "../../global/GlobalContext";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import imageImport from "../../Constants/imageImport";

function Otp({route,navigation}) {
    const {phoneNumber,user_name,user_exists} = route.params;
    const [ loading , setLoading ] = useState(false);
    const [ verifyOtpLoading , setVerifyOtpLoading ] = useState(false);
    const [ autoverifyingLoading , setAutoverifyingLoading ] = useState(false);
    const [ resend , setResend ] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [otp, setOtp] = useState('');
    const [code, setCode] = useState('');
    const [ getUserID , setGetUserID ] = useState('')
    const [ userId , setUserId ] = useState('');
    const [ timer , setTimer ] = useState(25);
    const {authState,fetchAuthuser} = UseContextState();
    const toast = useToast();
    // let phoneNumber = '919800980098'
    const goBack = () => {
        navigation.goBack();
      };

      const handleShowToast=()=>{
        toast.show("Login Successfully", {
          type: "success",
        });
      }
      
      const showInvalidErrorToast=()=>{
        toast.show("Invalid OTP", {
          type: "danger",
        });
      }
      const handleEmptyOtpBtnClick=()=>{
        toast.show("Enter a Valid OTP", {
          type: "danger",
        });
      }
      


      // function showAutoVerifyingScreen(){
      //   setAutoverifyingLoading(true)
      //   setTimeout(()=>{
      //     setAutoverifyingLoading(false)
    
      //   },25000)
      //  }
    
      //  useEffect(()=>{
      //   showAutoVerifyingScreen()
      //  },[])
    
    
       useEffect(() => {
        let interval = setInterval(() => {
          setTimer(lastTimerCount => {
              lastTimerCount <= 1 && clearInterval(interval)
              return lastTimerCount - 1
          })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => {clearInterval(interval);setTimer(30)}
      }, []);
    
  
    const resendOtp = async()=>{
        console.log("Resend otp")
        setCode('')
        setLoading(true)
        setInterval(()=>{
          setLoading(false)
        },3000)
        setResend(prev=>!prev)
      }

  const confirmCode=async()=>{
    if(code?.length < 4 ){
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Otp !!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    } 
    setVerifyOtpLoading(true)
    await axios.post(`${config.BACKEND_URI}/api/v1/verify/adiogent/user/otp`,{phone_number:`+91${phoneNumber}`,otp:code},{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(async(res)=>{
      console.log("res?.data OTP VERIFY--",res?.data)
      if(res?.data?.status === false){
        showInvalidErrorToast()
        setCode('')
        setVerifyOtpLoading(false)

      }
      if(res?.data?.status === true){
        if(user_exists){
          console.log("LOGIN CALLED")
          await loginUser();
          setVerifyOtpLoading(false)
          return;
        }
        if(!user_exists){
          console.log("SIGN UP CALLED")
          await registerUser();
          setVerifyOtpLoading(false)
        return;
        }
      }


    }).catch(err=>{
      console.log(err)
      showInvalidErrorToast()
      setVerifyOtpLoading(false)
    })
    try {
      // if(user_exists){
      //   console.log("LOGIN CALLED")
      //   await loginUser();
      //   setVerifyOtpLoading(false)
      //   return;
      // }
      // if(!user_exists){
      //   console.log("SIGN UP CALLED")
      //   await registerUser();
      //   setVerifyOtpLoading(false)
      // return;
      // }

    } catch (error) {
        console.log(error)
        setVerifyOtpLoading(false)
        // alert('Invalid code.');
        showInvalidErrorToast()
    }
  }

  // LOGIN USER FUNC  
  const loginUser=async()=>{
    await axios.get(`${config.BACKEND_URI}/api/app/login/user/+91 ${phoneNumber}`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
     console.log(res?.data);
     if(res?.data?.status){
         setItemToLocalStorage('user',res?.data?.user);
         fetchAuthuser();
         handleShowToast()
        //  navigation.navigate(navigationString.HOME);
     }
    })
    .catch(err=>{
     console.log(err);
    })
  }

  // REGISTER USER FUCNC
  const registerUser=async()=>{
    let data = {
      username:user_name,
      phone_number:`+91 ${phoneNumber}`,
  }
 await axios.post(`${config.BACKEND_URI}/api/app/create/user`,data,{headers: {
  'Authorization': `token ${config.APP_VALIDATOR}`,
},withCredentials:true})
 .then(res=>{
  console.log(res?.data);
  if(res?.data?.status){
      setItemToLocalStorage('user',res?.data?.user);
      setUserId('')
      fetchAuthuser()
      handleShowToast()
      // setVerifyOtpLoading(false)
      // navigation.navigate(navigationString.HOME);
  }
 })
 .catch(err=>{
  console.log(err);
 })
  }



  return (
    <View style={styles.screenContainer}>
    { loading && <View style={{position:'absolute',top:'0%',bottom:'0%',left:'0%',right:'0%',zIndex:2,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)',padding:14,borderRadius:8}} >
   <View style={{paddingTop:190}} >
   <ActivityIndicator color={config.primaryColor} size='large' />
    <Text  >Resending otp...</Text>
   </View>
    </View> 
    }

{ verifyOtpLoading && <View style={{position:'absolute',top:'0%',bottom:'0%',left:'0%',right:'0%',zIndex:2,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)',padding:14,borderRadius:8}} >
   <View style={{paddingTop:0}} >
   <ActivityIndicator color={config.primaryColor} size='large' />
    <Text  >Verifying otp...</Text>
   </View>
    </View> 
    }
{/* <StatusBar backgroundColor="#fff" /> */}

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingTop:12}} >
<MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
<Text style={styles.headingText} >Verify</Text>
<MaterialIcons style={{opacity:0}} name="keyboard-arrow-left" size={27} color='white' />
</View>
<View style={{flex:1,
    // alignItems: "center",
    justifyContent: "center"}}
>
  {/* <Image source={imageImport?.otpScreenLogo} style={{width:responsiveWidth(20),height:responsiveWidth(20)}} /> */}

<View style={{paddingHorizontal:20}} >
      {/* <Text style={styles.codeText} >Enter the verification code we have sent to your phone number +91{phoneNumber}</Text> */}
      <Text style={styles.codeText} >OTP has been sent to  +91{phoneNumber}</Text>

 


<View>

<View style={styles.commonFieldContainer} >
<TextInput 
value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g,''))}
 autoFocus 
 maxLength={4}
 keyboardType='number-pad'
 style={styles.commonField} placeholder='Enter Your Otp*' />
  <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
</View>
      {/* <View style={styles.otpResend}>
        <Text style={{ color: "gray" }}>Can't received? </Text>
        <Text onPress={resendOtp} style={{ color: config.primaryColor, fontWeight: "600" }}>
        Resend OTP
        </Text>
      </View> */}
      {code?.length > 3 
      
      ?
      <TouchableOpacity onPress={()=>confirmCode()} activeOpacity={0.8} style={styles.verifySignUpBtn}>
      <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
      <Text style={styles.signInText}>Verify and Sign In </Text>
    </TouchableOpacity>
      :
      <TouchableOpacity onPress={handleEmptyOtpBtnClick} activeOpacity={0.8} style={styles.verifySignUpBtn}>
       <MaterialCommunityIcons style={{paddingRight:4}} name="checkbox-marked-circle-outline" size={24} color="white" />
      <Text style={styles.signInText}>Verify and Sign In </Text>
    </TouchableOpacity>
    }
     
</View>

      {/* <TouchableOpacity onPress={()=>confirmCode()} activeOpacity={0.8} style={styles.verifySignUpBtn}>
        <Text style={styles.signInText}>Verify and Sign In </Text>
      </TouchableOpacity> */}
   </View>
{/* for extra spacing */}
<View style={{paddingBottom:20}} ></View>
{/* for extra spacing */}
</View>
</View>




   
  )
}

export default Otp

const styles = StyleSheet.create({
    verifySignUpBtn: {
        width: "100%",
        marginTop: 20,
        flexDirection:'row',
        justifyContent:'center',
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: config.primaryColor,
        borderRadius: 16,
        shadowColor: config.primaryColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 90,
        elevation: 9,
      },
    verifySignUpDisableBtn: {
        width: "100%",
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
        borderColor:'lightgray',
        borderWidth:0.5,
        borderRadius: 16,
        shadowColor: '#f2f2f2',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 90,
        elevation: 9,
      },
      verifySignInDisableText: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 1,
        color: "lightgray",
      },
      commonFieldContainer:{
        position:'relative',
        width:'100%'
      },
      commonField:{
        width:'100%',
        marginTop:15,
        paddingHorizontal:10,
        paddingVertical:9,
        fontSize:14,
        // textTransform:'capitalize',
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
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
    
      signInText: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 1,
        color: "white",
      },
      codeText:{
        // marginTop:15,
        fontSize:15,
        fontWeight:'400',
        color:'gray',
        textAlign:'center',
        paddingVertical:10,
        lineHeight:21
      },
    otpField: {
        width: 50,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "lightgray",
        marginHorizontal: 5,
        backgroundColor: "#f5f5f6",
        paddingVertical: 10,
        textAlign: "center",
      },
      otpFieldInput:{
        width:100,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "lightgray",
        marginHorizontal: 5,
        backgroundColor: "#f5f5f6",
        paddingVertical: 10,
        textAlign: "center",
      },
      otpResend:{
        flexDirection:'row',
        marginVertical:26,
        alignItems:'center',
        justifyContent:'center'
        
      },
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
        bottom:14,
        left:15
      },
      nineOneText:{
        fontSize:14,
    
      },
      phoneField:{
        width:'100%',
        marginTop:15,
        paddingHorizontal:79,
        paddingVertical:9,
        fontSize:14,
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
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
        fontSize:14,
        // textTransform:'capitalize',
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
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
        width: "100%",
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 10,
        backgroundColor: config.primaryColor,
        borderRadius: 16,
        shadowColor: config.primaryColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.49,
        shadowRadius: 10,
        elevation: 9,
      
      }
})


   