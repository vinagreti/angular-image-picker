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
