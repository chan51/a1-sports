import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

let timerInterval: any;

const TimerText = (props: any) => {
  const { time, startText, endText, setTime } = props;

  const [disabledTime, setDisabledTime] = useState(time);

  useEffect(() => {
    startTimer();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [disabledTime]);

  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      if (disabledTime <= 0) {
        setTime(0);
        clearInterval(timerInterval);
      } else {
        setDisabledTime(disabledTime - 1);
      }
    }, 1000);
  };

  return (
    <TextData>
      {' '}
      {startText}
      {disabledTime}
      {endText}
    </TextData>
  );
};

export const TextData = styled.Text`
  font-size: 12px;
  color: #222f2c;
`;

export default TimerText;
