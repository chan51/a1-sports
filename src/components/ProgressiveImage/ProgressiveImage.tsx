import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import progressiveImage from '../../assets/progressive.png';

const ProgressiveImage: React.FC<any> = ({
  source,
  cloudinaryURL,
  cachedFile,
  style,
  ...props
}: any) => {
  const imageAnimated = new Animated.Value(0.5);
  const thumbnailAnimated = new Animated.Value(0);

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedImageSource = cloudinaryURL => {
    if (cloudinaryURL) {
      return { uri: cloudinaryURL };
    } else {
      return progressiveImage;
    }
  };

  return (
    <View style={styles.container}>
      hello
      {!imageAnimated && !cachedFile ? (
        <Animated.Image
          {...props}
          source={animatedImageSource(cloudinaryURL)}
          style={[styles.thumbOverlay, style, { opacity: thumbnailAnimated }]}
          onLoad={handleThumbnailLoad}
          blurRadius={thumbnailAnimated}
        />
      ) : (
        <></>
      )}
      <Animated.Image
        {...props}
        source={source}
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        onLoad={onImageLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default ProgressiveImage;
