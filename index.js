import {program} from 'commander'
import inquirer from 'inquirer'
import fs from 'fs'
import Path from 'path'



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


function innerHTML(body){
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root">
      ${body}
    </div>
  </body>
  </html>`
}


async function makeDirFile (filename, path, body){
  let filePath = Path.join(Path.resolve(),path,filename);

  if(fsAccess(path)){ //디렉토리가 있을때
    console.log('디렉토리가 존재합니다.');
    fs.writeFile(filePath,innerHTML(body),err => {console.error(err)}); //파일 생성
  } else { //디렉토리가 없을때
    await fs.mkdir(path, { recursive: true }, err => console.error(err)); //*디렉토리 생성
    fs.writeFile(filePath,innerHTML(body),err => {console.error(err)}); //파일 생성 
  }
}

makeDirFile('index.html','.','<p>그래그래</p>')

const inquirerPrompt = [
  {
    type : 'input',
    name : 'p',
    message : '내용을 입력해주세요'
  },
  {
    type : 'confirm',
    name : 'confirm',
    message : '저장하시겠습니까?'
  }
]


const fileName = program.command('mkfile')

fileName
  .usage('--name <name> --path [path]')
  .description('파일을 생성합니다.')
  .option('-n, --name [name]','파일이름을 입력하세요','index.html')
  .option('-d, --directory [path]','경로를 입력하세요','.')
  .action(option => {
    inquirer
      .prompt(inquirerPrompt)
      .than(answers => {
        const bodyText = `<${Object.keys(answers[0])[0]}> ${answers.p} </${Object.keys(answers[0])[0]}>`;
        if(answers.confirm){
          makeDirFile(option.name, option.directory, bodyText);
          console.log('파일이 생성되었습니다.');
        } else {
          console.log('취소되었습니다.');
        }

      })
  })