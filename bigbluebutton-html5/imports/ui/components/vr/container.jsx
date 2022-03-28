import React, { useContext } from 'react';
import VRComponent from './component'
import VRService from './service'
import Unity, { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';



const VRContainer = (props) =>{
  this.props = unityContext
  if(VRService.isVRAvailable()){
    return (
      <VRComponent {...props } />
    );
  }
  return null
}
export const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});


export const startVR = () => {
  if(VRService.isVRAvailable()){
    unityContext.unityInstance.Module.WebXR.toggleVR()
  }
  else{
    alert("VR Is not supported")
  }
}

export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);