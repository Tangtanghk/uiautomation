import { Page } from "playwright";
import { BasePage } from "../BasePage";
import { expect } from "playwright/test";
import { locators } from "./builderlocators";

export class QpmnBuilderPage extends BasePage {

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

    //options: Same image, Different image
    async setPropertyEditor(cardfronts: string, cardbacks: string ): Promise<void>{
        await this.page.frameLocator(locators.iframe).getByText(cardfronts).first().click();
        await expect(this.page.frameLocator(locators.iframe).locator(`//div[@class="editor-loading ng-scope"]`)).toBeVisible();
        await expect(this.page.frameLocator(locators.iframe).locator(`//div[@class="editor-loading ng-scope"]`)).toBeHidden();
        // await this.page.waitForTimeout(1000); 
        await this.page.frameLocator(locators.iframe).getByText(cardbacks).nth(1).click();
        await expect(this.page.frameLocator(locators.iframe).locator(`//div[@class="editor-loading ng-scope"]`)).toBeVisible();
        await expect(this.page.frameLocator(locators.iframe).locator(`//div[@class="editor-loading ng-scope"]`)).toBeHidden();
        // await this.page.waitForTimeout(1000); 
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(8000); 
    }

    //upload file, e.g. 'C:\\tmp\\2.jpg'
    async uploadFile(filefullpath: string[]): Promise<void>{
        // await expect(this.page.frameLocator(locators.iframe).getByRole('link', { name: locators.adddesignelement })).toBeVisible({timeout:60000});
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: locators.adddesignelement }).click();
        await this.page.frameLocator(locators.iframe).locator('input[type=file]').setInputFiles(filefullpath);
        await expect(this.page.frameLocator(locators.iframe).locator(locators.progressbox)).toBeVisible();
        await expect(this.page.frameLocator(locators.iframe).locator(locators.progressboxhide)).toBeAttached({timeout: 120000});

    }

    //set 1 foreground, 1 background, 2 free iamges after uploading file
    async addImage(): Promise<void>{
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: locators.adddesignelement }).click({timeout: 30000});
        await this.page.frameLocator(locators.iframe).locator(locators.imagedropdown).first().click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Background').click();
        await this.page.waitForTimeout(2000);    
        await this.page.frameLocator(locators.iframe).locator(locators.imagedropdown).nth(1).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Foreground').click();
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator(locators.iframe).locator(locators.imagedropdown).nth(2).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(5000);
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: locators.adddesignelement }).click();
        await this.page.frameLocator(locators.iframe).locator(locators.imagedropdown).nth(3).click();
        await this.page.frameLocator(locators.iframe).getByRole('menu').getByText('Add').click();
        await this.page.waitForTimeout(5000);
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
        await this.page.frameLocator(locators.iframe).getByText('OK').click();
        await this.page.waitForTimeout(2000);  

        //background and foreground editor
        await this.page.frameLocator(locators.iframe).locator(locators.assistantbackgroundeditor).click();
        await this.builderAssistantGroundEditor();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(locators.assistantforegroundeditor).click();
        await this.builderAssistantGroundEditor();
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Cancel' }).click();
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
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorcrop).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorcontain).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorfill).click();
        // await this.page.waitForTimeout(2000); 
        // //Rotate
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotateplus).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotateminus).click();
        // await this.page.waitForTimeout(2000); 

        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotatebutton1).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotatebutton2).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotatebutton3).click();
        // await this.page.waitForTimeout(2000); 
        // await this.page.frameLocator(locators.iframe).locator(locators.groundeditorrotatebutton4).click();
        // await this.page.waitForTimeout(2000); 

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

    async textDesignChangeStyle(): Promise<void>{
       
        //Style
        await this.page.frameLocator(locators.iframe).locator(`//button[@id="font-family-list"]`).click();
        await this.page.frameLocator(locators.iframe).locator('.text-font-20th-Century-Gaunt').click();
        await this.page.waitForTimeout(2000);  

        await this.page.frameLocator(locators.iframe).
            locator(`//button[contains(@ng-mousedown,'Size,1')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).
            locator(`//button[contains(@ng-mousedown,'Size,1')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).
            locator(`//button[contains(@ng-mousedown,'Size,-1')]`).click();
        await this.page.waitForTimeout(2000);  
        //select color
        await this.page.frameLocator(locators.iframe).locator('#text-color-list').click();
        await this.page.frameLocator(locators.iframe).locator('li:nth-child(5) > .colors-item__label').click();
        await this.page.waitForTimeout(5000); 
        //select Font Style
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click,'isFontToBold')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click,'isFontToItalic')]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click,'isFontHasUnderline')]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).getByRole('textbox').click();
        await this.page.frameLocator(locators.iframe).getByRole('textbox').fill(''); 
        await this.page.frameLocator(locators.iframe).getByRole('textbox').
            pressSequentially('1.Builder.\n 2.Builder.\n 3.Builder');    
        await this.page.frameLocator(locators.iframe).getByText('Content', { exact: true }).click();
        await this.page.waitForTimeout(5000);      
         
    }

    async textDesignChangeShape(): Promise<void>{
     
        //Text Alignment - Vertical
        await this.page.frameLocator(locators.iframe).
            locator(`//button[contains(@class, 'text-align-direction-container_selected')]`).click();
        await this.page.waitForTimeout(3000); 
        
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Top'")]`).click();
        await this.page.waitForTimeout(2000);     
        
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Center'")]`).click();
        await this.page.waitForTimeout(2000);    
        
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontVerticalAlign == 'Bottom'")]`).click();            
        await this.page.waitForTimeout(2000);   
        
        //Text Alignment - Horizontal
        await this.page.frameLocator(locators.iframe).
            locator(`//button[contains(@class, 'text-align-direction-container_selected')]`).click();
        await this.page.waitForTimeout(3000);              
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Left'")]`).click();
        await this.page.waitForTimeout(2000);     
        
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Center'")]`).click();
        await this.page.waitForTimeout(2000);    
        
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@ng-class,"ctrl.fontHorizontalAlign == 'Right'")]`).click();
        await this.page.waitForTimeout(2000);    

        //Text Margin
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).first().click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).first().click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(1).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(1).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(2).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(2).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',1")]`).nth(3).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'margin',-1")]`).nth(3).click();
        await this.page.waitForTimeout(2000);  

        //Autofit
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Resize shape to fit text' }).click();
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: 'Shrink text on overflow' }).click();
        await this.page.waitForTimeout(5000);  
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Shrink text on overflow' }).click();
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: 'Resize shape to fit text' }).click();
        await this.page.waitForTimeout(5000);  
        await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'Resize shape to fit text' }).click();
        await this.page.frameLocator(locators.iframe).getByRole('link', { name: 'Do not autofit' }).click();
        await this.page.waitForTimeout(5000);  
        //Wrap text in shape //div[@class='text-box__wrap-text-in-shape-container']
        await this.page.frameLocator(locators.iframe).getByLabel('Wrap text in shape').check();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).locator('label').filter({ hasText: 'Wrap text in shape' }).locator('span').nth(1).click();
        await this.page.waitForTimeout(2000);  

        //Roate
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'Rotate',1")]`).click();
        await this.page.waitForTimeout(2000);  

        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "'Rotate',-1")]`).click();
        await this.page.waitForTimeout(2000);  

        //Flip
        await this.page.frameLocator(locators.iframe).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "x-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
        await this.page.frameLocator(locators.iframe).
            locator(`//div[@class="text-shape-container"]//button[contains(@class, "y-axis-container")]`).click();
        await this.page.waitForTimeout(2000);  
    }

    async generalDesignChangePosition(): Promise<void>{
        //align
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('top')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('bottom')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('left')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('right')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('horizontal')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('vertical')")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "changeAlign('center')")]`).click();
        await this.page.waitForTimeout(1000);  

        //Position
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "positionX,1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "positionX,-")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "positionY,1")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-mousedown, "positionY,-")]`).click();
        await this.page.waitForTimeout(1000);  

        //Order
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "moveToTop")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "moveUp")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "moveDown")]`).click();
        await this.page.waitForTimeout(1000);  
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "moveToBottom")]`).click();
        await this.page.waitForTimeout(1000);  
        //Reset to top
        await this.page.frameLocator(locators.iframe).locator(`//button[contains(@ng-click, "moveToTop")]`).click();
        await this.page.waitForTimeout(1000);  
    }
    async goToStep2Back(): Promise<void>{
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@class,"navigation-item-image-title ng-scope")]`).nth(1).click();
        await this.page.waitForTimeout(2000);
        if (await this.page.frameLocator(locators.iframe).getByRole('dialog').isVisible({timeout: 10000})){
            await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        }
        await this.page.waitForTimeout(5000);
    }

    async goToStep3Preview(): Promise<void>{
        await this.page.frameLocator(locators.iframe).
            locator(`//div[contains(@class,"navigation-item-image-title ng-scope")]`).nth(2).click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('load');
        if (await this.page.frameLocator(locators.iframe).getByRole('dialog').isVisible({timeout: 10000})){
            await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
            await this.page.waitForLoadState('load');
        }
        await this.page.waitForTimeout(5000);
    }
    async addToCart(){
        //Add to Cart
        await this.page.getByRole('button', { name: 'Add To Cart' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        if (await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).isVisible({timeout: 10000})){
            await this.page.frameLocator(locators.iframe).getByRole('button', { name: 'OK' }).click();
        }
    }
}