import React, { PureComponent } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "vr/build.loader.js",
  dataUrl: "vr/build.data",
  frameworkUrl: "vr/build.framework.js",
  codeUrl: "vr/build.wasm",
});

class VR extends PureComponent{
  render(){

    return (
      <Unity unityContext={unityContext} />
    )
  }
}