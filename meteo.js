const weatherBtn =
    document.getElementById("weatherBtn");

const weatherResult =
    document.getElementById("weatherResult");

const whatsappWeather =
    document.getElementById(
        "whatsappWeather"
    );


// =====================================================
// VARIABLE POUR STOCKER LA METEO
// =====================================================

let derniereMeteo = null;


// =====================================================
// RECHERCHER LA METEO
// =====================================================

weatherBtn.addEventListener(
    "click",
    async function() {

        const ville =
            document.getElementById(
                "ville"
            ).value.trim();


        if (!ville) {

            alert(
                "Veuillez entrer une ville."
            );

            return;

        }


        weatherResult.innerHTML = `
            <p>⏳ Recherche de la météo...</p>
        `;


        try {

            // ==========================================
            // RECHERCHE DES COORDONNEES
            // ==========================================

            const geoResponse =
                await fetch(
                    "https://geocoding-api.open-meteo.com/v1/search?name=" +
                    encodeURIComponent(ville) +
                    "&count=1&language=fr&format=json"
                );


            const geoData =
                await geoResponse.json();


            if (
                !geoData.results ||
                geoData.results.length === 0
            ) {

                throw new Error(
                    "Ville introuvable."
                );

            }


            const location =
                geoData.results[0];


            const latitude =
                location.latitude;

            const longitude =
                location.longitude;


            // ==========================================
            // API METEO
            // ==========================================

            const weatherResponse =
                await fetch(

                    "https://api.open-meteo.com/v1/forecast" +

                    "?latitude=" +
                    latitude +

                    "&longitude=" +
                    longitude +

                    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +

                    "&timezone=auto"

                );


            const weatherData =
                await weatherResponse.json();


            const current =
                weatherData.current;


            const temperature =
                current.temperature_2m;


            const humidity =
                current.relative_humidity_2m;


            const wind =
                current.wind_speed_10m;


            const code =
                current.weather_code;


            const description =
                getWeatherDescription(code);


            derniereMeteo = {

                ville: location.name,

                temperature:
                    temperature,

                humidity:
                    humidity,

                wind:
                    wind,

                description:
                    description

            };


            // ==========================================
            // AFFICHAGE
            // ==========================================

            weatherResult.innerHTML = `

                <div class="weather-card">

                    <h2>
                        📍 ${location.name}
                    </h2>

                    <p class="temperature">
                        🌡️ ${temperature} °C
                    </p>

                    <p>
                        ☁️ État :
                        <strong>
                            ${description}
                        </strong>
                    </p>

                    <p>
                        💧 Humidité :
                        ${humidity} %
                    </p>

                    <p>
                        💨 Vent :
                        ${wind} km/h
                    </p>

                </div>

            `;


            whatsappWeather.style.display =
                "block";


        }

        catch(error) {

            console.error(error);


            weatherResult.innerHTML = `

                <p class="error">

                    ❌ Impossible de récupérer
                    la météo.

                </p>

            `;

        }

    }
);


// =====================================================
// DESCRIPTION DU CODE METEO
// =====================================================

function getWeatherDescription(code) {

    const descriptions = {

        0: "Ciel dégagé",

        1: "Principalement dégagé",

        2: "Partiellement nuageux",

        3: "Couvert",

        45: "Brouillard",

        48: "Brouillard givrant",

        51: "Bruine légère",

        53: "Bruine modérée",

        55: "Bruine forte",

        61: "Pluie légère",

        63: "Pluie modérée",

        65: "Pluie forte",

        71: "Neige légère",

        73: "Neige modérée",

        75: "Neige forte",

        80: "Averses légères",

        81: "Averses modérées",

        82: "Averses fortes",

        95: "Orage",

        96: "Orage avec grêle",

        99: "Orage avec forte grêle"

    };


    return descriptions[code] ||
        "Conditions inconnues";

}


// =====================================================
// ENVOYER METEO SUR WHATSAPP
// =====================================================

whatsappWeather.addEventListener(
    "click",
    function() {

        if (!derniereMeteo) {

            alert(
                "Recherchez d'abord la météo."
            );

            return;

        }


        const message =

            "🌤️ *MÉTÉO*%0A%0A" +

            "📍 Ville : " +
            derniereMeteo.ville +
            "%0A" +

            "🌡️ Température : " +
            derniereMeteo.temperature +
            " °C%0A" +

            "☁️ État : " +
            derniereMeteo.description +
            "%0A" +

            "💧 Humidité : " +
            derniereMeteo.humidity +
            " %%0A" +

            "💨 Vent : " +
            derniereMeteo.wind +
            " km/h";


        const numero =
            "257XXXXXXXX";


        const url =
            "https://wa.me/" +
            numero +
            "?text=" +
            message;


        window.open(
            url,
            "_blank"
        );

    }
);
