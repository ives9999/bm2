export function addActive(data, defaultIdx=0) {
    data = data.map((item,idx) => {
        const a = {...item, active: idx === defaultIdx};
        return a;
    });

    return data;
}

export function setActiveByIdx(fnSet, idx) {
    fnSet((prev) => {
        if (prev[idx].active === true) {
            prev[idx].active = false;
            return [...prev]
        } else {
            const newPrev = prev.map((item) => {
                return {...item, active: false};
            });
            newPrev[idx].active = true;
            return [...newPrev];
        }
    })
}

export function empty(val) {
    if (!val) {
        return true;
    }
    if (val.length === 0) {
        return true;
    }

    return false;
}

export function getMimeTypeFromExtension(filename) {
    const extension = filename.split('.').pop();
    return {
        "bmp": "image/bmp",
        "svg": "image/svg+xml",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "gif": "image/gif",
        "png": "image/png",
        "ico": "image/vnd.microsoft.icon",
        "tif": "image/tiff",
        "tiff": "image/tiff",
        "webp": "image/webp",

        "avi": "video/x-msvideo",
        "mov": "video/mov",
        "mp4": "video/mp4",
        "mpeg": "video/mpeg",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        "webm": "video/webm",
        "ogv": "video/ogg",

        "aac": "audio/aac",
        "abw": "application/x-abiword",
        "arc": "application/x-freearc",
        "avi": "video/x-msvideo",
        "azw": "application/vnd.amazon.ebook",
        "bin": "application/octet-stream",
        "bmp": "image/bmp",
        "bz": "application/x-bzip",
        "bz2": "application/x-bzip2",
        "cda": "application/x-cdf",
        "csh": "application/x-csh",
        "css": "text/css",
        "csv": "text/csv",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "eot": "application/vnd.ms-fontobject",
        "epub": "application/epub+zip",
        "gz": "application/gzip",
        "gif": "image/gif",
        "htm": "text/html",
        "html": "text/html",
        "ico": "image/vnd.microsoft.icon",
        "ics": "text/calendar",
        "jar": "application/java-archive",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "jsonld": "application/ld+json",
        "mid": "audio/midi audio/x-midi",
        "midi": "audio/midi audio/x-midi",
        "mjs": "text/javascript",
        "mp3": "audio/mpeg",
        "mp4": "video/mp4",
        "mpeg": "video/mpeg",
        "mpkg": "application/vnd.apple.installer+xml",
        "odp": "application/vnd.oasis.opendocument.presentation",
        "ods": "application/vnd.oasis.opendocument.spreadsheet",
        "odt": "application/vnd.oasis.opendocument.text",
        "oga": "audio/ogg",
        "ogv": "video/ogg",
        "ogx": "application/ogg",
        "opus": "audio/opus",
        "otf": "font/otf",
        "png": "image/png",
        "pdf": "application/pdf",
        "php": "application/x-httpd-php",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "rar": "application/vnd.rar",
        "rtf": "application/rtf",
        "sh": "application/x-sh",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tar": "application/x-tar",
        "tif": "image/tiff",
        "tiff": "image/tiff",
        "ts": "video/mp2t",
        "ttf": "font/ttf",
        "txt": "text/plain",
        "vsd": "application/vnd.visio",
        "wav": "audio/wav",
        "weba": "audio/webm",
        "webm": "video/webm",
        "webp": "image/webp",
        "woff": "font/woff",
        "woff2": "font/woff2",
        "xhtml": "application/xhtml+xml",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "xml": "application/xml",
        "xul": "application/vnd.mozilla.xul+xml",
        "zip": "application/zip",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        "7z": "application/x-7z-compressed"
    }[extension] || "application/octet-stream";
}