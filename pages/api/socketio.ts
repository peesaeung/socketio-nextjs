import { NextApiRequest, NextApiResponse } from "next";
import { Server } from 'socket.io'
import { Client, Pool } from "pg";
import { host, user, password, database} from "./pgpool";

const pool = new Pool({
    host: host,
    user: user,
    password: password,
    database: database
});

const ioHandler = (req:NextApiRequest, res:NextApiResponse) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            // All Server Instance Here
            console.log('Connected socket.io')
            // Echo
            socket.on('event', async (msg)=> {
                socket.emit('response',{'data': msg.data})
            });
            // Patient Data
            // HN = Normal Array
            socket.on('patient',async (hn)=>{
                console.log(hn);
                // Querying from Hospital db by HN
                // queried data should be looked like this
                const HNtest = [
                    {"HN": "01234", "birthDate": "1987-06-05", "gender": true},
                    {"HN": "56789", "birthDate": "2000-12-31", "gender": false},
                ];
                //console.log(HNtest);
                /*for (let i in HNtest){
                    /!*
                    SQL
                        INSERT INTO patient_info (hn, birth_date, gender)
                        VALUES (HN.HN, HN.birthDate, HN.gender)
                    *!/
                    let sql = "INSERT INTO patient_info (hn, birth_date, gender) VALUES ("
                        + HNtest[i].HN + ", " + HNtest[i].birthDate + ", " + HNtest[i].gender + ")"
                    console.log(sql);
                }*/
                // Patient data (HN) >> Upsert HN >> PID
                // Upsert to patient_info db
                await socket.emit('hn_response', {'data':hn});
                await pool.connect((err, client, done) => {
                    if (err) throw err;
                    for (let i in HNtest){
                        /*
                        SQL
                            INSERT INTO patient_info (hn, birth_date, gender)
                            VALUES (HN.HN, HN.birthDate, HN.gender)
                        */
                        let sql = "INSERT INTO patient_info (hn, birth_date, gender) VALUES ("
                            + HNtest[i].HN + ", " + HNtest[i].birthDate + ", " + HNtest[i].gender + ")"
                        console.log(sql);
                    }
                    /*
                        client.query(sql, (err, res) => {
                            done();
                            if (err) {
                                console.log(err.stack);
                            } else {
                                console.log(res.rows);
                            }
                        });
                    }*/
                });
                // await socket.emit('patient', data, register=true)
            });
            // Patient Secret
            /* req should be looked like this
            [
                {"HN":"55/5555", "TXN": "A90909", "reason":"export complete th:sss:NCD menu", "staff":"S123"},
                {"HN":"e5555", "TXN": "0909", "reason":"coder work desk", "staff":"employee@organization.com"}
            ]
            */
            socket.on('patientSecret', async (req)=>{
                //Query data from ...
                /* queried data should be looked like this
                [
                    {
                        "HN": "01234",
                        "realHN": "2562525",
                        "title": "นาย",
                        "firstname": "กกกกกกกก",
                        "lastname": "ขขขขขขข"
                    },
                    {
                        "HN": "56789",
                        "TXN": "156da19453",
                        "realHN": "564654",
                        "realTXN": "901234",
                        "title": "Miss",
                        "firstname": "Abcdefg",
                        "middlename": "Hijklmn Opqrst",
                        "lastname": "Uvwxyz"
                    }
                ]
                */
                // await socket.emit('patientSecret', data)
            });
            // Visit Data
            /* req should be looked like this
            [
                {"HN":"55/5555", "TXN": "A90909", "IPD": false},
                {"HN":"315646", "TXN": "566410909", "IPD": true}
            ]
            */
            socket.on('visit',async (req)=>{
                // Visit data (HN, TXN) >> Transform >> PID, TXN >> Upsert TXN >> PID, VID
                console.log(req);
                // Querying from ...
                /* queried data should be looked like this
                [
                    {
                        "HN":"00000",
                        "TXN": "123456789",
                        "IPD": 0,
                        "visitTime": "2022-02-02T20:22:02Z",
                        "dischargeTime": "2022-02-02T22:22:22Z",
                        "dischargeStatus": 2,
                        "dischargeType": 1
                    },
                    {
                        "HN":"00001",
                        "TXN": "2345678",
                        "IPD": 0,
                        "visitTime": "2022-02-02T22:22:22Z",
                        "dischargeTime": "2022-02-22T02:20:00Z",
                        "dischargeStatus": 3,
                        "dischargeType": 5
                    },
                    {
                        "HN":"00001",
                        "TXN": "A987654VIP",
                        "IPD": 1,
                        "visitTime": "2022-02-02T02:20:00Z",
                        "dischargeTime": "2022-02-22T22:22:22Z",
                        "relatedTXN": ["2345678"],
                        "dischargeStatus": 2,
                        "dischargeType": 1,
                        "lengthOfStay": 23
                    }
                ]*/
                // Transform >> PID, TXN >> Upsert TXN >> PID, VID
                await socket.emit('txn_response', {'data':req})
                // Upsert to txn_info db
                // await socket.emit('thVisit', data, register=true)
            });
        })
        res.socket.server.io = io;
    } else {
        console.log('socket.io already running')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler
