const isVRAvailable = () => {
    polyfill.xr.isSessionSupported().then((val)=> {return val})
}

export default{
    isVRAvailable
}