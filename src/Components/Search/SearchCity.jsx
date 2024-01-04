import { useInView, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SearchBlack } from "../../assets";

const SearchCity = () => {
  const containerRef = useRef();
  const inView = useInView(containerRef, { amount: 0.5, once: true });
  //watch the input change
  const inputLocationInitialValue = {
    input_city: window.localStorage.getItem("previousCity") || "",
  };
  const [locationValue, setLocationValue] = useState(inputLocationInitialValue);

  const handleChange = (event) => {
    const { name, value } = event.target;
    //prevLocation represent the current state.
    //used the spread operator (...) create copy of the current state without modefying the current state
    //it create a new copy with the same values
    //the [name]:value is the part that is being updated. the [name] is use to
    //dyamically represent the property name(name attributes in html)
    //it means that the property with this name will update the its value with the value variable
    setLocationValue((prevLocationValue) => ({
      ...prevLocationValue,
      [name]: value,
    }));
  };

  //fetch data from the api
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [isDay, setIsDay] = useState("");
  const [changeBg, setChangeBg] = useState(false);
  const [isLoading, setIsLoading] = useState("false");
  const api_key = import.meta.env.VITE_REACT_APP_API_KEY;

  const fetchWeatherData = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
      const response = await fetch(url);
      const weather = await response.json();
      setWeatherData(weather);

      const sunrise = weather.sys.sunrise;
      const sunset = weather.sys.sunset;
      const timestamp = weather.dt * 1000;
      const dateObject = new Date(timestamp);
      const currentTime = dateObject.getTime();

      if (currentTime > sunrise * 1000 && currentTime < sunset * 1000) {
        setIsDay("day time | ");
        setChangeBg(true);
      } else {
        setIsDay("night time | ");
        setChangeBg(false);
      }

      setLocation(weather.name);
      setWind(weather.wind.speed + "K/M wind");
      setTemperature(weather.main.temp + "°C");
      setHumidity(weather.main.humidity + "% humidity");
      setCondition(weather.weather[0].description);
      setDate(formatDate(weather.dt * 1000, weather.timezone));
      setFeelsLike(weather.main.feels_like + "°C");
      setCountry(weather.sys.country);

      return weather;
    } catch (error) {
      setError("City not found! Please enter a valid name of a city");
    } finally {
      setIsLoading(false);
    }
  };

  ///format date
  const formatDate = (timestamp, timezone) => {
    const dateObject = new Date(timestamp);

    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = dateObject.toLocaleDateString(timezone, options);
    return formattedDate;
  };

  //handle search
  const [location, setLocation] = useState("");
  const [wind, setWind] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [condition, setCondition] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");

  const inputRef = useRef(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      window.localStorage.setItem("previousCity", locationValue.input_city);
      const weather = await fetchWeatherData(inputRef.current.value);
      setLocation(weather.name);
      setWind(weather.wind.speed + "K/M wind");
      setTemperature(weather.main.temp + "°C");
      setHumidity(weather.main.humidity + "% Humidity");
      setCondition(weather.weather[0].description);
      setDate(formatDate(weather.dt * 1000, weather.timezone));
      setFeelsLike(weather.main.feels_like + "°C");
      setCountry(weather.sys.country);
      setError("");
    } catch (error) {
      setError("Error: Please enter a valid name of a city!");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };

  useEffect(() => {
    const previousCity = window.localStorage.getItem("previousCity");
    if (previousCity) {
      // Fetch weather data for the previous city when the component mounts
      fetchWeatherData(previousCity);
    }
  }, []);

  return (
    <div
      className={`${
        changeBg ? "morning_bg" : "night_bg"
      } transition text-lg relative text-white tracking-widest py-14 px-5 grid grid-rows-[100px_minmax(200px,_1fr)100px] overflow-hidden h-[100dvh] | md:px-20 | xl:px-40 xl:h-[100dvh] xl:py-10 xl:grid-rows-[150px_minmax(200px,_1fr)50px]`}
    >
      <div className="w-full h-auto  py-3 flex justify-center row-span-1 xl:text-xl z-10">
        <div className="w-full flex flex-col text-center items-center">
          <div className="w-full h-10 bg-white flex items-center transition px-5 py-2 gap-2 rounded-full shadow-2xl | md:w-[60%] | xl:w-[40%]">
            <button className="w-8 h-8" onClick={handleSearch}>
              <img src={SearchBlack} alt="magnifying glass image" />
            </button>
            <input
              ref={inputRef}
              value={locationValue.input_city}
              type="text"
              name="input_city"
              id="input_city"
              className="input_location text-sm bg-transparent text-gray-500 border-l-2 border-gray-500 outline-none w-full h-full px-2"
              placeholder="Search location..."
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
      {weatherData && (
        <>
          <div className=" row-span-2 " ref={containerRef}>
            <div className="block space-y-10 transition | md:h-20 md:flex md:justify-between md:items-center md:space-y-0 | xl:h-20 xl:flex xl:justify-between xl:items-center xl:space-y-0 ">
              <motion.div
                style={{
                  opacity: inView ? 1 : 0,
                  scale: inView ? 1 : 0,
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
                }}
                className="uppercase"
              >
                <motion.div className="relative">
                  <h1 className="location  pr-8 text-5xl font-semibold transition | md:text-7xl | xl:w-full xl:text-8xl">
                    {location}
                    <p className="absolute top-0 right-0 text-lg rounded-full h-8 w-8 grid place-content-center">
                      {country}
                    </p>
                  </h1>
                </motion.div>
                <p className="date transition">{date}</p>
              </motion.div>
              <motion.div
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateX(200px)",
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) .5s",
                }}
                className="uppercase transition text-3xl  font-thin   | xl:text-4xl "
              >
                <span className="day" id="day">
                  {isDay}
                </span>
                <span> </span>
                <span className="condition ">{condition}</span>
              </motion.div>
            </div>
          </div>
          <div className="uppercase space-y-10">
            <motion.div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateX(-500px)",
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.6s",
              }}
              className=""
            >
              <motion.div className="temperature text-8xl transition | xl:text-9xl">
                {temperature}
              </motion.div>
              <p className="feels_like">{feelsLike}</p>
            </motion.div>
            <div className="flex tracking-widest font-thin">
              <motion.div
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(500px)",
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) .7s",
                }}
                className="flex flex-col pr-10 items-center border-r"
              >
                <div className=""></div>
                <p className="humidity_percentage">{humidity}</p>
              </motion.div>
              <motion.div
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(500px)",
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.8s",
                }}
                className="flex flex-col px-10 items-center"
              >
                <div></div>
                <p className="wind_rate">{wind}</p>
              </motion.div>
            </div>
          </div>
        </>
      )}
      {/* <div
        className={`${
          isLoading
            ? "absolute inset-0 w-full h-screen flex bg-black/25 z-50 justify-center items-center"
            : "hidden"
        }`}
      >
        <div className={`${isLoading ? "flex" : "hidden"} loader`}></div>
      </div> */}
      <div className=" bg-gradient-to-t from-[#0c0c1d] to-[#111134]/40 h-full w-full absolute inset-0 -z-[1]"></div>
    </div>
  );
};

export default SearchCity;
