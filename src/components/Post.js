import React, {Component} from 'react';
import {StyleSheet, Dimensions, Image, Text, View} from 'react-native';
import InputComentario from './InputComentario';
import Likes from './Likes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import fotoType from '../types';

//Pegando a largura da tela
const width = Dimensions.get('screen').width;

export default class Post extends Component {
  static propTypes = {
    foto: fotoType.isRequired,
    likeCallback: PropTypes.func.isRequired,
    comentarioCallback: PropTypes.func.isRequired,
  };

  //Recebendo props
  constructor(props) {
    //Passando props
    super(props);
    //Definindo foto como foto recebida via props
    this.state = {
      foto: this.props.foto,
      valorComentario: '',
    };
  }

  exibeLikesOld(likers) {
    if (likers.length <= 0) {
      return;
    }
    return (
      <Text style={styles.likes}>
        {likers.length} {likers.length > 1 ? 'curtidas' : 'curtida'}
      </Text>
    );
  }

  exibeLegenda(foto) {
    if (foto.comentario === '') {
      return;
    }
    return (
      <View style={styles.comentario}>
        <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
        <Text>{foto.comentario}</Text>
      </View>
    );
  }

  render() {
    //Desestruturação de objeto
    //Criar variavel com nome do objeto, extraindo as propriedades do objeto
    //const {foto} = this.state;  mesma coisa de ter feito foto = this.state.foto
    const {
      foto,
      likeCallback,
      comentarioCallback,
      verPerfilCallback,
    } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={styles.cabecalho}
          onPress={() => verPerfilCallback(foto.id)}>
          <Image source={{uri: foto.urlPerfil}} style={styles.fotoDePerfil} />
          <Text>{foto.loginUsuario}</Text>
        </TouchableOpacity>
        <Image
          //require faz analise do que vai ser colocado na APK
          source={{uri: foto.urlFoto}}
          //A primeira chave indica que estamos definindo uma propriedade
          //A segunda chave indica um objeto
          style={styles.foto}
        />
        <View style={styles.rodape}>
          <Likes foto={foto} likeCallback={likeCallback} />
          {this.exibeLegenda(foto)}
          {foto.comentarios.map(comentario => (
            <View style={styles.comentario} key={comentario.id}>
              <Text style={styles.tituloComentario}>{comentario.login}</Text>
              <Text>{comentario.texto}</Text>
            </View>
          ))}
          <InputComentario
            idFoto={foto.id}
            comentarioCallback={comentarioCallback}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cabecalho: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoDePerfil: {
    marginRight: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  foto: {
    width: width,
    height: width,
  },
  rodape: {
    margin: 10,
  },

  comentario: {
    flexDirection: 'row',
  },
  tituloComentario: {
    fontWeight: 'bold',
    marginRight: 5,
  },
});
