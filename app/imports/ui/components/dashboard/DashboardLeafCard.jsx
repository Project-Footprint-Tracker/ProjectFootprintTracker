import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider } from 'semantic-ui-react';
import { poundsOfCePerTree } from '../../../api/utilities/constants';

const DashboardLeafCard = ({ ceSavedTotal }) => {
  const [percent, setPercent] = useState(0);
  const [intervalID, setIntervalID] = useState();

  let startPercentage = 0;
  const endPercentage = ((ceSavedTotal % poundsOfCePerTree) / poundsOfCePerTree) * 100;

  const fill = () => {
    if (startPercentage.toFixed(1) === endPercentage.toFixed(1)) {
      clearInterval(intervalID);
    } else if ((endPercentage - startPercentage) <= 1) {
      setPercent((startPercentage += 0.1));
    } else {
      setPercent(startPercentage += 1);
    }
  };

  useEffect(() => {
    const id = setInterval(() => fill(), 60);
    setIntervalID(id);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className={'leaf-card'} fluid>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        style={{ display: 'none' }}>
        <use xlinkHref={'http://www.w3.org/1999/xlink'}/>
        <symbol id="wave">
          <path
            d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"/>
          <path
            d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"/>
          <path
            d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"/>
          <path
            d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"/>
        </symbol>
      </svg>
      <Card.Content textAlign='center'>
        <Card.Description>
          <div style={{ fontSize: 14 }}>
            You are {percent.toFixed(1)}% to saving another 48 lbs of CO2.
          </div>
          <div className="leaf-box">
            <div className="leaf-percent">
              <div className="percentNum">{percent.toFixed(1)}</div>
              <div className="percentB">%</div>
            </div>
            <div style={{ transform: `translateX(0px) translateY(${100 - percent}%)` }} className="leaf-water">
              <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_back">
                <use href="#wave"/>
              </svg>
              <svg viewBox="0 0 560 20" className="leaf-water_wave leaf-water_wave_front">
                <use href="#wave"/>
              </svg>
            </div>
          </div>
          <Divider hidden/>
          <div style={{ fontSize: 14 }}>
            It would have taken one year for a tree to absorb about 48 pounds of CO2.
          </div>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

DashboardLeafCard.propTypes = {
  ceSavedTotal: PropTypes.number.isRequired,
};

export default DashboardLeafCard;
