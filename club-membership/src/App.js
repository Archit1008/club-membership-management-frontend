// // src/App.js
// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EventList from './components/EventList';
// import UpdateEventForm from './components/UpdateEventForm';
// import Register from './Pages/Register';
// import Login from './Pages/Login';
// import Home from './components/Home';
// import EventForm from './components/EventForm';
// import ProtectedRoute from './Pages/ProtectedRoute';
// import OwnerLanding from './components/OwnerLanding';
// function App() {
//   const [refreshKey, setRefreshKey] = React.useState(0);

//   const refreshEvents = () => {
//     setRefreshKey(oldKey => oldKey + 1);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <h1>Club Membership Management</h1>

//        <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/register" element={<Register />} />
//   <Route path="/login" element={<Login />} />
//   <Route path="/ownerLanding" element={<OwnerLanding />} />

//   {/* ADMIN-only route */}
//   <Route
//     path="/events"
//     element={
//       <ProtectedRoute allowedRoles={['ADMIN']}>
//         <EventList key={refreshKey} />
//       </ProtectedRoute>
//     }
//   />

//   {/* MEMBER & OWNER route */}
//   <Route
//     path="/eventsList"
//     element={
//       <ProtectedRoute allowedRoles={['MEMBER', 'OWNER']}>
//         <EventList key={refreshKey} />
//       </ProtectedRoute>
//     }
//   />
// </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EventList from './components/EventList';
import UpdateEventForm from './components/UpdateEventForm';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './components/Home';
import EventForm from './components/EventForm';
import ProtectedRoute from './Pages/ProtectedRoute';
import OwnerLanding from './components/OwnerLanding';

function App() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refreshEvents = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <Router>
      <div className="App">
        <h1>Club Membership Management</h1>

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* OWNER dashboard (optional protection) */}
          <Route
            path="/ownerLanding"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerLanding />
              </ProtectedRoute>
            }
          />

          {/* ADMIN-only route: full events view */}
          <Route
            path="/events"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EventList key={refreshKey} />
              </ProtectedRoute>
            }
          />

          {/* MEMBER & OWNER routes */}
          {/* 1) Fallback: no clubId in URL; your EventList can read localStorage.clubId */}
          <Route
            path="/eventsList"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'OWNER']}>
                <EventList key={refreshKey} />
              </ProtectedRoute>
            }
          />
          {/* 2) Preferred: with clubId param (navigated from OwnerClubList) */}
          <Route
            path="/eventsList/:clubId"
            element={
              <ProtectedRoute allowedRoles={['MEMBER', 'OWNER']}>
                <EventList key={refreshKey} />
              </ProtectedRoute>
            }
          />

          {/* (Optional) Update Event Form route examples */}
          <Route
            path="/events/update"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UpdateEventForm onUpdated={refreshEvents} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
                <EventForm onCreated={refreshEvents} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
