import { useState, useEffect } from "react";
//import { dump } from "../../functions"

const useFetchOne = (url) => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [url]);
  
    return data;
  };
  
  export default useFetchOne;
  

// export function useMemberOne(props) {
//     const [one, setOne] = useState(null)
//     useEffect(() => {
//         if (props.token === undefined) {
//             return one
//         }
//         getOne()
//     }, [props.token])

//     async function getOne() {
//         const url = process.env.REACT_APP_API + "/member/getOne?token=" + props.token
//         const config = {
//             method: "GET",
//             Headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//         const response = await axios.get(url, {}, config)
//         if (response.data.success) {
//             const row = response.data.row
//             setOne(row)
//         }
//     }

//     return one
// }
