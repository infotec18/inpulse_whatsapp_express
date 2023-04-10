import { Socket } from 'socket.io';
import WebSocket from './WebSocket';
import { Session } from '../interfaces/attendances.interfaces';
import services from '../services';
import { runningAttendances } from './WhatsappClient';

export let Sessions: Array<Session> = [];

WebSocket.on('connection', (socket: Socket) => {
    console.log('Socket connected.', socket.id);

    socket.on("disconnect", (reason, description) => {
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
        console.log(`${socket.id} is disconnected. reason: ${reason}.`)
    });

    socket.on("session-connect", async(data: number) => {
        if(!Sessions.find(s => s.userId === data )) {
             await services.users.getOneById(data)
            .then(res => {
                const isAdmin: boolean = res.NIVEL === "ADMIN";
                Sessions.push({ socketId: socket.id, userId: data, admin: isAdmin});
                if(!isAdmin) {
                    const op_attendances = runningAttendances.value.filter(ra => ra.CODIGO_OPERADOR === data);
                    WebSocket.to(socket.id).emit("load-attendances", op_attendances)
                };
            });
        };
    });

    socket.on("session-disconnect", () => {
        Sessions = Sessions.filter(s => s.socketId !== socket.id);
    });
});