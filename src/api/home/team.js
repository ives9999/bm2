import { render } from "@testing-library/react";
import React from "react";
const { useState, useEffect } = React;

//const team = {id: 0, name: 'name'}

const HomeTeam = () => {
    const[team, setTeam] = useState({id: 0, name: 'name'});

    const fetchTeam = () => {
        fetch("http://api.sportpassword.localhost/site/team", {
        })
        .then (response => response.json())
        .then (data => {
            setTeam(data[0])
            
        })
        .catch (err => {})
    }

    useEffect(() => {
        fetchTeam();
    }, []);

    return (
        <>
            <div>{team.id}</div>
            <div>{team.name}</div>
        </>
    )
}

// class HomeTeam extends React.Component {

//     const[team, setTeam] = useState({id: 0, name: 'name'});

//     componentDidMount() {
//         const team = {id: 0, name: 'name'}
//         fetch("http://api.sportpassword.localhost/site/team", {
//             method: "GET",
//             //body: JSON.stringify(data),
//             headers: new Headers({
//                 'Content-Type': 'application/json',
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             team = data[0]
//         }) //
//         .catch(e => {
      
//         })
//     }

//     render() {
//         const {id, name} = this.team
//         return (
//             <>
//             <div>{id}</div>
//             <div>{name}</div>
//             </>
//         )
//     }
// }

export { HomeTeam };