// import * as fs from 'fs';
import fs from 'fs-extra';
const syspath = require('path');
// import { createCanvas } from '@napi-rs/canvas';

import path from 'path';
import { createCanvas, loadImage } from 'canvas';
export class ImageGenerator {
    constructor() {
    }

    static async generateImagesWithTimeStamp(fileSize:number,fileCount:number,filePath:string): Promise<void> {

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
              fs.rmSync(directory, { recursive: true });
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
          formattedTestTime = `${dateParts[1]}${dateParts[0]}${dateParts[3]}${dateParts[4]}${dateParts[5]}${dateParts[6]}`; // Reorder the parts to the desired format
          
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

    static async addTimestampToImageFolder(inputPath, outputPath) {
        const files = await fs.readdir(inputPath);
    
        // Function to ensure directory existence, delete if exists
        const ensureDirectory = (directory) => {
            if (fs.existsSync(directory)) {
                    console.log(directory);
                    fs.rmSync(directory, { recursive: true });
                }
                fs.mkdirSync(directory, { recursive: true });
            };
            
            // Ensure directory existence
            ensureDirectory(outputPath);
    
        for (const file of files) {
            const filePath = path.join(inputPath, file);
            const outputFilePath = path.join(outputPath, file);
    
            if (path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.jpeg') {
                try {
                    const image = await loadImage(filePath);
                    const canvas = createCanvas(image.width, image.height);
                    const ctx = canvas.getContext('2d');
    
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    ctx.font = '32px Arial';
                    ctx.fillStyle = 'black';
                    const timestamp = new Date().toLocaleString();
                    ctx.fillText(timestamp, 10, 40);
    
                    const originalFileSize = (await fs.stat(filePath)).size;
                    let quality = 1.0;
                    let buffer;
    
                    do {
                        buffer = canvas.toBuffer('image/jpeg', {
                            quality: quality,
                            progressive: false,
                        });
                        if (buffer.length > originalFileSize && quality > 0.5) {
                            quality -= 0.01;
                        } else {
                            if(quality < 1){
                                quality = quality + 0.01;
                                buffer = canvas.toBuffer('image/jpeg', {
                                    quality: quality,
                                    progressive: false,
                                });
                            }
                            break;
                        }
                    } while (buffer.length > originalFileSize);
    
                    await fs.writeFile(outputFilePath, buffer);
                    console.log(`Timestamp added to file ${file}`);
                } catch (error) {
                    console.error(`Error processing file ${file}:`, error);
                }
            }
        }
        console.log('Timestamps added successfully to all valid images.');
    }

}

  