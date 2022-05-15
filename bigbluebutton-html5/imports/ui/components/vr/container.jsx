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
  }
  test(){
    this.setState({EngineEnabled:true})
  }
  render(){
     return this.state.EngineEnabled ? <VRComponent { ...unityContext } />: null
  }
};

export default VRContainer