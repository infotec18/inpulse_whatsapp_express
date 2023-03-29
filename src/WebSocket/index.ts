import { Server, Socket } from 'socket.io';

const WebSocket = new Server();

export let Sessions: Array<{ socketId: string, userId: number }> = [];

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", (reason, description) => {
        console.log("Socket disconnected", reason, description);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(Sessions);
    });

    socket.on("session-connect", (data: number) => {
        if(!Sessions.find(s => s.userId === data )) {
            Sessions.push({ socketId: socket.id, userId: data});
        };
        console.log(Sessions);
    });

    socket.on("session-disconnect", () => {
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(Sessions);
    });

});

export default WebSocket;