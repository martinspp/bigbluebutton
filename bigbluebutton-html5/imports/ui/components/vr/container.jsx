import React, { useEffect } from 'react';
import VRComponent from './component'
import VRService from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';
import Screenshare from '/imports/api/screenshare';

const VRContainer = (props) =>{
  this.props = {unityContext}
  this.props = VRService.isVRAvailable()
  console.log("render container " + VRService.isVRAvailable())
  var started = false;
  useEffect(() => {
    unityContext.on("unityScreenShareStarted", function(){
      console.log("unityScreenShareStarted")
      const meetingId = Auth.meetingID
      const screenShareData = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }

      unityContext.send("ScreenShare","SettingsInit",JSON.stringify(screenShareData))
      
      console.log(Screenshare.find({ meetingId }))
      unityContext.send("ScreenShare", "ScreenshareStart");
      
      //console.log("Sending to unity: %O ", data)
    });

    unityContext.on("unityMultiplayerStarted", function(){
      console.log("unityMultiplayerStarted")
      const multiplayerData = {
        id: "add",
        meetingId: Auth.meetingID,
        playerId: Auth.userID,
        username: Auth.fullname,
        wsUrl: "wss://bbb.4eks1s.com:8765",
      }
      console.log(multiplayerData)
      unityContext.send("MultiplayerController", "SettingsInit",JSON.stringify(multiplayerData))
      //console.log("Sending to unity: %O ", data)
    });

  });

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