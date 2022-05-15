import React, { useEffect } from 'react';
import VRComponent from './component'
import unityContext from './service'
import { UnityContext } from "react-unity-webgl";
import { withTracker } from 'meteor/react-meteor-data';
import Auth from '/imports/ui/services/auth';
import BridgeService from '/imports/api/screenshare/client/bridge/service';


export default VRContainer = () => {

  useEffect(function(){
    unityContext.on("unitystarted", function(){
      console.log("unity started event")
      const data = {
        wsUrl: Auth.authenticateURL(Meteor.settings.public.kurento.wsUrl),
        callerName: Auth.userID,
        InternalMeetingId: Auth.meetingID,
        userName: Auth.fullname,
        voiceBridge: BridgeService.getConferenceBridge()
      }
      unityContext.send("BBBScreenshare","SettingsInit",JSON.stringify(data))
      console.log("Sending to unity: %O ", data)
    });
  },[]);

  
  return ( EngineEnabled ?
    <VRComponent { ...unityContext } />
    : null
  )
};