import React from 'react'
import { View, Modal,Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native"
import Carousel,{Pagination} from 'react-native-snap-carousel'
import imageImport from '../../Constants/imageImport'
import { Avatar } from "react-native-paper";
import { config } from '../../config';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const SLIDER_WIDTH = Dimensions.get('window').width 
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH )


  


const CarouselCardItem = ({ item, index }) => {

 
  return (


<View style={styles.container} key={index}>

   <Image
     source={{uri:item.image_url} }
     resizeMode="contain"
    style={{width:'100%',height:'100%',backgroundColor: "white"}}
    />
</View>
)
}

const styles = StyleSheet.create({
container: {
// backgroundColor: 'white',
// borderRadius: 8,
alignItems:'center',
width: '100%',
paddingBottom: 0,
shadowColor: "#000",
paddingVertical:0,
marginTop:0,

},
image: {
width:'100%',
height: 160,
borderRadius:12,
shadowOffset: {
width: 0,
height: 3,
},
shadowOpacity: 0.29,
shadowRadius: 4.65,
elevation: 7,


},
})




const ProductImageCarousel = ({productImages}) => {
const [index, setIndex] = React.useState(0)
const [openZoomImage,setopenZoomImage] =React.useState(false)
const isCarousel = React.useRef(null)
console.log("productImagesproductImagesproductImagesproductImages===>",productImages)
let ImageForZoom =[]
productImages?.forEach(element => {
console.log("productImagesproductImagesproductImageselementelementelementelementelementproductImages===>",element.image_url)
ImageForZoom?.push({url:element.image_url})
});
const images = [{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

}]

return (
<View style={{alignItems:'center',justifyContent:'center'}} >
<Modal visible={openZoomImage} transparent={true} onRequestClose={()=>setopenZoomImage(false)} >
                <ImageViewer enableSwipeDown={true}
                index={index}
                 onSwipeDown={()=>setopenZoomImage(false)}
                   enableImageZoom={true}
                  
                   onCancel={()=>setopenZoomImage(false)}  imageUrls={ImageForZoom}/>
            </Modal>
{/* <TouchableOpacity onPress={()=>setopenZoomImage(true)} > */}



<Carousel
layout="default"
layoutCardOffset={9}
ref={isCarousel}

data={productImages}
// renderItem={CarouselCardItem}
renderItem={({ item, index }) => {

 
  return (


<TouchableOpacity activeOpacity={0.8} onPress={()=>setopenZoomImage(true)} style={styles.container} key={index}>

   <Image
     source={{uri:item.image_url} }
     resizeMode="contain"
    style={{width:'100%',height:'100%',backgroundColor: "white"}}
    />
</TouchableOpacity>
)
}}
sliderWidth={SLIDER_WIDTH}
itemWidth={ITEM_WIDTH }
inactiveSlideShift={1}
useScrollView={true}
loop={true}
// autoplay={true}
// autoplayDelay={1}

onSnapToItem={(index) => setIndex(index )}
/>
<View  style={{marginTop:-75}} >
<Pagination
dotsLength={productImages?.length}
activeDotIndex={index}
carouselRef={isCarousel}
dotStyle={{
 width: 8,
 height: 8,
 borderRadius: 5,
 marginHorizontal: -6,
 backgroundColor:'white',
 
}}
inactiveDotOpacity={0.4}
inactiveDotScale={0.6}
tappableDots={true}

/>
</View>
{/* </TouchableOpacity> */}
</View>
)
}



export default ProductImageCarousel
