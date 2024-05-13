import { View, Text,SafeAreaView,ActivityIndicator } from 'react-native'
import React from 'react'
import { config } from '../config'

const CustomLoader = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
    <View style={{}} >
    <ActivityIndicator size='large' color={config.primaryColor} />
      <Text style={{ color:'gray',fontWeight:'500',paddingTop:12,paddingLeft:12}} >Loading...</Text>
    </View>

  </View>
  )
}

export default CustomLoader