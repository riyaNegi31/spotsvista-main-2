import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, Image } from 'react-native'; // Import Image
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const SelectionScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleUserButtonClick = () => {
    navigation.navigate('SignupScreen');
  };

  const handleDriverButtonClick = () => {
    navigation.navigate('DriverSignup');
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust animation duration as desired
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-photo/graphic-2d-colorful-wallpaper-with-grainy-gradients_23-2151001623.jpg?t=st=1713273580~exp=1713277180~hmac=4045c80a1b2c87a11ae517f8d4971283a571726a47573d2e982f92a2b3f38269&w=740',
      }}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: './android/app/src/Image/car_sel.webp',
          }}
          style={styles.carImage}
        />
      </View>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome to SpotVista</Text>
        <Text style={styles.subtitle}>Choose Your Role:</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUserButtonClick}
            style={styles.button}
            color="#007bff"
          >
            Passenger
          </Button>
          <Button
            mode="contained"
            onPress={handleDriverButtonClick}
            style={styles.button}
            color="#28a745"
          >
            Driver
          </Button>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    position: 'absolute',
    top: 328,
    left: 20,
  },
  carImage: {
    width: 50,
    height: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    width: '48%',
  },
});

export default SelectionScreen;
