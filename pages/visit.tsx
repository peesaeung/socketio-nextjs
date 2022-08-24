import Main from "../components/main";
import { ErrorMessage, Form, Formik, Field, FieldArray } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socketio = io();
function useSocket() {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        fetch('/api/socketio').finally(() => {
            //socketio = io()

            socketio.on('connect', () => {
                console.log('connect');
                //socket.emit('hello');
                socketio.emit('event', {data: 'Transmission Test Passed'});
            });
            socketio.on('disconnect', () => {
                console.log('disconnect')
                //mainlog += "\nDisconnected";
            });
            socketio.on('response', (msg) => {
                console.log(msg);
            });

            setSocket(socketio);
            function cleanup() {
                socket.disconnect()
            }
            return cleanup;
            /*socket.on('response', (msg) => {
                //mainlog += ('\n' + msg.data);
            });*/

            /*socket.on('hello', data => {
                console.log('hello', data)
            });*/

            /*socket.on('a user connected', () => {
                console.log('a user connected')
            });*/

        })
    }, [])
    return socket;
}
/*const txn_submit = (txn)=>{
    socketio.emit()
}*/
const initialValues = {
    TXNForm: [{HN: '', TXN: '', IPD: true}]};
const VisitForm = () => (
    <div>
        <Formik initialValues={initialValues} onSubmit={async (values) => {
            for (const i in values.TXNForm){
                let isTrue = (values.TXNForm[i].IPD === "true" || values.TXNForm[i].IPD === true);
                values.TXNForm[i].IPD = isTrue;
            }
            //console.log(values);

            await socketio.emit('visit', values);
        }}>
            {({ values }) => (
                <Form>
                    <FieldArray name="TXNForm">
                        {({ remove, push }) => (
                            <div>
                                {values.TXNForm.length > 0 && values.TXNForm.map((TXN, index) => (
                                    <div className="txn" key={index}>
                                        <label htmlFor={`TXNForm.${index}.HN`}>HN:</label>
                                        <Field name={`TXNForm.${index}.HN`} placeholder="HN"/>
                                        <ErrorMessage name={`TXNForm.${index}.HN`} component="div"
                                                      className="field-error"/>
                                        <label htmlFor={`TXNForm.${index}.TXN`}>TXN:</label>
                                        <Field name={`TXNForm.${index}.TXN`} placeholder="TXN"/>
                                        <ErrorMessage name={`TXNForm.${index}.TXN`} component="div"
                                                      className="field-error"/>
                                        <label htmlFor={`TXNForm.${index}.IPD`}>Type:</label>
                                        <Field name={`TXNForm.${index}.IPD`} as="select">
                                            <option value="true">IPD</option>
                                            <option value="false">OPD</option>
                                        </Field>
                                        <button type="button" className="remove_txn" onClick={() => remove(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="add_txn" onClick={() => {
                                    if(values.TXNForm.length < 10){push({HN: '', TXN: '', IPD: true})}
                                }}>
                                    Add more HN
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <button type="submit">Submit Visit Data</button>
                </Form>
            )}
        </Formik>
    </div>
);
export default function visit_page() {
    let [txn_log, set_txn_log] = useState('')
    const socket = useSocket(); //Instance
    useEffect(() => {
        if (socket) {
            /*socket.on('hello', (data) => {
                console.log('hello', data);
                //setMessage(data);
            });*/
            /*socket.on('a user connected', () => {
                //setUser('a user connected');
            });*/
            socket.on('txn_response', (msg)=> {
                console.log(msg.data)
                //set_txn_log(txn_log = msg.data);
            });
        }
    }, [socket]);
    return (
        <Main>
            <Head>
                <title>Visit Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Visit</h3>
            <VisitForm/>
            <p>{txn_log}</p>
        </Main>
    );
}
