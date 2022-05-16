import React, { useEffect } from 'react';
import VRComponent from './component'
import VRService from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';
import Screenshare from '/imports/api/screenshare';
import {
  subscribeToStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';
import {Canvg, presets} from 'canvg'
import canvas from 'canvas';
import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';
import Cursor from '../cursor/service';

const VRContainer = (props) =>{
  this.props = {unityContext}
  this.props = VRService.isVRAvailable()
  console.log("render container " + VRService.isVRAvailable())
  var WSConnected = false;
  var slideDimensions = {width: null, height:null}
  var lastSvg = null
  useEffect(() => {

    annotationsStreamListener = new Meteor.Streamer(`annotations-${Auth.meetingID}`, { retransmit: false });
    cursorStreamListener = new Meteor.Streamer(`cursor-${Auth.meetingID}`, { retransmit: false });

    annotationsStreamListener.on('added', () => {
      setTimeout(()=>{
        window.dispatchEvent(new CustomEvent("updateSlide"))
      },500)  
    });
    annotationsStreamListener.on('removed', () => {
      setTimeout(()=>{
        window.dispatchEvent(new CustomEvent("updateSlide"))
      },500)  
    });
    cursorStreamListener.on('message', ({ cursors }) => {
      unityContext.send("Presentation", "UpdateCursor",JSON.stringify(cursors[0]))
    });
    unityContext.on("unityScreenShareStarted", function(){
      const screenShareData = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      unityContext.send("ScreenShare","SettingsInit",JSON.stringify(screenShareData))
    });

    unityContext.on("unityMultiplayerStarted", function(){
      const multiplayerData = {
        id: "add",
        meetingId: Auth.meetingID,
        playerId: Auth.userID,
        username: Auth.fullname,
        wsUrl: "wss://bbb.4eks1s.com:8765",
      }
      console.log(multiplayerData)
      unityContext.send("MultiplayerController", "SettingsInit",JSON.stringify(multiplayerData))
     
    });

    unityContext.on("unityScreenShareWSConnected", function(){
      WSConnected = true;
      if (Screenshare.findOne({ meetingId: Auth.meetingID },{ fields: { 'screenshare.stream': 1 } })){
        unityContext.send("ScreenShare", "ScreenshareStart")
      }
    });

    subscribeToStreamStateChange('screenshare', function(e){
      if(e.detail.streamState == "connected" && WSConnected)
        unityContext.send("ScreenShare", "ScreenshareStart");
    });
    window.addEventListener("updateSlide",function(e){

      if(e.detail){
        slideDimensions={
          width:e.detail.width,
          height:e.detail.height
        }
      }

      const preset = presets.node({
        DOMParser,
        canvas,
        fetch
      });
      const c = preset.createCanvas(slideDimensions.width, slideDimensions.height);
      
      const ctx = c.getContext('2d');
      var doc = document.getElementById('whiteboard');
      doc.removeChild("g.class")
      if (doc != null)
      {
        var v = Canvg.fromString(ctx, doc.outerHTML, preset)
        v.resize(slideDimensions.width*1.5, slideDimensions.height*1.5)
        console.log("updating")
        v.render().then(() => {
          unityContext.send('Presentation','UpdateSlide',c.toDataURL('image/png'))
        })
        .catch(e => console.log("Something broke: "+ e))  
      }
    })
  });

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
  unityContext.unityInstance.Module.WebXR.toggleVR()
}


export default withTracker(() =>{
  return{
    unityContext,
  }
})(VRContainer);