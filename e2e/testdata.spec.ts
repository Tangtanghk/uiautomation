import { test, expect, BrowserContext, Page } from '@playwright/test';

test('create order for store 1', async ({page, context}) => {
  test.slow();
  const dataCreator = new DataCreator(page, context);
  let productUrl = "https://stage.demo.com/automationstore1/product/automation-testing-data-005-dont-remove/";
  let orderCount = 1;
  let customerName = "automation test order 1";
  await dataCreator.createOrder(productUrl,orderCount,customerName);

});

test('create order for store 2', async ({ page, context }) => {
  test.slow();
  const dataCreator = new DataCreator(page, context);
  let productUrl = "https://stage.demo.com/automationstore2/product/poker-size-custom-playing-card-2-48-x-3-46/";
  let orderCount = 1;
  let customerName = "automation test order 2";
  await dataCreator.createOrder(productUrl,orderCount,customerName);

});

export class DataCreator{
  page: Page;
  context: BrowserContext;
    
  constructor(page: Page, context: BrowserContext) {
      this.page = page;
      this.context = context;
  }  
  async createOrder(productUrl:string, orderCount:number, customerName:string){
    for (var i=0;i<orderCount;i++){
      this.page = await this.context.newPage();
      await this.page.goto(productUrl);
      await this.page.getByRole('button', { name: 'Add to cart' }).click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByRole('link', { name: 'View your shopping cart' }).click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByRole('link', { name: 'Proceed to checkout' }).click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByRole('textbox', { name: 'First name *' }).first().click();
      await this.page.getByRole('textbox', { name: 'First name *' }).first().fill(customerName);
      await this.page.getByRole('textbox', { name: 'Last name *' }).first().fill('last name');
      await this.page.getByRole('textbox', { name: 'Street address *' }).first().click();
      await this.page.getByRole('textbox', { name: 'Street address *' }).first().fill('street 123');
      await this.page.getByRole('textbox', { name: 'Town / City *' }).click();
      await this.page.getByRole('textbox', { name: 'Town / City *' }).fill('abc');
      await this.page.getByRole('textbox', { name: 'ZIP Code *' }).click();
      await this.page.getByRole('textbox', { name: 'ZIP Code *' }).fill('95123');
      await this.page.getByLabel('Phone *').click();
      await this.page.getByLabel('Phone *').fill('90292345');
      await this.page.getByLabel('Email address *').click();
      await this.page.getByLabel('Email address *').fill('abc@qpp123.com');
      await this.page.getByRole('button', { name: 'Place order' }).click();
      await expect(this.page.getByRole('heading', { name: 'Order received' })).toBeVisible({timeout:15000});      
      await this.page.close();
    }

  }

};


// test('temp, delete address', async ({ page }) => {
//   test.setTimeout(10*60*1000);
//   if (page.viewportSize()?.width <= 1152){
//     console.log("Skip desktop-only test cases");
//     test.skip();
//   } else{
    
//     await page.goto('https://www.demo.com/stage/app/customize/new-products/all');
//     await page.locator('a').filter({ hasText: 'Login' }).click();

//     await page.waitForLoadState('networkidle');
//     await page.getByPlaceholder('Please input your email').fill('automation@iubridge.com');
//     await page.getByPlaceholder('Please input your password').click();
//     await page.getByPlaceholder('Please input your password').fill('12345678@Ll1234');
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.locator('.btn-icon-chervon-down').click();
//     await page.getByRole('link', { name: 'Dashboard' }).click();

    
//     await page.getByRole('button', { name: 'My Account ' }).click();
//     await page.getByRole('link', { name: ' Address Book' }).click();

//     for (let k=0;k<10;k++){
//       for (let i=0;i<20;i++){
//         await page.locator(`//input[@type="checkbox"]`).nth(i+2).click();
//       }
//       await page.locator(`//button[@class="delete-btn"]`).click();
//       await page.getByRole('button', { name: 'Sure' }).click();
//     }


//   }
// });



// test('temp, delete files in file library', async ({ page }) => {
//   test.setTimeout(10*60*1000);
//   if (page.viewportSize()?.width <= 1152){
//     console.log("Skip desktop-only test cases");
//     test.skip();
//   } else{
    
//     await page.goto('https://www.demo.com/stage/app/customize/new-products/all');
//     await page.locator('a').filter({ hasText: 'Login' }).click();

//     await page.waitForLoadState('networkidle');
//     await page.getByPlaceholder('Please input your email').fill('automation@iubridge.com');
//     await page.getByPlaceholder('Please input your password').click();
//     await page.getByPlaceholder('Please input your password').fill('12345678@Ll1234');
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.locator('.btn-icon-chervon-down').click();
//     await page.getByRole('link', { name: 'Dashboard' }).click();

//     await page.getByRole('button', { name: 'File Library ' }).click();
//     await page.getByRole('link', { name: ' Library' }).click();

//     for ( let i = 0; i<90; i++){
//       let fileNumber = await page.locator(`//div[@class="info-file"]/span[2]`).textContent();
//       if (fileNumber != null && Number.parseInt(fileNumber) >= 20){
//         await page.getByLabel('Select All 0/20 Selected').check();
//         await page.getByRole('button', { name: 'delete' }).click();
//         await page.getByRole('button', { name: 'OK' }).click();

//         await expect(page.locator(`//div[@class="file-list-container ng-scope"]//input[contains(@class,"ng-not-empty")]`).first()).not.toBeVisible({timeout:60000});
//         // while( await page.locator(`//div[@class="file-list-container ng-scope"]//input[contains(@class,"ng-not-empty")]`).count() !=0) {
//         //   await page.waitForTimeout(500);
//         // }
//         await page.getByLabel('Select All 0/20 Selected').uncheck();
//       }

//     }
//   }
// });