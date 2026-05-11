
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   AppBar,
//   Toolbar,
//   Button,
//   TextField,
//   Tabs,
//   Tab,
//   LinearProgress,
// } from '@mui/material';
// import axios from 'axios';
// import heroImage from '../assets/hero.jpg';

// function Home() {
//   const [activeTab, setActiveTab] = useState('login');
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     email: '',
//     role: 'MEMBER', // Default role
//   });
//   const [errors, setErrors] = useState({});
//   const [passwordStrength, setPasswordStrength] = useState(0);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === 'password') {
//       calculatePasswordStrength(value);
//     }
//   };

//   const calculatePasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 6) strength += 30;
//     if (/[A-Z]/.test(password)) strength += 20;
//     if (/[0-9]/.test(password)) strength += 20;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 30;
//     setPasswordStrength(strength);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     }

//     if (activeTab === 'register') {
//       if (!formData.email.trim()) {
//         newErrors.email = 'Email is required';
//       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         newErrors.email = 'Invalid email format';
//       }
       


//       if (!formData.password.trim()) {
//         newErrors.password = 'Password is required';
//       } else if (formData.password.length < 6) {
//         newErrors.password = 'Password must be at least 6 characters';
//       }

//       if (formData.confirmPassword !== formData.password) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       if (activeTab === 'login') {
//         const res = await axios.post('http://localhost:8989/api/auth/login', {
//           username: formData.username,
//           password: formData.password,
//         });

//         const token = res.data;
//         localStorage.setItem('token', token);

//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const role = payload.roles?.[0];
//         console.log('Logged in role:', role);

//         if (role === 'ADMIN') {
//           navigate('/events');
//         } else if (role === 'MEMBER') {
//           navigate('/eventsList');
//         } 
//         else if(role === 'OWNER'){
//           navigate('/eventsList');
//         }
//           else {
//           alert('Unknown role');
//         }
//       } else {
//         await axios.post('http://localhost:8989/api/auth/registration', {
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//           roles:[formData.role], // Default role
//         });

//         alert('Registration successful!');
//         navigate('/');
//       }
//     } catch (error) {
//       console.error(error);
//       alert(`${activeTab === 'login' ? 'Login' : 'Registration'} failed!`);
//     }
//   };

//   return (
//     <Box>
//       <AppBar position="static">
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           <Typography variant="h6">Club Membership Management</Typography>
//           <Box>
//             <Button color="inherit" component={Link} to="/">Home</Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           position: 'relative',
//           backgroundImage: `url(${heroImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.4)',
//             zIndex: 0,
//           }}
//         />

//         <Box
//           sx={{
//             position: 'relative',
//             backgroundColor: 'rgba(255,255,255,0.95)',
//             p: 4,
//             borderRadius: 3,
//             width: 400,
//             boxShadow: 5,
//             zIndex: 1,
//           }}
//         >
//           <Tabs
//             value={activeTab}
//             onChange={(e, val) => setActiveTab(val)}
//             centered
//             sx={{ mb: 3 }}
//           >
//             <Tab label="Login" value="login" />
//             <Tab label="Register" value="register" />
//           </Tabs>

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               sx={{ mb: 2 }}
//               required
//               error={!!errors.username}
//               helperText={errors.username}
//             />

//            {activeTab === 'register' && (
//   <>
//     <TextField
//       fullWidth
//       label="Email"
//       name="email"
//       value={formData.email}
//       onChange={handleChange}
//       sx={{ mb: 2 }}
//       required
//       error={!!errors.email}
//       helperText={errors.email}
//     />

//     {/* Role Dropdown */}
//     <Box sx={{ mb: 2 }}>
//       <Typography variant="body1" sx={{ mb: 1 }}>Select Role</Typography>
//       <TextField
//         select
//         fullWidth
//         name="role"
//         value={formData.role}
//         onChange={handleChange}
//         SelectProps={{ native: true }}
//       >
//         <option value="MEMBER">Member</option>
//         <option value="OWNER">Owner</option>
//       </TextField>
//     </Box>
//   </>
// )}

//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               sx={{ mb: 2 }}
//               required
//               error={!!errors.password}
//               helperText={errors.password}
//             />

//             {activeTab === 'register' && (
//               <>
//                 <LinearProgress
//                   variant="determinate"
//                   value={passwordStrength}
//                   sx={{ mb: 2 }}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Confirm Password"
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   sx={{ mb: 2 }}
//                   required
//                   error={!!errors.confirmPassword}
//                   helperText={errors.confirmPassword}
//                 />
//               </>
//             )}

//             <Button variant="contained" fullWidth type="submit">
//               {activeTab === 'login' ? 'Login' : 'Register'}
//             </Button>
//           </form>
//         </Box>
//       </Box>

//       <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
//         <Typography variant="body2">
//           © 2025 Club Membership Portal. Built for efficient club management.
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// export default Home;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';
import heroImage from '../assets/hero.jpg';

function Home() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'MEMBER', // Default role
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (activeTab === 'register') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (activeTab === 'login') {
        const res = await axios.post('http://localhost:8989/api/auth/login', {
          username: formData.username,
          password: formData.password,
        });

        const token = res.data;
        localStorage.setItem('token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.roles?.[0];
        console.log('Logged in role:', role);

        // ✅ Role-based navigation
        if (role === 'ADMIN') {
          navigate('/events');
        } else if (role === 'MEMBER') {
          navigate('/eventsList');
        } else if (role === 'OWNER') {
          navigate('/ownerLanding'); // ✅ Redirect OWNER to OwnerLanding
        } else {
          alert('Unknown role');
        }
      } else {
        await axios.post('http://localhost:8989/api/auth/registration', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roles: [formData.role], // Default role
        });

        alert('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert(`${activeTab === 'login' ? 'Login' : 'Registration'} failed!`);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Club Membership Management</Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'rgba(255,255,255,0.95)',
            p: 4,
            borderRadius: 3,
            width: 400,
            boxShadow: 5,
            zIndex: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Register" value="register" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              error={!!errors.username}
              helperText={errors.username}
            />

            {activeTab === 'register' && (
              <>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Role Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>Select Role</Typography>
                  <TextField
                    select
                    fullWidth
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="OWNER">Owner</option>
                  </TextField>
                </Box>
              </>
            )}

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              error={!!errors.password}
              helperText={errors.password}
            />

            {activeTab === 'register' && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </>
            )}

            <Button variant="contained" fullWidth type="submit">
              {activeTab === 'login' ? 'Login' : 'Register'}
            </Button>
          </form>
        </Box>
      </Box>

      <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2">
          © 2025 Club Membership Portal. Built for efficient club management.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;