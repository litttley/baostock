
import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.1/mod.js";

Deno.test({
    name: "baostock.login",
    fn: async () => {
      const baoStockApi = new BaoStockApi();
      let s = await baoStockApi.login();
      console.log(s);
      let s2 = await baoStockApi.query_sz50_stocks();
      console.log(s2);
    },
  });