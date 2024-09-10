export function addActive(data) {
    data = data.map((item) => {
        const a = {...item, active: false};
        return a;
    });

    return data;
}

export function setActiveByIdx(fnSet, idx) {
    fnSet((prev) => {
        const newPrev = prev.map((item) => {
            return {...item, active: false};
        });
        newPrev[idx].active = true;
        return [...newPrev];
    })
}