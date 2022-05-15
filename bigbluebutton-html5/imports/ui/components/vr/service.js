import { UnityContext } from "react-unity-webgl";
import {setState} from "react"
const isVRAvailable = () => {
    console.log("testing vr")
    if(navigator.xr){
        navigator.xr.isSessionSupported("immersive-vr")
        .then((isSupported) => {
            return isSupported
        })
    }
    else{
        return false;
    }    
}
const unityContext = new UnityContext({
    loaderUrl: "vr/build.loader.js",
    dataUrl: "vr/build.data",
    frameworkUrl: "vr/build.framework.js",
    codeUrl: "vr/build.wasm",
  });

const startVR = () => {
    unityContext.unityInstance.Module.WebXR.toggleVR()
}
function setEngineEnabled(){
    this.setState({EngineEnabled: true})
}


export default{
    isVRAvailable,
    unityContext,
    startVR,
    setEngineEnabled
}