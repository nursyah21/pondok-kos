export const formatRupiahIntl = (number:number | any, currency = false) => {    
    if(typeof number == 'string'){
        number = parseInt(number.replaceAll(',','').replaceAll('.',''))
    }
    if(isNaN(number)){
        return '0'
    }

    number = new Intl.NumberFormat('en-En').format(number)
    return currency ? 'Rp '+number: number
    
}