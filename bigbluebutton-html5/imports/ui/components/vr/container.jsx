import React, { useEffect } from 'react';
import VRComponent from './component'

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
import PresentationToolbarService from '/imports/ui/components/presentation/presentation-toolbar/service'

import Users from '/imports/api/users';
import Presentations from '/imports/api/presentations';
import PresentationService from '/imports/ui/components/presentation/service';
import WhiteboardService from '/imports/ui/components/whiteboard/service';
import { publishCursorUpdate } from '/imports/ui/components/cursor/service';


const VRContainer = (props) =>{
  this.props = {unityContext}

  var WSConnected = false;
  var slideDimensions = {width: null, height:null}
  var lastSvg = null
  useEffect(() => {

    annotationsStreamListener = new Meteor.Streamer(`annotations-${Auth.meetingID}`);
    cursorStreamListener = new Meteor.Streamer(`cursor-${Auth.meetingID}`);

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
      console.log(JSON.stringify(cursors[0]));
      unityContext.send("PresentationController", "UpdateCursor",JSON.stringify(cursors[0]))
    });
    
    unityContext.on("unityScreenShareStarted", function(){
      const screenShareData = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      unityContext.send("ScreenShareController","SettingsInit",JSON.stringify(screenShareData))
    });

    unityContext.on("unityMultiplayerStarted", function(){
      const currentUser = Users.findOne(
        { userId: Auth.userID },
        {
          fields:
          {
            approved: 1, emoji: 1, userId: 1, presenter: 1,
          },
        },
      );

      const multiplayerData = {
        id: "add",
        meetingId: Auth.meetingID,
        playerId: Auth.userID,
        username: Auth.fullname,
        wsUrl: "wss://bbb.4eks1s.com:8765",
        isPresenter:currentUser?.presenter
      }
      console.log(multiplayerData)
      unityContext.send("MultiplayerController", "SettingsInit",JSON.stringify(multiplayerData))
     
    });

    unityContext.on("unityScreenShareWSConnected", function(){
      WSConnected = true;
      if (Screenshare.findOne({ meetingId: Auth.meetingID },{ fields: { 'screenshare.stream': 1 } })){
        unityContext.send("ScreenShareController", "ScreenshareStart")
      }
    });

    unityContext.on("unityPresentationNextSlide", () =>{
      console.log("next slide")
      const currentPresentation = Presentations.findOne({
        current: true,
      }, { fields: { podId: 1 } }) || {};
      const currentSlide = PresentationService.getCurrentSlide(currentPresentation.podId);
      const numberOfSlides = PresentationToolbarService.getNumberOfSlides(currentPresentation.podId, currentSlide.presentationId)
      PresentationToolbarService.nextSlide(currentSlide.num, numberOfSlides ,currentPresentation.podId)

    });
    unityContext.on("unityPresentationPreviousSlide", () =>{
      console.log("prev slide")
      const currentPresentation = Presentations.findOne({
        current: true,
      }, { fields: { podId: 1 } }) || {};
      const currentSlide = PresentationService.getCurrentSlide(currentPresentation.podId);
      
      PresentationToolbarService.previousSlide(currentSlide.num,currentPresentation.podId)
    });

    unityContext.on("unityPresentationSendCursor",(xPercent, yPercent) =>{
      console.log("received"+ xPercent + " "+ yPercent);
      whiteboardId=WhiteboardService.getCurrentWhiteboardId()
      publishCursorUpdate({
        xPercent:xPercent,
        yPercent:yPercent,
        whiteboardId})
    });

    subscribeToStreamStateChange('screenshare', function(e){
      if(e.detail.streamState == "connected" && WSConnected)
        unityContext.send("ScreenShareController", "ScreenshareStart");
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
      var doc = document.getElementById('whiteboard')
      if (doc != null)
      {
        var copy = doc.cloneNode(true);
        var arr = copy.getElementsByClassName("cursor")
        for (let element of arr) {
          element.remove()
        }
        
        var v = Canvg.fromString(ctx, copy.outerHTML, preset)
          
        v.resize(slideDimensions.width*1.5, slideDimensions.height*1.5)
        v.render().then(() => {
          unityContext.send('PresentationController','UpdateSlide',c.toDataURL('image/png'))
        })
        .catch(e => console.log("Something broke: "+ e))  
      }
    });
    window.addEventListener("assignPresenter",function(e){
      unityContext.send('MultiplayerController','UpdatePresenter', e.detail.userId)
    });
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