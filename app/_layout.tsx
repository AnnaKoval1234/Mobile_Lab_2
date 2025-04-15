import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider, DatabaseContextType } from '@/contexts/DatabaseContext'
import { MarkerContext, MarkerContextType } from '@/contexts/MarkerContext';
import { useState } from 'react';
import { MarkerData } from '@/types';

export default function RootLayout() {
  // const [markers, setMarkers] = useState<MarkerData[]>([]);
  // const cstate: MarkerContextType = {
  //   markers: markers,
  //   setMarkers: setMarkers
  // }
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Карта' }} />
        <Stack.Screen name="markers/[id]" options={{ title: 'Детали' }} />
      </Stack>
      <StatusBar style="light" />
    </DatabaseProvider>
  );
}
