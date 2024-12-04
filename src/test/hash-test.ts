import { MD5 } from 'object-hash';

const obj = { a: 'foo', b: ['bb', 'cc', '\u{1f605}'], c: 5 };
const obj2 = { c: 5, a: 'f\u006F\u006F', b: ['bb', 'cc', '😅'] };

console.log(obj, ' -> ', MD5(obj));
console.log(obj2, ' -> ', MD5(obj2));
