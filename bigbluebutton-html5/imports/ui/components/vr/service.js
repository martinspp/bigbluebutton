const isVRAvailable = async () => {
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

export default{
    isVRAvailable
}