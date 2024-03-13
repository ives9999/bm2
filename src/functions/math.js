export function formattedWithSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generateSortOrder() {
    return Math.floor(Date.now() / 10000000)
}