import { User } from "../entities/user.entity";
import services from "../services";
import WebSocket from "./WebSocket";

type userStatus = "online" | "offline" | "paused";

interface UserSessions {
    userId: number;
    userData: User;
    sessions: Array<string>;
    status: userStatus;
    attendances: number;
};

export class UsersSessions {
    value: Array<UserSessions> = [];

    async addSession(userId: number, socketId: string | null) {
        const findUser: User | null = await services.users.getOneById(userId);
        const findSessionsIndex: number = this.value.findIndex(s => s.userId === userId);

        if(findUser && !!~findSessionsIndex && socketId) {
            const findSessions = this.value[findSessionsIndex];
            const sessions = new Set([...findSessions.sessions, socketId]);
            this.value[findSessionsIndex].sessions = Array.from(sessions);
            this.value[findSessionsIndex].status = "online"; 
            console.log(new Date().toLocaleString(), `: User ID: ${this.value[findSessionsIndex].userId} is online in ${Array.from(sessions).length} sessions.`);

            const isPaused: boolean = this.value[findSessionsIndex].status === "paused";
            if(isPaused) WebSocket.to(`room_operator_${findUser.CODIGO}`).emit("paused");
            else WebSocket.to(`room_operator_${findUser.CODIGO}`).emit("resumed");

            this.emitUpdate();

        } else if (findUser && !~findSessionsIndex) {
            this.value.push({
                userId: findUser.CODIGO,
                userData: findUser,
                status: socketId ? "online" : "offline",
                sessions: socketId ? [socketId] : [],
                attendances: 0
            });
            socketId && console.log(new Date().toLocaleString(), `: User ID: ${findUser.CODIGO} is online.`);
            this.emitUpdate();
            

            WebSocket.to(`room_operator_${findUser.CODIGO}`).emit("resumed");
        };
    };

    async removeSession(socketId: string) {
        const findSessionsIndex: number = this.value.findIndex(s => s.sessions.includes(socketId));

        if(!!~findSessionsIndex) {
            this.value[findSessionsIndex].sessions = this.value[findSessionsIndex].sessions.filter(s => s !== socketId);

            if(!this.value[findSessionsIndex].sessions.length) {
                this.value[findSessionsIndex].status = "offline";
                console.log(new Date().toLocaleString(), `: User ID: ${this.value[findSessionsIndex].userId} is offline.`);
                this.emitUpdate();
            };
        };
    };

    async pauseSession(socketId: string) {
        const findSessionsIndex: number = this.value.findIndex(s => s.sessions.includes(socketId));

        if(!!~findSessionsIndex) {
            this.value[findSessionsIndex].status = "paused";
            this.emitUpdate();
            console.log(new Date().toLocaleString(), `: User ID: ${this.value[findSessionsIndex].userId} is paused.`);

            WebSocket.to(`room_operator_${this.value[findSessionsIndex].userId}`).emit("paused");

        };
    };

    async resumeSession(socketId: string) {
        const findSessionsIndex: number = this.value.findIndex(s => s.sessions.includes(socketId));

        if(!!~findSessionsIndex) {
            this.value[findSessionsIndex].status = "online";
            this.emitUpdate();
            console.log(new Date().toLocaleString(), `: User ID: ${this.value[findSessionsIndex].userId} is online`);

            WebSocket.to(`room_operator_${this.value[findSessionsIndex].userId}`).emit("resumed");
        };
    }

    async updateOperatorRunningAttendances(userId: number, attendances: number) {
         const findSessionIndex: number = this.value.findIndex(s => s.userId === userId);
         if(findSessionIndex >= 0) {
            this.value[findSessionIndex].attendances = attendances;
         } else {
            const findUser = await services.users.getOneById(userId);
            if(findUser) {
                this.value.push({
                    attendances: attendances,
                    sessions: [],
                    status: "offline",
                    userData: findUser,
                    userId: userId
                });
            };
         };
         this.emitUpdate();
    };

    async getOperatorSession(userId: number) {
        return this.value.find(u => u.userId === userId) || undefined;
    };

    emitUpdate() {
        WebSocket.to("monitoria-operadores").emit("operators-status", this.value);
    };


};