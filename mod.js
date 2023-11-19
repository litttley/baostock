
import * as cons from "./const.js";

export async function login()  {
    const conn = await Deno.connect({ hostname: cons.BAOSTOCK_SERVER_IP, port: cons.BAOSTOCK_SERVER_PORT });

    await conn.write(new TextEncoder().encode("00.8.80\x0100\x010000000024login\x01anonymous\x01123456\x010\x011635716994\n"));

    const buf = new Uint8Array(1024);
    const n = await conn.read(buf);
    let result = new TextDecoder().decode(buf.subarray(0, n))
    console.log(result);

    conn.close();

    return result

}
