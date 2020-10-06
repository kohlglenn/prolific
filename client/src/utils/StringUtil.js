export const truncate = (string, maxChar) => {
    if (string.length > maxChar) {
        return string.substring(0, maxChar - 3) + '...';
    } else {
        return string;
    }
};