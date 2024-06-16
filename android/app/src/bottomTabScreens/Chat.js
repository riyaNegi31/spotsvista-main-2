import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const currentUser = auth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('allUsers')
      .where('uid', '!=', currentUser.uid)
      .where('role', '==', 'driver')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot) {
          return;
        }
        const usersData = [];
        querySnapshot.forEach(doc => {
          usersData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setUsers(usersData);
      });

    return () => unsubscribe();
  }, []);

  const handleChat = (user) => {
    navigation.navigate('ChatScreen', { user });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChat(item)}>
      <View style={styles.shadowBox}>
        <View style={styles.itemContainer}>
          <Image source={require('../Image/contactnew.png')} style={styles.image} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6e6',
  },
  shadowBox: {
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f5f3ed',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
});

export default Chat;
