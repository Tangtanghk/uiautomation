import test from '@playwright/test';
import { FileUploadingManager } from './fileuploadingmanager';
import { ImageGenerator } from './utils/imagegenerate';

test('Generate files', async ({ page }) => {
    test.setTimeout(60*60*1000);

    let fileSize = 30; //MB
    let fileCount = 10;
    let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";
    await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);

});  