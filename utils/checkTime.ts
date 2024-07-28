export default function checkTime (timestampString:string, time=60*60*1000) {
    const timestamp = new Date(timestampString);
    const now = new Date();
    const ago = new Date(now.getTime() - time); // in milliseconds

    return timestamp < ago;
}