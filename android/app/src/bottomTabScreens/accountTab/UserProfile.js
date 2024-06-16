import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const retrieveProfile = () => {
    const user = auth().currentUser;

    if (user) {
      const userUID = user.uid;

      firestore()
        .collection('allUsers')
        .doc(userUID)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const documentData = documentSnapshot.data();
            setUserData(documentData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error retrieving user profile:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : userData ? (
        <View style={styles.profileContainer}>
          <Image source={require('../../Image/user.png')} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
            {/* Additional content */}
            
            {/* Add more user-related information here */}
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>User profile not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6e6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 36,
    color: 'black',
  },
  profileContainer: {
    backgroundColor:'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 26,
    borderRadius: 8,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black',
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },

});

export default UserProfile;
