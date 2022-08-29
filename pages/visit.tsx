import Main from "../components/main";
import {socketio, useSocket} from "../components/useSocket";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";

const initialValues = {
    TXNForm: [{
        org_id: 1,
        HN: '',
        txn: '',
        type: true
    }]
};
const VisitForm = () => (
    <div>
        <Formik initialValues={initialValues} onSubmit={async (values) => {
            for (const i in values.TXNForm){
                //let isTrue = (values.TXNForm[i].type === "true" || values.TXNForm[i].type === true);
                //values.TXNForm[i].type = isTrue;
                values.TXNForm[i].type = values.TXNForm[i].type === "true" || values.TXNForm[i].type === true;
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
                                        <label htmlFor={`TXNForm.${index}.txn`}>TXN:</label>
                                        <Field name={`TXNForm.${index}.txn`} placeholder="TXN"/>
                                        <ErrorMessage name={`TXNForm.${index}.txn`} component="div"
                                                      className="field-error"/>
                                        <label htmlFor={`TXNForm.${index}.type`}>Type:</label>
                                        <Field name={`TXNForm.${index}.type`} as="select">
                                            <option value="true">IPD</option>
                                            <option value="false">OPD</option>
                                        </Field>
                                        <button type="button" className="remove_txn" onClick={() => remove(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="add_txn" onClick={() => {
                                    if(values.TXNForm.length < 10){
                                        push({
                                            org_id: 1,
                                            HN: '',
                                            txn: '',
                                            type: true
                                        })
                                    }
                                }}>Add more HN</button>
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
            socket.on('txn_response', (msg)=> {console.log(msg.data)});
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
