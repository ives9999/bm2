// return timestamp second
export function nowTimestamp() {
    return Math.floor(Date.now()/1000)
}

export function nowMilliTimestamp() {
    return Date.now()
}

export function noSec(time) {
    const date = new Date('01 Jan 1970 ' + time)
    const h = (date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()
    const m = (date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()
    return h + ":" + m
}