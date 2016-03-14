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


// const setUsername = (username) => {
//  adduser([username]);
// }
//
// const setPrivileges = (username) => {
//  gpasswd([`-a ${username} sudo`]);
// }
//
// const eval = cmdLine('eval');
// const curl = cmdLine('curl');
// const ssh = cmdLine('ssh');
// const adduser = cmdLine('adduser');
// const gpasswd = cmdLine('gpasswd');
//
// // Installing Docker:
// const dockerInstall = () => {
//  curl(['-fsSL https://get.docker.com/ | sh'])
// }
//
// // I cannot connect to the Daemon host so I always need to use this:
// const daemonConnect = (machine_name) => {
//  restartMachine(machine_name);
//  evalMachine(machine_name);
// };
//
// // should default be a variable for the desired machine??
// const restartMachine = (machine_name) => {
//  dockerMachine(['restart', machine_name]);
// }
//
// // should default be a variable for the desired machine??
// const evalMachine = (machine_name) => {
//  eval([`'$(docker-machine env ${machine_name})'`]);
// }

// 2: Note: leaving out docker build for now
// 3: want to change the user away from root and create a password - how to do this??

// 4: I think we will need to do this in digitalocean but I am not sure
//   sudo apt-get -y install rsync

// 5: amazon
// docker-machine create --driver amazonec2 --amazonec2-access-key AKI******* --amazonec2-secret-key 8T93C*******  aws-sandbox

// some additional notes/ set-up commands we may want
// cmdLine – sudo??
// Create a user group?
// Add user:
// const addUser = (username) => {
//   ""sudo"" usermod -aG docker
// }
// The docker daemon needs to be started
// $ sudo service docker start
// You can set the daemon to start at boot
// $ sudo chkconfig docker on
