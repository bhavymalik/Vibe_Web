import React, { useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Catalog from './Catalog';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './App.css'

export default function App({ user,setUser, csvData, setCsvData }) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(user);
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
        };

        checkUser();
    }, [setUser]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <div className="App">
            {
                user ?
                    <>
                        <Navbar setUser={setUser}/>
                        <Catalog user={user} setUser={setUser} csvData={csvData} setCsvData={setCsvData} />
                    </>
                    :
                    <>
                        <h1> User is Not Logged In</h1>
                        <button onClick={() => { navigate("/") }} >Go to Home Page</button>
                    </>
            }
        </div>
    );
}


/*
        <Catalog csvData={csvData} />
        <Header />
 */

/**
 React.useEffect( ()=>{
    async function getUserData(){
    await supabase.auth.getUser().then((value)=>{
        if(value.data?.user){
          console.log(value.data.user);
          props.setUser(value.data.user);
        }
    })
  }
  getUserData();
  })

 */


