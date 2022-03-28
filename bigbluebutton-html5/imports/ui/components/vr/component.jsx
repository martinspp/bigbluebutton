import React, { PureComponent } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

class VRComponent extends PureComponent{
  render(){
    const{
      unityContext
    } = this.props;

    return (
      <Unity unityContext={unityContext} />
    )
  }
}