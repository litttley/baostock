import {
  login2,
  BaoStockApi

} from "./mod.js";

// Deno.test({
//     name: "baostock.login",fn:async ()=>{

//     let result =  await   login2()

//     console.log(result)

//     }

//   });

// Deno.test({
//   name: "BaoStockApi", fn: async () => {

//     const baoStockApi = new BaoStockApi();
//     let s = await baoStockApi.login()
//     console.log(s)

//   }

// });



Deno.test({
  name: "BaoStockApi.query_stock_basic", fn: async () => {

    const baoStockApi = new BaoStockApi();
    let s = await baoStockApi.query_stock_basic()
    console.log(s)

  }

});
