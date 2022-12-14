import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const NotificationBox: React.FC = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Info</Text>
      </View>

      <View style={styles.scrollView}>
        <Text>A1 Sports</Text>
        <View>
          <Text>{'\n'}</Text>
        </View>

        <Text>How to Invest?</Text>
        <View>
          <Text>{'\n'}</Text>
        </View>

        <Text>
          A1 sports works like a share market, but only for trades in sporting
          assets. Invest you coins in your Favourite Sportsperson(s). Their
          performance in every match would increase or decrease the assets share
          value.
        </Text>
        <View>
          <Text>{'\n'}</Text>
        </View>
        <Text>
          Players value will be updated within 30mins after the completion of
          every match
        </Text>
        <View>
          <Text>{'\n'}</Text>
        </View>
        <View>
          <Text>{'\n'}</Text>
        </View>

        <Text>INFORMATION ABOUT APPLICATION:-</Text>
        <View>
          <Text>{'\n'}</Text>
        </View>

        <Text>
          1. User with highest coins at the end of the tournament will be
          declared winner and will get a gift worth 10k
        </Text>
        <View>
          <Text>{'\n'}</Text>
        </View>
        <Text>
          2. Your coin updates will be available in your wallet section.
        </Text>
        <View>
          <Text>{'\n'}</Text>
        </View>
        <Text>3.For any query you can write us in feedback section.</Text>
        <View>
          <Text>{'\n'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  heading: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dadada',
  },
  headingText: {
    fontWeight: '500',
    fontSize: 16,
  },
});

export default NotificationBox;
