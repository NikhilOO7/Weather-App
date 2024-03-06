import { TbMapSearch, TbSearch, TbVolume, TbMoon, TbSun, TbVolumeOff } from "react-icons/tb";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { useState, useMemo } from "react";
import SingleDayForecast from "./Pages/SingleDayForecast";
import Astronaut from "./asset/not-found.svg";
import SearchPlace from "./asset/search.svg";
import LakeBackground from "./asset/lake-background.jpg";
import BackgroundImage from "./components/BackgroundImage";
import BackgroundColor from "./components/BackgroundColor";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./languages/i18n";

import axios from "axios";

function getDayOfWeek(dateString) {
    // Split the date string into components
    const parts = dateString.split("/");

    // Rearrange the parts to fit the MM/DD/YYYY format
    const formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

    // Create a Date object
    const date = new Date(formattedDate);

    // Get the day of the week as a number (0-6)
    const dayOfWeekNumber = date.getDay();

    // Array of week day names
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Get the name of the week day
    return weekDays[dayOfWeekNumber];
}

function DaySelector({ onDayChange, days, selectedDay }) {
    const navigate = useNavigate();
    const handleChange = (event) => {
        const date = event.target.value;
        onDayChange(date); // Update the state in the parent component
        const day = days.find((_, index) => index === Number(date));

        navigate(`/${getDayOfWeek(day)}`); // Navigate to the selected day's route
    };

    return (
        <select value={selectedDay} onChange={handleChange}>
            <option key={"-1"} value={""}>Select a Day</option>
            {days.map((day, index) => (
                <option key={day} value={index}>
                    {day}
                </option>
            ))}
        </select>
    );
}

function App() {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const { t, i18n } = useTranslation();
    const [noData, setNoData] = useState(t("no-data"));
    const [dayWiseData, setDayWiseData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [city, setCity] = useState(t("unknown-location"));
    const [weatherIcon, setWeatherIcon] = useState(
        `https://openweathermap.org/img/wn/10n@2x.png`
    );
    const [currentLanguage, setLanguage] = useState("en");
    const [loading, setLoading] = useState(false);
    const [day, setDay] = useState(0);
    const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);
    const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);

    const degreeSymbol = useMemo(() => isFahrenheitMode ? '\u00b0F' : '\u00b0C', [isFahrenheitMode]);

    const toggleDark = () => {
        let mode = localStorage.getItem('mode');
        if(mode === null)
            mode = 'light';
        document.body.classList.toggle("dark");
      
        (mode === 'light') ? (mode='dark') : (mode = 'light');
    
        localStorage.setItem('mode', mode);
    };

    const handleLanguage = (event) => {
        changeLanguage(event.target.value);
    };
    
    const changeLanguage = (value, location) => {
        i18n
            .changeLanguage(value)
            .then(() => setLanguage(value) && getWeather(location))
            .catch((err) => console.log(err));
    };

    const toggleFahrenheit = () => {
        setIsFahrenheitMode(!isFahrenheitMode)
    };

    const handleChange = (input) => {
        const { value } = input.target;
        setSearchTerm(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getWeather(searchTerm);
    };

    const getWeather = async (location) => {
        setLoading(true);
        setWeatherData([]);
        let how_to_search =
            typeof location === "string"
                ? `q=${location}`
                : `lat=${location[0]}&lon=${location[1]}`;

        const url = "https://api.openweathermap.org/data/2.5/forecast?";
        axios.post(`${url}${how_to_search}&appid=${API_KEY}&units=metric`)
            .then((response) => {
                const { data } = response;
                var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var hourwiseForecast = [];
                var daywiseWeatherForecast = [];
                for (var i = 0; i <= 32; i += 8) {
                    for (var j = i; j < i + 7; j++) {
                        if(j < i + 6) {
                            hourwiseForecast.push({
                                time: data.list[j].dt_txt.substring(0, 19),
                                temp: data.list[j].main.temp,
                                temp_min: data.list[j].main.temp_min,
                                temp_max: data.list[j].main.temp_max,
                                description: data.list[j].weather[0].description,
                                icon: `${"https://openweathermap.org/img/wn/" + data.list[day].weather[0]["icon"]
                                    }@4x.png`,
                                main: data.list[j].weather[0].main
                            });
                        }
                    }
                    daywiseWeatherForecast.push({
                        day: weekdays[new Date((data.list[i].dt_txt.substring(0, 10))).getDay() + 1],
                        time: data.list[i].dt_txt,
                        temp: data.list[j].main.temp,
                        temp_min: data.list[i].main.temp_min,
                        temp_max: data.list[i].main.temp_max,
                        description: data.list[i].weather[0].description,
                        weatherId: data.list[i].weather[0].id,
                        weather: data.list[i].weather[0],
                        main: data.list[i].main,
                        wind: data.list[i].wind,
                        clouds: data.list[i].clouds,
                        icon: `${"https://openweathermap.org/img/wn/" + data.list[day].weather[0]["icon"]
                            }@4x.png`,
                        hourwiseForecast: hourwiseForecast
                    });
                    hourwiseForecast = [];
                }
                setDayWiseData(daywiseWeatherForecast);
                setWeatherData(data);
                setLoading(false);
                setCity(`${data.city.name}, ${data.city.country}`);
                setWeatherIcon(
                    `${"https://openweathermap.org/img/wn/" + data.list[day].weather[0]["icon"]
                    }@4x.png`
                );
            }).catch((error) => {
                setNoData("Location Not Found");
                setLoading(false);
            })
    };

    const myIP = (location) => {
        const { latitude, longitude } = location.coords;
        getWeather([latitude, longitude]);
    };

    // load current location weather info on load
    window.addEventListener("load", function () {
        navigator.geolocation.getCurrentPosition(myIP)
    })

    const getNextFiveDays = () => {
        const days = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date.toLocaleDateString());
        }
        return days;
    };

    const days = getNextFiveDays();

    const handleDaysChange = (value) => {
        setSelectedDay(value);
    };

    const checkMode = () => {
        const mode = localStorage.getItem('mode');
        if(mode !== null && mode === 'dark'){
            document.getElementById('checkbox').checked = true;
            document.body.classList.toggle("dark");
        }
    }

    return (
        <Router>
            <div
                className="container"
                onLoad={checkMode}
            >
                <div
                    className="blur"
                    style={{
                        background: `${dayWiseData[selectedDay]?.weatherId ? BackgroundColor(dayWiseData[selectedDay]?.weatherId) : "#a6ddf0"
                            }`,
                        top: "-10%",
                        right: "0",
                    }}
                ></div>
                <div
                    className="blur"
                    style={{
                        background: `${dayWiseData[selectedDay]?.weatherId ? BackgroundColor(dayWiseData[selectedDay]?.weatherId) : "#a6ddf0"
                            }`,
                        top: "36%",
                        left: "-6rem",
                    }}
                ></div>
                <div className="content">
                    <div
                        className="form-container"
                        style={{
                            backgroundImage: `url(${dayWiseData[selectedDay]?.weatherId ? BackgroundImage(dayWiseData[selectedDay]?.weatherId) : LakeBackground
                                })`,
                        }}
                    >
                        <div className="name">
                            <div className="logo">
                                Weather App<hr></hr>
                            </div>
                            <div className="toggle-container">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    id="checkbox"
                                    onChange={toggleDark}
                                />
                                <label htmlFor="checkbox" className="label">
                                    <TbMoon
                                        style={{
                                            color: "#a6ddf0",
                                        }}
                                    />
                                    <TbSun
                                        style={{
                                            color: "#f5c32c",
                                        }}
                                    />
                                    <div className="ball" />
                                </label>
                            </div>
                            <div className="city">
                                <TbMapSearch />
                                <p>{city}</p>
                            </div>
                        </div>
                        <div className="search">
                            <h2>{t("title")}</h2>
                            <hr />
                            <form className="search-bar" noValidate onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="Explore cities weather"
                                    onChange={handleChange}
                                    required
                                />
                                <DaySelector selectedDay={selectedDay} onDayChange={handleDaysChange} days={days} />
                                <button className="s-icon">
                                    <TbSearch
                                        onClick={() => {
                                            navigator.geolocation.getCurrentPosition(myIP);
                                        }}
                                    />
                                </button>
                            </form>
                            <button
                                className="s-icon sound-toggler"
                                onClick={() => setBackgroundSoundEnabled((prev) => !prev)}
                            >
                                {backgroundSoundEnabled ? <TbVolume /> : <TbVolumeOff />}
                            </button>
                        </div>
                    </div>
                    <div className="info-container">
                        <div className="info-inner-container">
                            <select
                                className="selected-languange"
                                value={currentLanguage}
                                onChange={(e) => handleLanguage(e)}
                            >
                                <option selected value="en">
                                    {t("languages.en")}
                                </option>
                                <option value="es">{t("languages.es")}</option>
                                <option value="fr">{t("languages.fr")}</option>
                                <option value="id">{t("languages.id")}</option>
                            </select>
                            <div className="toggle-container">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    id="fahrenheit-checkbox"
                                    onChange={toggleFahrenheit}
                                />
                                <label htmlFor="fahrenheit-checkbox" className="label">
                                    <RiFahrenheitFill />
                                    <RiCelsiusFill />
                                    <div className="ball" />
                                </label>
                            </div>
                        </div>
                        {loading ? (
                            <div className="loader"></div>
                        ) : (
                            <span>
                                {weatherData.length === 0 ? (
                                    <div className="nodata">
                                        <h1>{noData}</h1>
                                        {noData === "Location Not Found" ? (
                                            <>
                                                <img
                                                    src={Astronaut}
                                                    alt="an astronaut lost in the space"
                                                />
                                                <p>Oh oh! We've lost in the space finding that place.</p>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src={SearchPlace}
                                                    alt="a person thinking about what place to find"
                                                />
                                                <p style={{ padding: "20px" }}>
                                                    Don't worry, if you don't know what search, try with:
                                                    Canada, New York or maybe Tatooine.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Routes>
                                        <Route path="/" exact element={
                                            <SingleDayForecast
                                                city={city}
                                                weatherIcon={weatherIcon}
                                                weatherData={dayWiseData[selectedDay]}
                                                isFahrenheitMode={isFahrenheitMode}
                                                degreeSymbol={degreeSymbol}
                                                t={t}
                                                soundEnabled={backgroundSoundEnabled?backgroundSoundEnabled:null}
                                            />
                                        } />
                                        <Route path="/:day" exact element={
                                            <SingleDayForecast
                                                city={city}
                                                weatherIcon={weatherIcon}
                                                weatherData={dayWiseData[selectedDay]}
                                                isFahrenheitMode={isFahrenheitMode}
                                                degreeSymbol={degreeSymbol}
                                                t={t}
                                                soundEnabled={backgroundSoundEnabled?backgroundSoundEnabled:null}
                                            />
                                        } />
                                    </Routes>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;