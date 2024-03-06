// import moment from 'moment'
// import '../css/SummaryCard.css'
// import React, { useMemo } from 'react'
// import convertToFahrenheit from '../helpers/convertToFahrenheit'


// function SummaryCard({ days, isFahrenheitMode, degreeSymbol, day }) {
//   console.log(days, day);
//   const day_icon = `${'https://openweathermap.org/img/wn/' + days.weather[day]["icon"]}@2x.png`

// 	const formattedTemp = useMemo(() => Math.round(isFahrenheitMode ? convertToFahrenheit(days.main.temp) : days.main.temp), [days.main.temp, isFahrenheitMode])

//   return (
//     <li className="summary-items">
//       <div>
//         <p className="">{formattedTemp}{degreeSymbol}</p>
//         <p className="">
//           {days.weather[day].main}
//           <img src={day_icon} alt="" />
//         </p>
//         <p className="">{days.weather[day].description}</p>
//         <p className="">{moment(days.dt_txt).format('hh:mm a')}</p>
//       </div>
//     </li>
//   )
// }

// export default SummaryCard;

import React, { useMemo } from 'react';
import moment from 'moment';
import '../css/SummaryCard.css';
import convertToFahrenheit from '../helpers/convertToFahrenheit';

function SummaryCard({ hourData, isFahrenheitMode, degreeSymbol, t }) {
    const { temp, description, icon, time, main } = hourData;

    const formattedTemp = useMemo(() => {
        return Math.round(isFahrenheitMode ? convertToFahrenheit(temp) : temp);
    }, [temp, isFahrenheitMode]);

    return (
        <li className="summary-items">
            <div>
                <p className="">{formattedTemp}{degreeSymbol}</p>
                <p className="">
                    {main}
                    <img src={icon} alt="" />
                </p>
                <p className="">{t(description)}</p>
                <p className="">{moment(time).format('hh:mm a')}</p>
            </div>
        </li>
    );
}

export default SummaryCard;
