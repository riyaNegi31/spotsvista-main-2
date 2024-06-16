import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Paragraph,
  Dialog,
  Portal,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const BookFutureRide = () => {
  const navigation = useNavigation();
  const [rideDate, setRideDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rideTime, setRideTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const clearFields = () => {
    setRideDate(new Date());
    setShowDatePicker(false);
    setRideTime(new Date());
    setShowTimePicker(false);
    setSource('');
    setDestination('');
  };

  const bookFutureRide = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('User not logged in');
      }
  
      const userId = currentUser.uid;
  
      await firestore().collection('futureRides').add({
        userId: userId, 
        rideDate: rideDate.toISOString(),
        rideTime: rideTime.toISOString(),
        source,
        destination,
      });
  
      setDialogMessage('Ride booked successfully!');
      setShowDialog(true);
      setTimeout(() => {
        navigation.navigate('Activity');
      }, 2000);
    } catch (error) {
      setDialogMessage('Error booking ride: ' + error.message);
      setShowDialog(true);
    } finally {
      clearFields();
    }
  };
  

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || rideDate;
    setShowDatePicker(false);
    setRideDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || rideTime;
    setShowTimePicker(false);
    setRideTime(currentTime);
  };

  const isFormComplete = () => {
    return rideDate && rideTime && source && destination;
  };
  
  const MyImage = () => (
    <Image
      source={require('../../Image/advance.jpg')} // Replace with your image path
      style={styles.imageStyle}
    />
  );


  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
              <MyImage />

      <TextInput
        label="Enter your location"
        value={source}
        onChangeText={setSource}
        style={styles.input}
      />
      <TextInput
        label="Destination"
        value={destination}
        onChangeText={setDestination}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}>
        Select Ride Date
      </Button>

      <Text style={styles.dateTimeText}>
        Selected Date: {rideDate.toDateString()}
      </Text>
      {showDatePicker && (
        <DateTimePicker
          value={rideDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Button
        mode="contained"
        onPress={() => setShowTimePicker(true)}
        style={styles.dateButton}>
        Select Ride Time
      </Button>
      <Text style={styles.dateTimeText}>
        Selected Time: {rideTime.toLocaleTimeString()}
      </Text>
      {showTimePicker && (
        <DateTimePicker
          value={rideTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      {isFormComplete() && (
        <TouchableOpacity onPress={bookFutureRide} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Ride</Text>
        </TouchableOpacity>
      )}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Message</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde0',
    paddingTop:46,
  },
  input: {
    margin: 10,
  },
  dateButton: {
    margin: 10,
    
    backgroundColor: '#7e4194',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    width: 190,
    marginLeft:96,
    color:'white',
  },
  bookButton: {
    margin: 10,
    backgroundColor: '#7e4194',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    paddingLeft: 10,
  },
  imageStyle:{
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius:60,
  },
});

export default BookFutureRide;
