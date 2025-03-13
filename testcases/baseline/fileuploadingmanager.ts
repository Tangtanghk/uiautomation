import { Page } from "playwright";
import { expect } from "playwright/test";
import { locators } from "../../pages/qpmn/builder/builderlocators";
import { FilesManager } from 'turbodepot-node';
import { DailyReportWriter } from './dailyreportwriter';
import fs from 'fs';

export class FileUploadingManager{
    readonly page: Page;
    baseURL = "https://www.demo.com/stage/";
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
        // baseURL = "https://www.demo.com/";
        this.baseURL = baseURL;        
    }
    async getPageLoadingTime(){
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
        //catalog page changed
        // if (this.baseURL.includes("stage")){
        //   await this.page.getByRole('link', { name: 'Products' }).first().click();
        // }else{
        //   await this.page.getByRole('link', { name: 'Catalog' }).click();
        // }
        await this.page.goto(this.baseURL + "app/customize/cards-games/catalog-playing-cards");
        await this.page.waitForLoadState('load');
        after = new Date().valueOf();
        this.loadingTimeProductListingPage = (after - before) / 1000;
        console.log("2. loading time of product listing page is: " + this.loadingTimeProductListingPage + " seconds.");
      
        before = new Date().valueOf();
        // await this.page.getByRole('link', { name: 'image failed Poker Size Custom Playing Card (2.48" x 3.46") as low as US$' }).click();
        await this.page.locator(`//a[@class="product-jump-box"]`).nth(0).click();
        await this.page.waitForLoadState('load');
        after = new Date().valueOf();
        this.loadingTimeProductDetailsPage = (after - before) / 1000;
        console.log("3. loading time of product details page is: " + this.loadingTimeProductDetailsPage + " seconds.");
      
        before = new Date().valueOf();
        await this.page.getByRole('button', { name: locators.orderasample }).first().click();
        await expect(this.page).toHaveURL(/.*builder/, {timeout: 60000});
        await expect(this.page.frameLocator('iframe[name="builderIFrame"]').getByRole('button', { name: 'OK' })).toBeEnabled({timeout:60000});
        after = new Date().valueOf();
        this.loadingTimeBuilder = (after - before) / 1000;
        console.log("4. loading time of builder is: " + this.loadingTimeBuilder + " seconds.");
      
        await this.page.frameLocator('iframe[name="builderIFrame"]').getByRole('button', { name: 'CLOSE' }).click();
        await this.page.waitForTimeout(5000); 
    }


    
    async getFileUploadingTime(path:string): Promise<boolean>{
      //resourcefile5x10MB; resourcefile235MB; resourcefile200x2.5MB; resourcefile200x100KB      
    //   path = "resourcefile5x10MB";
      let fileList = fs.readdirSync(path);
      let fileCount = fileList.length;
      let filefullpath: string [] = fileList.map (element => path + '/'+ element);
      console.log (filefullpath); 
      console.log ("the number of files: " + fileCount); 
    
    
      let filesManager = new FilesManager();
      this.dirSize = filesManager.getDirectorySize(path);
      console.log("total file size is " + (this.dirSize/(1024*1024)).toPrecision(3) + "MB");
      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).getByRole('link', { name: 'Add design element' })).toBeVisible({timeout:30000});
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByRole('link', { name: 'Add design element' }).click({timeout:30000});
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).locator('input[type=file]').setInputFiles(filefullpath);
      
      let timeBefore = new Date();
      let before = timeBefore.valueOf();
      this.formattedUploadingBefore = timeBefore.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      console.log("uploading started: " + this.formattedUploadingBefore);

      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).locator(`//div[@ng-show="showCount"]`)).toBeVisible({timeout:15000});
      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).locator(`//div[@ng-show="showCount" and @title="0"]`)).toBeAttached({timeout: 600000});           
      
  
      await expect(this.page.frameLocator('iframe[name="builderIFrame"]').locator(`//ul[@class="row pic-list-panel__list scrollbar"]`)).toBeVisible();
      let count = await this.page.frameLocator('iframe[name="builderIFrame"]').locator(`//ul[@class="row pic-list-panel__list scrollbar"]/li`).count();
      console.log("the number of thumbnail images: " + count);
      if (count<1) {
        return false;
      }   

      let timeAfter = new Date();
      let after = timeAfter.valueOf();
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