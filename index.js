import {program} from 'commander'
import inquirer from 'inquirer'
import fs from 'fs'
import Path from 'path'




const fsAccess = path => {
  try{
    fs.accessSync(path,fs.constants.R_OK | fs.constants.W_OK );
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
//"/result/"+filename+".html"

async function makeDirFile (filename, path, body){
  let folderPath = Path.join(Path.resolve(),"/result",path)
  let filePath = Path.join(Path.resolve(),"/result",path,filename);
  
  if(fsAccess(folderPath)){ //디렉토리가 있을때
    console.log('디렉토리가 존재합니다.');
  } else { //디렉토리가 없을때
    await fs.mkdir(folderPath, { recursive: true }, err => console.error(err)); //*디렉토리 생성
  }

  fs.writeFile(filePath,innerHTML(body),err => {console.error(err)}); //파일 생성 
}

const inquirerPrompt = [
  {
    type : 'list',
    name : 'tag',
    message : '태그를 선택해주세요',
    choices : ['p','div','a','ul','li']
  },
  {
    type : 'input',
    name : 'text',
    message : '내용을 입력해주세요'
  },
  {
    type : 'input',
    name : 'directory',
    message : '파일 위치를 지정해주세요.',
    default : '.'
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
      .then(answers => {
        let bodyText = `<${answers.tag}> ${answers.text} </${answers.tag}>`;
        if(answers.confirm){
          makeDirFile(option.name, answers.directory, bodyText);
          console.log('파일이 생성되었습니다.');
        } else {
          console.log('취소되었습니다.');
        }

      })
  })

  fileName.parse(process.argv)