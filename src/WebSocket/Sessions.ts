import { Socket } from 'socket.io';
import WebSocket from './WebSocket';
import { Session } from '../interfaces/attendances.interfaces';
import { runningAttendances } from './WhatsappClient';

export let Sessions: Array<Session> = [];

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", () => {
        const findSession = Sessions.find(u => u.socketId === socket.id);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(`${socket.id} disconnected. user: ${findSession && findSession.userId}`);
    });

    socket.on("session-connect", async(id: number) => {
        Sessions.push({ socketId: socket.id, userId: id });
        console.log(`${socket.id} connected. user: ${id}`)
    });

    socket.on("session-disconnect", () => {
        const findUser = Sessions.find(u => u.socketId === socket.id);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(`${socket.id} disconnected. user: ${findUser && findUser.userId}`);
    });

    socket.on("join-room", (id: number) => {
        socket.join(`room_operator_${id}`);
        runningAttendances.returnOperatorAttendances(id);

        socket.on("leave-room", () => {
            socket.leave(`room_operator_${id}`);
        });
    });
});