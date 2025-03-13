import test, { expect } from '@playwright/test';
import { LoadingTimeManager } from './loadingtimemanager';

test('5x10MB file uploading time', async ({ page }) => {
  test.setTimeout(60*60*1000);
  await page.setViewportSize({width:1900,height:820});
  //resourcefile5x10MB; resourcefile235MB; resourcefile200x2.5MB; resourcefile200x100KB
  let path = "resourcefile5x10MB";
  let filename = "";
  const fileuploadingmanger = new LoadingTimeManager(page);
  await fileuploadingmanger.getPageLoadingTime(path);
  await fileuploadingmanger.updateResult(filename);

});  

test('test', async ({ page }) => {
  test.setTimeout(30*60*1000);
  await page.setViewportSize({width:1900,height:820});
  // const popup = page.waitForEvent('dialog');
  await page.goto('https://www.shutterfly.com/');
  await page.getByRole('searchbox', { name: 'Enter searching text here' }).click();
  await page.getByRole('searchbox', { name: 'Enter searching text here' }).fill('playing cards');
  await page.getByRole('searchbox', { name: 'Enter searching text here' }).press('Enter');
  
  if (await page.getByLabel('Close', { exact: true }).isVisible()){
    await page.getByLabel('Close', { exact: true }).click(); 
  }

  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Upload Your Own Design', exact: true }).click();
  const page3 = await page3Promise;
  await page3.setViewportSize({width:1900,height:820});



  await page3.getByRole('link', { name: 'personalize' }).click();
  await page3.getByRole('img', { name: 'Layout image - photos 5 - text fields 3' }).click();

  const elements = await page3.$$("#transcend-consent-manager");

  // Remove each element
  for (const element of elements) {
    console.log(element);
    await element.evaluate((el) => el.remove());
  }

  await page3.getByLabel('Add photos').click();

  const fileChooserPromise = page3.waitForEvent('filechooser');
  await page3.getByRole('button', { name: 'Upload' }).click();
  const fileChooserUpload = await fileChooserPromise;
  // await fileChooserUpload.setFiles(['./resourcetmp/FELV-cat.jpg']);
  // await fileChooserPromise.finally();


  const fileChooserPromiseMulti = page3.waitForEvent('filechooser');
  await page3.getByRole('button', { name: 'CHOOSE PHOTOS' }).click();
  const fileChooser = await fileChooserPromiseMulti;
  await fileChooser.setFiles(['./resourcetmp/FELV-cat.jpg','./resourcetmp/2.jpg']);
  // await fileChooser.setFiles(['./resourcetmp/FELV-cat.jpg']);
  await expect(page3.locator(`//div[@class="photo"]`).nth(1)).toBeVisible({timeout:20*60*1000});
});  

