import { BaoStockApi } from "../mod.js";

Deno.test({
  name: "BaoStockApi.query_stock_basic",
  fn: async () => {
    const baoStockApi = new BaoStockApi();
    let s1 = await baoStockApi.login();
    console.log(s1);
    let s = await baoStockApi.query_stock_basic();
    console.log(s);
  },
});
