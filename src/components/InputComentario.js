import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

export default class InputComentario extends Component {
  static propTypes = {
    idFoto: PropTypes.number.isRequired,
    comentarioCallback: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      valorComentario: '',
    };
  }

  render() {
    const {comentarioCallback, idFoto} = this.props;
    return (
      <View style={styles.novoComentario}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentario"
          ref={input => (this.inputComentario = input)} //Associa um elemento de tela(input) com a variavel do objeto foto(inputComentario)
          onChangeText={texto => this.setState({valorComentario: texto})}
        />
        <TouchableOpacity
          onPress={() => {
            comentarioCallback(
              idFoto,
              this.state.valorComentario,
              this.inputComentario,
            );
            this.setState({valorComentario: ''});
          }}>
          <Image
            style={styles.icone}
            source={require('../../resources/img/send.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  novoComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
  },
  icone: {
    height: 30,
    width: 30,
  },
});
