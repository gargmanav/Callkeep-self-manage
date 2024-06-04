
import * as React from "react"
import RNNotificationCall from "react-native-full-screen-notification-incoming-call"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import ramdomUuid from "uuid-random"
import { useNavigation } from "@react-navigation/native"
import { CallKeepService } from "../services/CallKeepService"

CallKeepService.instance().setupCallKeep()
export default function Home() {
  const navigation = useNavigation()

  CallKeepService.navigation = navigation
  const display = () => {
    // Start a timer that runs once after X milliseconds
    //rest of code will be performing for iOS on background too
    const uuid = ramdomUuid()
    CallKeepService.instance().displayCall(uuid)
  }
  const onHide = () => {
    RNNotificationCall.hideNotification()
  }
  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 15,
          borderRadius: 15
        }}
        onPress={()=>setTimeout(() => {
          display()
        }, 2000)}
      >
        <Text>Display</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 15,
          borderRadius: 15,
          marginTop: 15
        }}
        onPress={onHide}
      >
        <Text>Hide</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20
  }
})


// // import { StyleSheet, Text, View } from "react-native"
// // import React, { useEffect } from "react"
// // import RnSmsRetriever from "rn-sms-retriever"

// // const index = () => {
// //   useEffect(() => {
// //     let smsListener
// //     async function innerAsync() {
// //       // get list of available phone numbers
// //       try {
// //         const selectedPhone = await RnSmsRetriever.requestPhoneNumber()
// //         console.log("Selected Phone is : " + selectedPhone)
// //       } catch (e) {
// //         console.log("Get Phone error", e)
// //       }
// //       // get App Hash
// //       const hash = await RnSmsRetriever.getAppHash()
// //       console.log("Your App Hash is : " + hash)
// //       // set Up SMS Listener;
// //       smsListener = DeviceEventEmitter.addListener(
// //         RnSmsRetriever.SMS_EVENT,
// //         data => {
// //           console.log(data, "SMS value")
// //         }
// //       )
// //       // start Retriever;
// //       await RnSmsRetriever.startSmsRetriever()
// //     }
// //     // only to be used with Android
// //     if (Platform.OS === "android") innerAsync()
// //     return () => {
// //       // remove the listsner on unmount
// //       smsListener?.remove()
// //     }
// //   }, [])

// //   return (
// //     <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
// //       <Text style={{color:"black"}}>index</Text>
// //     </View>
// //   )
// // }

// // export default index

// // const styles = StyleSheet.create({})


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const index = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   )
// }

// export default index

// const styles = StyleSheet.create({})