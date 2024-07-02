import axios from 'axios';
import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAppNavigation } from '../../App';
import { useUserStore } from '../zustand/user-store';
import { API_URL } from '../env';
import { useTokenStore } from '../zustand/token-store';

const SignUp = () => {
    const navigation = useAppNavigation();
    const { username: _username, setUsername: _setUsername } = useUserStore();
    const { token, setToken } = useTokenStore();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const signUp = async () => {
        const response = await axios.post(`${API_URL}/sign-up`, { username, password });
        setToken(response.data.token);
        _setUsername(username);
        window.location.reload();
    };

    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.header_text} onPress={() => navigation.navigate("SignIn")}>
              Sign-In
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.sign_up}>
              <Text style={styles.body_header}>Sign up</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#888"
                style={styles.text_input}
                onChangeText={setUsername}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                style={styles.text_input}
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={signUp}
              />
              <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={{ color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        padding: 20,
        backgroundColor: '#6200ee',
        alignItems: 'flex-end',
    },
    header_text: {
        color: 'white',
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#eee',
    },
    body_header: {
      color: 'white',
      alignSelf: 'center',
    },
    sign_up: {
        padding: 20,
        backgroundColor: '#6200ee',
        borderRadius: 5,
        gap: 10,
    },
    text_input: {
      color: 'black',
      backgroundColor: 'white',
      borderRadius: 5,
    },
    button: {
      backgroundColor: 'skyblue',
      padding: 10,
      alignSelf: 'flex-end',
    },
});

export default SignUp;
