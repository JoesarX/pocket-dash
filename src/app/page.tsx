'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
//import Link from "next/link";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

// Dynamic Image Imports for Next.js
import img1 from "@/resources/images/FotoNosotros (1).jpg";
import img2 from "@/resources/images/FotoNosotros (1).png";
import img3 from "@/resources/images/FotoNosotros (2).jpg";
import img4 from "@/resources/images/FotoNosotros (3).jpg";
import img5 from "@/resources/images/FotoNosotros (4).jpg";
import img6 from "@/resources/images/FotoNosotros (5).jpg";
import img7 from "@/resources/images/FotoNosotros (6).jpg";
import img8 from "@/resources/images/FotoNosotros (7).jpg";
import img9 from "@/resources/images/FotoNosotros (8).jpg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const startDate = new Date("2022-10-01T00:00:00");

// Define types for the API response
type WeatherData = {
  current_weather: {
    temperature: number;
    weathercode: string;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
};


interface WeatherResponse {
  milledgeville: WeatherData | null;
  zaragoza: WeatherData | null;
}

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [quote, setQuote] = useState("");
  const [timeTogether, setTimeTogether] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.api-ninjas.com/v1/quotes?category=love", {
          method: "GET",
          headers: {
            "X-Api-Key": "KUHZUZMas4Cb6fELzaRGgg==ZIshgtdhsL3Qu6KJ", // API key
          },
        });
        const data = await res.json();
        if (data.length > 0) setQuote(data[0].quote);
      } catch (error) {
        console.error("Error fetching the quote:", error);
      }
    };
    fetchQuote();
    const quoteInterval = setInterval(fetchQuote, 86400000);
    return () => clearInterval(quoteInterval);
  }, []);



  useEffect(() => {
    const updateTimeTogether = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeTogether(`${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`);
    };
    updateTimeTogether();
    const timeInterval = setInterval(updateTimeTogether, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=33.0801&longitude=-83.2321&current_weather=true&daily=sunrise,sunset"
        );
        const res2 = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.6488&longitude=-0.8891&current_weather=true&daily=sunrise,sunset"
        );
        const data1 = await res.json();
        const data2 = await res2.json();

        setWeatherData({
          milledgeville: data1,
          zaragoza: data2,
        });
      } catch (error) {
        console.error("Error fetching the weather data:", error);
      }
    };


    fetchWeather();
  }, []);

  const formatTemperature = (tempC: number | undefined) => {
    if (typeof tempC !== "number") return "--";
    const tempF = (tempC * 9) / 5 + 32;
    return `${tempC.toFixed(1)}°C / ${tempF.toFixed(1)}°F`;
  };

  // const formatSunInfo = (daily: { sunrise?: string[], sunset?: string[] } | undefined) => {
  //   if (!daily?.sunrise || !daily?.sunset) return "Unavailable";
  //   return `Sunrise: ${formatTime(daily.sunrise[0])}, Sunset: ${formatTime(daily.sunset[0])}`;
  // };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getWeatherDescription = (weatherCode: string) => {
    const weatherMap: { [key: string]: string } = {
      "0": "Clear sky",
      "1": "Mainly clear",
      "2": "Partly cloudy",
      "3": "Overcast",
      "45": "Foggy",
      "48": "Depositing rime fog",
      "51": "Light drizzle",
      "53": "Moderate drizzle",
      "55": "Dense drizzle",
      "56": "Freezing light drizzle",
      "57": "Freezing dense drizzle",
      "61": "Slight rain",
      "63": "Moderate rain",
      "65": "Heavy rain",
      "66": "Freezing rain",
      "67": "Heavy freezing rain",
      "71": "Slight snow",
      "73": "Moderate snow",
      "75": "Heavy snow",
      "77": "Snow grains",
      "80": "Slight rain showers",
      "81": "Moderate rain showers",
      "82": "Violent rain showers",
      "85": "Slight snow showers",
      "86": "Heavy snow showers",
      // Add more as needed
    };

    return weatherMap[weatherCode] || "Unknown weather";
  };

  const getWeatherIcon = (weatherCode: string) => {
    const iconMap: { [key: string]: string } = {
      "0": "☀️",   // Clear sky
      "1": "🌤️",  // Mainly clear
      "2": "⛅",   // Partly cloudy
      "3": "☁️",  // Overcast
      "45": "🌫️", // Foggy
      "51": "🌦️", // Light drizzle
      "53": "🌧️", // Moderate drizzle
      "55": "🌧️", // Dense drizzle
      "61": "🌧️", // Slight rain
      "63": "🌧️", // Moderate rain
      "65": "🌧️", // Heavy rain
      "71": "🌨️", // Slight snow
      "73": "🌨️", // Moderate snow
      "75": "🌨️", // Heavy snow
      // Add more as needed
    };

    return iconMap[weatherCode] || "❓"; // Unknown weather
  };


  const formatWeatherInfo = (
    weather: WeatherData | null,
    location: string,
    timezone: string
  ) => {
    const currentTime = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    return (
      <div
        className={`p-4 border rounded-lg shadow-md flex flex-col ${
          darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between ">
          <div>
            <h3 className="text-xl font-bold">{location}</h3>
            <p className="text-sm">{currentTime}</p>
          </div>
          <span className="text-3xl">
            {weather?.current_weather
              ? getWeatherIcon(weather.current_weather.weathercode)
              : "🌫️"}
          </span>
        </div>
        <div className="mt-2">
          <p>
            {weather?.current_weather
              ? `Temperature: ${formatTemperature(weather.current_weather.temperature)}`
              : "No data"}
          </p>
          <p>
            {weather?.current_weather
              ? `Weather: ${getWeatherDescription(weather.current_weather.weathercode)}`
              : "No weather data"}
          </p>
          <p>
            {weather?.daily
              ? `Sunrise: ${formatTime(weather.daily.sunrise[0])}`
              : "No sunrise info"}
          </p>
          <p>
            {weather?.daily
              ? `Sunset: ${formatTime(weather.daily.sunset[0])}`
              : "No sunset info"}
          </p>
        </div>
      </div>
    );
  };



  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-pink-50 text-gray-900"} transition-all duration-500 relative`}>
      {/* Decorative Flowers */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[url('/resources/flowers-top-left.png')] bg-cover" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[url('/resources/flowers-bottom-right.png')] bg-cover" />
      </div>

      {/* Toggle Dark/Light Mode Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 bg-pink-400 dark:bg-gray-600 rounded-full text-white shadow-md transition hover:scale-110"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <BsSunFill size={24} /> : <BsMoonFill size={24} />}
      </button>

      {/* Main Content */}
      <div className={`relative rounded-2xl p-6 sm:p-10 shadow-xl w-[90vw] max-w-4xl sm:h-[80vh] border-pink-300 ${darkMode ? " bg-gray-800" : "bg-pink-200 "} border-2  flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 transition-all`}>

        {/* Picture Section */}
        <div className="flex items-center justify-center w-full sm:w-1/3 overflow-hidden rounded-lg">
          <Image
            src={images[currentImage]}
            alt="Couple Image"
            className="object-cover w-full h-full"
            width={300}
            height={300}
            style={{ aspectRatio: '3/4', objectFit: 'cover' }} // Crop Image to fit
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center w-full sm:w-2/3 p-4 text-center">
          <div className="mb-3">
            <h1 className={`text-4xl sm:text-6xl font-bold  ${darkMode ? "text-pink-200 " : "text-pink-600"}`}>Hola Bebepocket!</h1>
            <h2 className="text-lg sm:text-2xl mt-2">Bienvenida al centro de Operaciones Bebisticas</h2>
            <h3 className="mt-2">{`Time Dating: ${timeTogether}` }</h3>
          </div>
          <div className={`italic  max-h-[150px] overflow-y-auto mb-4 ${darkMode ? "text-pink-200 " : "text-pink-600"}`}>
            <h2 className="text-xl sm:text-2xl">{quote}</h2>
          </div>

          <div className="flex justify-between">
            {weatherData?.milledgeville
              ? formatWeatherInfo(weatherData.milledgeville, "Milledgeville, GA", "America/New_York")
              : <div className="p-4 border rounded-lg shadow-md">Loading Milledgeville weather...</div>}
            {weatherData?.zaragoza
              ? formatWeatherInfo(weatherData.zaragoza, "Zaragoza, Spain", "Europe/Madrid")
              : <div className="p-4 border rounded-lg shadow-md">Loading Zaragoza weather...</div>}
          </div>

          {/* Links Section */}
          {/* <div className="flex justify-evenly mt-8 space-x-4 text-lg">
            <Link href="/future-feature1" className="hover:text-pink-600 dark:hover:text-gray-400 transition-all">
              Future Feature 1
            </Link>
            <Link href="/future-feature2" className="hover:text-pink-600 dark:hover:text-gray-400 transition-all">
              Future Feature 2
            </Link>
          </div> */}
        </div>
      </div>


    </div>
  );
};

export default Home;
