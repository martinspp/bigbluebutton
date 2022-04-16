import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  isStreamStateUnhealthy,
  subscribeToStreamStateChange,
  unsubscribeFromStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';

import { delay } from "lodash";
import debug from "redis/lib/debug";
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
      console.log("starting screenshare");
      unityContext.send("GameObject", "ScreenshareStart");
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

