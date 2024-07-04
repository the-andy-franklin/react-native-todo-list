import React from 'react';
import axios from 'axios';
import { StyleSheet, SafeAreaView, View, Text, TextInput, Pressable, Dimensions } from 'react-native';
import { useAppNavigation } from '../navigator';
import { API_URL } from '../env';
import { useUserStore } from '../zustand/user-store';
import { useTokenStore } from '../zustand/token-store';

const SignIn = () => {
    const navigation = useAppNavigation();
    const [password, setPassword] = React.useState('');
    const { username, setUsername } = useUserStore();
    const { setToken } = useTokenStore();

    const signIn = async () => {
        const response = await axios.post(`${API_URL}/signin`, { username, password });
        setToken(response.data.token);
    };

    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.header_text_2} onPress={() => navigation.navigate("SignUp")}>
              Sign-Up
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.sign_up}>
              <Text style={styles.body_header}>Sign In</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#888"
                style={styles.text_input}
                onChangeText={setUsername}
                autoCapitalize='none'
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                style={styles.text_input}
                onChangeText={setPassword}
                enterKeyHint='send'
                onSubmitEditing={signIn}
                autoCapitalize='none'
              />
              <Pressable style={styles.button} onPress={signIn}>
                <Text style={{ color: 'white' }}>Submit</Text>
              </Pressable>
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
    header_text_1: {
        color: 'white',
    },
    header_text_2: {
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
        width: (() => {
          const { width } = Dimensions.get('window');
          return width > 600 ? 400 : width * 0.8;
        })(),
    },
    text_input: {
      color: 'black',
      backgroundColor: 'white',
      borderRadius: 5,
    },
    button: {
      backgroundColor: 'limegreen',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
});

export default SignIn;
