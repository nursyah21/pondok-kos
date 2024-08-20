export const formatRupiahIntl = (number:number | any) => {
    // Handle non-numeric input
    if (isNaN(number)) {
        return 'Invalid number';
    }

    // Options for Indonesian Rupiah format
    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR', // Indonesian Rupiah currency code
        minimumFractionDigits: 0, // Minimum number of decimal places (optional)
    });

    return rupiahFormatter.format(number);
}