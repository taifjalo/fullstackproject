import "./App.css"
import {HashRouter as Router, Routes, Route} from "react-router-dom"
import { About }from "./pages/About"
import { Contact }from "./pages/Contact"
import { CreateHabit }from "./pages/CreateHabit"
import { Home }from "./pages/Home"
import { Landing }from "./pages/Landing"
import { Profile }from "./pages/Profile"
import { Readhabit }from "./pages/Readhabit"
import { Navbar } from "./components/Navbar";
import { Layout } from "./components/Layout";
import { useEffect } from "react"
import axios from "axios"


function App() {

  useEffect(() => {
    let token = sessionStorage.getItem("User")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])


  //Pages:

  //1- Landing page
  //2- Home page
  //3- ReadHabit
  //4- CreateHabit
  //5- Profile
  //6- about
  //7- Contact


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route element={<Layout/>}>
          <Route path="/home" element={<Home/>}/>
          <Route path="/createhabit" element={<CreateHabit/>}/>
          <Route path="/readhabit/:id" element={<Readhabit/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App























/*
import { useState, useEffect } from 'react'
import { getHabits, getHabit, createHabit, updateHabit, deleteHabit } from "./api";
import './App.css'

function App() {

const [habits, setHabits] = useState()

function makeHabit() {
  let habitObject = {
    title: "Here is Title_6",
    description: "Here is description_6", // ✅ الإملاء الصحيح
    content: "Here is content_6",
    author: "Here is author_6",
    dateCreated: new Date ()
  }
  createHabit(habitObject)
}

useEffect(() => {
   async function loadAllHabits() {
    let data = await getHabits()
    if(data) {
      setHabits(data)
    }
   }
   
   loadAllHabits()
}, []) */


