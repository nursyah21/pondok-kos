export const formatRupiahIntl = (number:number | any, currency = true) => {    
    if(typeof number == 'string'){
        number = parseInt(number.replaceAll(',','').replaceAll('.',''))
    }
    if(isNaN(number)){
        return '0'
    }

    return new Intl.NumberFormat('en-En').format(number)
}