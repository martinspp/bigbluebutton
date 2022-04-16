import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  isStreamStateUnhealthy,
  subscribeToStreamStateChange,
  unsubscribeFromStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';
import { delay } from "lodash";
class VRComponent extends PureComponent{

  constructor(){
    super();
    this.onStreamStateChange = this.onStreamStateChange.bind(this);
  }
  
  componentDidMount(){
    subscribeToStreamStateChange('screenshare', this.onStreamStateChange);
  }

  componentWillUnmount(){
    unityContext.send("GameObject","ScreenshareStop")
    unityContext.quitUnityInstance()
  }
  onStreamStateChange(event){
    console.log(event)
    if(event.detail.streamState == "connected")
    {
      const data = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      console.log("Sending to unity: %O ", data)
      unityContext.send("GameObject","SettingsInit",JSON.stringify(data))
      await delay(unityContext.send,5000, "GameObject", "ScreenshareStart");
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

