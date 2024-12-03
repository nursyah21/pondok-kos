export const getNextDate = (day:number, today?:any) => {
    let next
    if(today){
        next = new Date(new Date(today).getTime() + (day*60*60*24*1000)) .toLocaleDateString().split('/')
    }else{
        next = new Date(new Date().getTime() + (day*60*60*24*1000)) .toLocaleDateString().split('/')
    }
    
    const year = next[2]
    const month = next[0].padStart(2,'0')
    const date = next[1].padStart(2,'0')
    const res = `${year}-${month}-${date}`
    return res
}