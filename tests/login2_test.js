import { BaoStockApi, login2 } from "../mod.js";

Deno.test({
  name: "baostock.login2",
  fn: async () => {
    await login2();
  },
});
