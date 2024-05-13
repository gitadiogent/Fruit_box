import React,{useEffect,useState} from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking
} from "react-native";
import axios from "axios";
import strings from "../../Constants/strings";
import { config } from "../../config";
import { Surface, Avatar,ActivityIndicator } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CategoryCard from "./CategoryCard";
import { UseContextState } from "../../global/GlobalContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomLoader from "../../components/Loader";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

function Category({navigation}) {
  const [data , setData ] = useState([]);
  const [render , setRender ] = useState(false);
  const [loading , setLoading ] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {authState} = UseContextState()


  useEffect(()=>{
    setLoading(true)
    axios.get(`${config.BACKEND_URI}/api/get/all/categories`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      // console.log(res?.data);
      setData(res?.data)
      setLoading(false)
      setRefreshing(false)
    })
    .catch(err=>{
      console.log(err);
      setRefreshing(false)
    })
  },[render,refreshing])
  
  const onRefresh = async()=>{
    setRefreshing(true)
  }

  const DATA = data


  

  const renderCategoryItem = ({ item }) => {
    console.log("ITEM _______",item)
    return (
      <View>
      <CategoryCard itemImage={item.main_category_image[0]?.image?.image_url} category_id={item._id} navigation={navigation} itemName={item._id} />
      </View>

    );
  };

  return (
    <SafeAreaView style={styles.cartMainContainer}>
      <Surface style={styles.cartHeader}>
        <Text style={styles.cartHeadingText}>All Categories</Text>
        {/* <TouchableOpacity onPress={()=>setRender(true)} >
          <Text>Render</Text>
        </TouchableOpacity> */}
        <View style={styles.headerIconsContainer}>
          <MaterialIcons
            onPress={()=>Linking.openURL(`tel:+91${JSON.stringify(authState?.adminDetails?.phone_number)}`)}
            style={styles.headerIcon1}
            name="support-agent"
            size={20}
            color={config.primaryColor}
          />
          <FontAwesome name="whatsapp" onPress={()=>Linking.openURL(authState?.adminDetails?.whatsapp_link)} style={styles.headerIcon2} size={20} color={config.primaryColor} />

        </View>
      </Surface>
     {loading ? 
    //  <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
    //   <ActivityIndicator size='large' animating={true} color={config.primaryColor} />
    //  </View> 
    <View style={{justifyContent:'flex-start',alignItems:'flex-start',height:'70%'}} >
    {/* <Image
    source={imageImport.LoaderGif}
    style={{width:100,height:100,}}
    /> */}
    <CustomLoader />

  </View>
      :
      // <FlatList
      // refreshControl={
      //   <RefreshControl   refreshing={refreshing} onRefresh={onRefresh} />
      // }
        
      // showsVerticalScrollIndicator={false}
      //   data={DATA}
      //   renderItem={({ item }) => (
      //     <View style={styles.brandContainer}>
      //       <FlatList
      //         ListHeaderComponent={
      //           <Text style={styles.brandText}>{item._id}</Text>
      //         }
      //         showsVerticalScrollIndicator={false}
      //         numColumns={4}
      //         data={item.categories}
      //         renderItem={renderCategoryItem}
      //         keyExtractor={(item) => item.brandName}
      //       />
      //     </View>
      //   )}
      //   keyExtractor={(item) => item._id}
      //   ListFooterComponent={<View style={{ height: 70 }}></View>  }
      // />     
     <View style={{paddingTop:18}} >
       <FlatList
      refreshControl={
        <RefreshControl   refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
      numColumns={4}
        data={DATA}
        // columnWrapperStyle={{width: '100%'}}
        // contentContainerStyle={{justifyContent: 'space-evenly'}}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        ListFooterComponent={<View style={{ height: 70 }}></View>  }
      />   
     </View>


     }
    </SafeAreaView>
  );
}

export default Category;

const styles = StyleSheet.create({
  cartMainContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems:'center'
    // width:'100%',
  },
  cartHeader: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 11,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartHeadingText: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: "600",
    color: config.primaryColor,
  },
  headerIconsContainer:{
    flexDirection:'row'
  },
  headerIcon1: {
    borderColor: "lightgray",
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: responsiveWidth(2.6),
    paddingVertical:responsiveWidth(2.5),
    borderRadius: responsiveWidth(40),
    // marginLeft: 16.5,
    shadowProp: {
      shadowColor: "#171717",
      shadowOffset: { width: 12, height: 4 },
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  headerIcon2:{
    borderColor:'lightgray',
    borderWidth:1,
    backgroundColor:'white',
    // paddingLeft:11.5,
    // paddingRight:10,
    paddingLeft: responsiveWidth(3.3),
    paddingRight: responsiveWidth(2.7),
    paddingVertical:responsiveWidth(2.5),
    borderRadius:responsiveWidth(40),
    marginLeft:14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  
  },

  brandText: {
    fontSize: 16,
    paddingTop: 10,
    paddingHorizontal: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  brandBox: {
    alignItems: "center",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
