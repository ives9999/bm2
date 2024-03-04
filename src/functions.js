export function dump(value) {
    console.info(value)
}

export function ShowHtml({content}) {
    const markup = {__html: content};
    return <div dangerouslySetInnerHTML={markup} />
}