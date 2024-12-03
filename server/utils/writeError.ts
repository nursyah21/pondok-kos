import fs from 'fs'

export default function (message: string){
    const date = new Date()
    const day = date.toLocaleDateString()
    const time = date.toLocaleTimeString()
    const res = `${day} ${time}  |  ${message}`

    fs.appendFile('log.txt', `${res}\n`, (err) => {
        if (err) throw err;
        console.error(res)
    });
      
}