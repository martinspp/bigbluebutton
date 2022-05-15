import React, { PureComponent } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  subscribeToStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';

class VRComponent extends PureComponent{

  constructor(){
    super();
    
  }
  componentWillUnmount(){
    unityContext.send("ScreenShare","ScreenshareStop")
    unityContext.quitUnityInstance()
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