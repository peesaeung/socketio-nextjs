import Main from "../components/main";
import Head from "next/head";
import Link from "next/link";

let mainlog:string

export default function Index() {
/*    socket.on('disconnect', ()=> {
        mainlog += "\nDisconnected";
    })
    socket.on('response', async (msg)=> {
        mainlog += ('\n' + msg.data);
    })*/
    return(
        <Main>
            <Head>
                <title>Next.js Socket.IO Test</title>
            </Head>
            <Link href="/patient"><a>Patient Data</a></Link>&nbsp;
            <Link href="/visit"><a>Visit Data</a></Link><br/>
            <p>{mainlog}</p>
        </Main>
    );
}
