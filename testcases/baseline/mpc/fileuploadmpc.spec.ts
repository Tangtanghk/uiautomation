import test, { expect } from '@playwright/test';
import fs from 'fs';
import { DailyReportWriter } from '../dailyreportwriter';
import { FilesManager } from 'turbodepot-node';
import { ImageGenerator } from '../utils/imagegenerate';

test('5x10MB file uploading time', async ({ page }) => {
  test.setTimeout(30*60*1000);
  
  let path = "resourcefile5x10MBDiff";
  // await page.goto('https://www.makeplayingcards.com/');
  // await page.getByText('Accept').click();
  // await page.getByRole('link', { name: 'Playing Cards', exact: true }).click();

  // await page.locator('div:nth-child(2) > .itemmore > .btn_morebig').click();
  // await page.goto('https://www.makeplayingcards.com/design/personalized-small-poker-cards.html');
  
  await page.goto('https://uat-01.makeplayingcards.com/design/personalized-small-poker-cards.html');
  await page.getByRole('link', { name: 'start your design' }).click();
  await page.frameLocator('#sysifm_loginFrame').getByRole('row', { name: 'Same image for each number: (' }).getByRole('link').click();

  let fileSize = 30; //MB
  let fileCount = 10;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  
  let fileList = fs.readdirSync(filePath);
  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(filePath);
  // let fileCount = fileList.length;
  let filefullpath: string [] = fileList.map (element => filePath + '/'+ element);
  console.log (filefullpath); 
  console.log ("the number of files: " + fileCount); 

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

  // await page.locator('#uploadId').click();
  await page.locator('#uploadId').setInputFiles(filefullpath);
  await expect(page.locator('#U_Upload').getByRole('img').nth(fileCount-1)).toBeVisible({timeout:10*30*1000});  

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
  console.log("5. total time spent on uploading is : " + loadingTimeUploading + " seconds.");

  let comments = "https://mpc.com";
  let testResult = [0, 0, 0,
      0, 0, loadingTimeUploading.toString(),
      formattedUploadingBefore, formattedUploadingAfter, (dirSize/(1024*1024)).toPrecision(3), comments];

  const reportGenerator = new DailyReportWriter();
  await reportGenerator.createDailyReport(testResult);    

});  

