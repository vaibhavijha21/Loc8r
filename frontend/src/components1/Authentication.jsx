import React, { useState, useEffect } from 'react';
// ⚠️ IMPORTANT: In a standard React project, you need to install Firebase via npm/yarn:
// npm install firebase
// Then, you use standard imports, *not* CDN imports.
import { useNavigate } from 'react-router-dom';
import { 
  initializeApp 
} from 'firebase/app';
import { 
  getAnalytics 
} from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,  
  signInWithPopup,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// ------------------------------------------------
// ⚠️ Custom CSS for the complex layout and animation
// This is necessary because the original page heavily relies on this CSS.
// In a real project, this would be moved to a CSS file (e.g., Auth.css) and imported.
// ------------------------------------------------
const customStyles = `
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
	box-sizing: border-box;
}

body {
	// background: #1F2937;
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
	background-color: #171818ff;
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
	//padding: 12px 15px;
	//margin: px 0;
	width: 100%;
}

.container {
	background-color: #fff;
	border-radius: 10px;
  box-shadow:  0 0 20px rgba(66, 66, 67, 0.5);
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
  /* width: 50%; */
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
	// background: #1f3c76;
	// background: -webkit-linear-gradient(to right, #1f3c76, #1f3c76);
	background: #0d0d0eff;
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


const Authentication = ({ setIsAuthenticated }) => {

  const navigate = useNavigate();
  // ------------------------------------------------
  // Firebase Initialization
  // ------------------------------------------------
  const firebaseConfig = {
    apiKey: "AIzaSyBm-d5W9HLMfDoteB1lqk5M3F7mv-1e58c",
    authDomain: "loc8r-aa871.firebaseapp.com",
    projectId: "loc8r-aa871",
    storageBucket: "loc8r-aa871.firebasestorage.app",
    messagingSenderId: "449109675258",
    appId: "1:449109675258:web:ac0fdfd703f20d1acf0d43",
    measurementId: "G-4S9HC3KSQB"
  };
  const app = initializeApp(firebaseConfig);
  // eslint-disable-next-line
  const analytics = getAnalytics(app); // Initialized but not used further
  const auth = getAuth(app);


  // ------------------------------------------------
  // State Management
  // ------------------------------------------------
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // Login Form State
  const [loginRole, setLoginRole] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Login Conditional Fields (not strictly needed for login logic but for UI)
  const [loginAdminName, setLoginAdminName] = useState('');
  const [loginUserName, setLoginUserName] = useState('');
  const [loginUserContact, setLoginUserContact] = useState('');
  const [loginUserDept, setLoginUserDept] = useState('');

  // Signup Form State
  // const [signupRole, setSignupRole] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  // const [signupAdminName, setSignupAdminName] = useState('');
  const [signupUserName, setSignupUserName] = useState('');
  const [signupUserContact, setSignupUserContact] = useState('');
  const [signupUserDept, setSignupUserDept] = useState('');

  // ------------------------------------------------
  // Handlers for UI (Panel and Role Selection)
  // ------------------------------------------------
  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  // The original code only enabled the email/password fields upon role selection.
  const isLoginFieldsEnabled = loginRole !== '';
  // const isSignupFieldsEnabled = signupRole !== '';


  // ------------------------------------------------
  // Firebase Authentication Logic (Login)
  // ------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginRole) {
      alert("Please select a role.");
      return;
    }

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Validation for User Contact (only for User role)
    if (loginRole === "user") {
      const userContact = loginUserContact.trim();
      if (userContact.length !== 10 || !/^\d+$/.test(userContact)) {
        alert("Contact number must be exactly 10 digits");
        return;
      }
    }


    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("✅ Login Successful!");
        console.log(userCredential.user);
       setIsAuthenticated(true); 
        // 2. Programmatically navigate to the dashboard
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        alert("❌ " + error.message);
      });
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        alert("✅ Google Login Successful!");
        console.log(result.user);
        
        // 1. Update the authentication state in App.jsx
        setIsAuthenticated(true); 
        // 2. Programmatically navigate to the dashboard
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        alert("❌ " + error.message);
      });
  };

  // ------------------------------------------------
  // Firebase Authentication Logic (Signup)
  // ------------------------------------------------
  // ------------------------------------------------
  // Firebase Authentication Logic (Signup)
  // ------------------------------------------------
  const handleSignup = (e) => {
    e.preventDefault();

 

    const email = signupEmail.trim();
    const password = signupPassword.trim();
    const userContact = signupUserContact.trim(); // Now mandatory

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Validation for User Contact (now mandatory for all signups)
    if (userContact.length !== 10 || !/^\d+$/.test(userContact)) {
      alert("Contact number must be exactly 10 digits (only numbers allowed)");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("🎉 Account Created Successfully!");
        console.log(userCredential.user);
        // After successful signup, switch to the sign-in panel
        setIsRightPanelActive(false);
      })
      .catch((error) => {
        alert("❌ " + error.message);
      });
  };


  // ------------------------------------------------
  // JSX Render
  // ------------------------------------------------
  return (
    <>
      <style>{customStyles}</style> {/* Embedded custom CSS */}
      <div className="body bg-gradient-to-b from-[#0F172A] to-[#0B2545]">
        <div className={`container w-[70%] ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
          
          {/* Sign Up Container */}
          <div className="form-container sign-up-container">
            <form className="space-y-2" onSubmit={handleSignup}>
              <h2 className="text-2xl font-extrabold text-center text-gray-600 mt-2 mb-4 ">
                Create Your Account
              </h2>
              
              <input 
                id="signupemail" 
                type="email" 
                placeholder="Enter Email" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                // disabled={!isSignupFieldsEnabled}
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input 
                id="signuppassword" 
                type="password" 
                placeholder="Enter Password" 
                className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                // disabled={!isSignupFieldsEnabled}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />

              {/* Admin Fields */}
              {/* <div id="signupadminFields" className={`${signupRole === 'admin' ? '' : 'hidden'} space-y-3`}>
                <input 
                  id="signupadminName" 
                  type="text" 
                  placeholder="Admin Name" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={signupAdminName}
                  onChange={(e) => setSignupAdminName(e.target.value)}
                />
              </div> */}

              {/* User Fields */}
              <div id="signupuserFields" className={`space-y-3`}>
                <input 
                  id="signupuserName" 
                  type="text" 
                  placeholder="User Name" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={signupUserName}
                  onChange={(e) => setSignupUserName(e.target.value)}
                />
                <input 
                  id="signupuserContact" 
                  type="text" 
                  placeholder="User Contact" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={signupUserContact}
                  onChange={(e) => setSignupUserContact(e.target.value)}
                />
                <input 
                  id="signupuserDept" 
                  type="text" 
                  placeholder="Department" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={signupUserDept}
                  onChange={(e) => setSignupUserDept(e.target.value)}
                />
              </div>
              <button 
                id="signupBtn" 
                type="submit" 
                className="w-96 bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-200"
              >
                Create Account
              </button>
              <button 
                id="googlesignupBtn" 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-96 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> 
                Continue with Google
              </button>
            </form>
          </div>
          
          {/* Sign In Container */}
          <div className="form-container sign-in-container">
            <form className="space-y-2" onSubmit={handleLogin}>
              <h2 className="text-gray-600 text-2xl font-extrabold text-center  ">
                Login to Loc8r
              </h2>
              <select 
                id="role" 
                className="text-gray-900 w-96 font-bold px-4 py-2 border mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value)}
              >
                <option disabled value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              
              <div id="commonFields">
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Enter Email" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                  disabled={!isLoginFieldsEnabled}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input 
                  id="password" 
                  type="password" 
                  placeholder="Enter Password" 
                  className="w-96 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                  disabled={!isLoginFieldsEnabled}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {/* Admin Fields (Not used in login logic, but for UI mirroring) */}
              <div id="adminFields" className={`${loginRole === 'admin' ? '' : 'hidden'} space-y-3`}>
                <input 
                  id="adminName" 
                  type="text" 
                  placeholder="Admin Name" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginAdminName}
                  onChange={(e) => setLoginAdminName(e.target.value)}
                />
              </div>

              {/* User Fields (Used for contact validation in login logic) */}
              <div id="userFields" className={`${loginRole === 'user' ? '' : 'hidden'} space-y-3`}>
                <input 
                  id="userName" 
                  type="text" 
                  placeholder="User Name" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginUserName}
                  onChange={(e) => setLoginUserName(e.target.value)}
                />
                <input 
                  id="userContact" 
                  type="text" 
                  placeholder="User Contact" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginUserContact}
                  onChange={(e) => setLoginUserContact(e.target.value)}
                />
                <input 
                  id="userDept" 
                  type="text" 
                  placeholder="Department" 
                  className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={loginUserDept}
                  onChange={(e) => setLoginUserDept(e.target.value)}
                />
              </div>

              <button 
                id="loginBtn" 
                type="submit" 
                className="w-96 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-200"
              >
                Login
              </button>
              <button 
                id="googleloginBtn" 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-96 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> 
                Continue with Google
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
                  className="text-white bg-blue-600 p-2 w-32 hover:bg-gradient-to-br  rounded-lg mb-2" 
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

export default Authentication;