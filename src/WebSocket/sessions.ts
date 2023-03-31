import { Socket } from 'socket.io';
import WebSocket from '.';

export let Sessions: Array<{ socketId: string, userId: number }> = [];

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", (reason, description) => {
        console.log("Socket disconnected", reason, description);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
    });

    socket.on("session-connect", (data: number) => {
        if(!Sessions.find(s => s.userId === data )) {
            Sessions.push({ socketId: socket.id, userId: data});
        };
    });

    socket.on("session-disconnect", () => {
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
    });
});