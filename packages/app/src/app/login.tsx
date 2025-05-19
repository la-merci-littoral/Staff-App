import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import useStaffStore from '../stores/staffStore';
import { Href, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function Login() {
    const { login } = useStaffStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        login(username.trim(), password.trim())
            .then(() => {
                setUsername(() => '');
                setPassword(() => '');
                router.replace('/' as Href)
            })
            .catch((error: Error) => setError(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Staff Login</Text>
            <View style={styles.form}>
                <TextInput
                    placeholder="Nom d'utilisateur"
                    style={styles.input}
                    onChangeText={(data) => setUsername(data)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={username}
                />
                <TextInput
                    placeholder="Mot de passe"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={(data) => setPassword(data)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={password}
                />
                <Text style={{ ...styles.errorMessage, display: error == '' ? 'none' : 'flex' }} >{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lapis,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        marginBottom: 20,
        fontFamily: "Nunito_400Regular",
    },
    form: {
        width: 300,
        backgroundColor: Colors.indigo,
        padding: 20,
        borderRadius: 8
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10
    },
    errorMessage: {
        color: Colors.redError,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: "100%",
        marginBottom: 10,
        fontSize: 15,
        fontFamily: "Nunito_400Regular",
    },
    button: {
        backgroundColor: Colors.unitedNations,
        borderRadius: 4,
        padding: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.pale
    }
});
