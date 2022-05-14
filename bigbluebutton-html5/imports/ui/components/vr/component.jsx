import React, { PureComponent } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { unityContext } from "./container";
import {
  subscribeToStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';

class VRComponent extends PureComponent{

  constructor(){
    super();
    this.onStreamStateChange = this.onStreamStateChange.bind(this);
  }
  
  componentDidMount(){
    subscribeToStreamStateChange('screenshare', this.onStreamStateChange);
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
    const{
      unityContext,
      EngineEnabled
    } = this.props;
    if(EngineEnabled){
      return (
        <Unity unityContext={unityContext} />
      )
    }
    else{
      return null;
    }
  }
}

export default VRComponent;

