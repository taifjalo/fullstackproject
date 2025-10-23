import { getHabit, getImage } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export function Readhabit() {

    const [habit, setHabit] = useState({})

    let params = useParams()
    let id =  params.id
    const navigate = useNavigate()

    useEffect(() => {
        async function loadHabit() {
            let data = await getHabit(id)
            let date = new Date(data.dateCreated)
            data.dateCreated = date.toString()
            setHabit(data)
        }
        loadHabit()
    }, [])


    return (
        <>
            <button onClick={() => navigate(-1)}>Back</button>
            <h1>{habit.title}</h1>
            <h2>{habit.description}</h2>
            <img src={habit.image} alt="Habit Image" />
            <h3>{habit.dateCreated?.slice(4,15)}</h3>
            <p>{habit.content}</p>
        </>
    )
}