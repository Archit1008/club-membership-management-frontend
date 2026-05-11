
import React from "react";
import { Box, Grid, Card, CardContent, CardActions, Typography, Button, CircularProgress, Alert } from "@mui/material";

function OwnerClubList(props) {
  const { clubs = [], loading, error, onOpenEvents } = props;

  if (loading) {
    return React.createElement(Box, { sx: { display: "flex", justifyContent: "center", my: 3 } },
      React.createElement(CircularProgress)
    );
  }

  if (error) {
    return React.createElement(Alert, { severity: "error", sx: { mt: 2 } }, error);
  }

  return React.createElement(Box, null,
    React.createElement(Typography, { variant: "h6", sx: { mb: 2 } }, "Your Clubs"),
    (!clubs || clubs.length === 0)
      ? React.createElement(Alert, { severity: "info" }, "You don’t have any clubs yet. Create one above.")
      : React.createElement(Grid, { container: true, spacing: 2 },
        clubs.map(function (club) {
          var id = club.id || club.clubId;
          var name = club.clubName || club.name;
          return React.createElement(Grid, { item: true, xs: 12, md: 6, lg: 4, key: id },
            React.createElement(Card, { sx: { borderRadius: 2 } },
              React.createElement(CardContent, null,
                React.createElement(Typography, { variant: "subtitle2", color: "text.secondary" }, "Club ID: " + id),
                React.createElement(Typography, { variant: "h6" }, name),
                club.location && React.createElement(Typography, { color: "text.secondary" }, club.location)
              ),
              React.createElement(CardActions, null,
                React.createElement(Button, {
                  variant: "contained",
                  onClick: function () { onOpenEvents(id); }
                }, "Go to Events")
              )
            )
          );
        })
      )
  );
}

export default OwnerClubList;
