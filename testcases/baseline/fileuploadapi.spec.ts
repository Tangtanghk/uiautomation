import test, { APIRequestContext, expect } from '@playwright/test';
import fs from 'fs';
import { FilesManager } from 'turbodepot-node';
import { DailyReportWriter } from './dailyreportwriter';

let path:string;

test("10*10MB file uploading testing", async ({ request }) => {
  test.setTimeout(20*60*1000);
  path = './resourcefile10x10MB';
  await uploadFiles(path,request);
});

test("235MB file uploading testing", async ({ request }) => {
  test.setTimeout(20*60*1000);
  path = './resourcefile235MB';
  await uploadFiles(path,request);
});

test("30*100KB file uploading testing", async ({ request }) => {
  test.setTimeout(20*60*1000);
  path = './resourcefile30x100KB';
  await uploadFiles(path,request);
});

async function uploadFiles(path:string, request:APIRequestContext){

  const baseURL = 'https://fileservice.demo.com/file/file/upload';

  let fileList = fs.readdirSync(path);
  let fileCount = fileList.length;
  // let filefullpath: string [] = fileList.map (element => '' + element);
  // console.log (filefullpath); 

  let formattedTestTime = (new Date()).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  console.log("testing started time: " + formattedTestTime);

  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(path);
  console.log("total file size is " + (dirSize/(1024*1024)).toPrecision(3) + "MB");

  let stream: fs.ReadStream;
  let before = new Date().valueOf();

  for (var i=0;i<fileCount;i++){
    console.log(fileList[i]);
    stream = fs.createReadStream(path + '/' + fileList[i]);
    const response = await request.post(baseURL, {
      multipart: {
        fileField: stream
      },
      timeout:0
    });
    expect(response.status()).toBe(200);
  }
  let after = new Date().valueOf();
  let loadingTimeUploading = (after - before) / 1000;
  console.log("total time spent on uploading is : " + loadingTimeUploading + " seconds.");

  let testResult = [formattedTestTime,loadingTimeUploading.toString(),(dirSize/(1024*1024)).toPrecision(3)];

  const reportGenerator = new DailyReportWriter();
  await reportGenerator.setFilename("fileuploading.xlsx");
  await reportGenerator.setColumns(['Test Execute Time', 'Uploading(s)', 'File Size(MB)'])
  await reportGenerator.createDailyReport(testResult);

}
