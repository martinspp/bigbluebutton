import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  isStreamStateUnhealthy,
  subscribeToStreamStateChange,
  unsubscribeFromStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';
class VRComponent extends PureComponent{

  constructor(){
    super();
    this.onStreamStateChange = this.onStreamStateChange.bind(this);
  }
  
  startVR(){
    const {unityContext} = this.props
    //unityContext.startVR()
  }
  
  componentDidMount(){
    subscribeToStreamStateChange('screenshare', this.onStreamStateChange);
    
  }
  onStreamStateChange(event){
    console.log(event)
    if(event.detail.streamState == "connected")
    {
      console.log("stream started, change in vrcomponent")
      //console.log(Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl))
      //console.log("")
      const data = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      console.log("Sending to unity: %O ", data)
      unityContext.send("GameObject","ScreenshareInit",JSON.stringify(data))
    }
  }
  render(){
    const{
      unityContext
    } = this.props;

    return (
      <Unity unityContext={unityContext} />
      //<span></span>
    )
  }
}

export default VRComponent;

