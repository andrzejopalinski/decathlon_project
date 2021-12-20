import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LockOpenOutlined } from "@mui/icons-material";
import { useState } from "react";
import { auth } from "../infrastructure/firebase/firebaseSetup";
import { sendPasswordResetEmail } from "firebase/auth";
import { Copyright } from "../styles/Copyright";

const theme = createTheme();

interface ILoginProps {
  goToLogin: () => void;
}

const ResetPassword: React.FC<ILoginProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const confirmemail = data.get("confirmemail");

    const emailText: string = email == null ? "" : email.toString();

    if (email !== confirmemail) {
      return setError("Passwords do not match");
    }
    console.log("submitting");
    await sendPasswordResetEmail(auth, emailText)
      .then((resp) => {
        console.log(resp);
        props.goToLogin();
      })
      .catch((ex) => console.log(ex));

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOpenOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Password Reset
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmemail"
              label="Confirm Your Email"
              name="confirmemail"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Abort Resetting Password"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
export default ResetPassword;
