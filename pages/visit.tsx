import Main, {socket} from "../components/main";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function visit_page() {
    const txn_submit = async (event: any)=> {
        event.preventDefault();
        console.log(event.target);
        // await socket.emit('visit', txnselect)
    };
    return (
        <Main>
            <Head>
                <title>Visit Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Visit</h3>
            <form onSubmit={txn_submit} method="post">
                <div>

                </div>
                <p>
                    <input type="button" value="Add more" id="add-txn-button"/>
                    <input type="button" value="Remove Selected" id="remove-txn-button"/>
                </p>
                {/*<input type="button" value="Submit Visit Data" name="txn-submit" id="txn-submit"/>*/}
                <button type="submit">Submit Visit Data</button>
            </form>
        </Main>
    );
}
