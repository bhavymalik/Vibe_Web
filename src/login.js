import React from "react";
import './login.css';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import supabase from './supabaseClient';

function Login({user, setUser }) {
    const navigate = useNavigate();

    const googlesignin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log(tokenResponse);

                // Fetch user info from Google API
                const userInfoResponse = await axios.get(
                    'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const { email, name } = userInfoResponse.data;
                console.log("User info:", userInfoResponse.data);

                // Check if profile already exists in Supabase
                const { data: existingProfile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", email)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    // PGRST116: no matching row found (Supabase specific error code for no rows found)
                    throw profileError;
                }

                // If profile doesn't exist, insert it; otherwise, update it
                let userProfile;
                if (!existingProfile) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .insert({
                            email: email,
                            name: name,
                        })
                        .single();

                    if (error) {
                        throw error;
                    }

                    userProfile = data;
                } else {
                    const { data, error } = await supabase
                        .from("profiles")
                        .update({
                            name: name,
                        })
                        .eq("email", email)
                        .single();

                    if (error) {
                        throw error;
                    }

                    userProfile = data;
                }

                setUser(email);
                console.log(email);
                console.log(userProfile); // Log the user profile instead of `user`
                navigate('/app'); // Navigate to /app upon successful login
            } catch (error) {
                console.error('Error fetching or upserting user info:', error);
                alert(`Error: ${error.message}`); // Show error message to the user
                // Handle error gracefully, e.g., show error message to the user
            }
        },
        // other options
    });
    
    // Log the user state whenever it changes
    React.useEffect(() => {
        console.log("User state changed:", user);
    }, [user]);

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: ""
    });

    const [signinData, setSigninData] = React.useState({
        email: "",
        password: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleChangeSignin(event) {
        const { name, value } = event.target;
        setSigninData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    async function createUser() {
        try {
            const { user, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name
                    }
                }
            });

            if (error) throw error;

            alert("Signup successful! Please check your email to verify your account.");
        } catch (error) {
            alert(error.message);
        }
    }

    async function signingin() {
        try {
            const { user, error } = await supabase.auth.signInWithPassword({
                email: signinData.email,
                password: signinData.password
            });

            if (error) throw error;

            if (user?.email_confirmed_at) {
                // Fetch user profile after signing in
                const { data: userProfile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', signinData.email)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                setUser(signinData.email);
                navigate("/app");
            } else {
                alert("Please verify your email address before signing in.");
            }
        } catch (error) {
            alert(error.message);
        }
    }

    React.useEffect(() => {
        const signupButton = document.querySelector('.img__btn');
        const container = document.querySelector('.cont');

        const toggleSignupClass = () => {
            container.classList.toggle('s--signup');
        };

        if (signupButton) {
            signupButton.addEventListener('click', toggleSignupClass);
        }

        // Cleanup event listener on component unmount
        return () => {
            if (signupButton) {
                signupButton.removeEventListener('click', toggleSignupClass);
            }
        };
    }, []);

    return (
        <div className="cont">
            <div className="form sign-in">
                <h2>Welcome!</h2>
                <label>
                    <input
                        type="email"
                        placeholder="abc@xyz.com"
                        onChange={handleChangeSignin}
                        name="email"
                        value={signinData.email}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="*****************"
                        onChange={handleChangeSignin}
                        name="password"
                        value={signinData.password}
                    />
                </label>
                {1 && <p className="forgot-pass">Forgot password?</p>}
                <button
                    type="button"
                    className="submit"
                    onClick={signingin}
                >
                    Sign In
                </button>
                <p className="OR">-------------OR-------------</p>
                <button className="submit-google" onClick={googlesignin}>
                    Sign in with Google
                </button>
            </div>

            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h2>Don't have an account?</h2>
                        <h2>Please Sign up!</h2>
                    </div>
                    <div className="img__text m--in">
                        <h2>If you already have an account,</h2>
                        <h2>just sign in.</h2>
                    </div>
                    <div className="img__btn">
                        <span className="m--up">Sign Up</span>
                        <span className="m--in"><button>Sign In</button></span>
                    </div>
                </div>
                <div className="form sign-up">
                    <h2>Create your Account</h2>
                    <label>
                        <input
                            type="text"
                            placeholder="Name"
                            onChange={handleChange}
                            name="name"
                            value={formData.name}
                        />
                    </label>
                    <label>
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            name="email"
                            value={formData.email}
                        />
                    </label>
                    <label>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            name="password"
                            value={formData.password}
                        />
                    </label>
                    <button
                        type="button"
                        className="submit"
                        onClick={createUser}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
