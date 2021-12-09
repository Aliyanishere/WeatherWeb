import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function App() {
  const [weather, setweather] = useState(null);

  // const [cityName, setCityName] = useState("karachi")
  const cityName = useRef(null);

  const [location, setLocation] = useState(null);

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    let name = "";

    if (cityName.current.value) {
      name = `q=${cityName.current.value}`;
    }
    else if (location === "fail" || location === null) {
      name = "q=new york";
    }
    else if (location?.longitude) {
      name = `lat=${location?.latitude}&lon=${location?.longitude}`;
    }

    // console.log("name: ", name);
    // console.log("Cityname: ", cityName);
    if (name) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?${name}&appid=363a0329911c1b074081245aae1023c3&units=metric`
        )
        .then((res) => {
          const newWeather = res.data;
          // console.log("newWeather: ", newWeather);
          setweather(newWeather);
        });
    }
  }, [submit, location]);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("position got: ", position.coords.latitude);
            // console.log("position got: ", position.coords.longitude);
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          function (error) {
            setLocation("fail");
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }

    getLocation();
  }, []);

  return (
    <div className="App">
      <br />
      <br />
      <br />

      <h1 style={{ color: "teal" }}>City Name:</h1>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          ref={cityName}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
        />
      </Box>
      <input
        ref={cityName}
        style={{
          border: "1px solid lightseagreen",
          borderRadius: "10px",
          padding: "5px",
        }}
      />

      <button
        style={{
          border: "1px solid lightseagreen",
          marginLeft: "5px",
          background: "transparent",
          borderRadius: "10px",
          padding: "5px",
          color: "green",
        }}
        onClick={() => {
          console.log("name: ", cityName.current.value);

          setSubmit(!submit);
        }}
      >
        Submit
      </button>

      <br />
      <br />
      <br />

      {weather !== null ?
        <>
          <h1 style={{ color: "steelblue" }}>{weather?.name} Weather</h1>
          <h1 style={{ color: "steelblue" }}>{weather?.main?.temp}</h1>
          <h2 style={{ color: "steelblue" }}>
            {weather?.weather[0].description}
          </h2>
          <h2 style={{ color: "steelblue" }}>
            Wind Speed: {weather?.wind?.speed}
          </h2>
        </>
        :
        <h1>Loading...</h1>
      }
    </div>
  );
}
export default App;
