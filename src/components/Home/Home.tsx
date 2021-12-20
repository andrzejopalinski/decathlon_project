import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Badge, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AccountBox, BarChart, DataArray, Logout } from "@mui/icons-material";
import { AppBar } from "../styles/Appbar";
import { Drawer } from "../styles/Drawer";
import Profile from "./Profile";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../infrastructure/firebase/firebaseSetup";
import Records from "./Records";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface IHomeProps {
  goToLogin: () => void;
}

const mdTheme = createTheme();

const Home: React.FC<IHomeProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const logOut = async (event: React.FormEvent<HTMLButtonElement>) => {
    setLoading(true);
    event.preventDefault();

    console.log("submitting");
    await signOut(auth)
      .then((resp) => {
        console.log(resp);
        props.goToLogin();
      })
      .catch((ex) => console.log(ex));

    setLoading(false);
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const [value, setValue] = React.useState<number>(1);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Decathlon
            </Typography>
            <IconButton color="inherit" onClick={logOut}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List>
            <ListItem button onClick={() => setValue(0)}>
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => setValue(1)}>
              <ListItemIcon>
                <DataArray />
              </ListItemIcon>
              <ListItemText primary="Data" />
            </ListItem>
            <ListItem button onClick={() => setValue(2)}>
              <ListItemIcon>
                <BarChart />
              </ListItemIcon>
              <ListItemText primary="Charts" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <TabPanel value={value} index={0}>
            <Profile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Records />
          </TabPanel>
          <TabPanel value={value} index={2}>
            Chart *Coming Soon xD*
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
