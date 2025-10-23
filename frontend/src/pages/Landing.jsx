import { useState } from "react";
import { CreateUser } from "../components/CreateUser";
import { Login } from "../components/Login";

export function Landing() {

    //view == 0 --> Login
    //view == 1 --> Create user
    const [view, setView] = useState(0)

    return (
        <>
            {!view ?
            <>
                <Login/>
                <button onClick={() =>setView(!view)}>Login existing Account</button>
            </>:
            <>
                <CreateUser/>
                <button onClick={() =>setView(!view)}>Create new Account</button>
            </>}
        </>
    )
}