import React, { useContext } from 'react';
import VRComponent from './component'
import VRService from './service'
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});

const VRContainer = (props) =>{

  if(isVREnabled()){
    return (
      <VRComponent
        {
          ...{
            ...props
          }
        }
      />
            
    )
  }
  return null
}

export default withTracker(() =>{
  return{
    unityContext: this.unityContext,
  }
})(VRContainer);