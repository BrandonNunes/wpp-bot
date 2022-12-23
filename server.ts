import * as http from "http";
import {Server} from "socket.io";
import app from "./app";
import {createSection, qrCodeBase64, sessionName, sessionStatus} from "./src/bot";

const port = process.env.PORT || 9000;

const server = http.createServer(app)
export const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('qrcode', qrCodeBase64.value)
    io.emit('status', sessionStatus.value)
    io.emit('session', sessionName.value)
});


server.listen(port, () => {
    console.log(`Server listening on *:${port}`)
    createSection()
})
