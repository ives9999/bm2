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
        "azw": "application/vnd.amazon.ebook",
        "bin": "application/octet-stream",
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
        "htm": "text/html",
        "html": "text/html",
        "ics": "text/calendar",
        "jar": "application/java-archive",
        "js": "text/javascript",
        "json": "application/json",
        "jsonld": "application/ld+json",
        "mid": "audio/midi audio/x-midi",
        "midi": "audio/midi audio/x-midi",
        "mjs": "text/javascript",
        "mp3": "audio/mpeg",
        "mpkg": "application/vnd.apple.installer+xml",
        "odp": "application/vnd.oasis.opendocument.presentation",
        "ods": "application/vnd.oasis.opendocument.spreadsheet",
        "odt": "application/vnd.oasis.opendocument.text",
        "oga": "audio/ogg",
        "ogx": "application/ogg",
        "opus": "audio/opus",
        "otf": "font/otf",
        "pdf": "application/pdf",
        "php": "application/x-httpd-php",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "rar": "application/vnd.rar",
        "rtf": "application/rtf",
        "sh": "application/x-sh",
        "swf": "application/x-shockwave-flash",
        "tar": "application/x-tar",
        "ts": "video/mp2t",
        "ttf": "font/ttf",
        "txt": "text/plain",
        "vsd": "application/vnd.visio",
        "wav": "audio/wav",
        "weba": "audio/webm",
        "woff": "font/woff",
        "woff2": "font/woff2",
        "xhtml": "application/xhtml+xml",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "xml": "application/xml",
        "xul": "application/vnd.mozilla.xul+xml",
        "zip": "application/zip",
        "7z": "application/x-7z-compressed"
    }[extension] || "application/octet-stream";
}