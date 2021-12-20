import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext, useState } from "react";
import { auth } from "../infrastructure/firebase/firebaseSetup";
import { updateEmail, updatePassword } from "firebase/auth";
import { Copyright } from "../styles/Copyright";
import {
  AuthContext,
  useAuth,
} from "../infrastructure/firebase/context/AuthContext";
import { Context } from "vm";
import { AppContext, IAppContext } from "../../App";

const theme = createTheme();

interface IProfileProps {}

const Profile: React.FC<IProfileProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  //const user = useContext(AuthContext);

  const { user } = useContext<IAppContext>(AppContext);

  const emailUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("newemail");
    const confirmemail = data.get("confirmemail");

    const emailText: string = email == null ? "" : email.toString();

    if (email !== confirmemail) {
      return setError("Emails do not match");
    }
    console.log("submitting");

    if (user != undefined) {
      await updateEmail(user, emailText)
        .then((resp) => {
          console.log(resp);
        })
        .catch((ex) => console.log(ex));
    } else {
      console.log("User Undefined");
    }
    setLoading(false);
    console.log(error);
  };

  const passwordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("newpassword");
    const confirmpassword = data.get("confirmpassword");

    const passwordText: string = password == null ? "" : password.toString();

    if (password !== confirmpassword) {
      return setError("Passwords do not match");
    }
    console.log("submitting");
    if (user !== undefined) {
      await updatePassword(user, passwordText)
        .then((resp) => {
          console.log(resp);
        })
        .catch((ex) => console.log(ex));
    } else {
      console.log("User Undefined");
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={emailUpdate}
            noValidate
            sx={{ mt: 0 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="newemail"
              label="New Email"
              name="newemail"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmemail"
              label="Confirm New Email"
              name="confirmemail"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Update Email
            </Button>
            <Grid container></Grid>
          </Box>
          <Box
            component="form"
            onSubmit={passwordUpdate}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="newpassword"
              label="New Password"
              name="newpassword"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmpassword"
              label="Confirm New Password"
              name="confirmpassword"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Update Password
            </Button>
            <Grid container></Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
export default Profile;
