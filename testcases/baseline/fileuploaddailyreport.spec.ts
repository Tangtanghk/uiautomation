import test from '@playwright/test';
import { FileUploadingManager } from './fileuploadingmanager';
import { ImageGenerator } from './utils/imagegenerate';

test('5x10MB file uploading time', async ({ page }) => {
    test.setTimeout(60*60*1000);

    let fileSize = 10; //MB
    let fileCount = 5;
    let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
    await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
    let baseURL = "https://www.demo.com/";
    baseURL = "https://stage.demo.com/";
    let path = filePath;
    
    let filename = "";
    const fileuploadingmanger = new FileUploadingManager(page);
    fileuploadingmanger.setBaseURL(baseURL);
    await fileuploadingmanger.getPageLoadingTime();
    let result = await fileuploadingmanger.getFileUploadingTime(path);
    if (result = false){
        test.fail();
    }
    await fileuploadingmanger.updateResult(filename);
});  

test('30x2.5MB file uploading time', async ({ page }) => {
  test.setTimeout(60*60*1000);
  let fileSize = 2.5; //MB
  let fileCount = 30;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let baseURL = "https://www.demo.com/";
  baseURL = "https://stage.demo.com/";
  let path = filePath;
  let filename = "";
  const fileuploadingmanger = new FileUploadingManager(page);
  fileuploadingmanger.setBaseURL(baseURL);
  await fileuploadingmanger.getPageLoadingTime();
  let result = await fileuploadingmanger.getFileUploadingTime(path);
  if (result = false){
      test.fail();
  }
  await fileuploadingmanger.updateResult(filename);
});  

test('70x1 MB file uploading time', async ({ page }) => {
  test.setTimeout(60*60*1000);
  let fileSize = 1; //MB
  let fileCount = 70;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let baseURL = "https://www.demo.com/";
  baseURL = "https://stage.demo.com/";
  let path = filePath;
  let filename = "";
  const fileuploadingmanger = new FileUploadingManager(page);
  fileuploadingmanger.setBaseURL(baseURL);
  await fileuploadingmanger.getPageLoadingTime();
  let result = await fileuploadingmanger.getFileUploadingTime(path);
  if (result = false){
      test.fail();
  }
  await fileuploadingmanger.updateResult(filename);
});  

test('10x15 MB file uploading time', async ({ page }) => {
  test.setTimeout(60*60*1000);
  let fileSize = 15; //MB
  let fileCount = 10;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
  let baseURL = "https://www.demo.com/";
  baseURL = "https://stage.demo.com/";
  let path = filePath;
  let filename = "";
  const fileuploadingmanger = new FileUploadingManager(page);
  fileuploadingmanger.setBaseURL(baseURL);
  await fileuploadingmanger.getPageLoadingTime();
  let result = await fileuploadingmanger.getFileUploadingTime(path);
  if (result = false){
      test.fail();
  }
  await fileuploadingmanger.updateResult(filename);
});  