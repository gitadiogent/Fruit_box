import React from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import TabRoute from './TabRoute';
import Login from '../screens/Login/Login';
import navigationString from '../Constants/navigationString';
import Register from '../screens/Register/Register';
import ProductInfo from '../screens/ProductInfo/ProductInfo';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import Checkout from '../screens/Checkout/Checkout';
import OrderCompleted from '../screens/Checkout/OrderCompleted';
import Otp from '../screens/Otp/Otp';
import {UseContextState} from '../global/GlobalContext';
import SendEnquiry from '../screens/SendEnquiry/SendEnquiry';
import EditProfile from '../screens/EditProfile/EditProfile';
import NewArrivals from '../screens/NewArrivals/NewArrivals';
import EditCheckoutDetail from '../screens/EditCheckoutDetail/EditCheckoutDetail';
import ViewOrders from '../screens/Orders/ViewOrders';
import About from '../screens/Other/About';
import TermAndCondition from '../screens/Other/TermandCondition';
import PrivacyPolicy from '../screens/Other/PrivacyPolicy';
import ProductRatingsAndReviews from '../screens/ProductRatingsAndReviews/ProductRatingsAndReviews';
import ProductWriteAReview from '../screens/ProductRatingsAndReviews/ProductWriteAReview';
import Referscreen from '../screens/referScreen/Referscreen';
import RedumScreen from '../screens/redumScreen/RedumScreen';
import AllCoupons from '../screens/Other/AllCoupons';
import ShareProducts from '../screens/Other/ShareProducts';

// const Stack = createNativeStackNavigator()
const Stack = createStackNavigator();

const Tabs = createBottomTabNavigator();

function Route() {
  const {authState} = UseContextState();
  // console.log(authState,'authState');
  // console.log(authState?.isAuthenticated)
  return (
    <NavigationContainer>
      {/* {authState?.isAuthenticated  ?  */}
      {authState?.isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.screenOption,
            tabBarHideOnKeyboard: true,
          }}>
          <Stack.Screen
            name={navigationString.TAB_ROUTE}
            component={TabRoute}
          />
          <Stack.Screen
            name={navigationString.PRODUCT_INFO}
            component={ProductInfo}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.SEARCH_SCREEN}
            component={SearchScreen}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.CHECKOUT}
            component={Checkout}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.ORDER_COMPLETED}
            component={OrderCompleted}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.SEND_ENQUIRY}
            component={SendEnquiry}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.EDIT_PROFILE}
            component={EditProfile}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.VIEW_ORDER}
            component={ViewOrders}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.EDIT_CHECKOUT_DETAIL}
            component={EditCheckoutDetail}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.ABOUT}
            component={About}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.PRIVACYPOLICY}
            component={PrivacyPolicy}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.TERMANDCONDITION}
            component={TermAndCondition}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen
            name={navigationString.PRODUCT_RATING_AND_REVIEW}
            component={ProductRatingsAndReviews}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.PRODUCT_WRITE_A_REVIEW}
            component={ProductWriteAReview}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.REFER_AND_EARN}
            component={Referscreen}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.REDDEM_SCREEN}
            component={RedumScreen}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.All_COUPONS}
            component={AllCoupons}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
          <Stack.Screen
            name={navigationString.SHARE_PRODUCTS}
            component={ShareProducts}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forBottomSheetAndroid,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName={navigationString.LOGIN}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.screenOption,
            tabBarHideOnKeyboard: true,
          }}>
          <Stack.Screen
            name={navigationString.LOGIN}
            component={Login}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.REGISTER}
            component={Register}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name={navigationString.OTP_SCREEN}
            component={Otp}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
        </Stack.Navigator>
      )}

      {/* if user not logged in */}
    </NavigationContainer>

    // <TabBar/>
    // <BottomNav />
  );
}

export default Route;

const styles = StyleSheet.create({
  screenOption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
});
