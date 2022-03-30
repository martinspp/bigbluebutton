import { unityContext } from "../../components/vr/container";
const playMediaElement = (mediaElement) => {
  return new Promise((resolve, reject) => {
    if (mediaElement.paused) {
      // Tag isn't playing yet. Play it.
      mediaElement.play()
        .then(resolve)
        .catch((error) => {
          if (error.name === 'NotAllowedError') return reject(error);
          // Tag failed for reasons other than autoplay. Log the error and
          // try playing again a few times until it works or fails for good
          const played = playAndRetry(mediaElement);
          if (!played) return reject(error);
          return resolve();
        });
    } else {
      // Media tag is already playing, so log a success. This is really a
      // logging fallback for a case that shouldn't happen. But if it does
      // (ie someone re-enables the autoPlay prop in the mediaElement), then it
      // means the mediaStream is playing properly and it'll be logged.
      return resolve();
    }
  });
}

export default function loadAndPlayMediaStream (mediaStream, mediaElement, muted = true) {
  mediaElement.muted = muted;
  mediaElement.pause();
  mediaElement.srcObject = mediaStream;
  console.log('mediaelemm')
  console.log(mediaElement);
  //unityContext.send('webrtc', "Hello", 'Please work')
  //unityContext.send('webrtc', "Hello", mediaStream)
  const constraints = { video: true };

  //https://stackoverflow.com/questions/51543595/get-a-stream-of-bytes-from-navigator-mediadevices-getusermedia

          // use MediaStream Recording API
    const recorder = new MediaRecorder(mediaStream);

  // fires every one second and passes an BlobEvent
  recorder.ondataavailable = event => {

      // get the Blob from the event
      const blob = event.data;

      // and send that blob to the server...
      console.log(blob)
  };

  // make data available event fire every one second
  recorder.start(1000);
      
  return playMediaElement(mediaElement);
}
