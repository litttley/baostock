import { BaoStockApi } from "../mod.js";

Deno.test({
  name: "BaoStockApi.query_sz50_stocks",
  fn: async () => {
    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.query_sz50_stocks();
    console.log(s);
  },
});
