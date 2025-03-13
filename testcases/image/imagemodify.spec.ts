import test, { APIRequestContext, chromium, expect } from '@playwright/test';
import mergeImages from 'merge-images';
import * as fs from 'fs';
const syspath = require('path');
import { createCanvas } from '@napi-rs/canvas';
import { ImageGenerator } from '../baseline/utils/imagegenerate';


let path:string;

test("Add text to an image", async ({ request }) => {
  test.setTimeout(20*60*1000);
  path = './resourcefile10x10MB';

  // await addTextToImage();
  mergeImages(['./1.png', './2.png', './3.png']).then((b64: string) => {
    document.querySelector('img').src = b64;
});
});

test("Generate images w/o text", async ({ request }) => {
  test.setTimeout(20*60*1000);
  await generateImagesWSimple();
});

test("Generate images with timestamp", async ({ request }) => {
  test.setTimeout(20*60*1000);
  let fileSize = 2.5; //MB
  let fileCount = 30;
  let filePath = "resourcefile" + fileCount + "x" +fileSize + "MB-auto";

  await ImageGenerator.generateImagesWithTimeStamp(fileSize,fileCount,filePath);


  // await generateImagesWithText(1,1);
});


async function generateImagesWSimple() {

  const imageWidth = 1; // Width of the image
  const imageHeight = 1; // Height of the image
  const bytesPerPixel = 3; // 3 bytes per pixel (24-bit RGB)
  const headerSize = 54; // Size of the BMP header in bytes

  // Function to calculate the size of a row of pixel data, including padding
  const calculateRowSize = (width: number) => {
    const bytesPerRowWithoutPadding = width * bytesPerPixel;
    // Calculate the number of bytes required to pad the row to a multiple of 4
    const padding = (4 - (bytesPerRowWithoutPadding % 4)) % 4;
    return bytesPerRowWithoutPadding + padding;
  };


  const generateBMPBuffer = (width, height) => {
    const rowSize = calculateRowSize(width);
    const pixelDataSize = rowSize * height;
    // Calculate total file size
    const fileSize = headerSize + pixelDataSize;
    const buffer = Buffer.alloc(fileSize);

    // Write BMP header
    buffer.write('BM', 0);
    buffer.writeInt32LE(fileSize, 2);
    buffer.writeInt32LE(0, 6);
    buffer.writeInt32LE(headerSize, 10);
    buffer.writeInt32LE(40, 14);
    buffer.writeInt32LE(width, 18);
    buffer.writeInt32LE(height, 22);
    buffer.writeInt16LE(1, 26);
    buffer.writeInt16LE(24, 28); // 24-bit color depth
    buffer.writeInt32LE(0, 30);
    buffer.writeInt32LE(pixelDataSize, 34);
    buffer.writeInt32LE(2835, 38);
    buffer.writeInt32LE(2835, 42);
    buffer.writeInt32LE(0, 46);
    buffer.writeInt32LE(0, 50);

    // Write pixel data (background)
    let pixelIndex = headerSize;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = y * rowSize + x * bytesPerPixel;
            buffer.writeUInt8(255, pixelIndex + offset); // White background
            buffer.writeUInt8(255, pixelIndex + offset + 1); // White background
            buffer.writeUInt8(255, pixelIndex + offset + 2); // White background
        }
    }

    // Write timestamp (text)
    const timestamp = Date.now().toString();
    const timestampOffsetX = 10; // X position of the timestamp
    const timestampOffsetY = height - 20; // Y position of the timestamp
    const textColor = { r: 0, g: 0, b: 0 }; // Black text color
    for (let i = 0; i < timestamp.length; i++) {
        const char = timestamp.charAt(i);
        drawChar(buffer, char, timestampOffsetX + i * 8, timestampOffsetY, textColor,rowSize);
    }

    return buffer;
};

// Function to draw a character on the buffer
const drawChar = (buffer, char, x, y, color,rowSize) => {
    const font = require('bmp-js/fonts/font8x8');
    const charCode = char.charCodeAt(0);
    const charIndex = charCode - 32; // Characters start from ASCII 32 in the font array
    const charData = font[charIndex];
    if (!charData) return; // Character not found in the font

    for (let cy = 0; cy < 8; cy++) {
        const row = charData[cy];
        for (let cx = 0; cx < 8; cx++) {
            const bit = (row >> (7 - cx)) & 1;
            const pixelIndex = ((y + cy) * rowSize) + ((x + cx) * bytesPerPixel) + headerSize;
            if (bit === 1) {
                buffer.writeUInt8(color.r, pixelIndex); // Red
                buffer.writeUInt8(color.g, pixelIndex + 1); // Green
                buffer.writeUInt8(color.b, pixelIndex + 2); // Blue
            }
        }
    }
};

  // Generate and save BMP images
    const bmpBuffer = generateBMPBuffer(100, 100);
    const filename = `image_tt.bmp`;

    fs.writeFileSync(filename, bmpBuffer);

}

async function generateImagesWithTimeStampaaa(fileSize:number,fileCount:number,filePath:string) {

  // Function to calculate the size of a row of pixel data, including padding
  const calculateRowSize = (width: number) => {
    const bytesPerRowWithoutPadding = width * bytesPerPixel;
    // Calculate the number of bytes required to pad the row to a multiple of 4
    const padding = (4 - (bytesPerRowWithoutPadding % 4)) % 4;
    return bytesPerRowWithoutPadding + padding;
  };

  const bytesPerPixel = 3; // 3 bytes per pixel (24-bit RGB)
  const headerSize = 54; // Size of the BMP header in bytes
  let imageSize = fileSize*1024*1024/bytesPerPixel;
  let imageWidth = Math.floor(Math.sqrt(imageSize));
  let imageHeight = Math.floor(Math.sqrt(imageSize));

  // Function to generate a BMP file buffer of specified size
  const generateBMPBuffer = (width: number, height: number, text: string) => {
    const rowSize = calculateRowSize(width);
    const pixelDataSize = rowSize * height;
    const fileSize = headerSize + pixelDataSize;
    let buffer = Buffer.alloc(fileSize);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Flip canvas vertically
    ctx.scale(1, -1);
    ctx.translate(0, -canvas.height);

    ctx.fillStyle = 'white';
    // ctx.textAlign = 'left';
    // ctx.textBaseline = 'bottom';
    let fontSize = Math.round(height/10);
    ctx.font = fontSize + 'px Arial';
    ctx.fillText(text, 0, fontSize*2);
    console.log(fontSize + 'px Arial');
    
    // Write BMP header
    buffer.write('BM', 0);
    buffer.writeInt32LE(fileSize, 2);
    buffer.writeInt32LE(0, 6);
    buffer.writeInt32LE(headerSize, 10);
    buffer.writeInt32LE(40, 14);
    buffer.writeInt32LE(width, 18);
    buffer.writeInt32LE(height, 22);
    buffer.writeInt16LE(1, 26);
    buffer.writeInt16LE(24, 28); // 24-bit color depth
    buffer.writeInt32LE(0, 30);
    buffer.writeInt32LE(pixelDataSize, 34);
    buffer.writeInt32LE(2835, 38);
    buffer.writeInt32LE(2835, 42);
    buffer.writeInt32LE(0, 46);
    buffer.writeInt32LE(0, 50);

    const imageData = ctx.getImageData(0, 0, width, height);
    // Write pixel data
    let pixelIndex = headerSize;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = y * rowSize + x * bytesPerPixel;
            const offsetCanvas = (y*width + x) * 4;
            buffer.writeUInt8(imageData.data[offsetCanvas+2], pixelIndex + offset); // Red
            buffer.writeUInt8(imageData.data[offsetCanvas+1], pixelIndex + offset + 1); // Green
            buffer.writeUInt8(imageData.data[offsetCanvas], pixelIndex + offset + 2); // Blue
        }
    }
    return buffer;
  };

  // Function to ensure directory existence, delete if exists
  const ensureDirectory = (directory) => {
  if (fs.existsSync(directory)) {
        console.log(directory);
        fs.rmdirSync(directory, { recursive: true });
    }
    fs.mkdirSync(directory, { recursive: true });
  };

  // Ensure directory existence
  ensureDirectory(filePath);

  // Generate and save BMP images
  for (let i = 0; i < fileCount; i++) {
    let currentDate = new Date();
    let formattedTestTime = currentDate.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    let dateParts = formattedTestTime.split(/[ ,\/:]/); // Split the string into parts
    formattedTestTime = `${dateParts[2]}${dateParts[1]}${dateParts[0]}${dateParts[3]}${dateParts[4]}${dateParts[5]}`; // Reorder the parts to the desired format
    
    // Get milliseconds separately
    let milliseconds = currentDate.getMilliseconds();
  
    // Append milliseconds to the formatted time string
    formattedTestTime += `-${milliseconds.toString().padStart(3, '0')}`;
  
    console.log("image created time: " + formattedTestTime);  

    const bmpBuffer = generateBMPBuffer(imageWidth, imageHeight, formattedTestTime);
    const filename = filePath + `/` + `image_${imageWidth}_${imageHeight}_${formattedTestTime}.bmp`;
    fs.writeFileSync(filename, bmpBuffer);
  }
}

async function generateImages() {

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const imageWidth = 1000; // Width of the image
  const imageHeight = 2000; // Height of the image
  const bytesPerPixel = 3; // 3 bytes per pixel (24-bit RGB)
  const headerSize = 54; // Size of the BMP header in bytes

  // Function to generate a BMP file buffer of specified size
  const generateBMPBuffer = (width: number, height: number, text: string) => {
    const totalPixels = width * height;
    const pixelDataSize = totalPixels * bytesPerPixel;
    const fileSize = headerSize + pixelDataSize;
    const buffer = Buffer.alloc(fileSize);

    // const canvas = createCanvas(width, height);
    // const ctx = canvas.getContext('2d');
    // ctx.fillStyle = 'black';
    // ctx.font = '20px Arial';
    // ctx.fillText(text, 10, 30);

    // Write BMP header
    buffer.write('BM', 0);
    buffer.writeInt32LE(fileSize, 2);
    buffer.writeInt32LE(0, 6);
    buffer.writeInt32LE(headerSize, 10);
    buffer.writeInt32LE(40, 14);
    buffer.writeInt32LE(width, 18);
    buffer.writeInt32LE(height, 22);
    buffer.writeInt16LE(1, 26);
    buffer.writeInt16LE(24, 28); // 24-bit color depth
    buffer.writeInt32LE(0, 30);
    buffer.writeInt32LE(pixelDataSize, 34);
    buffer.writeInt32LE(2835, 38);
    buffer.writeInt32LE(2835, 42);
    buffer.writeInt32LE(0, 46);
    buffer.writeInt32LE(0, 50);

    // Write pixel data
    for (let i = headerSize; i < fileSize; i += 3) {
      buffer.writeUInt8(i%254, i); // Red
      buffer.writeUInt8(i%254, i + 1); // Green
      buffer.writeUInt8(i%254, i + 2); // Blue
    }

    return buffer;
  };

  // Generate and save BMP images
  // Generate and save BMP images
  for (let i = 0; i < 2; i++) {
    const bmpBuffer = generateBMPBuffer(imageWidth, imageHeight, `my images`);
    const filename = `image_${i}.bmp`;

    // Write the buffer to a file
    fs.writeFileSync(filename, bmpBuffer);
  }

  await browser.close();

}

async function addTextToImage() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
  


    // Set the viewport size (adjust as needed)
    await page.setViewportSize({ width: 3200, height: 3200 });
    const b64 = await fs.readFile("./img/test1.jpg", {encoding: "base64"});
    // Load your HTML content (replace with your actual image path)
    await page.setContent(`
        <html>
        <body>
        <h1>hello 1</h1>
        <img src="data:image/png;base64,${b64}" alt="alt tag">
        </body>
        </html>
    `);
  
    // Add the text to the canvas
    await page.evaluate(() => {

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        const img = document.querySelector('img');
    
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
    
        // Add text
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('hello world112233', 50, 50);
    });
  
    // Take a screenshot of the modified canvas
    await page.screenshot({ path: 'modified_image.png' });
  
    // Clean up
    await context.close();
    await browser.close();
  }
  