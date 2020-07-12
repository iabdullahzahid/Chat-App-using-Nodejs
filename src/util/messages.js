const generateMessage= (username,msg)=>{

    return {
    username,
    text: msg,
    createdAt: new Date().getTime()
    }

}

const generateLocationMessage= (username,location)=>{

        return{

            username,
            url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
            createdAt:new Date().getTime()

        }
}





module.exports= {
    
    generateMessage,
    generateLocationMessage


}