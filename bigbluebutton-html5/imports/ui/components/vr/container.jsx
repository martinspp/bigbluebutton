import React, { Component, useEffect } from 'react';
import VRComponent from './component'
import {unityContext} from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';



class VRContainer extends Component{
  constructor(props){
    super(props)
    this.state = {EngineEnabled: true}
    this.props.unityContext = new UnityContext({
      loaderUrl: "vr/build.loader.js",
      dataUrl: "vr/build.data",
      frameworkUrl: "vr/build.framework.js",
      codeUrl: "vr/build.wasm",
    });
    
  }
  test(){
    this.setState({EngineEnabled:true})
  }
  render(){
    const unityContext = this.props
    return this.state.EngineEnabled ? <VRComponent { ...props } />: null
  }
};

export default VRContainer