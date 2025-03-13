import { Page } from "playwright";
import { expect } from "playwright/test";
import { locators } from "../../pages/qpmn/builder/builderlocators";
import { FilesManager } from 'turbodepot-node';
import { DailyReportWriter } from './dailyreportwriter';
import fs from 'fs';

export class LoadingTimeHelper{
    readonly page: Page;
    baseURL = "https://www.demo.com/stage/";
    testTimeStart: any;
    formattedTestTimeStart: any;
    testTimeEnd: any;
    formattedTestTimeEnd: any;
    loadingTimeLandingPage: any;
    loadingTimeProductListingPage: any;
    loadingTimeProductDetailsPage: any;
    loadingTimeBuilder: any;
    loadingTimeUploading:number[] = [];
    loadingTimeAutofill:number[] = [];
    formattedUploadingBefore: any;
    formattedUploadingAfter: any;
    dirSize:number[] = [];
    loadingTimeATab:number[] = [];
    loadingTimeBox:number[] = [];
    loadingTimeCart: any;

    private columns: string[] = ['Test Start Time','Test End Time',
    'Landing page', 'Loading Builder', 
    'Card Upload (Front)','Auto Fill',
    'Loading Builder to Back','Card Upload (Back)','Auto Fill',
    'Loading Builder (Box Outside)','Image Upload (Front)','Auto Fill',
    'Loading Builder (Box Inside)','Image Upload (Back)','Auto Fill',
    'Loading Builder (Seal)','Image Upload', 'Auto Fill',
    'Preview Card', 'Preview Box','Add to Cart','Comments'];

    constructor(page: Page) {
        this.page = page;
    }

    async setBaseURL(baseURL: string){
        // baseURL = "https://www.demo.com/";
        this.baseURL = baseURL;        
    }
    async getPageLoadingTime(){

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

        this.testTimeStart = new Date();
        this.formattedTestTimeStart = this.testTimeStart.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      
        console.log("testing started time: " + this.formattedTestTimeStart);

        before = new Date().valueOf();
        // await this.page.getByRole('link', { name: 'image failed Poker Size Custom Playing Card (2.48" x 3.46") as low as US$' }).click();
        await this.page.locator(`//a[@class="product-jump-box"]`).nth(0).click();
        await this.page.goto(this.baseURL + "app/products/poker-size-custom-playing-cards-2.48-3.46-inch/");
        await this.page.waitForLoadState('load');

      
        //select options
        await this.page.getByRole('button', { name: 'cards' }).click();
        await this.page.getByText('55 cards').click();
        await this.page.getByRole('button', { name: 'Shrink-wrapped' }).click();
        await this.page.getByText('Custom tuck box').click();
        await this.page.getByRole('button', { name: 'Outside' }).click();
        await this.page.getByText('Inside + Outside').click();
        await this.page.locator('dl').filter({ hasText: 'Packaging seals: None' }).getByRole('button').click();
        await this.page.getByText('Custom seal').click();

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
        await this.page.frameLocator('iframe[name="builderIFrame"]').locator('label').filter({ hasText: 'Different for all backs' }).click();
        await this.page.frameLocator('iframe[name="builderIFrame"]').getByRole('button', { name: 'OK' }).click();

        
        //check iframe loading status
        let cursorStyle: string | null = null;
        const timeout = 30000; // Adjust the timeout as necessary
        const startTime = Date.now();
        let isDefaulttoBusy = false;
        // Polling for the cursor style change
        while (Date.now() - startTime < timeout) {
            cursorStyle = await this.getCursorStyle('iframe[name="builderIFrame"]');
            // Include 'progress' and 'wait' as they are common cursor styles for busy state
            // console.log('the cursorStyle is: ' + cursorStyle);
            if (!isDefaulttoBusy && (cursorStyle === 'progress' || cursorStyle === 'wait' || cursorStyle === 'busy') && (Date.now() - startTime < 5000 )) { 
                isDefaulttoBusy = true;
                console.log('Iframe started loading and cursor style has changed to busy in ' + (Date.now() - startTime)/1000 + 'seconds');
            }
            if (isDefaulttoBusy  && cursorStyle === 'default'){
                console.log('Iframe has completed loading and cursor style has changed to default in ' + (Date.now() - startTime)/1000 + 'seconds')
                break;
            }
            await this.page.waitForTimeout(500); // Adjust polling interval as necessary
        }
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

    }


    // Function to get the cursor style within the iframe
    async getCursorStyle(iframeSelector: string): Promise<string | null> {
      return await this.page.evaluate((iframeSelector) => {
      const iframeElement = document.querySelector(iframeSelector) as HTMLIFrameElement;
      if (!iframeElement) return null;
      const iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow?.document;
      if (!iframeDocument) return null;

      // Check the cursor style on the specific element or body
      const element = iframeDocument.querySelector('body') || iframeDocument.documentElement;
      return element ? getComputedStyle(element).cursor : null;
      }, iframeSelector);
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
      this.dirSize.push(filesManager.getDirectorySize(path));
      console.log("total file size is " + (this.dirSize[this.dirSize.length-1]/(1024*1024)).toPrecision(3) + "MB");
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
      this.loadingTimeUploading.push((after - before) / 1000);
      console.log("total time spent on uploading is : " + this.loadingTimeUploading[this.loadingTimeUploading.length-1] + " seconds.");
      return true;
    }
    
    async updateResult(filename:string){

      this.testTimeEnd = new Date();
      this.formattedTestTimeEnd = this.testTimeEnd.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    
      console.log("testing ended time: " + this.formattedTestTimeEnd);

        let comments = this.baseURL + " file size: " + (this.dirSize[0]/(1024*1024)).toPrecision(3) + "MB";
        let testResult = [this.formattedTestTimeStart,this.formattedTestTimeEnd,
            this.loadingTimeProductDetailsPage, this.loadingTimeBuilder, 
            //front
            this.loadingTimeUploading[0],this.loadingTimeAutofill[0],
            //back
            this.loadingTimeATab[0],this.loadingTimeUploading[1],this.loadingTimeAutofill[1],
            //box outside
            this.loadingTimeATab[1],this.loadingTimeUploading[2],this.loadingTimeBox[0],
            //box inside
            this.loadingTimeATab[2],this.loadingTimeUploading[3],this.loadingTimeBox[1],
            //seal
            this.loadingTimeATab[3],this.loadingTimeUploading[4],this.loadingTimeBox[2],
            //Preview
            this.loadingTimeATab[4],this.loadingTimeATab[5],
            //cart
            this.loadingTimeCart,
            comments];
      
        const reportGenerator = new DailyReportWriter();
        await reportGenerator.setColumns(this.columns);
        await reportGenerator.setFilename(filename);
        await reportGenerator.createDailyReport(testResult);    
    }  

    async getAutoFillLoadingTime(){

      let before = new Date().valueOf();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByText('AutoFill').click();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByRole('dialog').getByText('Select All').click();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).locator(`//span[text()="No Repeat" and contains(@class, "autofill")]`).click();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByLabel('No Repeat').getByText('Repeat', { exact: true }).click();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByText('OK').click();
      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).locator(`//span[@ng-if="ctrl.isAutoFill"]//span[ @ng-show="ctrl.autoFillLoading"]`)).toBeVisible({timeout:30000});
      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).locator(`//span[@ng-if="ctrl.isAutoFill"]//span[ @class="button__load ng-hide"]`)).toBeAttached({timeout: 300000});     
      let after = new Date().valueOf();     
      this.loadingTimeAutofill.push((after - before) / 1000);
      console.log("6. total time spent on autofill is : " + this.loadingTimeAutofill[this.loadingTimeAutofill.length-1] + " seconds.");
    }

    async getTabLoadingTime(tab:number){
      let before = new Date().valueOf();
      await this.page.frameLocator(`iframe[name="builderIFrame"]`).
          locator(`//div[contains(@class,"navigation-item-image-title ng-scope")]`).nth(tab).click();
      if (await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByRole('dialog').isVisible({timeout: 10000})){
          await this.page.frameLocator(`iframe[name="builderIFrame"]`).getByRole('button', { name: 'OK' }).click();
      }

      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).
          locator(`//div[@class="preview-shade preview-shade-show-hide ng-scope"]`)).toBeVisible({timeout: 30000});
      await expect(this.page.frameLocator(`iframe[name="builderIFrame"]`).
          locator(`//div[@class="preview-shade preview-shade-show-hide ng-scope ng-hide"]`)).toBeAttached({timeout: 60000});
      let after = new Date().valueOf(); 
      this.loadingTimeATab.push((after - before) / 1000);
      console.log("The time spent on loading new tab is : " + this.loadingTimeATab[this.loadingTimeATab.length-1] + " seconds. " + this.loadingTimeATab.length);

    }

    async getBoxAutofillLoadingTime(text:string){
      let before = new Date().valueOf();


      await this.page.frameLocator('iframe[name="builderIFrame"]').locator(`//button[@class="img-more-btn-container dropdown-toggle"]`).first().click();
      await this.page.frameLocator('iframe[name="builderIFrame"]').getByRole('menu').getByText(text).click();
      await this.page.waitForTimeout(2000);
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('load');
      await this.page.waitForLoadState("networkidle");
      let after = new Date().valueOf(); 
      this.loadingTimeBox.push((after - before) / 1000);
      console.log("total time spent on box is : " + this.loadingTimeBox[this.loadingTimeBox.length-1]  + " seconds.");
    }

    async deleteAllFiles(){
      if (expect(this.page.frameLocator('iframe[name="builderIFrame"]').getByLabel('Select All 0 Selected').isVisible())){
        await this.page.frameLocator('iframe[name="builderIFrame"]').getByLabel('Select All 0 Selected').check();
        await this.page.frameLocator('iframe[name="builderIFrame"]').locator('.img-delete-btn > .path1').first().click();
        await this.page.frameLocator('iframe[name="builderIFrame"]').getByRole('button', { name: 'OK' }).click();
      }
    }

    async getCartLoadingTime(){
      let before = new Date().valueOf();
      await this.page.getByRole('button', { name: 'Add To Cart' }).click();
      await this.page.getByRole('button', { name: 'Yes' }).click();
      await expect(this.page).toHaveURL(/.*cart/,{timeout:30000});
      let after = new Date().valueOf(); 
      this.loadingTimeCart = (after - before) / 1000;
      console.log("loading time of cart is: " + this.loadingTimeCart + " seconds.");
    }
}