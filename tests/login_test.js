import { BaoStockApi } from "../mod.js";

Deno.test({
  name: "baostock.login",
  fn: async () => {
    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.login();
    console.log(s);
  },
});
