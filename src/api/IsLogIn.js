//import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import axios from "axios";

//const queryClient = new QueryClient();

// export function IsLogIn() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <GetIsLogIn />
//         </QueryClientProvider>
//     )
// }

export function IsLogIn() {

    const cookies = new Cookies();
    var token = cookies.get("token")
    // var isLogIn = false
    // if (token !== undefined) {
    //     isLogIn = true
    // }
    const params = {token: token}

    const url = process.env.REACT_APP_API + "/member/postIsLogIn"
    const { data } = axios.post(
        url, 
        params, 
        {headers: {'Content-Type': 'application/json'}}
    )
    //console.info(data)
    // .then(response => {
    //     console.info(response.data)
    // })
    
    // const { isLoading, error, data } = useQuery({
    //     queryKey: ['repoData'], 
    //     queryFn: () => 
    //         fetch(url).then(
    //             (res) => res.json()
    //         ),
    // })
    // if (isLoading) return 'Loading...'
    // if (error) return error.message
    // return (
    //     <div>aaa</div>
    // )
    return (!data.success) ? 
    <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
    :
    <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">{data.row.nickname}</a>
}

//export default IsLogIn