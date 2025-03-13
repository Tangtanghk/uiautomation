import test, { expect } from '../../framework/basetest';
import { QpmnBuilder } from '../../pages/qpmn/builder/qpmnbuilder';
import { qpmnconfig } from '../../config/envConfig';
import { wooLocators } from '../../pages/qpmn/builder/woobuilderlocators';

const path = qpmnconfig.WOO_STORE_BASEURL + '/product/poker-size-custom-playing-card-2-48-x-3-46-2/';

//open builder
test.beforeEach(async ({ page, woobuilderpage }) => {
    woobuilderpage.setPath(path);
  await woobuilderpage.openProductDetailPage();
  await woobuilderpage.clickOnDesign();
});

test('woo builder: same image add to cart', async ({ page }) => {
  test.setTimeout(20*60*1000);
  const qpmnbuilder = new QpmnBuilder(page);
  qpmnbuilder.setFrameLocator(wooLocators.iframe);
  // //options: Same image, Different image
  await qpmnbuilder.setPropertyEditor('Same image','Same image');

  //step1: set Front
  await qpmnbuilder.uploadFile(['./resource/Background1.png','./resource/Foreground1女巫.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnbuilder.addImage();
  await qpmnbuilder.imageDesign();
  await qpmnbuilder.textDesign();
  await qpmnbuilder.backgroundLibDesign();
  await qpmnbuilder.foregroundLibDesign();
  await qpmnbuilder.stickLibDesign();

  //step2: set Back
  await qpmnbuilder.goToStep2Back();
  await qpmnbuilder.removeFiles();
  await qpmnbuilder.uploadFile(['./resource/Background2.png','./resource/Foreground2村民.png','./resource/free2.jpg','./resource/free1.jpg']);
  await qpmnbuilder.addImage();
  await qpmnbuilder.imageDesign();
  await qpmnbuilder.textDesign();
  await qpmnbuilder.stickLibDesign();

  //Step3: Preview
  await qpmnbuilder.goToStep3Preview();

  //Save design and redirect to product details page
  await qpmnbuilder.wooSaveDesign();
  await expect(page).toHaveURL(/.*product/);

});