import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { logout, selectedUser } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const pages = ["Home", "Register"];
const settings = ["Logout"];

const Header = () => {

    /* REDUX TOOLKIT */
    const dispatch = useAppDispatch();
    const { user, jwt, isAuthenticated } = useAppSelector(selectedUser);


  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout(jwt?.access_token? jwt.access_token : ""));
    navigate("/");
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    const id:string = event.currentTarget.id;
    if (id === "Home") {
      navigate("/")
    }
    if (id === "Register") {
      navigate("/register")
    }
    if (id === "Users") {
      navigate("/users")
    }
    if (id === "Subjects") {
      navigate("/subjects")
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    const id:string = event.currentTarget.id;
    if (id === "Logout") {
      logoutHandler();
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "primary",
              textDecoration: "none",
            }}
          >
            SCHOOL APP
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {(user?.role === "admin") && <MenuItem key="Users" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Users</Typography>
                </MenuItem>
                }
              {(user?.role === "admin") && <MenuItem key="Subjects" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Subjects</Typography>
                </MenuItem>
                }


            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                id={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}>
                {page}
              </Button>
            ))}
            {(user?.role === "admin") && <Button key="Users" id="Users" onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>Users</Button>}
            {(user?.role === "admin") && <Button key="Subjects" id="Subjects" onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>Subjects</Button>}
          </Box>

            

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              {user? <Button onClick={handleOpenUserMenu} variant="outlined" sx={{color: 'whitesmoke', backgroundColor: 'green'}}>{user?.firstName}</Button> 
              : <Button component={Link} to="/login" variant="outlined" sx={{color: 'whitesmoke', backgroundColor: 'green'}}>Login</Button>}
              
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu} id={setting}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* {isAuthenticated && <TokenClock />} */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
