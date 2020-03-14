import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Text,
  Button,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('screen').width;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      usuario: 'rafael',
      senha: '123456',
      mensagem: '',
    };
  }

  efetuaLogin = () => {
    const {navigation} = this.props;
    const uri = 'https://instalura-api.herokuapp.com/api/public/login';

    //Fetch é originalmente do metodo get e como teremos q fazer um metodo Post então temos q informar:
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        login: this.state.usuario,
        senha: this.state.senha,
      }),
      headers: new Headers({
        'Content-type': 'application/json',
      }),
    };
    fetch(uri, requestInfo)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Não foi possível efetuar login');
      })
      .then(token => {
        AsyncStorage.setItem('token', token); //Salvar no hd do celular
        AsyncStorage.setItem('usuario', this.state.usuario);
        navigation.dispatch(
          //Tirando a opção de voltar
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Feed'}],
          }),
        );
      })
      .catch(error => this.setState({mensagem: error.message}));
  };

  logout() {
    AsyncStorage.removeItem('usuario');
    AsyncStorage.removeItem('token');
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Instalura</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.usuario}
            autoCapitalize="none"
            placeholder="Usuário..."
            onChangeText={texto => this.setState({usuario: texto})}
          />
          <TextInput
            style={styles.input}
            defaultValue={this.state.senha}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Senha..."
            onChangeText={texto => this.setState({senha: texto})}
          />
          <Button title="Login" onPress={this.efetuaLogin} />
          <View style={styles.aluraLingua}>
            <Button
              title="Temos uma novidade!"
              onPress={() => navigation.navigate('AluraLingua')}
            />
          </View>
        </View>
        <Text style={styles.mensagem}>{this.state.mensagem}</Text>
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
  form: {
    width: width * 0.8,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  mensagem: {
    marginTop: 15,
    color: '#e74c3c',
  },
  aluraLingua: {
    marginTop: 50,
  },
});
