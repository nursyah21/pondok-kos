export const shortWord = (word:string | null, len=50) => {
    if(!word) return ''
    return word.length > len ? word.slice(0, len) + '...' : word
}