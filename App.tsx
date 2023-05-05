import { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import {  
  requestForegroundPermissionsAsync, // pedir permissao
  getCurrentPositionAsync, // pegar a localização do usuario
  LocationObject,
  watchPositionAsync, // pegar a possição atual do usuario em tempo real
  LocationAccuracy,
} from 'expo-location'
import { styles } from './styles'


export default function App() {
  const [location, setLocation] = useState<LocationObject | null >(null);

  const mapRef = useRef<MapView>(null)

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    // veriricar se usuario aceitou 
    if(granted){
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }

  }

  // importante para iniciar o app
  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);

      // animar o map e mostrar o ponteiro
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    });
  }, []);

  return (
    <View style={styles.container}>
      {
        location && 
        <MapView 
          ref={mapRef} // importante para fazer o map seguir o ponteiro
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005, // importante
            longitudeDelta: 0.005 // importante
          }}
        >
          
          <Marker coordinate={{
            // colocar o marcador 
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }} />
        </MapView>
      }
    </View>
  );
}


