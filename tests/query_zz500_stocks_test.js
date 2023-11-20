import {
    BaoStockApi
  
  } from "../mod.js";
  
   
  
   
  
  
  
  Deno.test({
    name: "BaoStockApi.query_zz500_stocks", fn: async () => {
  
      const baoStockApi = new BaoStockApi();
      let s = await baoStockApi.query_zz500_stocks()
      console.log(s)
  
    }
  
  });