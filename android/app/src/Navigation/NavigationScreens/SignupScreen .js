import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !name || !phoneNumber) {
      alert('Please fill in all the fields');
      setLoading(false);
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      await firestore().collection('allUsers').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        phoneNumber: phoneNumber,
        uid: result.user.uid,
        role: 'user',
        status: 'online',
      });
      setLoading(false);
      // Clear the input fields
      setEmail('');
      setPassword('');
      setName('');
      setPhoneNumber('');
      navigation.navigate('WelcomeScreen');
    } catch (err) {
      alert('Something went wrong');
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Image style={styles.img} source={require('../../Image/rr.jpeg')} />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.box2}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: '#006aff', text: 'black' } }} // Set text color to black
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          theme={{ colors: { primary: '#006aff', text: 'black' } }} // Set text color to black
        />
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: '#006aff', text: 'black' } }} // Set text color to black
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          theme={{ colors: { primary: '#006aff', text: 'black' } }} // Set text color to black
        />
        <Button mode="contained" onPress={userSignup} style={[styles.button, { alignSelf: 'center' }]}><Text style={styles.buttonText}>Sign up</Text>
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Already have an account?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde0',
    padding: 20,
  },
  text: {
    fontSize: 22,
    color: 'green',
    marginVertical: 10,
    textAlign: 'center',
  },
  img: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  box1: {
    marginTop: 20,
  },
  box2: {
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 10,
    borderRadius: 15,
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#7e4194',
    color: 'white',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    color: '#006aff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
