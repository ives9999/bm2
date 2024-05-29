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

export function nowDate(dateDivide = "-") {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return yyyy + dateDivide + mm + dateDivide + dd;
}

export function nowDateTime(dateDivide = "-") {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2, '0');
    var MM = String(today.getMinutes()).padStart(2, '0');
    var ss = String(today.getSeconds()).padStart(2, '0');
    return yyyy + dateDivide + mm + dateDivide + dd + ' ' + hh + ":" + MM + ":" + ss;
}