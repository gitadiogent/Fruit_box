import { View, Text } from 'react-native'
import React from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomToast = ({children}) => {
  return (
    <ToastProvider 
    animationType='zoom-in'
    placement='top'
    duration={3000}
    offset={10}
    successColor='#029E02'
    dangerColor='#DE040C'
    warningColor='#F7CA13'
    warningIcon={<MaterialIcons  name="warning" size={22} color='#fff' />}
    dangerIcon={<MaterialIcons  name="close" size={22} color='#fff'  />}
    successIcon={<MaterialIcons  name="done" size={22} color='#fff' />}
    
     swipeEnabled={true} >{children}</ToastProvider>
  )
}

export default CustomToast