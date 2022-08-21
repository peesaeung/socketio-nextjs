import { Server } from 'socket.io'

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            console.log('Connected socket.io')
            //socket.broadcast.emit('a user connected')
            /*socket.on('hello', msg => {
                socket.emit('hello', 'world!')
            })*/
            socket.on('event', async (msg)=> {
                socket.emit('response',{'data': msg.data})
            });
            socket.on('patient',async (msg)=>{
                console.log(msg);
                await socket.emit('hn_response', {'data':msg})
            });
            socket.on('visit',async (msg)=>{
                console.log(msg);
                await socket.emit('txn_response', {'data':msg})
            });
        })

        res.socket.server.io = io
    } else {
        console.log('socket.io already running')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler
