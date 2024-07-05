import React from "react";
import ReactDOM from 'react-dom/client'
import './App.css'

function Upload(){


    const[myvar, setMyVar] = React.useState({
        id: 18,
        title: "",
        description: "",
        price: 50,
        coverImg: "",
        stats: {
            rating: 0,
            reviewCount: 0
        },
        location: "",
        openSpots: 3,
    })

    function handleChange(event){
        const {name,value} = event.target
        setMyVar({
            ...myvar,
            [name]: value
        })
    }


    return(
        <form className="card">
        <input 
            type="text" 
            placeholder="item id" 
            onChange={handleChange} 
            name="id" 
            value={myvar.id}>
        </input>
        <input 
            type="text" 
            placeholder="Title" 
            onChange={handleChange} 
            name="title" 
            value={myvar.title}>
        </input>
        <input 
            type="text" 
            placeholder="price per item" 
            onChange={handleChange} 
            name="price" 
            value={myvar.price}>
        </input>
        <input 
            type="text" 
            placeholder=" items left" 
            onChange={handleChange} 
            name="openSpots" 
            value={myvar.openSpots}>
        </input>
        <input 
            type="text" 
            placeholder="Location" 
            onChange={handleChange} 
            name="location" 
            value={myvar.location}>
        </input>
    </form>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root-upload'));
root.render(
  <React.StrictMode>
    <div>
    <Upload />
    </div>
  </React.StrictMode>
);