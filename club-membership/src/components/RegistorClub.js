// import React, { useState } from 'react';
// import { registerClub } from '../api/clubApi';
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Alert
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const RegistorClub = ({ onSuccess }) => {
//   const [clubId, setClubId] = useState('');      // ✅ NEW: clubId field
//   const [clubName, setClubName] = useState('');
//   const [location, setLocation] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Optional: basic validation
//     if (!clubName || !location) {
//       setError('❌ Please fill all required fields.');
//       setMessage('');
//       return;
//     }

//     // If your backend allows client-provided IDs, include it; otherwise omit it
//     const payload = clubId
//       ? { id: clubId, clubName, location }
//       : { clubName, location };

//     try {
//       const res = await registerClub(payload);

//       // Prefer backend-generated ID if present
//       const createdId = res?.data?.id || res?.data?.clubId || clubId;

//       if (createdId) {
//         localStorage.setItem('clubId', createdId); // ✅ Save in localStorage
//       }

//       setMessage('✅ Club created successfully!');
//       setError('');
//       setClubId('');
//       setClubName('');
//       setLocation('');
//       if (onSuccess) onSuccess();
//       navigate('/eventsList'); // ✅ Navigate to events page after success
//     } catch (err) {
//       // Surface server-provided message if available (e.g., 409 "Club already exists")
//       const serverMsg =
//         err?.response?.data?.message ||
//         (typeof err?.response?.data === 'string' ? err.response.data : null) ||
//         '❌ Error creating club. Please try again.';
//       setError(serverMsg);
//       setMessage('');
//       console.error(err);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
//       <Card sx={{ width: 400, boxShadow: 3, borderRadius: 3 }}>
//         <CardContent>
//           <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
//             Register Your Club
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             {/* ✅ Optional: Let owner set a Club ID (or leave blank to let backend generate) */}
//             <TextField
//               fullWidth
//               label="Club ID (optional)"
//               value={clubId}
//               onChange={(e) => setClubId(e.target.value)}
//               sx={{ mb: 2 }}
//               helperText="Leave blank to auto-generate. If provided, must be unique."
//             />

//             <TextField
//               fullWidth
//               label="Club Name"
//               value={clubName}
//               onChange={(e) => setClubName(e.target.value)}
//               sx={{ mb: 2 }}
//               required
//             />
//             <TextField
//               fullWidth
//               label="Location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               sx={{ mb: 2 }}
//               required
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               type="submit"
//               sx={{ py: 1.2 }}
//             >
//               Create Club
//             </Button>
//           </form>

//           {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
//           {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default RegistorClub;

import React, { useState } from 'react';
import { registerClub } from '../api/clubApi';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const RegistorClub = ({ onSuccess }) => {
  const [clubId, setClubId] = useState('');      // Owner-chosen clubId (optional)
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!clubName || !location) {
      setError('❌ Please fill all required fields.');
      setMessage('');
      return;
    }

    // If your backend allows client-provided IDs, include it; otherwise omit it
    const payload = clubId
      ? { id: clubId, clubName, location }
      : { clubName, location };

    try {
      const res = await registerClub(payload);

      // Prefer backend-generated ID if present; fallback to user-provided
      const createdId = res?.data?.id || res?.data?.clubId || clubId;

      // ✅ Save the clubId for later (Events page can read localStorage.clubId)
      if (createdId) {
        localStorage.setItem('clubId', String(createdId));
      }

      setMessage('✅ Club created successfully!');
      setError('');

      // Clear only text fields (keep clubId if you want the user to see it)
      // setClubId(''); // optional — uncomment if you want to clear the entered clubId
      setClubName('');
      setLocation('');

      // ✅ Let parent refresh the club list; parent will handle navigation on club click
      if (onSuccess) onSuccess();

      // ❌ Do not navigate here — navigation should happen when owner clicks a club card
      // navigate(`/eventsList/${createdId}`); // <-- Removed by requirement

    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        '❌ Error creating club. Please try again.';
      setError(serverMsg);
      setMessage('');
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ width: 400, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
            Register Your Club
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* ✅ Optional: Let owner set a Club ID (or leave blank to let backend generate) */}
            <TextField
              fullWidth
              label="Club ID (optional)"
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Leave blank to auto-generate. If provided, must be unique."
            />

            <TextField
              fullWidth
              label="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ py: 1.2 }}
            >
              Create Club
            </Button>
          </form>

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegistorClub;
