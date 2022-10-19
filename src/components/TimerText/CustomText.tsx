import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CustomText = function(props) {
  return (
    <Text {...props} style={[styles.style, props.style]}>
      {props.children}
      {`  `}
    </Text>
  );
};

const styles = StyleSheet.create({
  style: {
    color: '#0b0b0b',
  },
});

CustomText.propTypes = {
  style: Text.propTypes.style,
};

export default CustomText;
