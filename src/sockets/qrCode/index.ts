import { Server } from 'socket.io';
import client from '..';
const qrcode = require('qrcode-terminal');

const io = new Server(5000);

io.on('connection', (socket: any) => {
    console.log('Socket connected.', socket.id);

    client.on('qr', (qr: string) => {
        socket.emit('qr', qr);
        qrcode.generate(qr, {small: true})
    })

    client.on('authenticated', () => {
        socket.emit('authenticated', 'Cliente autenticado com sucesso.')
    })
})