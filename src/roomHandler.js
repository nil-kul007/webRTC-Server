const {v4 : uuidv4} = require('uuid')

const rooms = {}
const roomHandler = (socket) => {
  const createRoom = ({customerId}) => {
    // const roomId = uuidv4();
    const roomId = customerId;
    rooms[roomId] = []
    socket.emit('room-created', {roomId})
    console.log('Room Create With ID: ', roomId)
  }
  const leaveRoom = ({roomId, peerId}) => {
    console.log("User left the room Callback", peerId);
    if(rooms[roomId]) rooms[roomId]= rooms[roomId].filter( id => id !== peerId)
    socket.to(roomId).emit("user-disconnected", {peerId});
  }

  const joinRoom = ({ roomId, peerId }) => {
    if(rooms[roomId]){
      console.log('User Joined the room', roomId, peerId)
      rooms[roomId].push(peerId)
      socket.join(roomId)
      socket.to(roomId).emit('user-joined', { peerId })
      socket.emit('get-users', {roomId, users: rooms[roomId]})
    }
    socket.on('disconnect', () => {
      console.log("User left the room", peerId);
      leaveRoom({ roomId, peerId });
    })
  }


  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}

module.exports = roomHandler