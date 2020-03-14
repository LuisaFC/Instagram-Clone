/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, View, Button} from 'react-native';
import Post from './Post';
import AsyncStorage from '@react-native-community/async-storage';
import InstaluraFetchService from '../services/InstaluraFetchService';
import Notificacao from '../api/Notificacao';
import HeaderUsuario from './HeaderUsuario';

export default class Feed extends Component {
  constructor() {
    super();
    //Como vai ter q mudar o array então ja deixa em state
    this.state = {
      fotos: [],
      falhaCarregamento: false,
      refreshing: false,
    };
  }

  buscarPorId(idFoto) {
    return this.state.fotos.find(foto => foto.id === idFoto);
  }

  atualizaFotos = fotoAtualizada => {
    const fotos = this.state.fotos.map(foto =>
      foto.id === fotoAtualizada.id ? fotoAtualizada : foto,
    );
    this.setState({fotos});
  };

  //Quando a função usa o this entao é melhor utilizar a função dessa maneira, para nao perder o escopo lexico do this
  like = idFoto => {
    const listaOriginal = this.state.fotos;
    const foto = this.buscarPorId(idFoto);

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        //console.warn('Pegou usuario logados');

        let novaLista = [];
        if (!foto.likeada) {
          novaLista = [...foto.likers, {login: usuarioLogado}];
        } else {
          //Tirar nome do usario da lista de likers - pegando os nomes de usuario diferentes do meuUsuario
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado;
          });
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista,
        };
        this.atualizaFotos(fotoAtualizada);
      });
    //console.warn('Passou aqui');
    InstaluraFetchService.post(`/fotos/${idFoto}/like`).catch(e => {
      this.setState({fotos: listaOriginal});
      Notificacao.exibe('Ops...', 'Algo deu errado ao curtir');
    });
  };

  //Quando mexe com this entao usar =>
  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    const listaOriginal = this.state.fotos;
    //se usuario nao digitar nada entao n fazer nada
    if (valorComentario === '') {
      return;
    }

    const foto = this.buscarPorId(idFoto);
    const comentario = {
      texto: valorComentario,
    };

    InstaluraFetchService.post(`/fotos/${idFoto}/comment`, comentario)
      .then(comentarioRecebido => [...foto.comentarios, comentarioRecebido])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista,
        };
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => {
        this.setState({fotos: listaOriginal});
        Notificacao.exibe('Ops...', 'Algo deu errado ao comentar');
      });
  };

  carregarFotos = () => {
    const {params} = this.props.route;
    let uri = '/fotos';

    if (params && params.usuario) {
      uri = `/public/fotos/${params.usuario}`;
    }

    InstaluraFetchService.get(uri)
      .then(json => this.setState({fotos: json, falhaCarregamento: false}))
      .catch(() => this.setState({falhaCarregamento: true}));
  };

  //Quando o componente for montado - Esse metodo só é chamado uma vez
  async componentDidMount() {
    this.props.navigation.addListener('focus', () => this.carregarFotos());
    this.carregarFotos();

    /*
    fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael')
      //Quando acessar url entao transforma resposta em json
      .then(resposta => resposta.json())
      //Quando transformar em json, adiciona na lista fotos
      .then(json => this.setState({fotos: json}));
    */
  }

  verPerfilUsuario = idFoto => {
    const foto = this.buscarPorId(idFoto);
    this.props.navigation.navigate('PerfilUsuario', {
      usuario: foto.loginUsuario,
      fotoDePerfil: foto.urlPerfil,
    });
  };

  exibeHeader = () => {
    const {params} = this.props.route;
    if (params) {
      return <HeaderUsuario {...params} posts={this.state.fotos.length} />;
    }
  };

  render() {
    const {falhaCarregamento} = this.state;
    return (
      <View>
        {falhaCarregamento ? (
          <Button onPress={this.carregarFotos} title="Recarregar" />
        ) : (
          <FlatList
            //Para cada item da lista, será retornado o id do item
            keyExtractor={item => item.id + ''}
            //Lista de elementos q sera renderizado
            data={this.state.fotos}
            onRefresh={() => this.carregarFotos()}
            refreshing={this.state.refreshing}
            //Função de renderização = Para cada item execute essa função ({item}) =>()
            renderItem={({item}) => (
              //Post passa o parametro foto com valor de item
              <Post
                foto={item}
                likeCallback={this.like}
                comentarioCallback={this.adicionaComentario}
                verPerfilCallback={this.verPerfilUsuario}
              />
            )}
            ListHeaderComponent={this.exibeHeader()}
          />
        )}
      </View>
    );
  }
}
