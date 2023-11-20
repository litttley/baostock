// import CRC32 from "npm:crc-32";
import { crc32 } from "https://deno.land/x/crc32/mod.ts";
// import {crc32} from 'https://deno.land/x/crc32hash@v1.0.0/mod.ts';
// import { crc32 } from "https://deno.land/x/compress@v0.3.8/zlib/zlib/crc32.ts";

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
  const return_str = cons.BAOSTOCK_CLIENT_VERSION + cons.MESSAGE_SPLIT +
    msg_type +
    cons.MESSAGE_SPLIT +
    add_zero_for_string(total_msg_length + "", 10, true);
  return return_str;
};

// const query_stock_basic=()=>{

// }

export async function login2() {
  const conn = await Deno.connect({
    hostname: cons.BAOSTOCK_SERVER_IP,
    port: cons.BAOSTOCK_SERVER_PORT,
  });

  let user_id = "anonymous";
  let password = "123456";
  // # 组织体信息
  const msg_body = "login" + cons.MESSAGE_SPLIT + user_id + cons.MESSAGE_SPLIT +
    password + cons.MESSAGE_SPLIT + "0";

  // # 组织头信息
  const msg_header = to_message_header(
    cons.MESSAGE_TYPE_LOGIN_REQUEST,
    msg_body.length,
  );
  const head_body = msg_header + msg_body;
  //00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010
  // console.log(head_body);

  //   const input = Buffer.from(head_body);
  //   const expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);
  //  let crc32str =  crc32(input)

  // let  crc32str = crc32(input).toString(10);
  // const crc32str = crc32.unsigned(head_body, 'utf8').toString(10);
  const crc32str = CRC32.buf(new TextEncoder().encode(head_body)) >>> 0;
  console.log(crc32str);

  //"00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994\n"
  let msg = head_body + cons.MESSAGE_SPLIT + crc32str + "\\n";
  console.log(msg);
  await conn.write(new TextEncoder().encode(msg));

  const buf = new Uint8Array(1024);
  const n = await conn.read(buf);
  let result = new TextDecoder().decode(buf.subarray(0, n));
  console.log(result);

  conn.close();

  return result;
}

export class BaoStockApi {
  constructor(user_id = "anonymous", password = "123456") {
    this.user_id = user_id;
    this.password = password;
    this.isLogin = false;
  }

  async send_msg(msg) {
    try {
      // 发送消息，并接受消息
      const conn = await Deno.connect({
        hostname: cons.BAOSTOCK_SERVER_IP,
        port: cons.BAOSTOCK_SERVER_PORT,
      });

      const msg1 = msg + "\n";
      // console.log(msg1)

      await conn.write(new TextEncoder().encode(msg1));

      let n = 0;
      let resultMsg = "";

      do {
        const buf = new Uint8Array(1024);

        n = await conn.read(buf);

        let result = new TextDecoder().decode(buf.subarray(0, n));
        // console.log("result"+result);

        resultMsg += result;
        if (result.slice(-13) == "<![CDATA[]]>\n") {
          //  console.log("111")

          break;
        }
      } while (n > 0);

      conn.close();

      // console.log(resultMsg)
      return resultMsg;
    } catch (error) {
      console.log(error);
    }
  }

  async wasi_send_msg1() {
    wasi_send_msg("");
  }

  async login() {
    // let user_id = this.user_id;
    // let password = this.password;
    // // # 组织体信息
    // const msg_body = "login" + cons.MESSAGE_SPLIT + user_id + cons.MESSAGE_SPLIT +
    //     password + cons.MESSAGE_SPLIT + "0";

    // // # 组织头信息
    // const msg_header = to_message_header(
    //     cons.MESSAGE_TYPE_LOGIN_REQUEST, msg_body.replaceAll(cons.MESSAGE_SPLIT, " ").length)
    // const head_body = msg_header + msg_body

    // const crc32str = crc32(head_body)
    // console.log(crc32str);

    let msg =
      "00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994";

    let receive_data = await this.send_msg(msg);
    // '00.8.80\x0101\x0100000000430\x01success\x01login\x01anonymous\x0120231120162133118\x014058276909<![CDATA[]]>\n'
    // let msg_header1 = receive_data.slice(0, cons.MESSAGE_HEADER_LENGTH)

    // let msg_body1 = receive_data.slice(cons.MESSAGE_HEADER_LENGTH, -1)
    if (receive_data.includes("success")) {
      console.log("登录成功");
      this.isLogin = true;
    }

    // const header_arr = msg_header1.split("01")

    // console.log(header_arr)
    // const body_arr = msg_body1.split("01")
    // console.log(body_arr)
    return receive_data;
  }

  async query_zz500_stocks() {
    try {
      let msg =
        "00.8.80\x0165\x010000000037query_zz500_stocks\x01anonymous\x011\x0110000\x01\x01327066214";

      let receive_data = await this.send_msg(msg);
      let msg_body = receive_data.split("{")[1].split("}")[0];

      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async query_hs300_stocks() {
    try {
      let msg =
        "00.8.80\x0161\x010000000037query_hs300_stocks\x01anonymous\x011\x0110000\x01\x01625698251";
      let receive_data = await this.send_msg(msg);
      let msg_body = receive_data.split("{")[1].split("}")[0];

      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async query_sz50_stocks() {
    try {
      let msg =
        "00.8.80\x0163\x010000000036query_sz50_stocks\x01anonymous\x011\x0110000\x01\x01896979375";
      let receive_data = await this.send_msg(msg);
      let msg_body = receive_data.split("{")[1].split("}")[0];

      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async query_stock_basic() {
    try {
      if (!this.isLogin) {
        throw "未登录";
      }

      // let msg = "00.8.80\x0145\x010000000037query_stock_basic\x01anonymous\x011\x0110000\x01\x01\x01857658827"
      let msg =
        "00.8.80\x0145\x010000000037query_stock_basic\x01anonymous\x011\x0110000\x01\x01\x01857658827";
      // await conn.write(new TextEncoder().encode(msg));

      // const buf = new Uint8Array(1024);
      // const n = await conn.read(buf);
      // let result = new TextDecoder().decode(buf.subarray(0, n))
      // console.log(result);

      // conn.close();

      let receive_data = await this.send_msg(msg);

      let msg_body = receive_data.split("{")[1].split("}")[0];

      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
