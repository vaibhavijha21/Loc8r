// Example inside handleLogin()
const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
localStorage.setItem('token', response.data.token);
alert('Login successful!');
navigate('/profile');
