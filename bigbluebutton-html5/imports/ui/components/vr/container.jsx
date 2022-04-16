import React, { useContext, useEffect } from 'react';
import VRComponent from './component'
import VRService from './service'
import Unity, { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import VideoProviderService from '/imports/ui/components/video-provider/service'
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';

const VRContainer = (props) =>{
  this.props = unityContext
  this.props = VRService.isVRAvailable()
  console.log("render container " + VRService.isVRAvailable())

  useEffect(function(){
    unityContext.on("loaded", function(){
      const data = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      unityContext.send("GameObject","SettingsInit",JSON.stringify(data))
      console.log("Sending to unity: %O ", data)
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
  const isVrAvailable = async () =>{

    if(await VRService.isVRAvailable()){
      unityContext.unityInstance.Module.WebXR.toggleVR()
    }
    else{
      alert("VR Is not supported")
    }  
  }
  isVrAvailable()
  console.log(VideoProviderService)
}


export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);