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
