import React, { Component, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  subscribeToStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';

class VRComponent extends Component{

  constructor(){
    super();
    this.onStreamStateChange = this.onStreamStateChange.bind(this);
  }
  
  componentDidMount(){
    subscribeToStreamStateChange('screenshare', this.onStreamStateChange);

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
  }

  componentWillUnmount(){
    unityContext.send("BBBScreenshare","ScreenshareStop")
    unityContext.quitUnityInstance()
  }
  onStreamStateChange(event){
    console.log(event)
    if(event.detail.streamState == "connected")
    {
      console.log("starting screenshare");
      unityContext.send("BBBScreenshare", "ScreenshareStart");
    }
  }
  render(){
    <Unity unityContext={unityContext} />
  }
}

export default VRComponent;

