import React, { useEffect } from 'react';
import VRComponent from './component'
import VRService from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';

const VRContainer = (props) =>{
  this.props = unityContext
  this.props = VRService.isVRAvailable()
  console.log("render container " + VRService.isVRAvailable())

  useEffect(function(){
    unityContext.on("unitystarted", function(){
      console.log("unity started event")
      const screenShareData = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      const multiplayerData = {
        id: "add",
        meetingId: Auth.meetingID,
        playerId: Auth.userID,
        username: Auth.fullname,
        wsUrl: "wss://bbb.4eks1s.com:8765",
      }
      console.log(multiplayerData)
      unityContext.send("ScreenShare","SettingsInit",JSON.stringify(screenShareData))
      unityContext.send("MultiplayerController", "SettingsInit",JSON.stringify(multiplayerData))
      //console.log("Sending to unity: %O ", data)
    });
  },[]);

  return (
    <VRComponent {...props } />
  );
}
export const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});

export const startVR = () => {
  unityContext.unityInstance.Module.WebXR.toggleVR()
}


export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);