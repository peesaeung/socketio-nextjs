import Script from "next/script";
import React from "react";
import { io } from "socket.io-client";

export const socket = io({autoConnect: true});
socket.on('connect', async ()=> {
    await socket.emit('event', {data: 'Transmission Test Passed'})
})
socket.on('disconnect', async ()=> {

})
socket.on('response', async (msg)=> {

})
export default function Main({children}: {children: React.ReactNode}) {
    return(
        <div>
            <header><h2>Fill-In</h2></header>
            <main>
                {children}
                {/*<Script type="text/javascript">

                </Script>*/}
            </main>
            <footer style={{textAlign: 'center'}}>&copy; {new Date().getFullYear()}</footer>
        </div>
    )
}
