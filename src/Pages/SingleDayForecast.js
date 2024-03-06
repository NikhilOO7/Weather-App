// import React from 'react';
// import DetailsCard from "../components/DetailsCard";
// import SummaryCard from "../components/SummaryCard";

// function SingleDayForecast({ city, weatherIcon, weatherData, isFahrenheitMode, degreeSymbol, day }) {

//     return (
//         <>
//             <h1 className="centerTextOnMobile">{"today"}</h1>
//             <DetailsCard
//                 weather_icon={weatherIcon?weatherIcon:null}
//                 data={weatherData?weatherData:null}
//                 isFahrenheitMode={isFahrenheitMode?isFahrenheitMode:null}
//                 degreeSymbol={degreeSymbol?degreeSymbol:null}
//                 day={day ? day : 0}
//             />
//             <h1 className="title centerTextOnMobile">
//                 {city}
//             </h1>
//             <ul className="summary">
//                 {weatherData.filter((_, keys) => keys === day).map((days, index) => (
//                 <SummaryCard key={index} days={days?days:null} isFahrenheitMode={isFahrenheitMode?isFahrenheitMode:null} degreeSymbol={degreeSymbol?degreeSymbol:null} day={day ? day : 0}/>
//                 ))}
//             </ul>
//         </>
//     )
// }

// export default SingleDayForecast

import React from 'react';
import DetailsCard from "../components/DetailsCard";
import SummaryCard from "../components/SummaryCard";

function SingleDayForecast({ city, weatherIcon, weatherData, isFahrenheitMode, degreeSymbol, t, soundEnabled }) {
    return (
        <>
            <h1 className="centerTextOnMobile">{t(`Weather Forecast for ${city}`)}</h1>
            <DetailsCard
                weather_icon={weatherIcon}
                data={weatherData}
                isFahrenheitMode={isFahrenheitMode}
                degreeSymbol={degreeSymbol}
                t={t}
                soundEnabled={soundEnabled}
            />
            <h1 className="title centerTextOnMobile">
                {t("Hourly Forecast")}
            </h1>
            <ul className="summary">
                {weatherData.hourwiseForecast.map((hourData, index) => (
                    <SummaryCard
                        key={index}
                        hourData={hourData}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                        t={t}
                    />
                ))}
            </ul>
        </>
    );
}

export default SingleDayForecast;