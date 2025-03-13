import test, { expect } from '@playwright/test';

test('test', async ({ page }) => {
  test.setTimeout(30*60*1000);
  await page.setViewportSize({width:1900,height:820});
  //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36
  //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
  // const popup = page.waitForEvent('dialog');
  await page.goto('https://www.zazzle.com/the_birthday_mermaid_t_shirt-256791678156842550');

});  

