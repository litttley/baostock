import {
    login,
 
  } from "./mod.js";

Deno.test({
    name: "lookup",fn:async ()=>{
        
    let result =  await   login()

    console.log(result)
    
    }
     
  });