export const differentTime = (time:Date) => {

    const expiry = new Date(time.getTime() + 24 * 60 * 60 * 1000); // Calculate the expiry time
    const now = new Date();

    const timeDiff = (expiry.getTime() - now.getTime()) / 1000; // Calculate the time difference in milliseconds)
    const hoursDiff = Math.floor(timeDiff / (60 * 60));  
    const minutesDiff = Math.floor((timeDiff % (60 * 60)) / 60)


    
    return `${hoursDiff} jam ${minutesDiff} menit`;
}