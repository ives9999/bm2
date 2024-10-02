import axios from "../../api/axios";

const domain = process.env.REACT_APP_API

export const homeTeamAPI = async () => {
    const url = domain + "/home/team"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const homeArenaAPI = async () => {
    const url = domain + "/home/arena"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const homeProductAPI = async () => {
    const url = domain + "/home/product";
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getHome = async() => {
    const url = "/home/product";
    let data = null;
    try {
        data = await axios.get(url);
        return data.data;
    } catch (e) {
        return e.response.data;
    }
    //console.info(data);
    // const [product, team, arena] = await Promise.all([
    //     homeProductAPI(),
    //     homeTeamAPI(),
    //     homeArenaAPI(),
    // ])
    //
    // return {team: team, arena: arena, product: product}
}