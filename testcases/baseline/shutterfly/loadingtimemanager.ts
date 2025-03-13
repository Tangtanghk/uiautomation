import { Page } from "playwright";
import { expect } from "playwright/test";
import { FilesManager } from 'turbodepot-node';
import { DailyReportWriter } from '../dailyreportwriter';
import fs from 'fs';

export class LoadingTimeManager{
    readonly page: Page;
    baseURL = "https://www.shutterfly.com/";
    formattedTestTime: any;
    loadingTimeLandingPage: any;
    loadingTimeProductListingPage: any;
    loadingTimeProductDetailsPage: any;
    loadingTimeBuilder: any;
    loadingTimeUploading: any;
    formattedUploadingBefore: any;
    formattedUploadingAfter: any;
    dirSize: any;

    constructor(page: Page) {
        this.page = page;
    }

    async setBaseURL(baseURL: string){
        // baseURL = "https://www.shutterfly.com/";
        this.baseURL = baseURL;        
    }
    async getPageLoadingTime(path:string){
        this.formattedTestTime = (new Date()).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        
        console.log("testing started time: " + this.formattedTestTime);

        let before = new Date().valueOf();
        await this.page.goto(this.baseURL);
        await this.page.waitForLoadState('load');
        let after = new Date().valueOf();
        this.loadingTimeLandingPage = (after - before) / 1000;
        console.log("1. loading time of landing page is: " + this.loadingTimeLandingPage + " seconds.");   
        
        before = new Date().valueOf();
        await this.page.getByRole('searchbox', { name: 'Enter searching text here' }).click();
        await this.page.getByRole('searchbox', { name: 'Enter searching text here' }).fill('playing cards');
        await this.page.getByRole('searchbox', { name: 'Enter searching text here' }).press('Enter');
        
        if (await this.page.getByLabel('Close', { exact: true }).isVisible()){
          await this.page.getByLabel('Close', { exact: true }).click(); 
        }
        await this.page.waitForLoadState('load');
        after = new Date().valueOf();
        this.loadingTimeProductListingPage = (after - before) / 1000;
        console.log("2. loading time of product listing page is: " + this.loadingTimeProductListingPage + " seconds.");
      
        before = new Date().valueOf();

        const pagePromise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'Upload Your Own Design', exact: true }).click();
        const pageUpload = await pagePromise;
        await pageUpload.setViewportSize({width:1900,height:820});

        await pageUpload.waitForLoadState('load');
        after = new Date().valueOf();
        this.loadingTimeProductDetailsPage = (after - before) / 1000;
        console.log("3. loading time of product details page is: " + this.loadingTimeProductDetailsPage + " seconds.");
      
        before = new Date().valueOf();
        await pageUpload.getByRole('link', { name: 'personalize' }).click();
        await pageUpload.getByRole('img', { name: 'Layout image - photos 5 - text fields 3' }).click();
        after = new Date().valueOf();
        this.loadingTimeBuilder = (after - before) / 1000;
        console.log("4. loading time of builder is: " + this.loadingTimeBuilder + " seconds.");
      

      //resourcefile5x10MB; resourcefile235MB; resourcefile200x2.5MB; resourcefile200x100KB      
      // path = "resourcefile5x10MB";
      let fileList = fs.readdirSync(path);
      let fileCount = fileList.length;
      let filefullpath: string [] = fileList.map (element => path + '/'+ element);
      console.log (filefullpath); 
      console.log ("the number of files: " + fileCount); 
    
    
      let filesManager = new FilesManager();
      this.dirSize = filesManager.getDirectorySize(path);
      console.log("total file size is " + (this.dirSize/(1024*1024)).toPrecision(3) + "MB");

      //remove  cookie preference
      const elements = await pageUpload.$$("#transcend-consent-manager");

      // Remove each element
      for (const element of elements) {
        await element.evaluate((el) => el.remove());
      }
      await pageUpload.getByLabel('Add photos').click();

      const fileChooserPromise = pageUpload.waitForEvent('filechooser');
      await pageUpload.getByRole('button', { name: 'Upload' }).click();
      const fileChooserUpload = await fileChooserPromise;
      // await fileChooserUpload.setFiles(['./resourcetmp/FELV-cat.jpg']);
      // await fileChooserPromise.finally();
    
    
      const fileChooserPromiseMulti = pageUpload.waitForEvent('filechooser');
      await pageUpload.getByRole('button', { name: 'CHOOSE PHOTOS' }).click();
      const fileChooser = await fileChooserPromiseMulti;
      await fileChooser.setFiles(filefullpath);
      // await fileChooser.setFiles(['./resourcetmp/FELV-cat.jpg']);

      let timeBefore = new Date();
      before = timeBefore.valueOf();
      this.formattedUploadingBefore = timeBefore.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      console.log("uploading started: " + this.formattedUploadingBefore);

      await expect(pageUpload.locator(`//div[@class="photo"]`).nth(fileCount-1)).toBeVisible({timeout:20*60*1000});

      let timeAfter = new Date();
      after = timeAfter.valueOf();
      this.formattedUploadingAfter = timeAfter.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      console.log("uploading finished: " + this.formattedUploadingAfter);
      this.loadingTimeUploading = (after - before) / 1000;
      console.log("5. total time spent on uploading is : " + this.loadingTimeUploading + " seconds.");
      return true;
    }
    
    async updateResult(filename:string){
        let comments = this.baseURL;
        let testResult = [this.formattedTestTime, this.loadingTimeLandingPage.toString(), this.loadingTimeProductListingPage.toString(),
            this.loadingTimeProductDetailsPage.toString(), this.loadingTimeBuilder.toString(), this.loadingTimeUploading.toString(),
            this.formattedUploadingBefore, this.formattedUploadingAfter, (this.dirSize/(1024*1024)).toPrecision(3), comments];
      
        const reportGenerator = new DailyReportWriter();
        await reportGenerator.createDailyReport(testResult);    
    }  

}