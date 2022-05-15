import React, { useEffect } from 'react';
import VRComponent from './component'
import {unityContext, EngineEnabled} from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';


export default VRContainer = () => {
  
  
  return ( EngineEnabled ?
    <VRComponent { ...unityContext } />
    : null
  )
};