const domain = process.env.REACT_APP_API
//const headers = {'Content-Type': 'application/json',}

export const homeTeamAPI = async () => {
    const url = domain + "/home/team"
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getList = async (manager_token) => {
    const url = domain + "/team/getList?manager_token="+manager_token
    const response = await fetch(url)
    const data = await response.json()
    return data
}