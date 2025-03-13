import test, { expect } from '../../framework/basetest';

test.beforeEach(async ({ page, checkoutpage }) => {
    test.slow();
    await checkoutpage.goToCheckoutPageFromCart();
    
});

  
test('checkout1: Open checkout page, check details in checkout domain.', async ({ page, checkoutpage }) => {
    console.log();
    await checkoutpage.addAddress();
    await checkoutpage.editAddress();
    await checkoutpage.selectAddress();

    await checkoutpage.selectShippingMethod();
    await checkoutpage.reviewAndPayment();

    //check Redeem: test coupon: testcode0001
    await checkoutpage.redeemCoupon("testcode0001");
    //invalid coupon
    await checkoutpage.redeemCoupon("invalidcoupon13579");
    
    if (page.viewportSize()?.width > 767){
        await expect(page.getByRole('button', { name: 'confirm and pay' })).toBeVisible();
    } else{
        await expect(page.getByRole('button', { name: 'payment' })).toBeVisible();
    }
});
