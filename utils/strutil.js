export function add_zero_for_string(content, length, direction) {
    `在str的左或右添加0
    :param str:待修改的字符串
    :param length:总共的长度
    :param direction:方向，True左，False右
    :return:
    `
    let content1 = content + ''
    let str_len = content1.length
    if (str_len < length) {

        for (let index = 0; index < length-str_len; index++) {
            if (direction) {
                content1 = "0" + content1
            } else {
                content1 = content1 + "0"
            }

        }

    }



    console.log("xxxxx:"+content1)

     
    return content1
}



export function calStrLength(str){   
    
 
    var str = '这里使用的正规表达式';
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var a = str.charAt(i);
        //使用的正则表达式
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }   
    console.log(len);

    return len
}