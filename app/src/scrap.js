const Promise = require('bluebird');

// TEST 1 -- confirm that promises will queue calls prior to resolution
// expect 100, 10, 11, 12, 13, 1, 2, 3, 4, 5, 1000, 2000

// const tenDelay = new Promise((resolve, reject) => {
//   setTimeout(resolve, 10000);
// });
//
// const fiveDelay = new Promise((resolve, reject) => {
//   setTimeout(resolve, 5000);
// });
//
// tenDelay.then(() => console.log(1));
// tenDelay.then(() => console.log(2));
// tenDelay.then(() => console.log(3));
// tenDelay.then(() => console.log(4));
// tenDelay.then(() => console.log(5));
//
// console.log(100);
//
// fiveDelay.then(() => console.log(10));
// fiveDelay.then(() => console.log(11));
// fiveDelay.then(() => console.log(12));
// fiveDelay.then(() => console.log(13));
//
//
// setTimeout(() => tenDelay.then(() => console.log(1000)), 11000)
// setTimeout(() => fiveDelay.then(() => console.log(2000)), 11000)

// TEST 2 -- confirm use of promise and closure
// expect 999, 101, 102, 103, 104, 105

// const testClosure = () => {
//   var counter = 0;
//   const delayProm = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(100), 5000);
//   })
//
//   return () => delayProm.then(data => console.log(data, ++counter));
//
// }
//
// const test = testClosure();
// test();
// test();
// test();
// console.log(999);
// test();
// test();
