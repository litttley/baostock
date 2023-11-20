import { BaoStockApi } from "../mod.js";

Deno.test({
  name: "BaoStockApi.query_stock_basic",
  fn: async () => {
    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.query_stock_basic();
    console.log(s);
  },
});
