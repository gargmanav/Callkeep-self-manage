
import { Platform } from "react-native"
import RNNotificationCall from "react-native-full-screen-notification-incoming-call"
import RNCallKeep from "react-native-callkeep"
import {
  check,
  PERMISSIONS,
  RESULTS,
  requestMultiple
} from "react-native-permissions"

const appName = "Incoming-Test"
const isAndroid = Platform.OS === "android"
const answerOption = {
  channelId: "default",
  channelName: "default",
  notificationIcon: "ic_launcher", //mipmap
  notificationTitle: "Linh Vo",
  answerText: "Answer",
  declineText: "Decline",
  notificationColor: "colorAccent", //path color in android
  notificationSound: undefined //raw
}
// this service only focus for Android

export class CallKeepService {
  constructor() {
    //setup callkeep
    // this.setupCallKeep();
  }
  static instance() {
    if (!CallKeepService._instance) {
      CallKeepService._instance = new CallKeepService()
    }
    return CallKeepService._instance
  }

  async setupCallKeep() {
    await new Promise(resolve => {
      console.log("setup call keep done in promise")
      this.setupCallKeepFunc().then(resolve)
    })
  }

  async setupCallKeepFunc() {
    const granted = await requestMultiple([
      PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS
    ])
    if (granted[PERMISSIONS.ANDROID.READ_PHONE_NUMBERS] !== RESULTS.GRANTED)
      return
    //only setup when granted permission
    await this.setup()
    //setup done
    if (isAndroid) {
      RNCallKeep.setAvailable(true)
    }
    this.registerEvent()
  }
  async setup() {
    try {
      await RNCallKeep.setup({
        ios: {
          appName: appName,
          maximumCallGroups: "1",
          maximumCallsPerCallGroup: "1",
          includesCallsInRecents: false,
          imageName: "callkitIcon" //image name from ios
        },
        android: {
          alertTitle: "Permissions required",
          alertDescription:
            "This application needs to access your phone accounts",
          cancelButton: "Cancel",
          okButton: "ok",
          selfManaged: true,
          additionalPermissions: [],
          foregroundService: {
            channelId: "default",
            channelName: "default",
            notificationTitle: "Incoming Call",
            notificationIcon: "ic_launcher_round"
          }
        }
      })
      return {
        result: "setupDone"
      }
    } catch (error) {
      console.log("error setup callkeep", error)
      return error
    }
  }
  registerEvent() {
    isAndroid &&
      RNCallKeep.addEventListener(
        "createIncomingConnectionFailed",
        this.onFailCallAction
      )
    RNCallKeep.addEventListener("answerCall", this.onCallKeepAnswerCallAction)
    RNCallKeep.addEventListener("endCall", this.onCallKeepEndCallAction)
    if (isAndroid) {
      //event only on android
      RNCallKeep.addEventListener(
        "showIncomingCallUi",
        ({ handle, callUUID, name }) => {
          RNNotificationCall.displayNotification(callUUID, null, 30000, {
            ...answerOption,
            channelId: "default",
            channelName: "default",
            notificationTitle: "Manav garg Chat",
            notificationBody: "Incoming video call",
            // payload: {
            //   kiokas: "ádada",
            //   ssskis: "awq"
            // }
          })
        }
      )
      // Listen to headless action events
      RNNotificationCall.addEventListener("endCall", data => {
        const { callUUID } = data
        // End call action here
        console.log("endCall", callUUID)
        RNCallKeep.endCall(callUUID)
      })
      RNNotificationCall.addEventListener("answer", data => {
        const { callUUID } = data
        //open app from quit state
        RNNotificationCall.backToApp()
        //call api answer
        console.log("answer", callUUID)
        RNCallKeep.answerIncomingCall(callUUID)
      })
      // You can listener firebase message event here
    }
  }
  onFailCallAction() {
    RNCallKeep.endAllCalls()
  }

  //handle event
  onCallKeepAnswerCallAction(answerData) {
    const { callUUID } = answerData
    // called when the user answer the incoming call
    //navigate to another screen
    //some project need to rehandle with redux state or other state manager refer https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/17#issuecomment-1318225574
    CallKeepService.navigation.navigate("Detail")
  }
  onCallKeepEndCallAction(answerData) {
    const { callUUID } = answerData
    //end call action of callkit
    //action destroy screen
    //You need to call RNCallKeep.endCall(callUUID) to end call
  }

  async displayCall(uuid) {
    const granted = await check(PERMISSIONS.ANDROID.READ_PHONE_NUMBERS)
    //only display call when permission granted
    if (granted !== RESULTS.GRANTED) return
    console.log("display call", uuid)
    RNCallKeep.displayIncomingCall(
      uuid,
      "Manav garg",
      "Manav garg",
      "9828573900",
      true,
      undefined
    )
  }
  endAllCall() {
    RNCallKeep.endAllCalls()
  }
}
