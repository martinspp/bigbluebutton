import React, { Component, useEffect } from 'react';
import VRComponent from './component'
import {unityContext} from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';



const VRContainer = (props) => {
  return(
   <VRComponent { ...unityContext } />
  )
};

const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});

export const startVR = () => {
  unityContext.unityInstance.Module.WebXR.toggleVR()
}

export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);