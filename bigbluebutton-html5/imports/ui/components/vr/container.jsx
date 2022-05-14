import React, { useEffect } from 'react';
import VRComponent from './component'
import VRService from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';

const VRContainer = () => {
  this.props = {
    unityContext,
  }
  this.state = {
    EngineEnabled: false
  }
  useEffect(function(){
    unityContext.on("unitystarted", function(){
      console.log("unity started event")
      const data = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      unityContext.send("BBBScreenshare","SettingsInit",JSON.stringify(data))
      console.log("Sending to unity: %O ", data)
    });
  },[]);

  if(state.EngineEnabled){
    return (
      <VRComponent {...props } />
    )}
  else{
    return
  };

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
    unityContext
  }
})(VRContainer);