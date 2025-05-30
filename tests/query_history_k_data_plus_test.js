import {
  BaoStockApi

} from "../mod.js";







Deno.test({
  name: "BaoStockApi.query_history_k_data_plus", fn: async () => {

    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.login();
    console.log(s)
    //日线指标参数（包含停牌证券）
    // const fields="code,date,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST";
    //周、月线指标参数
     const fields = "code,date,open,high,low,close,volume,amount,adjustflag,turn,pctChg";
    //5、15、30、60分钟线指标参数(不包含指数)
    // const fields = "code,date,time,open,high,low,close,volume,amount,adjustflag";

    const frequency = 'm'; // 'd' for daily, 'w' for weekly, 'm' for monthly
    let s1 = await baoStockApi.query_history_k_data_plus('sz.002414', '2020-11-01', '2025-11-21', fields, frequency, 3);
    console.log(s1)

  }

});