

## 使用说明


baostock官方文档`http://baostock.com/baostock/index.php/A%E8%82%A1K%E7%BA%BF%E6%95%B0%E6%8D%AE`

免密登录login

```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.2/mod.js"

const baoStockApi = new BaoStockApi();
let result = await baoStockApi.login();
console.log(result);

```

获取沪深A股历史K线数据:query_history_k_data_plus

```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.2/mod.js"
const baoStockApi = new BaoStockApi();
let s = await baoStockApi.login();
let s1 = await baoStockApi.query_history_k_data_plus('sh.600029','2023-11-01','2023-11-21',param = 'code,date,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST', frequency = 'd', adjustflag = 3)
console.log(s1)

```

上证50成分股：query_sz50_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.2/mod.js"
const baoStockApi = new BaoStockApi();
let loginResult = await baoStockApi.login();
let result = await baoStockApi.query_sz50_stocks();
console.log(result)

```

沪深300成分股：query_hs300_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.2/mod.js"
const baoStockApi = new BaoStockApi();
let loginResult = await baoStockApi.login();
let result = await baoStockApi.query_hs300_stocks();
console.log(result)

```

中证500成分股：query_zz500_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.2/mod.js"
const baoStockApi = new BaoStockApi();
let loginResult = await baoStockApi.login();
let result = await baoStockApi.query_zz500_stocks();
console.log(result)

```

## 相关资料

1. 项目初始化

https://deno.land/x/init@v1.5.3

2. 测试

https://docs.deno.com/runtime/manual/basics/testing/
