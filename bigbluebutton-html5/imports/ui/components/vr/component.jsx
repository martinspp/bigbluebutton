import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import Unity, { UnityContext } from "react-unity-webgl";
import {
  isStreamStateUnhealthy,
  subscribeToStreamStateChange,
  unsubscribeFromStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';

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

