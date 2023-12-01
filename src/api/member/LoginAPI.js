import {useState} from 'react'

function LoginAPI(email, password) {
    const [status, setStatus] = useState(200)
    // const [data, setData] = useState({
    //     status: 200,
    //     message: [],
    //     row: {},
    // })
    const formData = {email: email, password: password}
    const url = process.env.REACT_APP_API + "/member/postLogin"

    const login = async () => {
        try{
            const response = await fetch(url, {
                method: 'POST',
                Headers: {
                    'Content-Type': 'application/jsonn',
                },
                body: JSON.stringify(formData)
            })
            const res = await response.json()
            setStatus(res.status)
            //return res
        } catch (e) {

        }
    }
    login()
    return status
}

export default LoginAPI
