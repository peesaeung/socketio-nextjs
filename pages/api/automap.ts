import {PrismaClient} from "@prisma/client/"

const prisma = new PrismaClient();
let hn: string = "01234", txn: string = "123456789", ser: string = "abcd";
export async function main() {
    // Search pid by HN
    let pid = await prisma.patient_info.findUnique({
        where: {
            org_id_hn: {
                org_id: 1,
                hn: hn
            }
        },
        select: {pid: true}
    });
    if (pid != null) {
        // Get pid
        console.log(pid);
    } else {
        // Create temp row
        await prisma.patient_info.create({data: {org_id: 1}}); // Forced HN null
        pid = await prisma.patient_info.findUnique({
            where: {
                org_id_hn: {
                    org_id: 1,
                    hn: null
                }
            },
            select: {pid: true}
        });
        console.log(pid);
    }
    // Search vid by TXN
    let vid = await prisma.txn_info.findUnique({
        where: {
            org_id_pid_txn: {
                org_id: 1,
                pid: pid.pid,
                txn: txn
            }
        },
        select: {vid: true}
    });
    if (vid != null) {
        // Get vid
        console.log(vid);
    } else {
        // Create temp row
        await prisma.txn_info.create({
            data: {
                org_id: 1,
                pid: pid.pid
            }
        }); // Forced TXN null
        vid = await prisma.txn_info.findUnique({
            where: {
                org_id_pid_txn: {
                    org_id: 1,
                    pid: pid.pid,
                    txn: null
                }
            },
            select: {vid: true}
        });
        console.log(vid);
    }
    // Search iid by SER
    let iid = await prisma.item_id.findUnique({
        where: {
            org_id_pid_vid_ser: {
                org_id: 1,
                pid: pid.pid,
                vid: vid.vid,
                ser: ser
            }
        },
        select: {iid: true}
    });
    if (iid != null) {
        // Get iid
        console.log(iid);
    } else {
        // Create temp row
        await prisma.item_id.create({
            data: {
                org_id: 1,
                pid: pid.pid,
                vid: vid.vid,
                ser: ser
            }
        });
        iid = await prisma.item_id.findUnique({
            where: {
                org_id_pid_vid_ser: {
                    org_id: 1,
                    pid: pid.pid,
                    vid: vid.vid,
                    ser: ser
                }
            },
            select: {iid: true}
        });
        console.log(iid);
    }
    return {
        'HN': hn,
        'pid': pid.pid,
        'TXN': txn,
        'vid': vid.vid,
        'SER': ser,
        'iid': iid.iid
    };
}
let reqmap = main();
console.log(reqmap);
