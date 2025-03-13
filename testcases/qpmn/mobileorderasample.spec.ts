import test, { expect } from '../../framework/basetest';
import { QpmnBuilder } from '../../pages/qpmn/builder/qpmnbuilder';
import { Checkout } from '../../pages/qpmn/checkout/checkout';
import { qpmnconfig } from '../../config/envConfig';

const path = qpmnconfig.QPMN_BASEURL + '/app/products/poker-size-custom-playing-card-standard/';
test.describe.configure({mode:'parallel'});
//open builder
test.beforeEach(async ({ page, qpmnmobilebuilderpage }) => {
  if (page.viewportSize()?.width > 1152){
    console.log("Skip mobile-only test cases");
    test.skip();
  } else{
    test.slow();
    qpmnmobilebuilderpage.setPath(path);
    await qpmnmobilebuilderpage.openProductDetailPage();
    await qpmnmobilebuilderpage.clickOrderasample();  
  }

});

test('builder2: different image autofill', async ({ page, qpmnmobilebuilderpage }) => {

  //options: Same image, Different image
  await qpmnmobilebuilderpage.setPropertyEditor('Different image','Different image');

  await qpmnmobilebuilderpage.uploadFile(['./resource/Background1.png','./resource/Background2.png',
    './resource/Background3.png','./resource/Foreground1女巫.png','./resource/Foreground2村民.png',
    './resource/Foreground3法官.png','./resource/Foreground4狼人.png','./resource/Foreground5预言家.png']);

  await qpmnmobilebuilderpage.autoFill();
  await qpmnmobilebuilderpage.goToStep2Back();

  await qpmnmobilebuilderpage.autoFill();
  await qpmnmobilebuilderpage.goToStep3Preview();
  await qpmnmobilebuilderpage.addToCart();
  await expect(page).toHaveURL(/.*cart/,{timeout:60000});

});

test('builder4: same image builder assistant', async ({ page, qpmnmobilebuilderpage }) => {
  test.setTimeout(8*60*1000);

  //options: Same image, Different image
  await qpmnmobilebuilderpage.setPropertyEditor('Same image','Same image');
  await qpmnmobilebuilderpage.backgroundLibDesign();
  await qpmnmobilebuilderpage.foregroundLibDesign();
  await qpmnmobilebuilderpage.expandAssistant();
  await qpmnmobilebuilderpage.builderAssistant();
  await expect(page.getByRole('button', { name: 'Add To Cart' })).toBeVisible();

});

test('builder6: go to checkout default values', async ({ page, qpmnmobilebuilderpage }) => {
 
  //options: Same image, Different image
  await qpmnmobilebuilderpage.setPropertyEditor('Same image','Same image');  
  await qpmnmobilebuilderpage.goToStep2Back();
  await qpmnmobilebuilderpage.goToStep3Preview();
  await qpmnmobilebuilderpage.addToCartTemp();

  const checkoutpage = new Checkout(page);
  await checkoutpage.checkout();
  await expect(page.locator('body')).toContainText('Order Information',{timeout:30000});
  
});
