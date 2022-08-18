import Main, {socket} from "../components/main";
import {ErrorMessage, Form, Formik, Field, FieldArray} from "formik";
import Head from "next/head";
import Link from "next/link";

socket.on('txn_response', async (msg)=> {

});
const initialValues = {
    TXNForm: [{HN: '', TXN: '', IPD: true}]};
const VisitForm = () => (
    <div>
        <Formik initialValues={initialValues} onSubmit={async (values) => {
            for (const i in values.TXNForm){
                let isTrue = (values.TXNForm[i].IPD === "true");
                values.TXNForm[i].IPD = isTrue;
            }
            console.log(values);
            // await socket.emit('patient', values);
        }}>
            {({ values }) => (
                <Form>
                    <FieldArray name="TXNForm">
                        {({ insert, remove, push }) => (
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
                                <button type="button" className="add_txn" onClick={() => push({HN: '', TXN: '', IPD: true})}>
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
    return (
        <Main>
            <Head>
                <title>Visit Data</title>
            </Head>
            <Link href="/">Back</Link>
            <h3>Visit</h3>
            <VisitForm/>
            <p id="txn-log"></p>
        </Main>
    );
}
