import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {config} from '../../config';
// import { StatusBar } from 'expo-status-bar';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import Voice from '@react-native-voice/voice';
import imageImport from '../../Constants/imageImport';
import {useFocusEffect} from '@react-navigation/native';

function SearchScreen({route, navigation}) {
  const [brandSugguestion, setBrandSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState(
    route.params?.searchHistory ? route.params?.searchHistory : '',
  );
  const isSpeakTrue = route.params?.isSpeakTrue || false;

  // voice search
  const [isStartedRecording, setisStartedRecording] = useState(false);
  const [RecordingResults, setRecordingResults] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BACKEND_URI}/api/get/all/brands/suggestion/for/search`, {
        headers: {
          Authorization: `token ${config.APP_VALIDATOR}`,
        },
        withCredentials: true,
      })
      .then(res => {
        console.log(res?.data);
        setBrandSuggestion(res?.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [isSpeakTrue]),
  );

  const onSpeechStart = e => {
    console.log(e);
    setisStartedRecording(true);
  };
  const onSpeechEnd = e => {
    console.log(e);
    setisStartedRecording(false);
  };

  const onSpeechResults = e => {
    console.log(e);
    setRecordingResults(e.value);
    setSearchQuery(e.value?.join(' '));
    console.log('ENTDDDDD');
    onRecordCompleteSearch(e.value?.join(' '));
  };

  const onRecordCompleteSearch = async recordRes => {
    console.log('START SEarch');
    // if(!searchQuery.trim()){
    //   return;
    // }
    console.log('NAVI SEarch', recordRes?.trim());

    navigation.navigate(navigationString.SEARCH_RESULT, {
      searchValue: recordRes?.trim(),
    });
  };

  const startVoiceRecording = async () => {
    try {
      await Voice.start('en-US');
      setisStartedRecording(false);
      setRecordingResults([]);
    } catch (error) {
      console.log(error);
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
      setisStartedRecording(false);
      setRecordingResults([]);
    } catch (error) {
      console.log(error);
    }
  };

  // ======== VOICE SEARCH =====
  const onChangeSearch = searchValue => {
    setSearchQuery(searchValue);
  };
  const goBack = () => {
    navigation.goBack();
  };
  const onSubmitSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    navigation.navigate(navigationString.SEARCH_RESULT, {
      searchValue: searchQuery?.trim(),
    });
  };

  // ======== VOICE SEARCH =====
  useFocusEffect(
    useCallback(() => {
      if (isSpeakTrue) {
        Voice.start('en-US')
          .then(() => {
            setisStartedRecording(true);
            setRecordingResults([]);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }, []),
  );

  const renderbrandSuggestion = ({item, index}) => {
    // console.log("___________________SEARCH",item)
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationString.SEARCH_RESULT, {
            searchThroughCategory: item._id,
          })
        }
        activeOpacity={0.6}>
        <Text style={styles.brandSuggestion}>{item._id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {/* <StatusBar backgroundColor="white" /> */}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.searchBox}>
          <TextInput
            autoFocus={!isSpeakTrue}
            keyboardType="web-search"
            style={styles.searchBar}
            placeholder="Search with product name"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onSubmitEditing={onSubmitSearch}
          />
          <Octicons style={styles.serachIcon} name="search" size={20} />
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            activeOpacity={0.6}
            style={styles.clearSearchBtn}>
            <Feather
              name="delete"
              style={{paddingBottom: 8}}
              size={19}
              color="#555"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.6}
            style={styles.clearBtn}>
            <AntDesign
              name="closecircle"
              style={{paddingBottom: 8}}
              size={18}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        {loading ? (
          <View
            style={{
              marginVertical: 25,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={config.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={brandSugguestion}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={renderbrandSuggestion}
            contentContainerStyle={{paddingHorizontal: 8}}
            keyExtractor={item => item._id}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: '100%',
                  }}
                />
              );
            }}
          />
        )}
      </View>
      <View style={{alignSelf: 'center'}}>
        {isStartedRecording ? (
          <TouchableOpacity
            onPress={stopVoiceRecording}
            activeOpacity={0.6}
            style={styles.recordingBox}>
            <Image
              source={imageImport.listeningRecordingGif}
              style={styles.recordingStyle}
            />
            <Text style={styles.recordText}> Listening...</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startVoiceRecording}
            activeOpacity={0.6}
            style={styles.recordingBox}>
            <Image
              source={imageImport.startRecordingGif}
              style={styles.recordingStyle}
            />
            <Text style={styles.recordText}> Tap to Talk</Text>
          </TouchableOpacity>
        )}
      </View>

      {RecordingResults?.map(data => (
        <Text>{data}</Text>
      ))}
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: 10,

    flex: 1,
    backgroundColor: 'white',
  },
  searchBox: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  searchBar: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#f5f5f6',
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 38,
    marginBottom: 10,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    color: '#222',
    fontWeight: '400',
  },
  serachIcon: {
    position: 'absolute',
    left: 22,
    bottom: 15,
    color: config.primaryColor,
    paddingBottom: 8,
  },
  clearBtn: {
    position: 'absolute',
    right: 22,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 50,
  },
  brandSuggestion: {
    backgroundColor: '#f5f5f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 3,
    marginHorizontal: 5,
    color: 'gray',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    textTransform: 'capitalize',
  },
  recordingBox: {
    paddingTop: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingStyle: {
    width: 70,
    height: 70,
  },
  recordText: {
    paddingTop: 5,
    fontSize: 14,
    color: 'gray',
  },
});
