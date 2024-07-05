import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from './supabaseClient';
import Navbar from "./Navbar";

export default function Analytics({user}){
    return(
        <div>
            <Navbar />
            <div className="numeric-value"> 
            <div className="numeric-box">
                <h4>Profit</h4>
            </div>
            <div className="numeric-box">
                <h4>Products</h4>
            </div>
            <div className="numeric-box">
                <h4>Sales</h4>
            </div>
            <div className="numeric-box">
                <h4>Users</h4>
            </div>
            </div>


            <div className="data-graphs">

            </div>

        
            <div className="coming-events">

            </div>
        </div>
    )
}