import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, Image} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  setLocation,
  setLocationName,
  setNearbyPlaces,
  setMarkers,
} from '../redux/locationSlice';
import MapView, {Marker} from 'react-native-maps';
import {TextInput} from 'react-native-paper';

const Header = () => {
  const dispatch = useDispatch();
  const {locationName, latitude, longitude, markers} = useSelector(
    state => state.location,
  );

  const requestLocationPermission = () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            dispatch(setLocation({latitude, longitude, locationName: ''}));
            await getLocationName(latitude, longitude);
            await fetchNearbyPlaces(latitude, longitude);
            await fetchMarkers(latitude, longitude);
          },
          error => {
            console.error('Error getting current location:', error);
          },
        );
      },
      error => {
        console.error('Error requesting location permission:', error);
      },
    );
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const apiKey = '4a92e86c6073444a93c20b73f2f58285';
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      if (data.results.length > 0) {
        const address = data.results[0].formatted;
        dispatch(setLocationName(address));
      } else {
        console.warn('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location name:', error.message);
    }
  };

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const apiKey = 'AIzaSyAp__xlkv0-fU0iXT_SCReglaAzQQu2R04';

    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000000&type=tourist_attraction&key=${apiKey}&limit=50`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
    
      const places = data.results.map(place => ({
        name: place.name,
        description: place.description || 'No description available',
        image:
          place.photos && place.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
            : null,
        rating: place.rating || null,
      }));

      dispatch(setNearbyPlaces(places));
    } catch (error) {
      console.error('Error fetching nearby places:', error.message);
    }
  };

  const fetchMarkers = async (latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyAp__xlkv0-fU0iXT_SCReglaAzQQu2R04';
      const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.results) {
        const newMarkers = data.results.map(result => ({
          id: result.place_id,
          title: result.name,
          coordinates: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
        }));
        dispatch(setMarkers(newMarkers));
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);
  const handleLocationChange = text => {
    dispatch(setLocationName(text));
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: 'white',
        }}>
        <Image
          source={{
            uri: 'https://img.freepik.com/free-vector/location_53876-25530.jpg?size=338&ext=jpg&ga=GA1.1.632798143.1705708800&semt=ais',
          }}
          style={{width: 25, height: 60, marginRight: 10,}}
        />

        <TextInput
          label="  Location "
          value={locationName}
          onChangeText={handleLocationChange}
          style={{ backgroundColor: 'black', color: 'white',}}
          theme={{ colors: { primary: 'white', background: 'black' } }}
          color="white"
        />
      </View>
      <View style={{height: 200, marginTop: 10,color: 'black',}}>
       {latitude !== 0 && longitude !== 0 ? (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: Number(latitude),
              longitude: Number(longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Marker for the current location */}
            <Marker
              coordinate={{
                latitude: Number(latitude),
                longitude: Number(longitude),
              }}
              title="Current Location"
              pinColor="blue" 
            />

            {/* Other markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinates}
                title={marker.title}
              />
            ))}
          </MapView>
        ) : (
          <Text>No valid location data</Text>
        )}
      </View>
    </View>
  );
};

export default Header;
