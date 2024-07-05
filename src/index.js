import React from 'react';
import ReactDOM from 'react-dom/client';
import './login.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './login';
import Catalog from './Catalog';
import Analytics from './Analytics';
import Contact from './Contact'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';



function MyProject(){

  const [user, setUser] = React.useState("");
const clientid= "477035451594-v4atd2luf5hn7tcbdqbs19ro0vupfegb.apps.googleusercontent.com"
const [csvData, setCsvData] = React.useState([]);
const handleFileParsed = (data) => {
  setCsvData(data);
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login user={user} setUser={setUser} />,
  },
  {
    path: "/app",
    element: <App user={user}  setUser={setUser} csvData={csvData} setCsvData={setCsvData}/>,
  },
  {
    path: "/app1",
    element: <App user={user} setUser={setUser} csvData={csvData} setCsvData={setCsvData} />,
  },
  {
    path: "/catalog",
    element: <Catalog user={user} setUser={setUser} csvData={csvData} setCsvData={setCsvData} />,
  },
  {
    path: "/analytics",
    element: <Analytics user={user} setUser={setUser} />
  },
  {
    path: "/contacts",
    element: <Contact user={user} setUser={setUser} />
  }
]);

  return(
    <React.StrictMode>
    <GoogleOAuthProvider clientId={clientid}>
    < RouterProvider router={router} />
    </GoogleOAuthProvider>
    </React.StrictMode>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    < MyProject />
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

