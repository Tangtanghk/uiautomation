


export class ImageProcessor{

    constructor() {
    
    }
    
    async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            // Load the image from the file
            image.src = URL.createObjectURL(file);
    
            image.onload = () => {
                const width = image.width;
                const height = image.height;
    
                // Calculate new dimensions while maintaining aspect ratio
                let newWidth = width;
                let newHeight = height;
                if (width > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = (height * maxWidth) / width;
                }
                if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = (width * maxHeight) / height;
                }
    
                // Create a canvas and draw the resized image
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, newWidth, newHeight);
    
                // Convert canvas to Blob
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg');
            };
    
            image.onerror = (error) => {
                reject(error);
            };
        });
    }

    async addTextToImage(){
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const imageObj = new Image();
        imageObj.src = 'resourceimage/10MB.PNG'; // Replace with your image URL
        imageObj.onload = function() {
            context.drawImage(imageObj, 69, 50);
            context.font = '20px Calibri';
            context.fillText('My TEXT!', 100, 200);
        };

    }


}