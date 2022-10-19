import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

import { Countdown } from '../../models/countdown.interface';

let timerInterval: any;
let countdown: Countdown = {
  minutesCounter: '00',
  secondsCounter: '00',
  startDisable: false,
};

const CountdownTimer = (props: any) => {
  const { timerAction, time, style } = props;

  const [countdownTimer, setCountdownTimer] = useState('');
  const [defaultCountdown, setDefaultCountdown] = useState({
    minute: 0,
    seconds: 0,
  });

  useEffect(() => {
    const minutes = Math.floor(+time / 60000).toFixed(0);
    const seconds = ((+time % 60000) / 1000).toFixed(0);

    countdown = {
      ...countdown,
      minutesCounter: minutes.length == 1 ? '0' + minutes : minutes,
      secondsCounter: seconds.length == 1 ? '0' + seconds : seconds,
    };
    setDefaultCountdown({
      minute: Math.ceil(Number(minutes)),
      seconds: Math.ceil(Number(seconds)),
    });
  }, [time]);

  useEffect(() => {
    switch (timerAction) {
      case true:
        onButtonStart();
        break;
      case false:
        onButtonStop();
        break;
      case null:
        onButtonClear();
        break;
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerAction]);

  const onButtonStart = () => {
    timerInterval = setInterval(() => {
      const getCount = number => {
        if (time) {
          return (number - 1).toString();
        } else {
          return (number + 1).toString();
        }
      };

      const { minute, seconds } = defaultCountdown;
      var secondCounter = Number(countdown.secondsCounter),
        num = getCount(!secondCounter ? seconds : secondCounter),
        count = countdown.minutesCounter;

      if (Number(countdown.secondsCounter) == 59) {
        count = getCount(Number(countdown.minutesCounter));
        num = '00';
      }

      countdown = {
        ...countdown,
        minutesCounter:
          +count > -1 ? (count.length == 1 ? '0' + count : count) : '0',
        secondsCounter: +num > -1 ? (num.length == 1 ? '0' + num : num) : '0',
      };
      setCountdownTimer(
        `${countdown.minutesCounter} : ${countdown.secondsCounter}`,
      );
    }, 1000);
    countdown = { ...countdown, startDisable: true };
  };

  const onButtonStop = () => {
    clearInterval(timerInterval);
    countdown = { ...countdown, startDisable: false };
  };

  const onButtonClear = () => {
    countdown = {
      ...countdown,
      minutesCounter: '00',
      secondsCounter: '00',
    };
    setCountdownTimer('');
  };

  return <TextData style={style}>{countdownTimer}</TextData>;
};

export const TextData = styled.Text`
  font-size: 16px;
  color: #fff;
`;

export default CountdownTimer;
