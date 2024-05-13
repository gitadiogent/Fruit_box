import { View, Text } from 'react-native'
import React from 'react'
import Modal from "react-native-modal";

const CustomModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <Modal
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
        <Text style={styles.text}>Welcome To Bottom Sheet</Text>
      </View>
    </View>
  </Modal>
  )
}


const styles=StyleSheet.create({
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
      minHeight: 500,
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
})

export default CustomModal
