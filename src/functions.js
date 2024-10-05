export function dump(value) {
    console.info(value)
}

export function ShowHtml({content}) {
    const markup = {__html: content};
    return <div dangerouslySetInnerHTML={markup} />
}

export function IsEmptyField({
    value,
    unit='',
}) {
    //console.info("field:"+value);
    let active = true;
    if (value === undefined || value === null || value === '') {
        active = false;
    }
    return (
        <span className={!active ? 'text-gray-500' : ''}>{!active ? '未提供' : value+unit}</span>
    )
}

export function collectErrorMsg(messages) {
    var msgs = ""
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i].message
        msgs += msg + "\n"
    }
    return msgs;
}