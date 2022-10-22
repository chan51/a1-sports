import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const data = [
  {
    index: 0,
    title: 'A1Sports',
    text: 'Sports ka share market',
    image: require('../../assets/images/slider1.png'),
    bg: '#ffffff',
  },
  {
    index: 1,
    title: 'A1Sports',
    text: 'Invest into your favorite sports\n\n person to earn BIG rewards',
    image: require('../../assets/images/slider2.png'),
    bg: '#ffffff',
  },
  {
    index: 2,
    title: '',
    text: 'Analyse player`s performance and\n\n invest on top performers',
    image: require('../../assets/images/slider3.png'),
    bg: '#ffffff',
  },
];

type Item = typeof data[0];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F25813',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  slideText: {
    elevation: 4,
    backgroundColor: '#fff',
    padding: 8,
    paddingBottom: 60,
    borderTopLeftRadius: 90,
  },
  text: {
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 5,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#F25813',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
});

interface Props {
  isSliderDone: boolean;
  handleSlider: Function;
}

const IntroSlider: React.FC<Props> = ({ isSliderDone, handleSlider }) => {
  let slider: AppIntroSlider | undefined;

  const _renderItem = ({ item, index }: { item: Item; index: number }) => {
    return (
      <ImageBackground source={item.image} style={styles.image}>
        <View style={styles.slideText}>
          <Text style={styles.title}>{item.title}</Text>

          {index < data.length - 1 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#F25813' }]}
                onPress={() => handleSlider()}
              >
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          )}

          {data.length - 1 === index && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#F25813' }]}
                onPress={() => handleSlider()}
              >
                <Text style={styles.buttonText}>Explore</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </ImageBackground>
    );
  };

  const _keyExtractor = (item: Item) => item.index.toString();

  const _renderPagination = (activeIndex: number) => {
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {data.length > 1 &&
              data.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? { backgroundColor: '#F25813' }
                      : { backgroundColor: 'rgba(0, 0, 0, .2)' },
                  ]}
                  onPress={() => slider?.goToSlide(i, true)}
                />
              ))}
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="rgba(0, 0, 0, .4)" />
      <AppIntroSlider
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        renderPagination={_renderPagination}
        data={data}
        ref={ref => (slider = ref!)}
      />
    </View>
  );
};

export default IntroSlider;
