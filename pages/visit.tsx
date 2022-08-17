import Main from "../components/main";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function visit_page() {
    return (
        <Main>
            <Head>
                <title>Visit Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Visit</h3>
        </Main>
    );
}
