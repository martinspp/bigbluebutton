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


const startVR = () => {
    unityContext.unityInstance.Module.WebXR.toggleVR()
}


export default{
    isVRAvailable,
    startVR,

}