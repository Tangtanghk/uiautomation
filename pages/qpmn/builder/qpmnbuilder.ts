import type { Page } from 'playwright';
import { qpmnconfig } from '../../../config/envConfig';
import { expect } from 'playwright/test';

export class QpmnBuilder {
    readonly page: Page;
    readonly baseURL = qpmnconfig.QPMN_BASEURL;
    frameLocator = `iframe[name="builderFrame"]`;
    
    constructor(page: Page) {
        this.page = page;
    }

	async setFrameLocator(frameLocator: string){
		return this.frameLocator = frameLocator;
	}    

    async open(): Promise<void> {
        await this.page.goto( this.baseURL + '/app/products/poker-size-custom-playing-card-standard/');
        await this.page.getByRole('button', { name: 'Order a sample' }).first().click();
        await expect(this.page.frameLocator(this.frameLocator).getByRole('dialog')).toContainText('OK',{timeout: 120000});

        if ( await this.page.frameLocator(this.frameLocator).locator('#qp-prompt-confirm-button').isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByText('Hint').click();
            await  this.page.frameLocator(this.frameLocator).locator('#qp-prompt-confirm-button').click();   
        }
           
    
    }

    //options: Same image, Different image
    async setPropertyEditor(cardfronts: string, cardbacks: string ): Promise<void>{
        await this.page.frameLocator(this.frameLocator).getByText(cardfronts).first().click();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="editor-loading ng-scope"]`).waitFor({state: 'detached'});
        await this.page.frameLocator(this.frameLocator).getByText(cardbacks).nth(1).click();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="editor-loading ng-scope"]`).waitFor({state: 'detached'});
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(8000); 
    }

    async autoFill(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).getByText('AutoFill').click();
        await this.page.frameLocator(this.frameLocator).getByText('cancelAll').click();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).first().check();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(1).check();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(2).check();
      
      
      
        await this.page.frameLocator(this.frameLocator).locator(`//span[text()="No Repeat" and contains(@class, "autofill")]`).click();
        await this.page.frameLocator(this.frameLocator).getByLabel('No Repeat').getByText('Repeat', { exact: true }).click();
        await this.page.frameLocator(this.frameLocator).getByText('OK').click();
        await expect(this.page.frameLocator(this.frameLocator).locator(`//span[ @class="button__load"]`)).toBeVisible({timeout:30000});
        await expect(this.page.frameLocator(this.frameLocator).locator(`//span[ @class="button__load ng-hide"]`)).toBeAttached({timeout: 120000});
      
      
        await this.page.frameLocator(this.frameLocator).getByText('AutoFill').click();
        await this.page.frameLocator(this.frameLocator).getByText('cancelAll').click();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(3).check();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(4).check();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(5).check();
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(6).check();  
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="modal-dialog modal-picture-autofill"]//input[@type="checkbox"]`).nth(7).check();
        await this.page.frameLocator(this.frameLocator).locator('#fill-type-button').getByText('Background').click();
        await this.page.frameLocator(this.frameLocator).getByText('ForeGround', { exact: true }).click();
        await this.page.frameLocator(this.frameLocator).locator(`//span[text()="No Repeat" and contains(@class, "autofill")]`).click();
        await this.page.frameLocator(this.frameLocator).getByLabel('No Repeat').getByText('Repeat', { exact: true }).click();
        await this.page.frameLocator(this.frameLocator).getByText('OK').click();
        await expect(this.page.frameLocator(this.frameLocator).locator(`//span[ @class="button__load"]`)).toBeVisible({timeout:30000});
        await expect(this.page.frameLocator(this.frameLocator).locator(`//span[ @class="button__load ng-hide"]`)).toBeAttached({timeout: 120000});
      
    }

    async goToStep2Back(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@class,"navigation-item-image-title ng-scope")]`).nth(1).click();
        await this.page.waitForTimeout(2000);
        if (await this.page.frameLocator(this.frameLocator).getByRole('dialog').isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
            await this.page.waitForTimeout(5000);
        }

    }
    async  removeFiles(){
        await this.page.frameLocator(this.frameLocator).locator(`//input[@id="img-select-checkbox" ]`).check();
        await this.page.frameLocator(this.frameLocator).locator(`//i[@ng-click="ctrl.deleteSelectedImg()" ]`).click();
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(2000);
    }

    
    async goToStep3Preview(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@class,"navigation-item-image-title ng-scope")]`).nth(2).click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('load');
        if (await this.page.frameLocator(this.frameLocator).getByRole('dialog').isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
            await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(5000);
        }

        //verify screenshot
        // if(await this.page.frameLocator(this.frameLocator).locator(`//div[@class="konvajs-content"]`).isVisible()){
        //     // await this.page.frameLocator(this.frameLocator).
        //     //     locator(`//div[@class="konvajs-content"]`).screenshot({path:"./screenshot/preview.png", omitBackground: true})
        //     await expect(this.page.frameLocator(this.frameLocator).
        //         locator(`//div[@class="konvajs-content"]`)).toHaveScreenshot();
        // }

    }

    async addToCart(){
        //Add to Cart
        await this.page.getByRole('button', { name: 'Add To Cart' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        if (await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
        }
        await this.page.waitForURL(this.baseURL + '/app/cart/');
    }
    
    async wooSaveDesign(): Promise<void>{
        //Save design in Woo Builder
        await this.page.getByRole('button', { name: 'Save' }).click();
        if (await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
        }       
        await expect(this.page.getByRole('button', { name: 'Add to cart' })).toBeVisible({timeout: 60000});
    }
    
    async addToCartTemp(){
        //Add to Cart
        await this.page.getByRole('button', { name: 'Add To Cart' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        if (await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).isVisible({timeout: 10000})){
            await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'OK' }).click();
        }
        await this.page.waitForURL(this.baseURL + '/app/cart/');

        //select 1st product to checkout
        await this.page.locator(`//input[@id="item.id"]`).first().check();
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

    //upload file, e.g. 'C:\\tmp\\2.jpg'
    async uploadFile(filefullpath: string[]): Promise<void>{
        await expect(this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' })).toBeVisible({timeout:30000});
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click({timeout:30000});
        await this.page.frameLocator(this.frameLocator).locator('input[type=file]').setInputFiles(filefullpath);
        await expect(this.page.frameLocator(this.frameLocator).locator(`//div[@class="upload-pictures-box"]//div [@class='progress-box']`)).toBeVisible({timeout:30000});
        await expect(this.page.frameLocator(this.frameLocator).locator(`//div [@class='progress-box ng-hide']`)).toBeAttached({timeout: 120000});

    }

    //set foreground, background, free iamge after uploading file
    async addImage(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();
        await this.page.frameLocator(this.frameLocator).
            locator(`//Button[@class='img-more-btn-container dropdown-toggle']`).first().click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(2000);    
        await this.page.frameLocator(this.frameLocator).
            locator(`//Button[@class='img-more-btn-container dropdown-toggle']`).nth(1).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//Button[@class='img-more-btn-container dropdown-toggle']`).nth(2).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();
        await this.page.frameLocator(this.frameLocator).
            locator(`//Button[@class='img-more-btn-container dropdown-toggle']`).nth(3).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(5000);
        // await this.page.frameLocator(this.frameLocator).
        //     locator(`(//input[contains(@class,'pic-list-panel')])[1]`).check({timeout:60000});
        // await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Add' }).click();
        // await this.page.waitForTimeout(5000);

    }
    async imageDesign(): Promise<void>{
        await this.imageDesignChangeShape();
        //style
        await this.page.waitForTimeout(2000);
        //We have to use locator to detect this element, getByRole doesn't work.
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Style']`).click();
        await this.page.waitForTimeout(2000);        
        await this.imageDesignChangeStyle();

        //position
        await this.page.waitForTimeout(2000);
        //We have to use locator to detect this element, getByRole doesn't work.
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Position']`).click();
        await this.page.waitForTimeout(2000);        
        await this.generalDesignChangePosition();

    }

    async imageDesignChangeStyle(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='pic-style-container']//span[@class='glyphicon glyphicon-plus']`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='pic-style-container']//span[@class='glyphicon glyphicon-minus']`).click();
        await this.page.waitForTimeout(1000);

        await this.page.frameLocator(this.frameLocator).locator('#picture-style-editor-12 li').filter({ hasText: 'blue' }).locator('span').click();
        await this.page.waitForTimeout(2000);        
        await this.page.frameLocator(this.frameLocator).locator('#picture-style-editor-12 li').filter({ hasText: 'red' }).locator('span').click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(this.frameLocator).locator('#picture-style-editor-12 li').filter({ hasText: 'green' }).locator('span').click();    
        await this.page.waitForTimeout(2000);        
    }

    async imageDesignChangeShape(): Promise<void>{
        //shape
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Manage design' }).click();
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Width,1') ]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Width,-1') ]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Height,1') ]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Height,-1') ]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Rotate,1') ]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='picture-shape-container']//button[contains(@ng-mousedown,'Rotate,-1') ]`).click();
        await this.page.waitForTimeout(2000);

        await this.page.frameLocator(this.frameLocator).locator('label').filter({ hasText: 'Lock Aspect Ratio' }).locator('span').nth(1).click();
        await this.page.frameLocator(this.frameLocator).getByLabel('Lock Aspect Ratio').check();
        await this.page.frameLocator(this.frameLocator).getByLabel('Relative To Original Size').check();
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@class,'x-axis-container')]`).click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@class,'y-axis-container')]`).click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@class,'x-axis-container')]`).click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@class,'y-axis-container')]`).click();


    }

    async imageDesignChangePosition(): Promise<void>{
        // await this.page.frameLocator(this.frameLocator).getByRole('button', { name: ' ' }).click();
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'top-align-btn')]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'bottom-align-btn')]`).click();
        await this.page.waitForTimeout(1000);      
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'left-align-btn')]`).click();
        await this.page.waitForTimeout(1000);        
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'right-align-btn')]`).click();
        await this.page.waitForTimeout(1000);        
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'vertical-middle-btn')]`).click();
        await this.page.waitForTimeout(1000);      
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'horizontal-center-btn')]`).click();
        await this.page.waitForTimeout(1000);        
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'both-center-btn')]`).click();

        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='position-ctrl-container']//button[contains(@ng-mousedown,'positionX,1')]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='position-ctrl-container']//button[contains(@ng-mousedown,'positionX,-1')]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='position-ctrl-container']//button[contains(@ng-mousedown,'positionY,1')]`).click();
        await this.page.waitForTimeout(1000);
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class='position-ctrl-container']//button[contains(@ng-mousedown,'positionY,-1')]`).click();
        await this.page.waitForTimeout(1000);  


        //(Order) change layer
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'moveToTop')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'moveUp')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'moveDown')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'moveToBottom')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'moveToTop')]`).click();
        await this.page.waitForTimeout(1000);  

        //set 1st image to top
        await this.page.frameLocator(this.frameLocator).locator(`//button//*[contains(@class,'top-align-btn')]`).click();
        await this.page.waitForTimeout(1000);

    }

    async textDesign(): Promise<void>{
        await expect(this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' })).toBeVisible({timeout: 30000});
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();    
        await this.page.frameLocator(this.frameLocator).getByRole('listitem', { name: 'TEXT' }).click();
        await this.page.waitForTimeout(5000);    

        //change style
        await this.textDesignChangeStyle();

        //Shape
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Shape']`).click();     
        await this.page.waitForTimeout(2000);    
        await this.textDesignChangeShape();
        //Position
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Position']`).click();  
        await this.page.waitForTimeout(2000);  
        await this.generalDesignChangePosition();
    }

    async textDesignChangeStyle(): Promise<void>{

        await this.page.frameLocator(this.frameLocator).getByPlaceholder('Enter some text').click();
        await this.page.frameLocator(this.frameLocator).getByPlaceholder('Enter some text').
            fill('1.Card builder testing.\n 2.Card builder testing.\n 3.Card builder testing.\n .\n .\n .\n .\n .\n .\n .\n ');
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Add' }).click();
        await this.page.waitForTimeout(2000);  
        //Style
        await this.page.frameLocator(this.frameLocator).locator(`//button[@id="font-family-list"]`).click();
        await this.page.frameLocator(this.frameLocator).locator('.text-font-20th-Century-Gaunt').click();
        await this.page.waitForTimeout(2000);  

        await this.page.frameLocator(this.frameLocator).
            locator(`//button[contains(@ng-mousedown,'Size,1')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).
            locator(`//button[contains(@ng-mousedown,'Size,1')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).
            locator(`//button[contains(@ng-mousedown,'Size,-1')]`).click();
        await this.page.waitForTimeout(2000);  
        //select color
        await this.page.frameLocator(this.frameLocator).locator('#text-color-list').click();
        await this.page.frameLocator(this.frameLocator).locator('li:nth-child(5) > .colors-item__label').click();
        await this.page.waitForTimeout(5000); 
        //select Font Style
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'isFontToBold')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'isFontToItalic')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click,'isFontHasUnderline')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).getByRole('textbox').click();
        await this.page.frameLocator(this.frameLocator).getByRole('textbox').fill(''); 
        await this.page.frameLocator(this.frameLocator).getByRole('textbox').
            pressSequentially('1.Builder.\n 2.Builder.\n 3.Builder');    
        await this.page.frameLocator(this.frameLocator).getByText('Content', { exact: true }).click();
        await this.page.waitForTimeout(5000);      

        await expect(this.page.frameLocator(this.frameLocator).locator('canvas:nth-child(8)')).toBeVisible();
        await this.page.waitForLoadState('load');
         
    }

    async textDesignChangeShape(): Promise<void>{
     
        //Text Alignment - Vertical
        await this.page.frameLocator(this.frameLocator).
            locator(`//button[contains(@class, 'text-align-direction-container_selected')]`).click();
        await this.page.waitForTimeout(3000); 
        
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Top'")]`).click();
        await this.page.waitForTimeout(2000);     
        
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Center'")]`).click();
        await this.page.waitForTimeout(2000);    
        
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Bottom'")]`).click();            
        await this.page.waitForTimeout(2000);   
        
        //Text Alignment - Horizontal
        await this.page.frameLocator(this.frameLocator).
            locator(`//button[contains(@class, 'text-align-direction-container_selected')]`).click();
        await this.page.waitForTimeout(3000);              
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Left'")]`).click();
        await this.page.waitForTimeout(2000);     
        
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Center'")]`).click();
        await this.page.waitForTimeout(2000);    
        
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Right'")]`).click();
        await this.page.waitForTimeout(2000);    

        //Text Margin
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).first().click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).first().click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(1).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(1).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(2).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(2).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(3).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(3).click();
        await this.page.waitForTimeout(2000);  

        //Autofit
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Resize shape to fit text' }).click();
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Shrink text on overflow' }).click();
        await this.page.waitForTimeout(5000);  
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Shrink text on overflow' }).click();
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Resize shape to fit text' }).click();
        await this.page.waitForTimeout(5000);  
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Resize shape to fit text' }).click();
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Do not autofit' }).click();
        await this.page.waitForTimeout(5000);  
        //Wrap text in shape //div[@class='text-box__wrap-text-in-shape-container']
        await this.page.frameLocator(this.frameLocator).getByLabel('Wrap text in shape').check();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator('label').filter({ hasText: 'Wrap text in shape' }).locator('span').nth(1).click();
        await this.page.waitForTimeout(2000);  

        //Roate
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'Rotate',1")]`).click();
        await this.page.waitForTimeout(2000);  

        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "'Rotate',-1")]`).click();
        await this.page.waitForTimeout(2000);  

        //Flip
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
    }

    async generalDesignChangePosition(): Promise<void>{
        //align
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('top')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('bottom')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('left')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('right')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('horizontal')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('vertical')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "changeAlign('center')")]`).click();
        await this.page.waitForTimeout(1000);  

        //Position
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "positionX,1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "positionX,-")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "positionY,1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown, "positionY,-")]`).click();
        await this.page.waitForTimeout(1000);  

        //Order
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "moveToTop")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "moveUp")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "moveDown")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "moveToBottom")]`).click();
        await this.page.waitForTimeout(1000);  
        //Reset to top
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-click, "moveToTop")]`).click();
        await this.page.waitForTimeout(1000);  
    }

    async backgroundLibDesign(){
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click(); 
        await this.page.frameLocator(this.frameLocator).locator(`//li[contains(@title, "Background")]`).click();

        const imageCount = await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Background"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Background library!");
            return false;
        }
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Background"]`).first().click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Background"]`).nth(1).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Background"]`).nth(2).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).first().click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(2).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Background').click();

        await this.page.waitForTimeout(2000);   
        return true;            
    }

    async foregroundLibDesign(){
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();
        await this.page.frameLocator(this.frameLocator).locator(`//li[contains(@title, "Foreground")]`).click();
      
        const imageCount = await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Foreground"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Foreground library!");
            return false;
        }        
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Foreground"]`).first().click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Foreground"]`).nth(1).click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Foreground"]`).nth(2).click();
        await this.page.waitForTimeout(3000);

        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).first().click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(2).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Foreground').click();

        await this.page.waitForTimeout(2000);   
        return true;   
    }

    async stickLibDesign(){
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();
        await this.page.frameLocator(this.frameLocator).locator(`//li[contains(@title, "Stick")]`).click();
    
        const imageCount = await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@title="Add"]`).count();
        if (imageCount <= 2){
            console.log("The number of images is " + imageCount + ", not enough data in Stick library!");
            return false;
        } 
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@title="Add"]`).first().click();
        await this.page.waitForTimeout(5000);     
        await this.page.frameLocator(this.frameLocator).getByRole('link', { name: 'Add design element' }).click();
        await this.page.frameLocator(this.frameLocator).locator(`//ul[@class="items-ul"]//button[@id="single-button"]`).nth(1).click();
        await this.page.frameLocator(this.frameLocator).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(2000); 

        //use position to zoom in or out stick
        /*
        await this.page.frameLocator(this.frameLocator).locator('canvas:nth-child(8)').hover({
                position: {
                    x: 482,
                    y: 221
                }
                });
        await this.page.mouse.down();

        await this.page.frameLocator(this.frameLocator).locator('canvas:nth-child(8)').hover({
                position: {
                    x: 600,
                    y: 300
                }
                });
        await this.page.mouse.up();
        */

        //new resolution
        await this.page.frameLocator(this.frameLocator).locator('canvas:nth-child(8)').hover({
            position: {
            x: 618,
            y: 317
            }
        });
        await this.page.mouse.down();
        await this.page.frameLocator(this.frameLocator).locator('canvas:nth-child(8)').hover({
            position: {
            x: 730,
            y: 430
            }
        });        
        await this.page.mouse.up();

        await this.stickLibDesignShape();
  
        //Style
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Style']`).click();     
        await this.page.waitForTimeout(2000);    
        await this.stickLibDesignStyle();
        //Position
        await this.page.frameLocator(this.frameLocator).locator(`//li[@title='Position']`).click();  
        await this.page.waitForTimeout(2000);  
        await this.generalDesignChangePosition();
        return true;

    }
    async stickLibDesignShape(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'cropWidth,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'cropWidth,-1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'cropHeight,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'cropHeight,-1')]`).click();
        await this.page.waitForTimeout(1000);  

        await this.page.frameLocator(this.frameLocator).locator('label').filter({ hasText: 'Lock Aspect Ratio' }).locator('span').nth(1).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).getByLabel('Lock Aspect Ratio').check();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).getByLabel('Relative To Original Size').check();      
        await this.page.waitForTimeout(1000);  

        //Rotate
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'transformRotate,1')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,'transformRotate,-1')]`).click();
        await this.page.waitForTimeout(1000);  
        
        //Flip
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//div[@class="picture-shape-container"]//button[contains(@class,"y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);          
    }

    async stickLibDesignStyle(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,"'Brightness',0.1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[contains(@ng-mousedown,"'Brightness',-0.1")]`).click();
        await this.page.waitForTimeout(1000);  
    }

    async builderAssistant(): Promise<void>{
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Undo"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Redo"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="ZoomIn"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="ZoomOut"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Original"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Fit"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Preview"]`).click();
        await this.page.frameLocator(this.frameLocator).getByText('OK').click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Duplicate"]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Remove"]`).click();
        await this.page.frameLocator(this.frameLocator).getByText('OK').click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="BackgroundEditor"]`).click();
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="ForegroundEditor"]`).click();
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'Cancel' }).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(this.frameLocator).locator(`//button[@title="Property"]`).click();
        await expect(this.page.frameLocator(this.frameLocator).getByText('Change your design')).toBeVisible();
        await expect(this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'CLOSE' })).toBeVisible();
        await this.page.frameLocator(this.frameLocator).getByRole('button', { name: 'CLOSE' }).click();
                

    }
}