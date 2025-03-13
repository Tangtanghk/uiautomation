import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/qpmn/search';

test('searchCard', async ({ page }) => {

    const searchpage = new SearchPage(page);
    await searchpage.open();

    await searchpage.search('card');
    // await expect(page.getByRole('link', { name: '1', exact: true })).toBeVisible();

    await page.getByRole('group').locator('div').filter({ hasText: 'Sort by' }).locator('span').click();
    await page.waitForTimeout(2000); 
    await page.getByText('High - Low').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // waits for another 2 seconds even if the newwork is idle

    const elements = await page.$$('span.product__price');

    expect(elements.length).toBeGreaterThan(0);
    for (let element of elements) {
        expect(await element.isVisible()).toBeTruthy();
    }


    // const elements = await page.$$('span.product__price');
    const prices = await Promise.all(elements.map(element => element.textContent()));
    const sortedPrices = [...prices].sort((a, b) => parseFloat(b.slice(3)) - parseFloat(a.slice(3)));

    expect(prices).toEqual(sortedPrices);
});

test('searchRandomEmpty', async ({ page }) => {

    const searchpage = new SearchPage(page);
    await searchpage.open();

    await searchpage.search('test123');
    await expect(page.getByText('The catalog products is empty.')).toBeVisible();
});