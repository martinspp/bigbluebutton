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
    unityContext.startVR()
  }
  
  componentDidMount(){
    subscribeToStreamStateChange('screenshare', this.onStreamStateChange);
  }
  onStreamStateChange(){
    console.log("stream started, change in vrcomponent")
    //console.log(Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl))
    //console.log("")
    data = [Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
      "none",
      Auth.userID,
      Auth.meetingID,
      Auth.fullname,
      BridgeService.getConferenceBridge()]
    console.log("Sending to unity: %O ", data)
    unityContext.send("GameObject","ScreenshareInit",data)
  }
  render(){
    const{
      unityContext
    } = this.props;

    return (
      <Unity unityContext={unityContext} />
    )
  }
}

export default VRComponent;

