import Main from "../components/main";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function patient_page() {
    return (
        <Main>
            <Head>
                <title>Patient Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Patient</h3>
        </Main>
    );
}
