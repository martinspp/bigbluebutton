import React, { useContext } from 'react';
import VRComponent from './component'
import VRService from './service'
import Unity, { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import {getVideoStreams} from '/imports/ui/components/video-provider/service'


const VRContainer = (props) =>{
  this.props = unityContext
  this.props = VRService.isVRAvailable()
  console.log("render container " + VRService.isVRAvailable())
  return (
    <VRComponent {...props } />
  );
}
export const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});


export const startVR = () => {
  const isVrAvailable = async () =>{

    if(await VRService.isVRAvailable()){
      unityContext.unityInstance.Module.WebXR.toggleVR()
    }
    else{
      alert("VR Is not supported")
    }  
  }
  //isVrAvailable()
  console.log(getVideoStreams)
}

export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);