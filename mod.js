
import crc32 from "npm:buffer-crc32";
import * as cons from "./const.js";




const add_zero_for_string = (content, length, direction) => {
    //    在str的左或右添加0
    //     :param str:待修改的字符串
    //     :param length:总共的长度
    //     :param direction:方向，True左，False右
    //     :return:

    //   let content = content+'';
    let str_len = content.length;
    if (str_len < length) {
        while (str_len < length) {
            if (direction) {
                content = "0" + content;
            } else {
                content = content + "0";
            }

            str_len = content.length;
        }
    }

    return content;
};


const to_message_header = (msg_type, total_msg_length) => {
    const return_str = cons.BAOSTOCK_CLIENT_VERSION + cons.MESSAGE_SPLIT + msg_type +
        cons.MESSAGE_SPLIT +
        add_zero_for_string(total_msg_length + '', 10 + '', true);
    return return_str;
};



// const query_stock_basic=()=>{

// }

export async function login2() {
    const conn = await Deno.connect({ hostname: cons.BAOSTOCK_SERVER_IP, port: cons.BAOSTOCK_SERVER_PORT });

    let user_id = this.user_id;
    let password = this.password;
    // # 组织体信息
    const msg_body = "login" + cons.MESSAGE_SPLIT + user_id + cons.MESSAGE_SPLIT +
        password + cons.MESSAGE_SPLIT + "0";

    // # 组织头信息
    const msg_header = to_message_header(
        cons.MESSAGE_TYPE_LOGIN_REQUEST, msg_body.length)
    const head_body = msg_header + msg_body
    //00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010
    console.log(head_body);

    //   const input = Buffer.from(head_body);
    //   const expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);
    //  let crc32str =  crc32(input)

    // let  crc32str = crc32(input).toString(10);
    const crc32str = crc32.unsigned(head_body, 'utf8').toString(10);
    console.log(crc32str);



    //"00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994\n"
    let msg = head_body + cons.MESSAGE_SPLIT + crc32str + '\n'
    console.log(msg)
    await conn.write(new TextEncoder().encode(msg));

    const buf = new Uint8Array(1024);
    const n = await conn.read(buf);
    let result = new TextDecoder().decode(buf.subarray(0, n))
    console.log(result);

    conn.close();

    return result

}


export class BaoStockApi {
    constructor(user_id = "anonymous", password = "123456") {
        this.user_id = user_id;
        this.password = password;
        
    }

    async login() {
        const conn = await Deno.connect({ hostname: cons.BAOSTOCK_SERVER_IP, port: cons.BAOSTOCK_SERVER_PORT });

        let user_id = this.user_id;
        let password = this.password;
        // # 组织体信息
        const msg_body = "login" + cons.MESSAGE_SPLIT + user_id + cons.MESSAGE_SPLIT +
            password + cons.MESSAGE_SPLIT + "0";

        // # 组织头信息
        const msg_header = to_message_header(
            cons.MESSAGE_TYPE_LOGIN_REQUEST, msg_body.length)
        const head_body = msg_header + msg_body
        //00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010
        console.log(head_body);

        //   const input = Buffer.from(head_body);
        //   const expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);
        //  let crc32str =  crc32(input)

        // let  crc32str = crc32(input).toString(10);
        const crc32str = crc32.unsigned(head_body, 'utf8').toString(10);
        console.log(crc32str);



        //"00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994\n"
        let msg = head_body + cons.MESSAGE_SPLIT + crc32str + '\n'
        console.log(msg)
        await conn.write(new TextEncoder().encode(msg));

        const buf = new Uint8Array(1024);
        const n = await conn.read(buf);
        let result = new TextDecoder().decode(buf.subarray(0, n))
        console.log(result);

        conn.close();

        return result

    }

    async query_stock_basic(){
        const conn = await Deno.connect({ hostname: cons.BAOSTOCK_SERVER_IP, port: cons.BAOSTOCK_SERVER_PORT });

        let msg="00.8.80\x0145\x010000000037query_stock_basic\x01anonymous\x011\x0110000\x01\x01\x01857658827"+'\n'
        await conn.write(new TextEncoder().encode(msg));

        const buf = new Uint8Array(1024);
        const n = await conn.read(buf);
        let result = new TextDecoder().decode(buf.subarray(0, n))
        console.log(result);

        conn.close();

        return result

    }
}