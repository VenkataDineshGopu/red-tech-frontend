import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled, useTheme, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";

const Root = styled("div")(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MenuButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(2),
}));

const NavBar: React.FC = () => {
  const theme = useTheme();

  return (
    <Root theme={theme}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "transparent",
          color: "#000",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <img
            src={`${process.env.PUBLIC_URL}/RT.png`}
            alt="Logo"
            style={{ height: 40, marginRight: theme.spacing(2) }}
          />
          <Title variant="h6" theme={theme}>
            Home
          </Title>
          <Box sx={{ flexGrow: 1 }} />
          <MenuButton edge="end" color="inherit" theme={theme}>
            <SettingsIcon />
          </MenuButton>
          <IconButton edge="end" color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Root>
  );
};

export default NavBar;
