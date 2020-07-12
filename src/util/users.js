const users=[]

const addUser= ({id,username,room})=>{


    //clean the data
    username= username.trim().toLowerCase()
    room= room.trim().toLowerCase()

    //validate

    if(!username || !room){
        return {
            error: 'Username and Room Required'
        }
    }

    //check for esisting user with same username in same room

    const exisitngUser= users.find((user)=>{

        return user.room===room && user.username===username

    })


    //validate user
    if(exisitngUser){
       return {
        error: 'Username already exisit'
    }
    }

    //store User in array
    const user= {id,username,room}
    users.push(user)
    return {user}
}



const removeUser= (id)=>{
    
    const index= users.findIndex((user)=>{
        return user.id===id

    })

    if(index!== -1)
    {
        return users.splice(index,1)[0]
    }

}


const getUser=(id)=>{

    const user= users.find((user)=>{
            return user.id===id

        })

       return user

}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



module.exports={

    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}