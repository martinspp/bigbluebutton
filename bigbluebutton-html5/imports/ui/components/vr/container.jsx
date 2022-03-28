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
  unityContext.unityInstance.Module.WebXR.toggleVR()
}

export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);