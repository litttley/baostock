import pako from 'npm:pako@2.1.0'
import * as Strutil from './utils/strutil.js'

// import { crc32fast } from './crc32/crc32_wasm.js'


// import { crc32 } from "https://deno.land/x/crc32wasm_deno@v0.0.2/mod.ts.js";
import  { crc32 }  from "jsr:@littleyy/crc32wasm-deno@0.0.2";

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



// export async function login2() {
//   const conn = await Deno.connect({
//     hostname: cons.BAOSTOCK_SERVER_IP,
//     port: cons.BAOSTOCK_SERVER_PORT,
//   });

//   let user_id = "anonymous";
//   let password = "123456";
//   // # 组织体信息
//   const msg_body = "login" + cons.MESSAGE_SPLIT + user_id + cons.MESSAGE_SPLIT +
//     password + cons.MESSAGE_SPLIT + "0";

//   // # 组织头信息
//   const msg_header = to_message_header(
//     cons.MESSAGE_TYPE_LOGIN_REQUEST,
//     msg_body.length,
//   );
//   const head_body = msg_header + msg_body;
//   //00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010
//   // console.log(head_body);

//   //   const input = Buffer.from(head_body);
//   //   const expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);
//   //  let crc32str =  crc32(input)

//   // let  crc32str = crc32(input).toString(10);
//   // const crc32str = crc32.unsigned(head_body, 'utf8').toString(10);
//   const crc32str = CRC32.buf(new TextEncoder().encode(head_body)) >>> 0;
//   console.log(crc32str);

//   //"00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994\n"
//   let msg = head_body + cons.MESSAGE_SPLIT + crc32str + "\\n";
//   console.log(msg);
//   await conn.write(new TextEncoder().encode(msg));

//   const buf = new Uint8Array(1024);
//   const n = await conn.read(buf);
//   let result = new TextDecoder().decode(buf.subarray(0, n));
//   console.log(result);

//   conn.close();

//   return result;
// }



function mergeUint8Arrays(arrays) {
  // sum of individual array lengths
  let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

  if (!arrays.length) return null;

  let result = new Uint8Array(totalLength);

  // for each array - copy it over result
  // next array is copied right after the previous one
  let length = 0;
  for (let array of arrays) {
    result.set(array, length);
    length += array.length;
  }

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


      await conn.write(new TextEncoder().encode(msg1));

      let n = 0;

      const buffArray = []

      do {
        const buf = new Uint8Array(1024);
        n = await conn.read(buf);
        const recv = buf.subarray(0, n)
        buffArray.push(recv)

        const endMsg = new TextDecoder().decode(recv.slice(-13))

        if (endMsg == "<![CDATA[]]>\n") {
          break;
        }
      } while (n > 0);

      conn.close();

      const receive = mergeUint8Arrays(buffArray)
      const head_bytes = receive.slice(0, cons.MESSAGE_HEADER_LENGTH)
      const head_str = new TextDecoder().decode(head_bytes)
 
      // const head_arr = head_str.split(cons.MESSAGE_SPLIT)

      if (head_str.slice(8, 10) == '96') {//需要解压

        const head_inner_length = parseInt(head_str.slice(-10))


        let output = pako.inflate(receive.slice(cons.MESSAGE_HEADER_LENGTH, cons.MESSAGE_HEADER_LENGTH + head_inner_length))
        // var output = new jsscompress.inflate();
        const body_str = new TextDecoder().decode(output)

        return body_str

      } else {
        return new TextDecoder().decode(receive)
      }
      // const receive = new TextDecoder().decode(mergeBuffArray)

      // return receive;
    } catch (error) {
      console.log(error);
    }
  }


  async login() {
   


    let msg = "00.8.90\x0100\x010000000024login\x01anonymous\x01123456\x010\x013460013509"

    let receive_data = await this.send_msg(msg);
 
    if (receive_data.includes("success")) {
      // console.log("登录成功");
      this.isLogin = true;
    }

    return receive_data;
  }

  async query_zz500_stocks() {
    try {
      // let msg =
      //   "00.8.90\x0165\x010000000037query_zz500_stocks\x01anonymous\x011\x0110000\x01\x01327066214";

      let msg = '00.8.90\x0165\x010000000037query_zz500_stocks\x01anonymous\x011\x0110000\x01\x011839600167'

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
      // let msg =
      //   "00.8.80\x0161\x010000000037query_hs300_stocks\x01anonymous\x011\x0110000\x01\x01625698251";

      let msg = '00.8.90\x0161\x010000000037query_hs300_stocks\x01anonymous\x011\x0110000\x01\x011536415114'
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

      // let msg =
      //   "00.8.80\x0163\x010000000036query_sz50_stocks\x01anonymous\x011\x0110000\x01\x01896979375";
      let msg =
        "00.8.90\x0163\x010000000036query_sz50_stocks\x01anonymous\x011\x0110000\x01\x011555705250";
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

      // let msg =
      //   "00.8.80\x0145\x010000000037query_stock_basic\x01anonymous\x011\x0110000\x01\x01\x01857658827";
      let msg = '00.8.90\x0145\x010000000037query_stock_basic\x01anonymous\x011\x0110000\x01\x01\x011304847754'

      let receive_data = await this.send_msg(msg);

      let msg_body = receive_data.split("{")[1].split("}")[0];

      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async to_message_header(msg_type, total_msg_length) {

    let total_msg_length_str = total_msg_length + ""
    let return_str = cons.BAOSTOCK_CLIENT_VERSION + cons.MESSAGE_SPLIT + msg_type +''
      + cons.MESSAGE_SPLIT +''
      +
     
      Strutil.add_zero_for_string(total_msg_length_str, 10, true)

    return return_str

  }
  async query_history_k_data_plus(stock_code, start_date, end_date, param = 'code,date,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST', frequency = 'd', adjustflag = 3) {
    try {

      // console.log(param)

      let body1=`query_history_k_data_plus\x01anonymous\x011\x0110000\x01${stock_code}\x01${param}\x01${start_date}\x01${end_date}\x01${frequency}\x01${adjustflag}`
  
       let body =`00.8.90\x0195\x01${ Strutil.add_zero_for_string(body1.length, 10, true)}${body1}`
      let size = crc32(body)

      let msg = `${body}\x01${size}`

      let receive_data = await this.send_msg(msg);

      // console.log(receive_data)
      if(receive_data?.includes(cons.BSERR_INDICATOR_INVALIED)) {
        
        throw new Error(`查询失败，可能是参数错误,${receive_data}`);

      }
      let msg_body = receive_data.split("{")[1].split("}")[0];
      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {

      console.log(error)

      return null

    }
  }

  async organize_msg_body(str) {

    let str_arr = str.split(",")

    // 返回的消息头
    let msg_body = ""
    for (let item of str_arr) {
      msg_body = msg_body + item.trim() +'\\x01'+''
    }

 

    return msg_body.slice(0, msg_body.length-4 )

  }
  async query_stock_industry() {
    try {

    
    
      let msg='00.8.90\x0159\x010000000040query_stock_industry\x01anonymous\x011\x0110000\x01\x01\x011378362580'

      let receive_data = await this.send_msg(msg);
      let msg_body = receive_data.split("{")[1].split("}")[0];
      let jsonObj = JSON.parse("{" + msg_body + "}");

      return jsonObj;
    } catch (error) {

      console.log(error)

      return null

    }
  }
}
