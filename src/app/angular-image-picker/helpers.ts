export const ReducedMemoryRepresentation = (total: number = 0) => {
    if (isNaN(total)) {
        return 0;
    } else {
        total = total + 0;
        switch (true) {
            case total < 1000:
            return `${total.toFixed(1)}B`;
            case total < 1000000:
            return `${(total / 1000).toFixed(1)}KB`;
            case total < 1000000000:
            return `${(total / 1000000).toFixed(1)}MB`;
            case total < 1000000000000:
            return `${(total / 1000000000).toFixed(1)}GB`;
        }
    }
}

export const ImageHandler = {
    dataURItoBlob: (dataURI: string): Blob => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = decodeURI(dataURI.split(',')[1]);
        }

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type: mimeString});
    },
    blobToFile: (blob: Blob): File => {
        return new File([blob], `inputFile`);
    },
    dataURItoFile: (dataURI: string): File => {
        const blob: Blob = ImageHandler.dataURItoBlob(dataURI);
        return ImageHandler.blobToFile(blob);
    }
}

export const GetAverageRGB  = (imgEl) => {
    
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
        return defaultRGB;
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */alert('x');
        return defaultRGB;
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    
    return rgb;
    
}
