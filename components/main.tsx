import Script from "next/script";
import React, {useEffect} from "react";
import io from "socket.io-client";

export var mainlog:string
export default function Main({children}: {children: React.ReactNode}) {

    /*        socket.on('connect', async ()=> {
                await socket.emit('event', {data: 'Transmission Test Passed'})
            })*/

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
