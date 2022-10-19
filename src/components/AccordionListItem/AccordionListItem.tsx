import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

export const AccordionListItem: React.FC<any> = ({
  index,
  title,
  children,
  openIndex,
  setOpenIndex,
}: any) => {
  const animatedController = useRef(new Animated.Value(0)).current;
  const [bodySectionHeight, setBodySectionHeight] = useState(0);

  const bodyHeight = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bodySectionHeight],
  });

  const arrowAngle = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', `${Math.PI}rad`],
  });

  useEffect(() => {
    setTimeout(() => toggleListItem(), 100);
  }, [openIndex]);

  const toggleListItemIndex = () => {
    setOpenIndex(index);
  };

  const toggleListItem = () => {
    if (index === openIndex) {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 1,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedController, {
        duration: 300,
        toValue: 0,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => toggleListItemIndex()}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 14, color: '#222F2C', fontWeight: 'bold' }}>{title}</Text>
          <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <ScrollView style={styles.scrollView}>
        <Animated.View
          style={[
            styles.bodyBackground,
            { height: index === openIndex ? bodyHeight : null },
          ]}
        >
          <View
            style={styles.bodyContainer}
            onLayout={event =>
              setBodySectionHeight(event.nativeEvent.layout.height)
            }
          >
            {children}
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
};
export default AccordionListItem;

const styles = StyleSheet.create({
  scrollView: {
    display: 'flex',
  },
  bodyBackground: {
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
    // paddingLeft: 24,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#EFEFEF',
  },
  bodyContainer: {
    flex: 1,
    display: 'flex',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
  },
});
