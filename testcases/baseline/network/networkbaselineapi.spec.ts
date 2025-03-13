import test, { expect } from '@playwright/test';
import fs from 'fs';
import { DailyReportWriter } from '../dailyreportwriter';
import { FilesManager } from 'turbodepot-node';
import { ImageGenerator } from '../utils/imagegenerate';
import * as path from 'path';
import { request, APIRequestContext } from 'playwright';
import FormData from 'form-data';
import { request as httpRequest } from 'http';

test('KF IDC - tagcloudflare', async () => {
  test.setTimeout(30*60*1000);
  
  let fileSize = 30; //MB
  let fileCount = 3;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 
  
  // Define the URL for the API endpoint
  const url = new URL('http://kf-idc.uat-01.makeplayingcards.com/upload');

  await uploadFiles(filefullpath,url,dirSize);

});  

test('TP IDC - tagcloudflare', async () => {
  test.setTimeout(30*60*1000);
  
  let fileSize = 30; //MB
  let fileCount = 3;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 

  // Define the URL for the API endpoint
  const url = new URL('http://tp-idc.uat-01.makeplayingcards.com/upload');

  await uploadFiles(filefullpath,url,dirSize);

});  

test('AWS HK - tagcloudflare', async () => {
  test.setTimeout(30*60*1000);
  
  let fileSize = 30; //MB
  let fileCount = 3;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 

  // Define the URL for the API endpoint
  const url = new URL('http://aws-hk.uat-01.makeplayingcards.com/upload');

  await uploadFiles(filefullpath,url,dirSize);

});  

test('AWS US - tagcloudflare', async () => {
  test.setTimeout(30*60*1000);
  
  let fileSize = 30; //MB
  let fileCount = 3;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 

  // Define the URL for the API endpoint
  const url = new URL('http://aws-us.uat-01.makeplayingcards.com/upload');

  await uploadFiles(filefullpath,url,dirSize);

});  

test('Azure US - tagcloudflare', async () => {
  test.setTimeout(30*60*1000);
  
  let fileSize = 30; //MB
  let fileCount = 3;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 

  // Define the URL for the API endpoint
  const url = new URL('http://azure-us.uat-01.makeplayingcards.com/upload');

  await uploadFiles(filefullpath,url,dirSize);

});  

async function uploadFiles(filefullpath:string[], url:URL, dirSize:number){

  // Define the list of image file paths
  const imagePaths = filefullpath;

  // Use FormData to construct the multipart request
  const formData = new FormData();
  imagePaths.forEach((imagePath) => {
    const fileStream = fs.createReadStream(imagePath);
    formData.append('files', fileStream, path.basename(imagePath));
  });

  // Options for the HTTP request
  const options = {
    method: 'POST',
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    headers: formData.getHeaders(),
  };

  let formattedUploadingBefore;
  let before;
  let timeBefore = new Date();
  before = timeBefore.valueOf();
  formattedUploadingBefore = timeBefore.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  console.log("uploading started: " + formattedUploadingBefore);

  // Send the POST request
  const response = await new Promise((resolve, reject) => {
    const req = httpRequest(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    // Pipe the form data into the request
    formData.pipe(req);
  });

  // Check the response
  if (response.status === 200) {
    console.log('Response:', response.body);
  } else {
    console.log('Failed to upload files. Status:', response.status);
  }

  let formattedUploadingAfter;
  let after;
  let timeAfter = new Date();
  after = timeAfter.valueOf();
  formattedUploadingAfter = timeAfter.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  let loadingTimeUploading;
  console.log("uploading finished: " + formattedUploadingAfter);
  loadingTimeUploading = (after - before) / 1000;
  console.log("total time spent on uploading is : " + loadingTimeUploading + " seconds.");

  let comments = url.hostname + " status:" + response.status;
  let testResult = [0, 0, 0,
      0, 0, loadingTimeUploading.toString(),
      formattedUploadingBefore, formattedUploadingAfter, (dirSize/(1024*1024)).toPrecision(3), comments];

  const reportGenerator = new DailyReportWriter();
  reportGenerator.setFilename(`cloudflare_report_hk.xlsx`);
  await reportGenerator.createDailyReport(testResult);    
  
}