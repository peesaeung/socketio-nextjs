import Main from "../components/main";
import {socketio, useSocket} from "../components/useSocket";
import {ErrorMessage, Form, Formik, Field, FieldArray} from "formik";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";

const initialValues = {HNRaw: [{HN: ''}]};
const HNdataForm = () => (
    <div>
        <Formik initialValues={initialValues} onSubmit={async (values) => {
            let HNArr = [];
            for (const i in values.HNRaw) {
                HNArr.push(values.HNRaw[i].HN)
            }
            //console.log(HNArr)
            await socketio.emit('patient', HNArr);
        }}>
            {({values}) => (
                <Form>
                    <FieldArray name="HNRaw">
                        {({remove, push}) => (
                            <div>
                                {values.HNRaw.length > 0 && values.HNRaw.map((HN, index) => (
                                    <div className="hn" key={index}>
                                        <label htmlFor={`HNRaw.${index}.HN`}>HN:</label>
                                        <Field name={`HNRaw.${index}.HN`} placeholder="HN"/>
                                        <ErrorMessage name={`HNRaw.${index}.HN`} component="div"
                                                      className="field-error"/>
                                        <button type="button" className="remove_hn" onClick={() => remove(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="add_hn" onClick={() => {
                                    if (values.HNRaw.length < 10) {
                                        push({HN: ''})
                                    }
                                }}>
                                    Add more HN
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <button type="submit">Submit HN</button>
                </Form>
            )}
        </Formik>
    </div>
);
export default function patient_page() {
    let [hn_log, set_hn_log] = useState('')
    const socket = useSocket(); // Instance
    useEffect(() => {
        if (socket) {
            socket.on('hn_response', (msg) => {
                console.log(msg.data)
            });
        }
    }, [socket]);
    const hntext_submit = async (event: any) => {
        event.preventDefault();
        let hnArr = event.target.hnbox.value.split(' ', 10);
        //console.log(hnArr);
        await socketio.emit('patient', hnArr);
    }
    return (
        <Main>
            <Head>
                <title>Patient Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Patient</h3>
            <h4>Textarea</h4>
            <form onSubmit={hntext_submit} method="post">
                <p>
                    <label htmlFor="hnbox">HN:</label>
                    <textarea name="hnbox" id="hnbox" placeholder="Up to 10 HNs, separated by space bar"
                              cols="30" rows="5" required></textarea>
                </p>
                <button type="submit">Submit HN</button>
            </form>
            <h4>Multiple Textfield</h4>
            <HNdataForm/>
            <p>{hn_log}</p>
        </Main>
    );
}
