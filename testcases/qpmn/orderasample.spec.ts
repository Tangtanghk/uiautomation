import test, { expect } from '../../framework/basetest';
import { QpmnBuilder } from '../../pages/qpmn/builder/qpmnbuilder';
import { Checkout } from '../../pages/qpmn/checkout/checkout';
import { qpmnconfig } from '../../config/envConfig';

const path = qpmnconfig.QPMN_BASEURL + '/app/products/poker-size-custom-playing-card-standard/';

test.describe.configure({mode:'parallel'});
//open builder
test.beforeEach(async ({ page, qpmnbuilderpage }) => {
  test.slow();
  qpmnbuilderpage.setPath(path);
  await qpmnbuilderpage.openProductDetailPage();
  await qpmnbuilderpage.clickOrderasample();
});

test('builder2: different image autofill', async ({ page }) => {
  if (page.viewportSize()?.width <= 1152){
    console.log("Skip desktop-only test cases");
    test.skip();
  } else{
    const qpmnbuilder = new QpmnBuilder(page);
    //options: Same image, Different image
    await qpmnbuilder.setPropertyEditor('Different image','Different image');
  
    await qpmnbuilder.uploadFile(['./resource/Background1.png','./resource/Background2.png',
      './resource/Background3.png','./resource/Foreground1女巫.png','./resource/Foreground2村民.png',
      './resource/Foreground3法官.png','./resource/Foreground4狼人.png','./resource/Foreground5预言家.png']);
  
    await qpmnbuilder.autoFill();
    await qpmnbuilder.goToStep2Back();
  
    await qpmnbuilder.autoFill();
    await qpmnbuilder.goToStep3Preview();
    await qpmnbuilder.addToCart();
    await expect(page).toHaveURL(/.*cart/);
  }
});

test('builder3: same front and back, go to cart directly', async ({ page }) => {
  const qpmnbuilder = new QpmnBuilder(page);

  //options: Same image, Different image
  await qpmnbuilder.setPropertyEditor('Same image','Same image');  
  await qpmnbuilder.goToStep2Back();
  await qpmnbuilder.goToStep3Preview();
  await qpmnbuilder.addToCart();
  await expect(page).toHaveURL(/.*cart/);
  await page.waitForLoadState('networkidle');

});


test('builder4: same image builder assistant', async ({ page }) => {
  if (page.viewportSize()?.width <= 1152){
    console.log("Skip desktop-only test cases");
    test.skip();
  } else{
    test.setTimeout(5*60*1000);
    const qpmnbuilder = new QpmnBuilder(page);
  
    //options: Same image, Different image
    await qpmnbuilder.setPropertyEditor('Same image','Same image');
    await qpmnbuilder.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
    await qpmnbuilder.addImage();
    await qpmnbuilder.builderAssistant();
    await expect(page.getByRole('button', { name: 'Add To Cart' })).toBeVisible();  
  }
});

test('builder5: same image builder assistant - POM', async ({ page, qpmnbuilderpage }) => {
  if (page.viewportSize()?.width <= 1152){
    console.log("Skip desktop-only test cases");
    test.skip();
  } else{
    test.setTimeout(5*60*1000);
    await qpmnbuilderpage.setPropertyEditor('Same image','Same image');
    await qpmnbuilderpage.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
    await qpmnbuilderpage.addImage();
    await qpmnbuilderpage.builderAssistant();
    await expect(page.getByRole('button', { name: 'Add To Cart' })).toBeVisible();    
  }
});

test('builder6: go to checkout default values', async ({ page }) => {
  if (page.viewportSize()?.width <= 1152){
    console.log("Skip desktop-only test cases");
    test.skip();
  } else{
    const qpmnbuilder = new QpmnBuilder(page);

    //options: Same image, Different image
    await qpmnbuilder.setPropertyEditor('Same image','Same image');  
    await qpmnbuilder.goToStep2Back();
    await qpmnbuilder.goToStep3Preview();
    await qpmnbuilder.addToCartTemp();
  
    const checkoutpage = new Checkout(page);
    await checkoutpage.checkout();
    await expect(page.locator('body')).toContainText('Order Information');      
  }
});
