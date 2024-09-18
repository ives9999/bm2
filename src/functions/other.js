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