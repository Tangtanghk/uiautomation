import test from '@playwright/test';
import { ImageGenerator } from '../utils/imagegenerate';
import { FileUploadingManager } from '../fileuploadingmanager';

test('5x10MB file uploading time', async ({ page }) => {
    test.setTimeout(60*60*1000);
    let fileSize = 10; //MB
    let fileCount = 5;
    let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
    await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);
    let baseURL = "https://test-qpmn.qppdev.com/stage/";
    // baseURL = "https://www.demo.com/stage/";
    let path = filePath;
    let filename = "";
    const fileuploadingmanger = new FileUploadingManager(page);
    fileuploadingmanger.setBaseURL(baseURL);
    await fileuploadingmanger.getPageLoadingTime();
    let result = await fileuploadingmanger.getFileUploadingTime(path);
    if (result = false){
        test.fail();
    }
    await fileuploadingmanger.updateResult(filename);
});  