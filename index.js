const program = require('commander')
const inquirer = require('inquirer')
const fs = require('fs')

const appProgram = program.Command('cli')

// fs.readFile('index.html',(err, data)=> {
//   if(err){
//     console.error("파일을 읽어오는데 실패했습니다.",err)
//   } else {
//     //* 파일을 읽어오는데 성공 후 기믹 작성
//   }
// })


const fsAccess = path => {
  try{
    fs.accessSync(path,fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK );
    return true;
  } catch (err) {
    return false;
  }
};

// console.log(fsAccess('index.js'))