import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/qpmn/product';

test('productDisplay', async ({ page }) => {

    const productpage = new ProductPage(page);
    await productpage.open();

    const elementsProductName = await page.$$('p.product-name');
    expect(elementsProductName.length).toBeGreaterThan(0);
    // await page.getByRole('button', { name: 'Premium Smooth (PS30)' }).isVisible();
    await expect(page.getByRole('button', { name: 'Premium Smooth (PS30)' })).toBeVisible();
    // await page.getByRole('menuitem', { name: 'Premium Smooth (PS30)' }).click();
    await expect(page.getByRole('button', { name: 'cards' })).toBeVisible();
    // await page.getByRole('menuitem', { name: '56 cards' }).click();
    await expect(page.getByRole('button', { name: 'Full color both side' })).toBeVisible();
    // await page.getByRole('menuitem', { name: 'Full color both side', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Matte finish' })).toBeVisible();
    // await page.getByRole('menuitem', { name: 'Matte finish' }).click();
    await expect(page.getByRole('button', { name: 'Shrink-wrapped' })).toBeVisible();
    // await page.getByRole('menuitem', { name: 'Shrink-wrapped' }).click();


});

test('productDisplay2', async ({ page }) => {

    const productpage = new ProductPage(page);
    await productpage.open();

    // const page1Promise = page.waitForEvent('popup');
    // await page.locator('dl').filter({ hasText: 'Card Stock: What is it?' }).getByRole('link').click();
    // const page1 = await page1Promise;
    // await page1.close();
    const page2Promise = page.waitForEvent('popup');
    await page.locator('dl').filter({ hasText: 'Card Stock: What is it?' }).getByRole('link').click();
    // await page.waitForTimeout(10000);
    const page2 = await page2Promise;
    await expect(page2.getByRole('heading', { name: 'Examining our selection of' })).toBeVisible({timeout:10000});
    await page2.close();

});

test('productDisplay3', async ({ page }) => {

    const productpage = new ProductPage(page);
    await productpage.open();

    if (page.viewportSize()?.width > 767){
        await page.getByText('Full Product Bulk Price').first().click();
    }else{
        await page.getByRole('button', { name: 'Full Product Bulk Price ' }).click();
    }
    

    await page.getByRole('list').getByText('25.35').first().click();
    await page.getByText('13.50').first().click();
    await page.getByRole('button', { name: '' }).click();

    await page.getByRole('link', { name: 'Shipping', exact: true }).click();
    await page.locator('.form-control').first().click();
    await page.getByRole('menuitem', { name: 'Afghanistan' }).locator('span').click();
    await page.getByRole('button', { name: 'Calculate Delivery Cost' }).click();
    await page.getByRole('cell', { name: 'Afghanistan' }).locator('span').click();
    await expect(page.getByRole('cell', { name: 'Afghanistan' })).toBeVisible();
    await page.locator('#info-area-operating').getByRole('button', { name: ' Order a sample' }).click();
    //viewport width > 1152 desktop version, <= 1152 mobile version 
    if (page.viewportSize()?.width > 1152){
        await page.getByText('Copyright of your images').click();
        await expect(page.getByText('Copyright of your images')).toBeVisible();
    }

});