import {
    BaoStockApi
  
  } from "../mod.js";
  
   
  
   
  
  
  
  Deno.test({
    name: "BaoStockApi.query_history_k_data_plus", fn: async () => {
  
      const baoStockApi = new BaoStockApi();
      let s = await baoStockApi.login();
      let s1 = await baoStockApi.query_history_k_data_plus('sh.600029','2023-11-01','2023-11-21')
      console.log(s1)
  
    }
  
  });