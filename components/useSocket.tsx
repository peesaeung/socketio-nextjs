import {useEffect, useState} from "react";
import io from "socket.io-client";

export let socketio = io();

export function useSocket() {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        fetch('/api/socketio').finally(() => {
            socketio.on('connect', () => {
                console.log('connect');
                socketio.emit('event', {data: 'Transmission Test Passed'});
            });
            socketio.on('disconnect', () => {
                console.log('disconnect')
            });
            socketio.on('response', (msg) => {
                console.log(msg);
            });
            setSocket(socketio);

            function cleanup() {
                socket.disconnect()
            }

            return cleanup;
        })
    }, [])
    return socket;
}
