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
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext, useState } from "react";
import { auth } from "../infrastructure/firebase/firebaseSetup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AddCircleOutline } from "@mui/icons-material";
import { Copyright } from "../styles/Copyright";
import { AppContext, IAppContext } from "../../App";

const theme = createTheme();

interface ILoginProps {
  goToHomepage: () => void;
}

const SignUp: React.FC<ILoginProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { toggleUser } = useContext<IAppContext>(AppContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const confirmpassword = data.get("confirmpassword");

    const emailText: string = email == null ? "" : email.toString();
    const passwordText: string = password == null ? "" : password.toString();

    if (password !== confirmpassword) {
      return setError("Passwords do not match");
    }
    console.log("submitting");
    await createUserWithEmailAndPassword(auth, emailText, passwordText)
      .then((resp) => {
        if (resp) {
          console.log(resp);
          toggleUser != undefined && toggleUser(resp.user);
          props.goToHomepage();
        }
      })
      .catch((ex) => console.log(ex));

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <HourglassBottomIcon style={{ width: "50vw", marginTop: "50vh" }} />
      ) : (
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
                <AddCircleOutline />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmpassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmpassword"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 4 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
};
export default SignUp;
