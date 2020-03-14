import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Splash extends Component {
  componentDidMount() {
    AsyncStorage.getItem('token').then(token => {
      const {navigation} = this.props;

      //console.warn('token: ' + token);
      let initial;
      if (token) {
        initial = 'Feed';
      } else {
        initial = 'Login';
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: initial}],
        }),
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Instalura</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26,
  },
});
