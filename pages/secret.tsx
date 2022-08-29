import Main from "../components/main";
import {socketio, useSocket} from "../components/useSocket";
import {ErrorMessage, Form, Formik, Field, FieldArray} from "formik";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";

const initialValues = {
    secret: [{
        HN: '',
        txn: '',
        title: '',
        firstname: '',
        middlename: '',
        lastname: ''
    }]
};
const SecretForm = () => (
    <div>
        <Formik initialValues={initialValues} onSubmit={async (values) => {
            await socketio.emit('patientSecret', values);
        }}>
            {({values}) => (
                <Form>
                    <FieldArray name="secret">
                        {({remove, push}) => (
                            <div>
                                {values.secret.length > 0 && values.secret.map((x, index) => (
                                    <div className="secret" key={index}>
                                        <div>
                                            <div>
                                                <label htmlFor={`secret.${index}.HN`}>HN:</label>
                                                <Field name={`secret.${index}.HN`} placeholder="HN"/>
                                                <ErrorMessage name={`secret.${index}.HN`} component="div"
                                                              className="field-error"/>
                                                <label htmlFor={`secret.${index}.txn`}>TXN:</label>
                                                <Field name={`secret.${index}.txn`} placeholder="TXN"/>
                                                <ErrorMessage name={`secret.${index}.txn`} component="div"
                                                              className="field-error"/>
                                            </div>
                                            <div>
                                                <label htmlFor={`secret.${index}.title`}>Title:</label>
                                                <Field name={`secret.${index}.title`} placeholder="Title"/>
                                                <ErrorMessage name={`secret.${index}.title`} component="div"
                                                              className="field-error"/>
                                                <label htmlFor={`secret.${index}.firstname`}>First Name:</label>
                                                <Field name={`secret.${index}.firstname`} placeholder="First Name"/>
                                                <ErrorMessage name={`secret.${index}.firstname`} component="div"
                                                              className="field-error"/>
                                                <label htmlFor={`secret.${index}.firstname`}>Middle Name:</label>
                                                <Field name={`secret.${index}.middlename`} placeholder="Middle Name"/>
                                                <ErrorMessage name={`secret.${index}.middlename`} component="div"
                                                              className="field-error"/>
                                                <label htmlFor={`secret.${index}.lastname`}>Last Name:</label>
                                                <Field name={`secret.${index}.lastname`} placeholder="Last Name"/>
                                                <ErrorMessage name={`secret.${index}.lastname`} component="div"
                                                              className="field-error"/>
                                            </div>
                                            <button type="button" className="remove_secret" onClick={() =>
                                                remove(index)}>Remove
                                            </button>
                                        </div>
                                        <br/>
                                    </div>
                                ))}
                                <button type="button" className="add_secret" onClick={() => {
                                    push({
                                        HN: '',
                                        txn: '',
                                        title: '',
                                        firstname: '',
                                        middlename: '',
                                        lastname: ''
                                    })
                                }}>Add more
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <button type="submit">Submit Secret</button>
                </Form>
            )}
        </Formik>
    </div>
)
export default function secret_page() {
    let [secret_log, set_secret_log] = useState('')
    const socket = useSocket(); //Instance
    useEffect(() => {
        if (socket) {
            socket.on('secret_response', (msg) => {
                console.log(msg.data)
                //set_txn_log(txn_log = msg.data);
            });
        }
    }, [socket]);
    return (
        <Main>
            <Head>
                <title>Patient Secret Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Patient Secret</h3>
            <SecretForm/>
            {/*<p>{secret_log}</p>*/}
        </Main>
    );
}
