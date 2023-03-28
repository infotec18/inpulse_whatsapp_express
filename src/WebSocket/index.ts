import { Server, Socket } from 'socket.io';

const WebSocket = new Server();

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", (reason, description) => {
        console.log("Socket disconnected", reason, description);
    });
});

export default WebSocket;