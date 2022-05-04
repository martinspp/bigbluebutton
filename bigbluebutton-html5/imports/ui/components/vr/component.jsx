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
      <div>
      <Unity unityContext={unityContext} />
      <canvas id='svg-to-png-convert' hidden></canvas>
      </div>
    )
  }
}

export default VRComponent;

