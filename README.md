
## 本库版本发布
`deno publish --allow-slow-types --allow-dirty `
## 使用说明


baostock官方文档`http://baostock.com/baostock/index.php/A%E8%82%A1K%E7%BA%BF%E6%95%B0%E6%8D%AE`

免密登录login

```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.6/mod.js"

const baoStockApi = new BaoStockApi();
let result = await baoStockApi.login();
console.log(result);

```

获取沪深A股历史K线数据:query_history_k_data_plus
baostock对应文档:`http://baostock.com/baostock/index.php/A%E8%82%A1K%E7%BA%BF%E6%95%B0%E6%8D%AE`

```
参数含义：

code：股票代码，sh或sz.+6位数字代码，或者指数代码，如：sh.601398。sh：上海；sz：深圳。此参数不可为空；

fields：指示简称，支持多指标输入，以半角逗号分隔，填写内容作为返回类型的列。详细指标列表见历史行情指标参数章节，日线与分钟线参数不同。此参数不可为空；

start：开始日期（包含），格式“YYYY-MM-DD”，为空时取2015-01-01；

end：结束日期（包含），格式“YYYY-MM-DD”，为空时取最近一个交易日；

frequency：数据类型，默认为d，日k线；d=日k线、w=周、m=月、5=5分钟、15=15分钟、30=30分钟、60=60分钟k线数据，不区分大小写；指数没有分钟线数据；周线每周最后一个交易日才可以获取，月线每月最后一个交易日才可以获取。

adjustflag：复权类型，默认不复权：3；1：后复权；2：前复权。已支持分钟线、日线、周线、月线前后复权。 BaoStock提供的是涨跌幅复权算法复权因子，具体介绍见：复权因子简介或者BaoStock复权因子简介。

```
```js

    //日线指标参数（包含停牌证券）
    // const fields="code,date,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST";

    //周、月线指标参数
    //  const fields = "code,date,open,high,low,close,volume,amount,adjustflag,turn,pctChg";
    
    //5、15、30、60分钟线指标参数(不包含指数)
    const fields = "code,date,time,open,high,low,close,volume,amount,adjustflag";

    const frequency = 'm'; //d,w,m,
    let s1 = await baoStockApi.query_history_k_data_plus('sz.002414', '2020-11-01', '2025-11-21', fields, frequency, 3);
    console.log(s1)

```

上证50成分股：query_sz50_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.6/mod.js"
const baoStockApi = new BaoStockApi();
let loginResult = await baoStockApi.login();
let result = await baoStockApi.query_sz50_stocks();
console.log(result)

```

沪深300成分股：query_hs300_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.6/mod.js"
const baoStockApi = new BaoStockApi();
let loginResult = await baoStockApi.login();
let result = await baoStockApi.query_hs300_stocks();
console.log(result)

```

中证500成分股：query_zz500_stocks()
```js

import {BaoStockApi} from "https://deno.land/x/baostock@v0.0.6/mod.js"
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
