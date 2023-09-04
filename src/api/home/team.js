import { render } from "@testing-library/react";
import React from "react";
const { useState, useEffect } = React;

//const team = {id: 0, name: 'name'}

const HomeTeam = () => {
    const[team, setTeam] = useState({id: 0, name: 'name'});
    const url = "http://api.sportpassword.localhost/site/team"

    useEffect(() => {

        const fetchTeam = () => {
            fetch("http://api.sportpassword.localhost/site/team", {
            })
            // .then (response => response.json())
            // .then (data => {
            //     setTeam(data[0])
            // });
            //.catch (err => {})
        };

        Promise.all([
            fetch(url, {
                method: "GET",
            }),
        ])
        .then(([response1]) =>
            Promise.all([response1.json()])
        )
        .then(([data1]) => {
            setTeam(data1[0]);
        });
    }, []);

    return (
        <>
            <div>{team.id}</div>
            <div>{team.name}</div>
        </>
    )
}

export { HomeTeam };