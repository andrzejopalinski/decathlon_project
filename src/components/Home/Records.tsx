import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import database, { auth } from "../infrastructure/firebase/firebaseSetup";
import { Copyright } from "../styles/Copyright";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { child, get, getDatabase, onValue, ref, set } from "firebase/database";
import { AppContext, IAppContext } from "../../App";
import moment from "moment";
import { TempleHinduOutlined } from "@mui/icons-material";

const theme = createTheme();

interface IRecordsProps {}
interface IRowType {
  date: string;
  eventName: string;
  eventType: string;
  points: number;
  score: number;
}
const Records: React.FC<IRecordsProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<any[]>([]);
  //const user = useContext(AuthContext);

  const { user } = useContext<IAppContext>(AppContext);

  useEffect(() => {
    fillTable();
  }, []);

  const fillTable = async () => {
    //event.preventDefault();
    const userID = user?.uid;
    const dbRef = ref(database);

    get(child(dbRef, `events/${userID}`))
      .then((resp) => {
        if (resp.exists()) {
          var temp = JSON.parse(JSON.stringify(resp.toJSON()));
          for (let child of Object.keys(temp)) {
            var row: IRowType = temp[child];
            setLoading(true);
            rows.push(
              newData(
                row.date,
                row.eventName,
                row.eventType,
                row.points,
                row.score
              )
            );
            setLoading(false);
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    const newData = (
      date: string,
      eventName: string,
      eventType: string,
      points: number,
      score: number
    ) => {
      return { eventName, eventType, date, score, points };
    };
  };

  const addEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const scoreTemp = data.get("score");
    const score = scoreTemp == null ? -1 : Number(scoreTemp);

    const userID = user?.uid;

    // console.log(score);
    // console.log(
    //   `submitting: score - ${score}, eventName - ${eventName}, eventType - ${eventType} `
    // );
    //console.log(moment().format("DD/MM/YYYY-hh:mm:ss"));
    await set(
      ref(
        database,
        `events/${userID}/${moment().format("DD-MM-YYYY-hh:mm:ss")}`
      ),
      {
        eventName: eventName,
        eventType: eventType,
        date: moment().format("DD.MM.YYYY").toString(),
        score: score,
        points: calculatePoints(eventName, eventType, score),
      }
    );
    setLoading(false);
    fillTable();
  };

  const [eventType, setEventType] = React.useState("");
  const [eventName, setEventName] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value as string);
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    setEventName(event.target.value as string);
  };

  const calculatePoints = (name: string, type: string, score: number) => {
    const events: Array<string> = [
      "100 metres",
      "Long jump",
      "Shot put",
      "High jump",
      "400 metres",
      "110m hurdles",
      "Discus throw",
      "Pole vault",
      "Javelin throw",
      "1500 metres",
    ];

    const A: number[] = new Array(
      25.437,
      0.14354,
      51.39,
      0.8465,
      1.53775,
      5.74352,
      12.91,
      0.2797,
      10.14,
      0.03768
    );
    const B: number[] = new Array(
      18.0,
      220.0,
      1.5,
      75.0,
      82.0,
      28.5,
      4.0,
      100.0,
      7.0,
      480.0
    );
    const C: number[] = new Array(
      1.81,
      1.4,
      1.05,
      1.42,
      1.81,
      1.92,
      1.1,
      1.35,
      1.08,
      1.85
    );
    let i = events.indexOf(name);

    if (type == "Field Event") {
      let x = A[i] * (score - B[i]);
      let p = Math.pow(x, C[i]);
      return p.toPrecision(5);
    } else if (type == "Track Event") {
      let x = A[i] * (B[i] - score);
      let p = Math.pow(x, C[i]);
      return p.toPrecision(5);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <HourglassBottomIcon style={{ width: "50vw", marginTop: "50vh" }} />
          ) : (
            <>
              <Box component="form" onSubmit={addEvent} noValidate>
                <FormControl fullWidth>
                  <InputLabel id="eventType">Event Type</InputLabel>
                  <Select
                    fullWidth
                    labelId="eventType"
                    id="eventType"
                    value={eventType}
                    label="Event Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Track Event"}>Track Event</MenuItem>
                    <MenuItem value={"Field Event"}>Field Event</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: 2 }} fullWidth>
                  <InputLabel id="eventName">Event</InputLabel>
                  <Select
                    fullWidth
                    labelId="eventName"
                    id="eventName"
                    value={eventName}
                    label="Event Name"
                    onChange={handleChange2}
                  >
                    <MenuItem value={"100 metres"}>
                      100 metres (track) [s]
                    </MenuItem>
                    <MenuItem value={"Long jump"}>
                      Long jump (field) [m]
                    </MenuItem>
                    <MenuItem value={"Shot put"}>Shot put (field) [m]</MenuItem>
                    <MenuItem value={"High jump"}>
                      High jump (field) [m]
                    </MenuItem>
                    <MenuItem value={"400 metres"}>
                      400 metres (track) [s]
                    </MenuItem>
                    <MenuItem value={"110m hurdles"}>
                      110m hurdles (track) [s]
                    </MenuItem>
                    <MenuItem value={"Discus throw"}>
                      Discus throw (field) [m]
                    </MenuItem>
                    <MenuItem value={"Pole vault"}>
                      Pole vault (field) [m]
                    </MenuItem>
                    <MenuItem value={"Javelin throw"}>
                      Javelin throw (field) [m]
                    </MenuItem>
                    <MenuItem value={"1500 metres"}>
                      1500 metres (track) [s]
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="score"
                  label="Score"
                  name="score"
                  autoFocus
                />
                <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
                  Add
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell align="right">Event Type</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Score</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows &&
                      rows.map((row) => (
                        <TableRow
                          key={row.eventName}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.eventName}
                          </TableCell>
                          <TableCell align="right">{row.eventType}</TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                          <TableCell align="right">{row.score}</TableCell>
                          <TableCell align="right">{row.points}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
export default Records;
