import test, { expect } from '@playwright/test';
import { locators } from "../../pages/qpmn/builder/builderlocators";

import fs from 'fs';
import { LoginPage } from '../../pages/qpmn/login-page';
import { FilesManager } from 'turbodepot-node';
import { DailyReportWriter } from './dailyreportwriter';


test('test loading time', async ({ page }) => {
  test.setTimeout(60*60*1000);

  const loginpage = new LoginPage(page);
  await loginpage.open();
  
  await loginpage.login("automation@iubridge.com", "12345678@Ll1234");
  await expect(page).toHaveURL(/.*products/, {timeout: 60000}); 
  await page.waitForTimeout(10000);

  let formattedTestTime = (new Date()).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  console.log("testing started time: " + formattedTestTime);
  let baseURL = "https://www.demo.com/stage/";
  baseURL = "https://www.demo.com/";
  let before = new Date().valueOf();
  await page.goto(baseURL);
  await page.waitForLoadState('load');
  let after = new Date().valueOf();
  let loadingTimeLandingPage = (after - before) / 1000;
  console.log("1. loading time of landing page is: " + loadingTimeLandingPage + " seconds.");

  before = new Date().valueOf();
  if (baseURL.includes("stage")){
    await page.getByRole('link', { name: 'Products' }).first().click();
  }else{
    await page.getByRole('link', { name: 'Catalog' }).click();
  }
  await page.waitForLoadState('load');
  after = new Date().valueOf();
  let loadingTimeProductListingPage = (after - before) / 1000;
  console.log("2. loading time of product listing page is: " + loadingTimeProductListingPage + " seconds.");

  before = new Date().valueOf();
  await page.getByRole('link', { name: 'image failed Poker Size' }).click();
  await page.waitForLoadState('load');
  after = new Date().valueOf();
  let loadingTimeProductDetailsPage = (after - before) / 1000;
  console.log("3. loading time of product details page is: " + loadingTimeProductDetailsPage + " seconds.");

  before = new Date().valueOf();
  await page.getByRole('button', { name: locators.orderasample }).first().click();
  await expect(page).toHaveURL(/.*builder/, {timeout: 60000});
  await expect(page.frameLocator('iframe[name="builderFrame"]').getByRole('button', { name: 'OK' })).toBeEnabled({timeout:60000});
  after = new Date().valueOf();
  let loadingTimeBuilder = (after - before) / 1000;
  console.log("4. loading time of builder is: " + loadingTimeBuilder + " seconds.");

  await page.frameLocator('iframe[name="builderFrame"]').getByRole('button', { name: 'CLOSE' }).click();
  await page.waitForTimeout(5000); 

  //resourcefile5x10MB; resourcefile235MB; resourcefile200x2.5MB; resourcefile200x100KB
  let path = "resourcefile200x2.5MB";
  
  path = "resourcefile5x10MB";
  let fileList = fs.readdirSync(path);
  let filefullpath: string [] = fileList.map (element => path + '/'+ element);
  console.log (filefullpath); 


  let filesManager = new FilesManager();
  let dirSize = filesManager.getDirectorySize(path);
  console.log("total file size is " + (dirSize/(1024*1024)).toPrecision(3) + "MB");

  await expect(page.frameLocator(`iframe[name="builderFrame"]`).getByRole('link', { name: 'Add design element' })).toBeVisible({timeout:30000});
  await page.frameLocator(`iframe[name="builderFrame"]`).getByRole('link', { name: 'Add design element' }).click({timeout:30000});
  await page.frameLocator(`iframe[name="builderFrame"]`).locator('input[type=file]').setInputFiles(filefullpath);
  
  let timeBefore = new Date();
  before = timeBefore.valueOf();
  let formattedUploadingBefore = timeBefore.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  console.log("uploading started: " + formattedUploadingBefore);
  await expect(page.frameLocator(`iframe[name="builderFrame"]`).locator(`//div[@class="upload-pictures-box"]//div [@class='progress-box']`)).toBeVisible({timeout:30000});
  await expect(page.frameLocator(`iframe[name="builderFrame"]`).locator(`//div[@class='progress-box ng-hide']`)).toBeAttached({timeout: 3600000});
  let timeAfter = new Date();
  after = timeAfter.valueOf();
  let formattedUploadingAfter = timeAfter.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  console.log("uploading finished: " + formattedUploadingAfter);
  let loadingTimeUploading = (after - before) / 1000;
  console.log("5. total time spent on uploading is : " + loadingTimeUploading + " seconds.");
  
  let comments = baseURL;
  let testResult = [formattedTestTime, loadingTimeLandingPage.toString(), loadingTimeProductListingPage.toString(),
                    loadingTimeProductDetailsPage.toString(), loadingTimeBuilder.toString(), loadingTimeUploading.toString(),
                    formattedUploadingBefore, formattedUploadingAfter, (dirSize/(1024*1024)).toPrecision(3), comments];

  const reportGenerator = new DailyReportWriter();
  await reportGenerator.createDailyReport(testResult);
});