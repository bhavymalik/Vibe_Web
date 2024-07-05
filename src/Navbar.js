import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";

export default function Navbar({setUser})
{   

    const navigate = useNavigate();


    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            setUser(""); // Reset user state to empty string or initial state value
            navigate("/"); // Redirect to the home page or login page
        }
    }

    const [dropdownOpen, setDropdownOpen] = React.useState(false);


    return(
        <div>
        <navbar className="mynav">
        <h1 >VIBE</h1>
        <input type="text" placeholder="Search" className="mysearch"></input>
        <button className="search-btn">
        <svg class="svg-icon search-icon" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><title id="title"></title><desc id="desc"></desc><g class="search-path" fill="none" stroke="#848F91"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg>
        </button>
        <ul className="mynav-list">
            <li>Contact Us</li>
            <li>
            <i className="fa fa-user-circle" onClick={() => setDropdownOpen(!dropdownOpen)}></i>
            {dropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => navigate("/Brand")}>My Profile</li>
              <hr></hr>
              <li onClick={signOutUser}>Logout</li>
            </ul>
            )}
            </li>
        </ul>
        </navbar>

        <navbar className="myvertnav">
        <ul className="myvertnav-list">
            <li>
                <i className="fa fa-area-chart" ></i>
                <button className="vert-nav-btn" onClick={()=>navigate("/analytics")}>Analytics</button>
            </li>
            <li>
                <i className="fa fa-shopping-cart"></i>
                <button className="vert-nav-btn" onClick={()=>navigate("/catalog")}>Catalog</button>
            </li>
            <li> 
                <i className="fa fa-address-book"></i>
                <button className="vert-nav-btn" onClick={()=>navigate("/contacts")}>Users</button>
            </li>
            <li> 
                <i className="fa fa-envelope"></i>
                <button className="vert-nav-btn">Queries</button>
            </li>
            <li>
                <i className="fa fa-eye"></i>
                <button className="vert-nav-btn">Showcase</button>
            </li>
            <hr></hr>
            <li>
                <i className="fa fa-cog"></i>
                <button className="vert-nav-btn">Settings</button>
            </li>
            <li>
                <i className="fa fa-user"></i>
                <button className="vert-nav-btn">My Profile</button>
            </li>
        </ul>
        </navbar>
        </div>
    )
}

/*
  <li><FileUpload onFileParsed={onFileParsed}/> </li>
            <li>Catalog</li>
            <li>Analytics</li>
            <li>Contact Us</li>
            <li><button onClick={()=> signOutUser()}>Sign Out</button></li>
*/