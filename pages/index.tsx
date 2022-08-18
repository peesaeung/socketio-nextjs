import Main from "../components/main";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";


export default function Index() {
    return(
        <Main>
            <Head>
                <title>Next.js Socket.IO Test</title>
            </Head>
            <Link href="/patient"><a>Patient Data</a></Link>&nbsp;
            <Link href="/visit"><a>Visit Data</a></Link><br/>
            <div><p id="log"></p></div>
        </Main>
    );
}
