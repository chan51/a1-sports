import React, { Fragment, PureComponent } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Player } from '../../models/player.interface';

import { ListItem } from './styles';
import coins from './../../assets/icons/coins.png';
import down from './../../assets/icons/down.png';
import growth from './../../assets/icons/growth.png';

class PlayerItem extends PureComponent<{
  player: Player;
  gotoPlayerInvestment: Function;
}> {
  render() {
    const { player, gotoPlayerInvestment } = this.props;
    return (
      <Fragment key={`player-${player.id}`}>
        <ListItem onPress={() => gotoPlayerInvestment(player)}>
          <View style={styles.playerList}>
            <View style={styles.playerListValue}>
              <Text style={styles.playerListValueText}>{player.name}</Text>
              {/* <Image style={{ marginRight: 8 }} source={growth || down} />
                <Text style={{ fontSize: 13, fontWeight: '500' }}>
                  +1.2%
              </Text> */}
            </View>
            <View style={styles.playerListValue}>
              <Text style={styles.playerListValueText}>{player.team}</Text>
            </View>
            <View
              style={{
                ...styles.playerListValue,
                justifyContent: 'flex-end',
                width: '20%',
              }}
            >
              <Text style={styles.playerListValueText}>{player.value}</Text>
              <Image source={coins} />
            </View>
          </View>
        </ListItem>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  playerList: {
    flexDirection: 'row',
    marginTop: 2,
    width: '100%',
  },
  playerListValue: {
    width: '40%',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  playerListValueText: {
    marginRight: 8,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default PlayerItem;
