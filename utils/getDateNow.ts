export const getDateNow = () => {
    const today = new Date(new Date().getTime()) .toLocaleDateString().split('/')
    const year = today[2]
    const month = today[0].padStart(2,'0')
    const date = today[1].padStart(2,'0')
    const res = `${year}-${month}-${date}`
    return res
    //next.toLocaleDateString().replaceAll('/','-')
}