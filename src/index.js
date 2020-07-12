const http= require('http')
const path = require('path')
const express= require('express')
const socketio=require('socket.io')
const Filter =require('bad-words')
const {generateMessage,generateLocationMessage} = require('./util/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./util/users')
const app = express()


const server= http.createServer(app)
const io= socketio(server)

const port= process.env.PORT || 3000
const publicDirectory=path.join(__dirname,'../public')  // setting path to public directory


app.use(express.static(publicDirectory))  //setting express static middleware to serve file in public

io.on('connect', (socket)=>{

    console.log('One Websocket connection added')
    


    socket.on('join', ({username,room},callback)=>{
     const {user,error}= addUser({id:socket.id, username,room})

        if(error)
        {
            return callback(error)
        }

      socket.join(user.room)  

        socket.emit('message', generateMessage('Admin',`Welcome ${user.username}`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined the chat`))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)

        })
        callback()



    })


    socket.on('sendMessage',(msg,callback)=>{

       const user= getUser(socket.id)

        const filter= new Filter()

        if(filter.isProfane(msg))
        {
            return callback('Bad word used')
        }

        io.to(user.room).emit('message',generateMessage(user.username,msg))
        callback()
    })


    socket.on('sendLocation',(location,callback)=>{

        const user=  getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,location))
        callback()

    })




    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
    
            })
        }
    })
})




server.listen(port,()=>{

    console.log(`Express Server running on ${port}`)
})