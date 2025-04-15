import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { MarkerData } from '@/types';

type Props = {
  markers: MarkerData[];
  onMarkerPress: (m: MarkerData) => void;
};

export default function MarkerList({ markers, onMarkerPress }: Props) {
  return (
    <View>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => onMarkerPress(marker)}
        />
      ))}
    </View>)
}
