const isVRAvailable = async () => {
    const xrSessionSupported = polyfill.xr.isSessionSupported()
    if(xrSessionSupported === undefined){
        return false;
    }
    return await xrSessionSupported.then((val)=>{return val})
}

export default{
    isVRAvailable
}