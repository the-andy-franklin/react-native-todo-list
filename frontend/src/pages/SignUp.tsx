import React from 'react';
import axios from 'axios';
import { StyleSheet, SafeAreaView, View, Text, TextInput, Pressable } from 'react-native';
import { useAppNavigation } from '../navigator';
import { API_URL } from '../env';
import { useUserStore } from '../zustand/user-store';
import { useTokenStore } from '../zustand/token-store';

const SignUp = () => {
    const navigation = useAppNavigation();
    const [password, setPassword] = React.useState('');
    const { username, setUsername } = useUserStore();
    const { setToken } = useTokenStore();

    const signUp = async () => {
        const response = await axios.post(`${API_URL}/signup`, { username, password });
        setToken(response.data.token);
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
                enterKeyHint="send"
                onSubmitEditing={signUp}
              />
              <Pressable style={styles.button} onPress={signUp}>
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
      backgroundColor: 'limegreen',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
});

export default SignUp;
