import React,{useCallback,useEffect,useState} from 'react'
import { useFocusEffect, } from '@react-navigation/native';
import { Surface, Avatar, Portal,Provider  } from "react-native-paper";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    Linking,
    ActivityIndicator,
    Image,
    Animated
  } from "react-native";
import ProductCard from '../../components/ProductCard';
// import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { config } from '../../config';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import imageImport from '../../Constants/imageImport';
import strings from '../../Constants/strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLoader from '../../components/Loader';
import { UseContextState } from '../../global/GlobalContext';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth
} from "react-native-responsive-dimensions";
import Modal from "react-native-modal";


function SearchResult({route,navigation}) {
  const [ currentPage , setCurrentPage ] = useState(1);
  const [ searchResult , setSearchResult ] = useState([]);
  const [ totalPagesCount , setTotalPagesCount ] = useState(1)
  const [ brandSuggestion , setBrandSuggestion ] = useState([])
  const [ productFilters , setProductFilters ] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [ loading , setLoading ] = useState(false);
  const [ render , setRender ] = useState(false)
  const [ productCount , setProductCount  ] = useState(0)
  const [ loadMore , setLoadmore ] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const {authState} = UseContextState()
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
//   let scrollY = new Animated.Value(0)
//   let diffClamp = Animated.diffClamp(scrollY,0,45)
//   let translateY = diffClamp.interpolate({
//    inputRange:[0,45],
//    outputRange:[0,-45]
//  })



  // useFocusEffect(
  //   useCallback(()=>{
  //      diffClamp = Animated.diffClamp(scrollY,0,45)
  //      translateY = diffClamp.interpolate({
  //       inputRange:[0,45],
  //       outputRange:[0,-45]
  //     })
    
  //   },[render])
  // )
 
  
  const {searchValue,searchThroughSubCategory,searchThroughBrandCategory,searchThroughCategory,searchWithBannerTouch } = route.params;
  console.log("search --->",searchValue,"searchThroughSubCategory---->>>>>",searchThroughSubCategory,searchThroughCategory,"searchWithBannerTouch-->",searchWithBannerTouch);
  useFocusEffect(
    useCallback(()=>{

      axios.get(`${config.BACKEND_URI}/api/get/all/brands/suggestion/for/search?main_category=${searchThroughCategory == undefined ? '':searchThroughCategory}`,{headers: {
        'Authorization': `token ${config.APP_VALIDATOR}`,
      },withCredentials:true})
      .then(res=>{
        // console.log(res?.data);
        setBrandSuggestion(res?.data);
        setRefreshing(false)
      })
      .catch(err=>{
        console.log(err);
        setRefreshing(false)
      })
    },[render])
  )
 
useFocusEffect(
  useCallback(()=>{
    // console.log("MAIN USE EFFECT RUNS")
    setLoading(true);
    axios.get(`${config.BACKEND_URI}/api/app/search/for/products?&search_by=${searchValue == undefined ? '' :searchValue }&subcategory=${searchThroughSubCategory == undefined ? '' : JSON.stringify(searchThroughSubCategory)}&category=${searchThroughCategory == undefined ? '':searchThroughCategory}&brand_category=${searchThroughBrandCategory == undefined? '':searchThroughBrandCategory}&product_tag=${selectedFilter == null ? "" : selectedFilter}`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        setSearchResult([...res?.data?.result]);
        setCurrentPage(1);
        setTotalPagesCount(res?.data?.pages)
        setProductCount( res?.data?.result?.length)
        setLoading(false);
        if(currentPage=== totalPagesCount){
          setLoadmore(false)
        }
        setRefreshing(false)
     
    })
    .catch(err=>{
      console.log(err);
    })
  },[searchValue,searchThroughSubCategory,searchThroughBrandCategory,searchThroughCategory,render,selectedFilter,refreshing])
)

useFocusEffect(
  useCallback(()=>{
    axios.get(`${config.BACKEND_URI}/api/app/get/products/tags/for/filter`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res?.data);
      setProductFilters(res?.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },[])
)

  const onRefresh = async()=>{
    setRefreshing(true)
  }
//==============LOAD MORE ITEMS FUNCTIONS==========
  const loadMoreItems =async()=>{
    // console.log("loadmore called..");
    // console.log("Total page -->",totalPagesCount,'Current page before-->',currentPage);

   if(currentPage< totalPagesCount){
    await setCurrentPage(currentPage + 1 )
    // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
    await axios.get(`${config.BACKEND_URI}/api/app/search/for/products?&page=${currentPage+1}&search_by=${searchValue == undefined ? '' :searchValue }&subcategory=${searchThroughSubCategory == undefined ? '' : JSON.stringify(searchThroughSubCategory)}&category=${searchThroughCategory == undefined ? '':searchThroughCategory}&brand_category=${searchThroughBrandCategory == undefined ? '':searchThroughBrandCategory}&product_tag=${selectedFilter == null ? "" : selectedFilter}`,{headers: {
      'Authorization': `token ${config.APP_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      
        setSearchResult([...searchResult , ...res?.data?.result]);
        if(currentPage=== totalPagesCount){
          setLoadmore(false)
        }
        setProductCount( res?.data?.result?.length)
    })
    .catch(err=>{
      console.log(err);
    })
   }
  }
//=============LOAD MORE ITEMS FUNCTIONS=============

    const goBack=()=>{
        navigation.goBack()
    }

    const searchWithBrandSuggestion = (value)=>{
      navigation.navigate(navigationString.SEARCH_RESULT,
        {searchThroughBrandCategory:value,searchValue:''})
        // setRender(prev=>!prev)

      // setCurrentPage(1);
    }
    const renderbrandSuggestion = useCallback(({item,index})=>{
      return(
        <View>
        {searchThroughCategory || searchThroughBrandCategory ?
          <TouchableOpacity onPress={()=>searchWithBrandSuggestion(item?.category_name)} activeOpacity={0.6} >
          <Text style={searchThroughBrandCategory != item?.category_name ? {...styles.brandSuggestion} : {...styles.brandSuggestion,color:config.primaryColor,borderColor:config.primaryColor}}  >{item.category_name}</Text>
       </TouchableOpacity >
          :
          
          <TouchableOpacity onPress={()=>searchWithBrandSuggestion(item?._id)} activeOpacity={0.6} >
       <Text style={searchThroughCategory != item._id ? {...styles.brandSuggestion} : {...styles.brandSuggestion,color:config.primaryColor,borderColor:config.primaryColor}}  >{item._id}</Text>
       </TouchableOpacity >
          }
          </View>
      )
    },[searchThroughCategory,searchThroughBrandCategory]) 
    // SET EMPTY PRODUCT FOR GRID ALIGNMENT
    let emptyArr = [{empty:true,product_images:[]}]
    searchResult?.length % 2 != 0  &&  setSearchResult([...searchResult,...emptyArr])
    // console.log("RESULT",searchResult)
    // console.log("LENGTH=>",searchResult?.length);
    
    const renderProducts = useCallback(({ item, index }) => {
     
return  (
 <View style={{marginTop:5}} >
   { item.empty 
    ?
   ( <View style={
   
     { backgroundColor: "#fff", //#f2f2f2
      width: 165,
      height: 250,
      borderRadius: 30,
      margin: 5,
      padding: 20,
      overflow: "hidden",}
    
   } >

    </View>)
    :
    (<ProductCard product_id={item._id} 
      product_code={item.product_code}
      product_name={item?.product_name}
      product_main_category={item?.product_main_category} 
      product_category={item?.product_category} 
      product_subcategory={item?.product_subcategory} 
      product_variant={item?.product_variant} 
      product_images={item?.product_images} 
      new_arrival={item?.new_arrival}
      trending_product={item?.trending_product}
      product_sale_price={item?.product_sale_price}
      product_regular_price={item?.product_regular_price}
      navigation={navigation} />)
  }
 </View>
)}, []);
  
const onClickProductFilter=(filterName)=>{
  setModalVisible(false)
  console.log(filterName)
  setSelectedFilter(filterName)
}
console.log("selectedFilter",selectedFilter)

const renderProductsTagFilter = useCallback(({item,index})=>{
  return(
    <TouchableOpacity 
    onPress={()=>onClickProductFilter(item?._id)}
    activeOpacity={0.4}
    style={{borderWidth:0.6,
      borderColor:'#f2f2f2',
      paddingVertical:7,
      paddingHorizontal:13,
      borderRadius:6,
      marginVertical:3,
      marginHorizontal:5,
      textTransform:'capitalize',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    }}
    >
      <Text style={{
        fontSize:14,
        fontWeight:'500',
        color:'#999',
        letterSpacing:1.2,
        textTransform:'capitalize',
      }}>
        
           {item._id ==  null ? "none" : item._id}
           </Text>
         <MaterialIcons name="radio-button-on" size={16} color={selectedFilter == item._id ? config.primaryColor : '#999' } />

    </TouchableOpacity>
  )
},[selectedFilter])


  return (
    <View style={{flex:1,backgroundColor:'white',}} >
       <View style={{ position:'absolute',bottom:75,right:22,zIndex:2}} >
      
      {selectedFilter === null || selectedFilter === "" ? 
      <View></View> 
      :
      <Text style={{backgroundColor:'red',color:'white',textAlign:'center',fontSize:10,fontWeight:'600',left:70,top:13,zIndex:3,height:15,width: 15,borderRadius:40}} >1</Text>
      }
         
        
        {/* <TouchableOpacity onPress={toggleModal}  activeOpacity={0.9} style={styles.filterProductsBtn}>
     <Ionicons name="filter" 
      style={{ paddingBottom: 1, width: 23 }}
       size={16} color="white" />
     <Text style={styles.filterProductsText}>Filter</Text>
   </TouchableOpacity> */}
 
   </View>
    {/* <StatusBar backgroundColor="white" /> */}
    {/* <Animated.View style={{transform:[{translateY:translateY}],elevation:4,zIndex:4}} > */}
    <Surface   style={styles.productHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
    {searchValue !== undefined &&  <Text style={styles.searchResultText}>{searchValue?.slice(0,18)}{searchValue?.length > 18 &&'...'}</Text> }
   {searchThroughSubCategory &&  <Text style={styles.searchResultText}>{searchThroughSubCategory?.sub_category?.slice(0,18)}{searchThroughSubCategory?.sub_category?.length > 18 &&'...'}</Text> }
   {searchThroughCategory &&  <Text style={styles.searchResultText}>{searchThroughCategory?.slice(0,18)}{searchThroughCategory?.length > 18 &&'...'}</Text> }
   {searchThroughBrandCategory &&  <Text style={styles.searchResultText}>{searchThroughBrandCategory?.slice(0,18)}{searchThroughBrandCategory?.length > 18 &&'...'}</Text> }

    </View>
   
    <View style={{flexDirection:'row',alignItems:'center'}} >
    {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)}  >
      <Octicons
        style={{paddingRight: 10}}
        name="search"
        size={20}
        color={config.primaryColor}
      />
      </TouchableOpacity> */}
      <View style={styles.headerIconsContainer} >
        <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN,{searchHistory:searchValue == undefined ? '' :searchValue})} >
          <Octicons
            style={styles.serachIcon}
            name="search"
            size={18}
            color={config.primaryColor}
          />
        </TouchableOpacity>
          <MaterialIcons
            onPress={()=>Linking.openURL(`tel:+91${JSON.stringify(authState?.adminDetails?.phone_number)}`)}
            style={styles.headerIcon1}
            name="support-agent"
            size={20}
            color={config.primaryColor}
          />
        <FontAwesome name="whatsapp" onPress={()=>Linking.openURL(authState?.adminDetails?.whatsapp_link)} style={styles.headerIcon2} size={20} color={config.primaryColor} />
        </View>
    </View>
    {/* <TouchableOpacity onPress={toggleModal} >
    <Text>open Modal</Text>
  </TouchableOpacity> */}
 
  </Surface>
    {/* </Animated.View> */}
   
<View >
  

 

<View style={{alignItems:'center'}}  >
  {loading  ?
  // <ActivityIndicator size='large' color={config.primaryColor} />
    <View style={{marginTop:responsiveWidth(-30)}} >
      <CustomLoader/>
    </View>
  :
<FlatList
  refreshControl={
    <RefreshControl progressViewOffset={80} refreshing={refreshing} onRefresh={onRefresh} />
  }
  numColumns={2}
  data={searchResult}
  // stickyHeaderIndices={[0]}
  // onScroll={(e)=>{
  //   scrollY?.setValue(e.nativeEvent.contentOffset.y)
  // }}
  ListHeaderComponent={()=>(
    <View>
       {(!searchValue?.length || searchValue == undefined ) &&
  <View style={{alignItems:'flex-start',paddingTop:4,paddingBottom:5}} >
  <FlatList
    data={brandSuggestion}
    horizontal={true}
    contentContainerStyle={{paddingHorizontal:10 }}
// columnWrapperStyle={{paddingHorizontal:10}}
    showsHorizontalScrollIndicator={false}
    renderItem={renderbrandSuggestion}
    keyExtractor={(item)=>item._id}
    ItemSeparatorComponent={() => {
      return (
          <View
              style={{
                  height: "100%",
                
              }} />
      );
  }}
  />
</View>
  }
    </View>
  )}
  contentContainerStyle={{marginTop:70 }}
  // columnWrapperStyle={{justifyContent:'space-evenly'}}
  ListFooterComponent={() => (
    !loadMore && currentPage < totalPagesCount  ?  <View style={{alignItems:'center',marginVertical:10}} >
      <ActivityIndicator size='large' color={config.primaryColor} />
      <Text style={{ color:'gray',}} >Loading...</Text>
      <View style={{ paddingBottom: 200 }}></View>
    </View> : <View style={{ paddingBottom: 200 }}></View>
  )}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={()=>(
    <View>
       { !loading  && searchResult.length <= 0   && 
    <View style={{alignItems:'center',marginTop:responsiveScreenHeight(3.5)}} >
    <Image
    source={imageImport.NotFoundResult}
    style={{width:300,height:300}}
    />
    {/* <Text>We are sorry the product you </Text>
    <Text>search is not found </Text> */}
 <View activeOpacity={0.6}   style={styles.notFoundProduct} >
    <Text style={styles.notFoundText} >Product Not Found</Text>
   </View>
   <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingTop:15}} onPress={()=>{navigation.navigate(navigationString.HOME);setRender(prev=>!prev)}}  >
   <MaterialIcons  name="keyboard-arrow-left" size={20} color='#808080' />
   <Text style={{fontWeight:500,fontSize:responsiveFontSize(1.5),color:'#808080',marginLeft:-2}} > Go To Home</Text>
   </TouchableOpacity>
  </View>
    }
    </View>
  )}
  renderItem={renderProducts}
  keyExtractor={(item, index) => index}
  onEndReached={loadMoreItems}
  // onEndReachedThreshold={0.2}
/>

  }
   

    
  </View>
{/* <View style={{ paddingBottom: 255 }}></View> */}

</View>

{/* <Modal
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        // animationIn="bounceInUp"
        // animationOut="bounceOutDown"
        animationInTiming={600}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.center}>
            <View style={styles.barIcon} />
           </View>
           <View>
           {
  <View  >
    
    <View>
      <Text>Filters</Text>
    </View>
  <FlatList
    data={brandSuggestion}
    horizontal={true}
    contentContainerStyle={{paddingHorizontal:10 }}
    showsHorizontalScrollIndicator={false}
    renderItem={renderbrandSuggestion}
    keyExtractor={(item)=>item._id}
  />
</View>
  }
    </View>
    <View>
      <Text>Category</Text>
    </View>
    <View style={styles.applyAndClearBtnBox} >
        <TouchableOpacity  activeOpacity={0.8} style={styles.clearFilterBtn}>
  <Text style={styles.clearFiltertext}>Clear </Text>
  </TouchableOpacity>
        <TouchableOpacity  activeOpacity={0.8} style={styles.applyFilterBtn}>
  <Text style={styles.applyFiltertext}>Apply Filter</Text>
  </TouchableOpacity>
        </View>
       
        </View>
      </Modal> */}


  </View>

  )
}

export default SearchResult

const styles=StyleSheet.create({
    productHeader: {
        width: "100%",
        position:'absolute',
        top:0,
        left:0,
        right:0,
        backgroundColor:'white',
        paddingTop: 8,
        paddingBottom: 11,
        paddingHorizontal: 15, 
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex:2
      },
      searchResultText: {
        fontSize: responsiveFontSize(2),
        textTransform:'capitalize',
        paddingLeft:2,
        fontWeight: "500",
        color:config.primaryColor,
      },
      serachIcon: {
        paddingRight: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        paddingLeft: responsiveWidth(2.9),
        paddingRight:responsiveWidth(2.8),
        paddingTop: responsiveWidth(2.6),
        paddingBottom: responsiveWidth(2.4),
        borderRadius: responsiveWidth(40),
      },
      headerIconsContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      },
      headerIcon1: {
        borderColor: "lightgray",
        borderWidth: 1,
        backgroundColor: "white",
        paddingHorizontal: responsiveWidth(2.6),
        paddingVertical:responsiveWidth(2.5),
        borderRadius: responsiveWidth(40),
        marginLeft: 8,
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
        paddingLeft: responsiveWidth(3.3),
    paddingRight: responsiveWidth(2.7),
    paddingVertical:responsiveWidth(2.5),
    borderRadius:responsiveWidth(40),
        marginLeft:8,
        shadowProp: {
          shadowColor: '#171717',
          shadowOffset: {width: 12, height: 4},
          shadowOpacity: 0.49,
          shadowRadius: 3,
        },
      
      },
      brandSuggestion:{
        backgroundColor:'#f5f5f6',
        paddingHorizontal:16,
        paddingVertical:6,
        marginVertical:1,
        marginHorizontal:5,
        color:'gray',
        fontSize:responsiveFontSize(1.5),
        borderRadius:30,
        borderWidth:0.5,
        borderColor:'lightgray',
        textTransform:'capitalize'
      },
      notFoundProduct:{
        backgroundColor:config.primaryColor,
        paddingHorizontal:30,
        paddingVertical:12,
        borderRadius:12,
        shadowColor:config.primaryColor,
        shadowOffset:{width:0,height:1},
        shadowOpacity:1,
        shadowRadius:30,
        elevation:9
      },
      notFoundText:{
        color:'white',
        fontSize:14,
        letterSpacing:2,
        fontWeight:'500'
      },
      filterProductsBtn: {
        zIndex:2,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 9,
        paddingHorizontal:12,
        backgroundColor: config.primaryColor,
        borderRadius: 86,
        shadowColor: config.primaryColor,
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.49,
        shadowRadius: 10,
        elevation: 5,
      },
      filterProductsText: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1.6,
        color: "white",
      },
      containerStyle:{
        backgroundColor: 'white',
      paddingTop: 9,
      paddingBottom:12,
      marginHorizontal:65,
      borderRadius:10,
    zIndex:2
    },
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    modalContent: {
      backgroundColor: "#fff",
      paddingTop: 12,
      paddingHorizontal: 12,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      minHeight: 450,
      paddingBottom: 20,
    },
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    barIcon: {
      width: 60,
      height: 5,
      backgroundColor: "#bbb",
      borderRadius: 3,
    },
    text: {
      color: "#bbb",
      fontSize: 24,
      marginTop: 100,
    },
    filterProductsBtn: {
      zIndex:2,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: 9,
      paddingHorizontal:12,
      backgroundColor: config.primaryColor,
      borderRadius: 86,
      shadowColor: config.primaryColor,
      shadowOffset: { width: 10, height: 0 },
      shadowOpacity: 0.49,
      shadowRadius: 10,
      elevation: 5,
    },
    filterProductsText: {
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 1.6,
      color: "white",
    },
    applyAndClearBtnBox:{
      position:'absolute',
      bottom:10,
      paddingHorizontal:10,
      width:'100%',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center'
    },
    applyFilterBtn: {
      width: "65%",
      alignItems: "center",
      paddingVertical: 13,
      paddingHorizontal: 20,
      backgroundColor: config.primaryColor,
      borderRadius: 16,
      shadowColor: config.primaryColor,
      shadowOffset: { width: 10, height: 0 },
      shadowOpacity: 0.49,
      shadowRadius: 10,
      elevation: 5,
    },
    clearFilterBtn: {
      width: "35%",
      marginRight:14,
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderColor: config.primaryColor,
      borderWidth:1,
      borderRadius: 16,
      // shadowColor: config.primaryColor,
      // shadowOffset: { width: 10, height: 0 },
      // shadowOpacity: 0.49,
      // shadowRadius: 10,
      // elevation: 5,
    },
    clearFiltertext:{
      fontSize:15,
      fontWeight:'600',
      letterSpacing:1.5,
      color:config.primaryColor
    },
    applyFiltertext:{
      fontSize:15,
      fontWeight:'600',
      letterSpacing:1.5,
      color:'white'
    },
   
})