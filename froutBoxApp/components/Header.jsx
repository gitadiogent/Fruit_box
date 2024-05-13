import React from 'react';

// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Share,
  TextInput,
  Text,
  Dimensions,
  SafeAreaView,
  View,
  Linking,
} from 'react-native';

import strings from '../Constants/strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {UseContextState} from '../global/GlobalContext';
import {config} from '../config';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import navigationString from '../Constants/navigationString';

function Header({navigation}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const {authState} = UseContextState();
  const onChangeSearch = query => setSearchQuery(query);

  const openHelpCenter = () => {
    return alert('HELP CENTER');
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: authState?.adminDetails?.app_link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const goToSearch = () => {
    navigation.navigate(navigationString.SEARCH_SCREEN,{isSpeakTrue: false});
  };
  const goToSearchWithMic = () => {
    navigation.navigate(navigationString.SEARCH_SCREEN, {isSpeakTrue: true});
  };

  return (
    <View style={styles.headerMain}>
      <View style={styles.headerStyle}>
        <Text
          style={{
            fontSize: responsiveFontSize(2.1),
            color: config.primaryColor,
            fontWeight: '700',
          }}>
          {config.APP_NAME?.slice(0, 20)}
          {config.APP_NAME?.length > 20 && '...'}
        </Text>
        <View style={styles.headerIconsContainer}>
        <Feather
            style={styles.micIcon}
            name="mic"
            size={20}
            color={config.primaryColor}
            onPress={goToSearchWithMic}
          />
          <Octicons
            style={styles.serachIcon}
            name="search"
            size={20}
            color={config.primaryColor}
            onPress={goToSearch}
          />

         
          {/* <Feather
            name="share-2"
            onPress={onShare}
            style={styles.headerIcon1}
            size={20}
            color={config.primaryColor}
          /> */}
          {/* <FontAwesome name="share-2" onPress={()=>Linking.openURL(authState?.adminDetails?.whatsapp_link)} style={styles.headerIcon2} size={24} color={config.primaryColor} /> */}
          {/* <FontAwesome onPress={openHelpCenter}  style={styles.headerIcon2} name="language" size={24}  color={config.primaryColor} /> */}
        </View>
      </View>
      {/* <View style={styles.searchBox}>
           <TextInput
             style={styles.searchBar}
             placeholder="What are you looking for?"
             onChangeText={onChangeSearch}
             value={searchQuery}
           />
           <Octicons  style={styles.serachIcon} name="search" size={20}  />
         </View> */}
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  headerMain: {
    paddingTop: 8,
    // paddingBottom:8,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    // borderBottomEndRadius:25,
    // borderBottomStartRadius:25
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  headerIcon1: {
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: responsiveWidth(40),
    marginLeft: responsiveWidth(4),
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  headerIcon2: {
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: 'white',
    // paddingLeft:responsiveWidth(2.6),
    // paddingRight:11,
    paddingHorizontal: responsiveWidth(2.6),
    paddingVertical: responsiveWidth(2.5),
    borderRadius: responsiveWidth(40),
    marginLeft: 14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  searchBox: {
    marginTop: 16,
    justifyContent: 'center',
    position: 'relative',
  },

  searchBar: {
    paddingVertical: 10,
    backgroundColor: '#f5f5f6',
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 45,
    marginBottom: 10,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    fontWeight: '600',
  },
  serachIcon: {
    paddingRight: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 40,
  },
  micIcon: {
    paddingRight: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 40,
  },
});
