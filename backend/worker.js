// Weatherly backend - Cloudflare
export default {
  async fetch(request) {

    const url = new URL(request.url);

    // Home / API test
    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Weatherly Backend is working!"
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // Weather API
    if (url.pathname === "/api/weather") {

      const city = url.searchParams.get("city");

      if (!city) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "City name is required."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      try {

        // Find city coordinates
        const geoURL =
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse =
          await fetch(geoURL);

        const geoData =
          await geoResponse.json();

        if (
          !geoData.results ||
          geoData.results.length === 0
        ) {

          return new Response(
            JSON.stringify({
              success: false,
              message: `City "${city}" was not found.`
            }),
            {
              status: 404,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        const location =
          geoData.results[0];


        // Get weather
        const weatherURL =
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=sunrise,sunset&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

        const weatherResponse =
          await fetch(weatherURL);

        const weatherData =
          await weatherResponse.json();


        return new Response(
          JSON.stringify({
            success: true,
            location: location,
            weather: weatherData
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );

      } catch (error) {

        return new Response(
          JSON.stringify({
            success: false,
            message: "Unable to fetch weather data."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }


    // Route not found
    return new Response(
      JSON.stringify({
        success: false,
        message: "API route not found."
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
