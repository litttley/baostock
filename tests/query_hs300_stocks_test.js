import { BaoStockApi } from "../mod.js";

Deno.test({
  name: "BaoStockApi.query_hs300_stocks",
  fn: async () => {
    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.query_hs300_stocks();
    console.log(s);
  },
});
