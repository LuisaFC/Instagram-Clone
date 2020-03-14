import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import fotoType from '../types';

export default class Likes extends Component {
  static propTypes = {
    foto: fotoType.isRequired,
    likeCallback: PropTypes.func.isRequired,
  };

  carrgarIcone(likeada) {
    return likeada
      ? require('../../resources/img/s2-checked.png')
      : require('../../resources/img/s2.png');
  }

  //retorna o primeiro falso ou o ultimo verdadeiro
  exibeLikes(likers) {
    return (
      likers.length > 0 && (
        <Text>
          {likers.length}
          {likers.length > 1 ? 'curtidas' : 'curtida'}
        </Text>
      )
    );
  }

  render() {
    const {foto, likeCallback} = this.props;
    return (
      <View>
        <TouchableOpacity onPress={() => likeCallback(foto.id)}>
          <Image
            style={styles.botaoDeLike}
            source={this.carrgarIcone(foto.likeada)}
          />
        </TouchableOpacity>
        {this.exibeLikes(foto.likers)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  botaoDeLike: {
    height: 40,
    width: 40,
  },
  likes: {
    fontWeight: 'bold',
  },
});
