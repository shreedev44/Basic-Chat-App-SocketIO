import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";


const app = express();
const server = createServer(app)
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/:name', (req, res) => {
    res.render('index', {name: req.params.name});
})
let users = {};
let userArr = new Set();;

io.on('connection', (socket) => {
    socket.on('login', (userId) => {
        users[userId] = socket.id;
        userArr.add(userId);
        io.emit('userList', [...userArr]);
    });
    console.log(userArr)
    socket.on('disconnect', () => {
        for(let user in users){
            if(users[user] == socket.id){
                delete users[user];
                userArr.delete(user)
            }
        }
    })
    socket.on('chat', (msg) => {
        io.emit('chat', {message: msg.message, from: msg.from})
    })
})

server.listen(3000, () => console.log('server running'));