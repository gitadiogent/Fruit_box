import React,{useState,useEffect} from 'react';
import { StatusBar } from 'react-native';
import {MD3LightTheme as DefaultTheme,Provider as PaperProvider} from "react-native-paper"
import { WithSplashScreen } from './components/SplashScreen';
import GlobalContext from './global/GlobalContext';
import Route from './Navigations/Route';
import InternetConnectionAlert from "react-native-internet-connection-alert";
import { ToastProvider } from 'react-native-toast-notifications'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomToast from './components/CustomToast';
import messaging from '@react-native-firebase/messaging';
import notifee,{AndroidImportance,AndroidStyle} from '@notifee/react-native';
import { config } from './config';


const theme={
  colors: {
    ...DefaultTheme.colors,
    primary:'#fff',
    secondary: 'black',
    tertiary: 'black'
  },
}

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  async function onMessageReceived(message) {
    // Do something
  }
  
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);

  const subscribeToTopic = () => {
    messaging()
      .subscribeToTopic(config.APP_ID)
      .then(() => console.log('Subscribed to topic!'));
  };



  useEffect(() => {
      setIsAppReady(true);
      subscribeToTopic()

    
  }, []);

  useEffect(() => {
    getFCMToken();
    requestPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('remoteMessage', JSON.stringify(remoteMessage));
      // console.log('remoteMessage Image===>>>', JSON.stringify(remoteMessage?.notification?.android?.imageUrl));
      DisplayNotification(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  const getFCMToken = () => {
    messaging()
      .getToken()
      .then(token => {
        console.log('token=>>>', token);
      });
  };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  async function DisplayNotification(remoteMessage) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Channel',
      sound:'hollow',
      vibration: true,
      lights:true,
      vibrationPattern: [300, 500],
      importance: AndroidImportance.HIGH,
    });

    if(remoteMessage?.notification?.android?.imageUrl){
       // Display a notification with Image 
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      
      android: {
        channelId,
        sound: 'hollow',
        vibration: true,
        vibrationPattern: [300, 500],
        style: { type: AndroidStyle.BIGPICTURE, picture: remoteMessage?.notification?.android?.imageUrl },
        importance: AndroidImportance.HIGH,
      },
    });
    }else{
      // Display a notification Without Image 
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        
        android: {
          channelId,
          sound: 'hollow',
          vibration: true,
          vibrationPattern: [300, 500],
          importance: AndroidImportance.HIGH,
        },
      });
    }
    

  }



    //=========== PLEASE REMOVE THIS AT THE TIME OF DEVELOPMENT ===============
  // console.log=()=>{}
  //=========== PLEASE REMOVE THIS AT THE TIME OF DEVELOPMENT ===============
  return (
  <WithSplashScreen isAppReady={isAppReady} >

    <PaperProvider theme={theme} >  
      <StatusBar barStyle = "dark-content" backgroundColor='white' />
      <GlobalContext>
      <InternetConnectionAlert
  onChange={(connectionState) => {
    console.log("Connection State: ", connectionState);
  }}><CustomToast>
    <Route />
    </CustomToast>
      </InternetConnectionAlert>
      </GlobalContext>
    </PaperProvider>
    </WithSplashScreen>

  );
}

