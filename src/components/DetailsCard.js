// import React, { useMemo } from 'react';
// import moment from 'moment';
// import '../css/DetailsCard.css';
// import convertToFahrenheit from '../helpers/convertToFahrenheit'

// function DetailsCard({ weather_icon, data, soundEnabled, isFahrenheitMode, degreeSymbol, day}) {
// 	const { clouds, main, weather } = data.list[day];

// 	const formattedData = useMemo(() => {
// 		return {
// 			temp: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp) : main.temp),
// 			feels_like: Math.round(isFahrenheitMode ? convertToFahrenheit(main.feels_like) : main.feels_like),
// 			temp_min: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp_min) : main.temp_min),
// 			temp_max: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp_max) : main.temp_max),
// 		};
// 	}, [isFahrenheitMode, main.feels_like, main.temp, main.temp_max, main.temp_min])

// 	return (
// 		<div className='details'>
// 			<div className='clouds'>
// 				<p className='celsius'>{formattedData.temp}{degreeSymbol}</p>
// 				<div className='cloud-icon'>
// 					{weather[day].main?weather[day].main:null}
// 					<img src={weather_icon} className='' alt='' />
// 				</div>
// 				<p className='des'>
// 					<span>{weather[day].description}</span>
// 				</p>
// 				<p className='time'>
// 					<span>{moment().format('dddd MMM YYYY')}</span>
// 				</p>
// 			</div>
// 			<div className='more-info'>
// 				<p className=''>
// 					{'realFell'}: <span>{formattedData.feels_like}{degreeSymbol}</span>
// 				</p>
// 				<p className=''>
// 					{'humidity'}: <span>{main.humidity}%</span>
// 				</p>
// 				<p className=''>
// 					{'cover'}: <span>{clouds.all}</span>
// 				</p>
// 				<p className=''>
// 					{'min-temp'}: <span>{formattedData.temp_min}{degreeSymbol}</span>
// 				</p>
// 				<p className=''>
// 					{'max-temp'}: <span>{formattedData.temp_max}{degreeSymbol}</span>
// 				</p>
// 			</div>
// 		</div>
// 	);
// }

// export default DetailsCard;

import React, { useMemo } from 'react';
import moment from 'moment';
import '../css/DetailsCard.css';
import BackgroundSound from './BackgroundSound';
import { useTranslation } from 'react-i18next';
import convertToFahrenheit from '../helpers/convertToFahrenheit';

function DetailsCard({ weather_icon, data, isFahrenheitMode, degreeSymbol, t, soundEnabled }) {
    const { clouds, main, weather } = data;

    const formattedData = useMemo(() => {
        return {
            temp: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp) : main.temp),
            feels_like: Math.round(isFahrenheitMode ? convertToFahrenheit(main.feels_like) : main.feels_like),
            temp_min: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp_min) : main.temp_min),
            temp_max: Math.round(isFahrenheitMode ? convertToFahrenheit(main.temp_max) : main.temp_max),
            humidity: main.humidity,
            cloudiness: clouds.all,
        };
    }, [isFahrenheitMode, main]);

    return (
        <div className='details'>
            <div className='weather-icon'>
                <img src={weather_icon} alt='Weather icon' />
            </div>
            <div className='weather-info'>
                <h2>{weather.main}</h2>
                <p>{weather.description}</p>
                <p>{t(`Temp: ${formattedData.temp}${degreeSymbol}`)}</p>
                <p>{t(`Feels like: ${formattedData.feels_like}${degreeSymbol}`)}</p>
                <p>{t(`Min Temp: ${formattedData.temp_min}${degreeSymbol}`)}</p>
                <p>{t(`Max Temp: ${formattedData.temp_max}${degreeSymbol}`)}</p>
                <p>{t(`Humidity: ${formattedData.humidity}%`)}</p>
                <p>{t(`Cloudiness: ${formattedData.cloudiness}%`)}</p>
                <p>{t(`Time: ${moment().format('dddd, MMMM Do YYYY')}`)}</p>
            </div>
            <BackgroundSound weather={weather} soundEnabled={soundEnabled} />
        </div>
    );
}

export default DetailsCard;
