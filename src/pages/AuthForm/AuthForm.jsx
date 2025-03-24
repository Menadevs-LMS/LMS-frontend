import { useState } from 'react';
import "./AuthForm.css";
import axios from 'axios';
import {
    FaUser,
    FaLock,
    FaEnvelope
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ setToken }) => {
    const [isActive, setIsActive] = useState(false);
    const [userName, setName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsActive(true);
        setName("");
        setEmail("");
        setPassword("");
        setError("");
    };

    const handleLoginClick = () => {
        setIsActive(false);
        setName("");
        setEmail("");
        setPassword("");
        setError("");
    };

    const handleLogin = async (event) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        event?.preventDefault();
        setError("");

        try {
            const loginData = {
                userEmail,
                password
            };

            await axios.post(`${backendUrl}/auth/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                const userRole = response.data.data.user.role;
                console.log("userRole AuthForm>>>>>>>>", userRole)
                if (userRole === "instructor") {
                    console.log("To educator authform")

                    navigate("/educator");
                } else {
                    console.log("To Home authform")

                    navigate("/");
                }
                setToken(response.data.data.accessToken);

            });

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };



    const handleRegister = async (event) => {
        event?.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        setError("");

        try {
            const registerData = {
                userName,
                userEmail,
                password,
                role: "student"
            };

            const response = await axios.post(`${backendUrl}/auth/register`, registerData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);

            if (response.data.success) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                setToken(response.data.data.accessToken);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };


    return (
        <div className='auth-form'>
            <div className={`container ${isActive ? 'active' : ''}`}>
                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        {!isActive && error && <div className="error-message">{error}</div>}
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={userEmail}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FaEnvelope className='auth-icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className='auth-icon' />
                        </div>
                        <button type="submit" className="btn">Login</button>
                    </form>
                </div>

                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Registration</h1>
                        {isActive && error && <div className="error-message">{error}</div>}
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={userName}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <FaUser className='auth-icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={userEmail}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FaEnvelope className='auth-icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className='auth-icon' />
                        </div>
                        <button type="submit" className="btn">Register</button>
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, Welcome!</h1>
                        <p>Don't have an account?</p>
                        <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account?</p>
                        <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;