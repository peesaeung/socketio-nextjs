import { PrismaClient } from "@prisma/client/"
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from 'socket.io'

const prisma = new PrismaClient();
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
                /*
                for (let i in hn){
                    await prisma.xxx.findUnique({where: x: i});
                }
                 */
                // queried data should be looked like this
                const HNtest = [
                    {"org_id": 1, "hn": "01234", "birth_date": new Date("1987-06-05"), "gender": true},
                    {"org_id": 1, "hn": "56789", "birth_date": new Date("2000-12-31"), "gender": false},
                ];
                // Patient data (HN) >> Upsert HN >> PID
                // Upsert to patient_info db
                for (let i in HNtest){
                    await prisma.patient_info.upsert({
                        create: HNtest[i],
                        update: HNtest[i],
                        where: {org_id_hn: {org_id: HNtest[i]['org_id'], hn: HNtest[i]['hn']}}
                    });
                    await socket.emit('hn_response', {'data':HNtest[i]});
                }



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
            socket.on('visit',async (txn)=>{
                // req should be looked like this
                /*const TXNForm = [
                    {"org_id: 1, "HN":"55/5555", "txn": "A90909", "type": false},
                    {"org_id: 1, "HN":"315646", "txn": "566410909", "type": true}
                ]*/
                // Visit data (HN, TXN) >> Transform >> PID
                /*
                for (let i in txn){
                    let buff = await prisma.patient_info.findUnique({
                    where: {org_id_hn: {org_id: TXNForm[i]['org_id'], hn: TXNForm[i]['HN']}}
                    });
                    txn[i].pid = buff.pid;
                    delete txn[i].HN;
                }
                */
                console.log(txn);
                /*
                for (let i in txn){
                    await prisma.xxx.findUnique({where: allUnique: {HN: , TXN: , IPD: }});
                }
                 */
                // TXN >> Upsert TXN >> PID, VID
                // queried data should be looked like this
                const TXNtest = [
                    {
                        "org_id": 1,
                        "pid": 1,
                        //"HN":"00000",
                        "txn": "123456789",
                        "type": false,
                        "visit_time": new Date("2022-02-02T20:22:02Z"),
                        "discharge_time": new Date("2022-02-02T22:22:22Z"),
                        //"dischargeStatus": 2,
                        //"dischargeType": 1
                    },
                    {
                        "org_id": 1,
                        "pid": 2,
                        //"HN":"00001",
                        "txn": "2345678",
                        "type": false,
                        "visit_time": new Date("2022-02-02T22:22:22Z"),
                        "discharge_time": new Date("2022-02-22T02:20:00Z"),
                        //"dischargeStatus": 3,
                        //"dischargeType": 5
                    },
                    {
                        "org_id": 1,
                        "pid": 2,
                        //"HN":"00001",
                        "txn": "A987654VIP",
                        "type": true,
                        "visit_time": new Date("2022-02-02T02:20:00Z"),
                        "discharge_time": new Date("2022-02-22T22:22:22Z"),
                        "related_txn": ["2345678"],
                        //"dischargeStatus": 2,
                        //"dischargeType": 1,
                        "los": 23   // Length of Stay
                    }
                ]
                // Transform >> PID, TXN >> Upsert TXN >> PID, VID
                // Upsert to txn_info db
                for (let i in TXNtest){
                    await prisma.txn_info.upsert({
                        create: TXNtest[i],
                        update: TXNtest[i],
                        where: {org_id_pid_txn: {
                            org_id: TXNtest[i]['org_id'], pid: TXNtest[i]['pid'], txn: TXNtest[i]['txn']}
                        }
                    });
                    await socket.emit('txn_response', {'data':TXNtest[i]});
                }
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
