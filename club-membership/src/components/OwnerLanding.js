// import React from "react";
// import { Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import RegistorClub from "./RegistorClub";

// const OwnerLanding = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // ✅ Clear JWT token
//     navigate("/"); // ✅ Navigate to Home page
//   };

//   return (
//     <Box>
//       {/* Header with Logout */}
//       <AppBar position="static">
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography variant="h6">Owner Dashboard</Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>

//       {/* Register Club Form */}
//       <Box sx={{ p: 3 }}>
//         <RegistorClub onSuccess={() => navigate("/eventsList")} />
//         {/* ✅ After successful club registration, navigate to eventsList */}
//       </Box>
//     </Box>
//   );
// };

// export default OwnerLanding;

// import React, { useEffect, useState } from "react";
// import { Box, Typography, AppBar, Toolbar, Button, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import RegistorClub from "./RegistorClub";
// import OwnerClubList from "./OwnerClubList";
// import { getMyClubs } from "../api/clubApi";

// function OwnerLanding() {
//   var navigate = useNavigate();
//   var [clubs, setClubs] = useState([]);
//   var [loading, setLoading] = useState(false);
//   var [listError, setListError] = useState("");

//   function handleLogout() {
//     localStorage.removeItem("token");
//     navigate("/");
//   }

//   function fetchClubs() {
//     setLoading(true);
//     setListError("");
//     getMyClubs()
//       .then(function (res) {
//         setClubs(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(function (err) {
//         console.error(err);
//         setListError("❌ Unable to load your clubs.");
//       })
//       .finally(function () {
//         setLoading(false);
//       });
//   }

//   useEffect(function () {
//     fetchClubs();
//   }, []);

//   function handleClubCreated() {
//     fetchClubs();
//   }

//   function handleOpenEvents(clubId) {
//     localStorage.setItem("clubId", String(clubId));
    
//   }

//   return React.createElement(Box, null,
//     React.createElement(AppBar, { position: "static" },
//       React.createElement(Toolbar, { sx: { justifyContent: "space-between" } },
//         React.createElement(Typography, { variant: "h6" }, "Owner Dashboard"),
//         React.createElement(Button, { color: "inherit", onClick: handleLogout }, "Logout")
//       )
//     ),
//     React.createElement(Box, { sx: { p: 3 } },
//       React.createElement(RegistorClub, { onSuccess: handleClubCreated }),
//       React.createElement(Divider, { sx: { my: 3 } }),
//       React.createElement(OwnerClubList, {
//         clubs: clubs,
//         loading: loading,
//         error: listError,
//         onOpenEvents: handleOpenEvents
//       })
//     )
//   );
// }

// export default OwnerLanding;
// navigate("/eventsList/" + clubId);



import React, { useEffect, useState } from "react";
import {
  Box, Typography, AppBar, Toolbar, Button, Divider,
  Grid, Card, CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegistorClub from "./RegistorClub";
import OwnerClubList from "./OwnerClubList";
import { getMyClubs } from "../api/clubApi";
import { applyMembership, getActiveMembership } from "../api/membershipApi";

function OwnerLanding() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [membership, setMembership] = useState(null); // { status, type, id, ... } or null
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipMsg, setMembershipMsg] = useState("");

  // Resolve ownerUserId from localStorage or token payload
  const resolveOwnerUserId = () => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Common fields: 'sub' or 'userId' depending on backend JWT
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  };

  const ownerUserId = resolveOwnerUserId();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function fetchClubs() {
    setLoading(true);
    setListError("");
    getMyClubs()
      .then((res) => setClubs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error(err);
        setListError("❌ Unable to load your clubs.");
      })
      .finally(() => setLoading(false));
  }

  function fetchMembership() {
    if (!ownerUserId) return;
    setMembershipLoading(true);
    setMembershipMsg("");
    getActiveMembership(ownerUserId)
      .then((res) => {
        // If no approved membership, API may return null
        const data = res.data || null;
        setMembership(data);
      })
      .catch((err) => {
        console.error("Membership fetch error:", err);
        setMembershipMsg("Could not load membership status.");
        setMembership(null);
      })
      .finally(() => setMembershipLoading(false));
  }

  useEffect(() => {
    fetchMembership();
    fetchClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClubCreated() {
    fetchClubs();
  }

  function handleOpenEvents(clubId) {
    localStorage.setItem("clubId", String(clubId));
    navigate("/eventsList/" + clubId);
  }

  async function onApplyMembership(type) {
    if (!ownerUserId) {
      alert("User not identified. Please login again.");
      return;
    }
    try {
      await applyMembership({ ownerUserId, type });
      setMembershipMsg(`Applied for ${type}. Awaiting admin approval.`);
      fetchMembership(); // Refresh status
    } catch (err) {
      console.error("Apply membership error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to apply membership.";
      setMembershipMsg(msg);
    }
  }

  const isApproved = Boolean(membership && membership.status === "APPROVED");

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Owner Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Membership Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Membership</Typography>

          {/* Status Banner */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                Status: {membershipLoading ? "Loading..." : (membership?.status || "None")}
              </Typography>
              <Typography variant="body2">
                Plan: {membership?.type || "-"}
              </Typography>
              {membershipMsg && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {membershipMsg}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Apply UI if not approved */}
          {!isApproved && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Select a plan to apply. Admin will approve your request. You can create clubs/events after approval.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Silver</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Up to 5 events per month.
                      </Typography>
                      <Button variant="contained" onClick={() => onApplyMembership("SILVER")}>
                        Apply Silver
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Gold</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Up to 20 events per month.
                      </Typography>
                      <Button variant="contained" onClick={() => onApplyMembership("GOLD")}>
                        Apply Gold
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Club Registration (gated by membership approval) */}
        <Box sx={{ opacity: isApproved ? 1 : 0.5 }}>
          {!isApproved && (
            <Typography variant="body2" sx={{ mb: 1 }} color="warning.main">
              Club registration is disabled until your membership is approved.
            </Typography>
          )}
          <RegistorClub onSuccess={handleClubCreated} disabled={!isApproved} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Owner's clubs list */}
        <OwnerClubList
          clubs={clubs}
          loading={loading}
          error={listError}
          onOpenEvents={handleOpenEvents}
        />
      </Box>
    </Box>
  );
}

export default OwnerLanding;
