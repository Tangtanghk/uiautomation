import test, { expect } from '../../framework/basetest';
import { QpmnBuilder } from '../../pages/qpmn/builder/qpmnbuilder';
import { Checkout } from '../../pages/qpmn/checkout/checkout';
import { qpmnconfig } from '../../config/envConfig';

const path = qpmnconfig.QPMN_BASEURL + '/app/products/poker-size-custom-playing-card-standard/';

//open builder
test.beforeEach(async ({ page, qpmnbuilderpage }) => {
  if (page.viewportSize()?.width <= 1152){
    console.log("Skip desktop-only test cases");
    test.skip();
  } else{
    qpmnbuilderpage.setPath(path);
    await qpmnbuilderpage.openProductDetailPage();
    await qpmnbuilderpage.clickOrderasample();
  }
});

test('builder1: same image add to cart', async ({ page }) => {
  test.setTimeout(20*60*1000);
  const qpmnbuilder = new QpmnBuilder(page);
  // //options: Same image, Different image
  await qpmnbuilder.setPropertyEditor('Same image','Same image');

  await qpmnbuilder.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnbuilder.addImage();
  await qpmnbuilder.imageDesign();
  await qpmnbuilder.textDesign();
  await qpmnbuilder.backgroundLibDesign();
  await qpmnbuilder.foregroundLibDesign();
  await qpmnbuilder.stickLibDesign();

  await qpmnbuilder.goToStep2Back();
  await qpmnbuilder.removeFiles();
  await qpmnbuilder.uploadFile(['./resource/Background2.png','./resource/Foreground2村民.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnbuilder.addImage();
  await qpmnbuilder.imageDesign();
  await qpmnbuilder.textDesign();

  // await qpmnbuilder.backgroundLibDesign();
  // await qpmnbuilder.foregroundLibDesign();
  await qpmnbuilder.stickLibDesign();
  await qpmnbuilder.goToStep3Preview();
  await qpmnbuilder.addToCart();
  await expect(page).toHaveURL(/.*cart/);

});

test('builder2: test upload file', async ({ page }) => {
  test.setTimeout(20*60*1000);
  const qpmnbuilder = new QpmnBuilder(page);
  // //options: Same image, Different image
  await qpmnbuilder.setPropertyEditor('Same image','Same image');
  for (var i=0;i<50;i++){
    await qpmnbuilder.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
    await page.waitForTimeout(1000);
    await qpmnbuilder.removeFiles();
  
  }


});