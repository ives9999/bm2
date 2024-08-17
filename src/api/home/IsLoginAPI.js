import {useState} from 'react'

function IsLoginAPI(token) {

    const [isLogin, setIsLogin] = useState(false)
    const [data, setData] = useState({})
    const [message, setMessage] = useState([])
    if (token.trim() === '') {
        return [isLogin, data, "token is empty"]
    }

    const fetchData = async () => {
        try {
            const url = process.env.REACT_APP_API + "/member/postIsLogIn?token"+token
            // const options = {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify
            // }
            const response = await fetch(url)
            const data = await response.json()
            setIsLogin(data.success)
            setData(data.row)
            setMessage(data.message)
        } catch (error) {
            // setIsLogin(false)
            // setMessage("Error")
        }
        //return [isLogin, data, message]
    }
    fetchData()
    return [isLogin, data, message]
}

export default IsLoginAPI
