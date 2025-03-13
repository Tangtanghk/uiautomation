import test, { expect } from '../../framework/basetest';
import { qpmnconfig } from '../../config/envConfig';

const path = qpmnconfig.QPMN_BASEURL + '/app/products/poker-size-custom-playing-card-standard/';

//open builder
test.beforeEach(async ({page, qpmnmobilebuilderpage }) => {
  if (page.viewportSize()?.width > 1152){
    console.log("Skip mobile-only test cases");
    test.skip();
  } else{
    qpmnmobilebuilderpage.setPath(path);
    await qpmnmobilebuilderpage.openProductDetailPage();
    await qpmnmobilebuilderpage.clickOrderasample();
  }
});

test('mobile builder1: same image add to cart', async ({ page, qpmnmobilebuilderpage }) => {
  test.setTimeout(20*60*1000);
  // //options: Same image, Different image
  await qpmnmobilebuilderpage.setPropertyEditor('Same image','Same image');

  await qpmnmobilebuilderpage.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnmobilebuilderpage.addImage();
  await qpmnmobilebuilderpage.textDesign();
  await qpmnmobilebuilderpage.backgroundLibDesign();
  await qpmnmobilebuilderpage.foregroundLibDesign();
  await qpmnmobilebuilderpage.stickLibDesign();

  await qpmnmobilebuilderpage.goToStep2Back();
  await qpmnmobilebuilderpage.removeFiles();
  await qpmnmobilebuilderpage.uploadFile(['./resource/Background2.png','./resource/Foreground2村民.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnmobilebuilderpage.addImage();
  await qpmnmobilebuilderpage.textDesign();
  await qpmnmobilebuilderpage.backgroundLibDesign();
  await qpmnmobilebuilderpage.foregroundLibDesign();
  await qpmnmobilebuilderpage.stickLibDesign();
  
  await qpmnmobilebuilderpage.goToStep3Preview();
  await qpmnmobilebuilderpage.addToCart();
  await expect(page).toHaveURL(/.*cart/,{timeout:60000});

});