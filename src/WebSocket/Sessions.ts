import { Socket } from 'socket.io';
import WebSocket from './WebSocket';
import { Session } from '../interfaces/attendances.interfaces';
import { runningAttendances } from './WhatsappClient';

export let Sessions: Array<Session> = [];
export let PausedUsers: Array<number> = [];

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", () => {
        const findSession = Sessions.find(u => u.socketId === socket.id);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(`${socket.id} disconnected. user: ${findSession && findSession.userId}`);
    });

    socket.on("session-connect", async(id: number) => {
        const isPaused: boolean = PausedUsers.includes(id);
        Sessions.push({ socketId: socket.id, userId: id });

        if(isPaused) socket.emit("paused");
        else socket.emit("resumed");

        console.log(`${socket.id} connected. user: ${id}`)
    });

    socket.on("session-disconnect", () => {
        const findUser = Sessions.find(u => u.socketId === socket.id);
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(`${socket.id} disconnected. user: ${findUser && findUser.userId}`);
    });

    socket.on("pause-attendances", () => {
        const findUser = Sessions.find(s => s.socketId === socket.id);
        if(findUser && findUser.userId) {
            PausedUsers.push(findUser.userId);
            socket.emit("paused");
        };
    });

    socket.on("resume-attendances", () => {
        const findUser = Sessions.find(s => s.socketId === socket.id);
        if(findUser && findUser.userId) {
            PausedUsers = PausedUsers.filter(id => id !== findUser.userId);
            socket.emit("resumed");
        };
    });

    socket.on("join-room", (id: number) => {
        socket.join(`room_operator_${id}`);
        runningAttendances.returnOperatorAttendances(id);

        socket.on("leave-room", () => {
            socket.leave(`room_operator_${id}`);
        });
    });
});