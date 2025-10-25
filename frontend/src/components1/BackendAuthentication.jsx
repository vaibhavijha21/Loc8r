import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

// Custom CSS for the authentication layout
const customStyles = `
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
	box-sizing: border-box;
}

body {
	background: #f9f9ffff;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	height: 100vh;
	margin: 0;
}

h2 {
	text-align: center;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #eaedf5ff;
	background-color: #333;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 30px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: auto; 
  min-height: 100%;
	text-align: center;
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: px 0;
	width: 100%;
}

.container {
    background-color: #fff;
    /* removed rounded corners as requested */
    border-radius: 0px;
    box-shadow:  0 0 20px rgba(42, 75, 141, 0.5);
    position: relative;
    overflow: hidden;
    width: 900px;
    max-width: 100%;
    min-height: 500px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%, 49.99% {
		opacity: 0;
		z-index: 1;
	}
	
	50%, 100% {
		opacity: 1;
		z-index: 5;
	}
}

@keyframes sweep {
  0% {
    transform: rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.8;
  }
}

.animate-sweep {
  animation: sweep 3s linear infinite;
  background: conic-gradient(from 0deg, rgba(255,255,255,0.4), transparent 60%);
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.right-panel-active .overlay-container{
	transform: translateX(-100%);
}

.overlay {
	background: #000000ff;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #FFFFFF;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
  	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.right-panel-active .overlay {
  	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.social-container {
	margin: 20px 0;
}

.social-container a {
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	height: 40px;
	width: 40px;
}
`;

const BackendAuthentication = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  // State Management
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [signupUserName, setSignupUserName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUserContact, setSignupUserContact] = useState('');
  const [signupUserDept, setSignupUserDept] = useState('');

  // Handlers for UI
  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
    setError('');
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
    setError('');
  };

  // Backend Authentication Logic (Login)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.login({ Email: email, password });
      
      // Store token and user data
      apiService.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      alert("✅ Login Successful!");
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Backend Authentication Logic (Signup)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = signupEmail.trim();
    const password = signupPassword.trim();
    const userContact = signupUserContact.trim();
    const userName = signupUserName.trim();
    const userDept = signupUserDept.trim();

    if (!email || !password || !userName || !userContact) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (userContact.length !== 10 || !/^\d+$/.test(userContact)) {
      setError("Contact number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register({
        User_name: userName,
        Contact: userContact,
        Email: email,
        User_Department: userDept,
        password: password
      });
      
      // Store token and user data
      apiService.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      alert("🎉 Account Created Successfully!");
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="body bg-gradient-to-b from-[#0F172A] to-[#0B2545]">
        <div className={`container w-[70%] ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
          
          {/* Sign Up Container */}
          <div className="form-container sign-up-container">
            <form className="space-y-2" onSubmit={handleSignup}>
              <h2 className="text-2xl font-extrabold text-center text-black-600 mt-2 mb-4">
                🔑Create Your Account
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                value={signupUserName}
                onChange={(e) => setSignupUserName(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Enter Email" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Enter Password" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Contact Number (10 digits)" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupUserContact}
                onChange={(e) => setSignupUserContact(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Department" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupUserDept}
                onChange={(e) => setSignupUserDept(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-96 bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
          
          {/* Sign In Container */}
          <div className="form-container sign-in-container">
            <form className="space-y-2" onSubmit={handleLogin}>
              <h2 className="text-black-600 text-3xl font-extrabold text-center">
                🔐 Login to Loc8r
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <input 
                type="email" 
                placeholder="Enter Email" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Enter Password" 
                className="w-96 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-96 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-200 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
          
          {/* Overlay Container */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left relative overflow-hidden">
                {/* Radar Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]">
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    <div className="absolute inset-8 rounded-full border border-white/15"></div>
                    <div className="absolute inset-16 rounded-full border border-white/10"></div>
                    <div className="absolute inset-24 rounded-full border border-white/5"></div>
                    <div className="absolute inset-0 rounded-full origin-center animate-sweep bg-gradient-to-tr from-white/20 to-transparent"></div>
                  </div>
                </div>
                <h1 className="font-bold text-3xl py-2 mt-2">Welcome Back!</h1>
                <p className="font-bold p-4">Login to recover. Login to reunite.</p>
                <button 
                  className="text-white bg-blue-600 p-2 w-32 hover:bg-gradient-to-br rounded-lg mb-2" 
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Log In
                </button>
              </div>
              <div className="overlay-panel overlay-right relative overflow-hidden">
                {/* Radar Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]">
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    <div className="absolute inset-8 rounded-full border border-white/15"></div>
                    <div className="absolute inset-16 rounded-full border border-white/10"></div>
                    <div className="absolute inset-24 rounded-full border border-white/5"></div>
                    <div className="absolute inset-0 rounded-full origin-center animate-sweep bg-gradient-to-tr from-white/20 to-transparent"></div>
                  </div>
                </div>
                <h1 className="font-bold text-3xl py-2 mt-2">Hey, Visitor!</h1>
                <p className="font-bold p-4">Create your account and never lose track again.</p>
                <button 
                  className="text-white bg-blue-600 p-2 w-32 hover:bg-gradient-to-br rounded-lg mb-2" 
                  id="signUp"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackendAuthentication;
