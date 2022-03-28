const isVRAvailable = () => {
    const xrSessionSupported = polyfill.xr.isSessionSupported()
    if(xrSessionSupported === undefined){
        return false;
    }
    xrSessionSupported.then((val)=>{return val})
    console.log("here")
    
}

export default{
    isVRAvailable
}