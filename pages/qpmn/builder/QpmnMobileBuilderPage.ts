import { Page } from "playwright";
import { expect } from "playwright/test";
import { locators } from "./builderlocators";
import { QpmnBuilderPage } from "./QpmnBuilderPage";
import { qpmnconfig } from "../../../config/envConfig";

export class QpmnMobileBuilderPage extends QpmnBuilderPage {

    constructor(public page: Page){
        super(page)
    }

    async openProductDetailPage(): Promise<void> {
        await super.open( );
    }

    async clickOrderasample(){
        await this.page.getByRole('button', { name: locators.orderasample }).first().click();
        await expect(this.page).toHaveURL(/.*builder/, {timeout: 60000});
        await expect(this.page.frameLocator(locators.iframe).getByRole('dialog')).toContainText('OK',{timeout: 120000});

        if ( await this.page.frameLocator(locators.iframe).locator(locators.promtconfirm).isVisible({timeout: 10000})){
            await  this.page.frameLocator(locators.iframe).locator(locators.promtconfirm).click();   
        }    
    }

    async openImageEditor(): Promise<void>{
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.library-bar-btn').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class,"builder-tool-icon__ImageLibrary")]`).click();

    }

    async closeImageEditor(): Promise<void>{
        await this.page.frameLocator(locators.iframe).locator('.image-library-header__close-icon').click();
    }   

    //upload file, e.g. 'C:\\tmp\\2.jpg'
    async uploadFile(filefullpath: string[]): Promise<void>{
        await this.openImageEditor();
        await this.page.frameLocator(locators.iframe).locator('input[type=file]').setInputFiles(filefullpath);
        await expect(this.page.frameLocator(locators.iframe).locator(locators.progressbox)).toBeVisible();
        await expect(this.page.frameLocator(locators.iframe).locator(locators.progressboxhide)).toBeAttached({timeout: 120000});
        await this.closeImageEditor();
    }

    //only can set backgroud in mobile
    async addImage(): Promise<void>{
        await this.openImageEditor();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Background' }).first().click();
        await this.closeImageEditor();
        await this.page.waitForTimeout(5000);
    }

    async  removeFiles(){
        await this.openImageEditor();
        const imageCount = await this.page.frameLocator(locators.iframe).
            locator(`//ul//i[contains(@class,"img-delete-btn")]`).count();
        for (var i=0;i<imageCount;i++){
            await this.page.frameLocator(locators.iframe).
                locator(`//ul//i[contains(@class,"img-delete-btn")]`).nth(0).click();
            await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
            await this.page.waitForTimeout(1000);
        }
        await this.closeImageEditor();
    }

    async expandAssistant(): Promise<void>{
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'More' }).click();
    }
    //builder assistant
    async builderAssistant(): Promise<void>{

        await this.page.frameLocator(locators.iframe).locator(locators.assistantundo).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantredo).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantzoomin).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantzoomout).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantoriginal).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantfit).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantpreview).click();
        await this.page.frameLocator(locators.iframe).getByText('OK').click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantduplicate).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantremove).click();
        await this.page.waitForTimeout(2000);  

        //background and foreground editor
        await this.page.frameLocator(locators.iframe).locator(locators.assistantbackgroundeditor).click();
        await this.builderAssistantGroundEditor();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantforegroundeditor).click();
        await this.builderAssistantGroundEditor();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(2000);  
        
        await this.page.frameLocator(locators.iframe).locator(locators.assistantproperty).click();
        await expect(this.page.frameLocator(locators.iframe).getByRole('button', { name: 'CLOSE' })).toBeVisible();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'CLOSE' }).click();
        await this.page.waitForTimeout(2000);  
    }

    async builderAssistantGroundEditor(): Promise<void>{


        //backgroundeditor
        await this.frameClickAndWait(locators.groundeditorcrop);
        await this.frameClickAndWait(locators.groundeditorcontain);
        await this.frameClickAndWait(locators.groundeditorfill);
        await this.frameClickAndWait(locators.groundeditorrotateplus);
        await this.frameClickAndWait(locators.groundeditorrotateminus);
        await this.frameClickAndWait(locators.groundeditorrotatebutton1);
        await this.frameClickAndWait(locators.groundeditorrotatebutton2);
        await this.frameClickAndWait(locators.groundeditorrotatebutton3);
        await this.frameClickAndWait(locators.groundeditorrotatebutton4);

        //Flip
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorflipx).click();
        await this.page.waitForTimeout(2000); 
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorflipy).click();
        await this.page.waitForTimeout(2000); 
        
        //Zoom
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorzoomwplus).click();
        await this.page.waitForTimeout(2000); 
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorzoomwminus).click();
        await this.page.waitForTimeout(2000); 
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorzoomhplus).click();
        await this.page.waitForTimeout(2000); 
        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorzoomhminus).click();
        await this.page.waitForTimeout(2000); 

        await this.page.frameLocator(locators.iframe).locator(locators.groundeditorlockratio).check();
        await this.page.waitForTimeout(2000); 
    }

    async textDesign(): Promise<void>{

        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.library-bar-btn').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class,"builder-tool-icon__FontLibrary")]`).click();

        //Add Text
        await this.page.frameLocator(locators.iframe).getByPlaceholder('Enter some text').click();
        await this.page.frameLocator(locators.iframe).getByPlaceholder('Enter some text').
            fill('1.Card builder testing.\n 2.Card builder testing.\n 3.Card builder testing.\n .\n .\n .\n .\n .\n .\n .\n ');
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Add' }).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class, "builder-close-icon")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//span[contains(@class, "builder-editor-icon__text-style")]`).click();     

        //change style
        await this.textDesignChangeStyle();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//i[contains(@class, "builder-close-icon")]`).click();
        await expect(this.page.frameLocator(locators.iframe).locator('canvas:nth-child(8)')).toBeVisible();
        await this.page.waitForLoadState('load');

        //Shape
        await this.page.frameLocator(locators.iframe).locator(`//li[@title='Shape']`).click();     
        await this.page.waitForTimeout(2000);    
        await this.textDesignChangeShape();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//i[contains(@class, "builder-close-icon")]`).nth(1).click();
        //Position
        await this.page.frameLocator(locators.iframe).locator(`//li[@title='Position']`).click();  
        await this.page.waitForTimeout(2000);  
        await this.generalDesignChangePosition();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//i[contains(@class, "builder-close-icon")]`).nth(2).click();
    }


    async backgroundLibDesign(){

        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.library-bar-btn').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class,"builder-tool-icon__BackgroundLibrary")]`).click();

        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Get more').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//div[@class="category-panel"]//button[contains(@class,"dropdown-toggle")]`).click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Poker, Playing Card').nth(1).click();
        await this.page.waitForTimeout(5000);          
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.object-img').first().click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(2) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(3) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Select All').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('OK', { exact: true }).click();

        const imageCount = await this.page.frameLocator(locators.iframe).locator(`//button[@title="Background"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Background library!");
            return false;
        }

        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Background"]`).first().click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Background"]`).nth(1).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Background"]`).nth(2).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).first().click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(2).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(2000);   
        await this.page.frameLocator(locators.iframe).locator('.stickers-library-header__close-icon').click();
        return true;            
    }

    async foregroundLibDesign(){
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.library-bar-btn').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class,"builder-tool-icon__ForegroundLibrary")]`).click();

        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Get more').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//div[@class="category-panel"]//button[contains(@class,"dropdown-toggle")]`).click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('St. Patrick Day').nth(1).click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.object-img').first().click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(2) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(3) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Select All').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('OK', { exact: true }).click();

        const imageCount = await this.page.frameLocator(locators.iframe).locator(`//button[@title="Foreground"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Foreground library!");
            return false;
        }        
        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Foreground"]`).first().click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Foreground"]`).nth(1).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//button[@title="Foreground"]`).nth(2).click();
        await this.page.waitForTimeout(3000);

        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).first().click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(2).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(2000);   
        await this.page.frameLocator(locators.iframe).locator('.stickers-library-header__close-icon').click();
        return true;   
    }

    async stickLibDesign(){
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.library-bar-btn').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator(`//span[contains(@class,"builder-tool-icon__StickLibrary")]`).click();

        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Get more').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//div[@class="category-panel"]//button[contains(@class,"dropdown-toggle")]`).click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Number').nth(1).click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('.object-img').first().click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(2) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').locator('li:nth-child(3) > .thumbnail > .object-img').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('Select All').click();
        await this.page.frameLocator('iframe[name="builderFrame"]').getByText('OK', { exact: true }).click();     
   
        const imageCount = await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@title="Add"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Stick library!");
            return false;
        } 
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@title="Add"]`).first().click();
        await this.page.waitForTimeout(5000);     
        await this.page.frameLocator(locators.iframe).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(2000); 
        await this.page.frameLocator(locators.iframe).locator('.stickers-library-header__close-icon').click();
        /*
        //use position to zoom in or out stick
        //viewport: {width:1024,height:1366}
        await this.page.frameLocator(locators.iframe).locator('canvas:nth-child(8)').hover({
            position: {
            x: 538,
            y: 432
            }
        });
        await this.page.mouse.down();
        await this.page.frameLocator(locators.iframe).locator('canvas:nth-child(8)').hover({
            position: {
            x: 638,
            y: 535
            }
        });        
        await this.page.mouse.up();
        */
        await this.page.frameLocator(locators.iframe).locator(`//li[@title='Shape']`).click();     
        await this.page.waitForTimeout(2000);    
        await this.stickLibDesignShape();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//li[contains(@id, "picture-shape")]//i[contains(@class, "builder-close-icon")]`).click();
 
        //Style
        await this.page.frameLocator(locators.iframe).locator(`//li[@title='Style']`).click();     
        await this.page.waitForTimeout(2000);    
        await this.stickLibDesignStyle();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//li[contains(@id, "picture-style")]//i[contains(@class, "builder-close-icon")]`).click();

        //Position
        await this.page.frameLocator(locators.iframe).locator(`//li[@title='Position']`).click();  
        await this.page.waitForTimeout(2000);  
        await this.generalDesignChangePosition();
        await this.page.frameLocator('iframe[name="builderFrame"]').
            locator(`//li[contains(@id, "position")]//i[contains(@class, "builder-close-icon")]`).click();
        return true;

    }
    async stickLibDesignShape(): Promise<void>{
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'cropWidth,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'cropWidth,-1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'cropHeight,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'cropHeight,-1')]`).click();
        await this.page.waitForTimeout(1000);  

        await this.page.frameLocator(locators.iframe).locator('label').filter({ hasText: 'Lock Aspect Ratio' }).locator('span').nth(1).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).getByLabel('Lock Aspect Ratio').check();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).getByLabel('Relative To Original Size').check();      
        await this.page.waitForTimeout(1000);  

        //Rotate
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'transformRotate,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,'transformRotate,-1')]`).click();
        await this.page.waitForTimeout(1000);  
        
        //Flip
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);          
    }

    async stickLibDesignStyle(): Promise<void>{
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,"'Brightness',0.1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown,"'Brightness',-0.1")]`).click();
        await this.page.waitForTimeout(1000);  
    }

    async autoFill(): Promise<void>{
        await this.openImageEditor();
        await this.page.frameLocator(locators.iframe).getByText('AutoFill').click();
        await this.page.frameLocator(locators.iframe).getByText('cancelAll').click();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(0).check();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(1).check();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(2).check();
      
      
      
        await this.page.frameLocator(locators.iframe).locator(`//span[text()="No Repeat" and contains(@class, "autofill")]`).click();
        await this.page.frameLocator(locators.iframe).getByLabel('No Repeat').getByText('Repeat', { exact: true }).click();
        await this.page.frameLocator(locators.iframe).getByText('OK').click();
        await expect(this.page.frameLocator(locators.iframe).locator(`//span[ @class="button__load"]`)).toBeVisible({timeout:30000});
        await expect(this.page.frameLocator(locators.iframe).locator(`//span[ @class="button__load ng-hide"]`)).toBeAttached({timeout: 120000});
      
      
        await this.page.frameLocator(locators.iframe).getByText('AutoFill').click();
        await this.page.frameLocator(locators.iframe).getByText('cancelAll').click();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(3).check();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(4).check();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(5).check();
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(6).check();  
        await this.page.frameLocator(locators.iframe).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(7).check();
        await this.page.frameLocator(locators.iframe).locator('#fill-type-button').getByText('Background').click();
        await this.page.frameLocator(locators.iframe).getByText('ForeGround', { exact: true }).click();
        await this.page.frameLocator(locators.iframe).locator(`//span[text()="No Repeat" and contains(@class, "autofill")]`).click();
        await this.page.frameLocator(locators.iframe).getByLabel('No Repeat').getByText('Repeat', { exact: true }).click();
        await this.page.frameLocator(locators.iframe).getByText('OK').click();
        await expect(this.page.frameLocator(locators.iframe).locator(`//span[ @class="button__load"]`)).toBeVisible({timeout:30000});
        await expect(this.page.frameLocator(locators.iframe).locator(`//span[ @class="button__load ng-hide"]`)).toBeAttached({timeout: 120000});
        await this.closeImageEditor();
    }

    async addToCartTemp(){
        //Add to Cart
        await this.page.getByRole('button', { name: 'Add To Cart' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        if (await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).isVisible({timeout: 10000})){
            await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        }
        await expect(this.page).toHaveURL(/.*cart/,{timeout:60000});
        await this.page.waitForLoadState('networkidle');

        //select 1st product to checkout
        if (this.page.viewportSize()?.width > 767){
            const itemCount = (await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).count())
            if (itemCount == 0){
                console.log("no items in Cart!");
                return;
            }else if (itemCount == 1){
                await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).check();
            }else{
                await this.page.locator(`//div[@class="cart-content-container ng-scope"]//input[@id="item.id"]`).first().check();
            }
          } else{
            const itemCount = (await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).count())
            if (itemCount == 0){
                console.log("no items in Cart!");
                return;
            }else if (itemCount == 1){
                await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).check();
            }else{
                await this.page.locator(`//div[@class="cart-content-container_mobile ng-scope"]//input[@id="item.id"]`).first().check();
            }            
          }

        await this.page.getByRole('button', { name: 'Continue' }).click(); 
        await this.page.getByRole('button', { name: 'OK' }).click();
        // login
        await this.page.waitForLoadState('load');
        await this.page.getByPlaceholder('Please input your email').click();
        await this.page.getByPlaceholder('Please input your email').fill(qpmnconfig.credentials.username0);
        await this.page.getByPlaceholder('Please input your password').click();
        await this.page.getByPlaceholder('Please input your password').fill(qpmnconfig.credentials.password0);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        await this.page.waitForTimeout(5000);        
    }


}