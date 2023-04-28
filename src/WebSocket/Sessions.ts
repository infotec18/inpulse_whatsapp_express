import { Socket } from 'socket.io';
import WebSocket from './WebSocket';
import { runningAttendances } from './WhatsappClient';
import { UsersSessions } from './UsersSessions';

export const Sessions = new UsersSessions();

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", () => Sessions.removeSession(socket.id));

    socket.on("session-connect", (id: number) => Sessions.addSession(id, socket.id));

    socket.on("session-disconnect", () => Sessions.removeSession(socket.id));

    socket.on("pause-attendances", () => Sessions.pauseSession(socket.id));

    socket.on("resume-attendances", () => Sessions.resumeSession(socket.id));

    socket.on("join-room", (id: number) => {
        socket.join(`room_operator_${id}`);
        runningAttendances.returnOperatorAttendances(id);

        socket.on("leave-room", () => {
            socket.leave(`room_operator_${id}`);
        });
    });

    socket.on("joinAttendanceRoom", () => {
        socket.join("attendanceRoom");
        runningAttendances.emitUpdate();
    });

    socket.on("join-monitoria-operadores", () => {
        socket.join("monitoria-operadores");
        Sessions.emitUpdate();
    });
});