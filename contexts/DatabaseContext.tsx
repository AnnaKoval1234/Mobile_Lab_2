import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDatabase } from '../database/schema';
import { MarkerData, ImageData } from "@/types";

export interface DatabaseContextType {
    // Операции с базой данных
    addMarker: (latitude: number, longitude: number) => Promise<number>;
    deleteMarker: (id: number) => Promise<void>;
    getMarkers: () => Promise<MarkerData[]>;
    addImage: (markerId: number, uri: string) => Promise<void>;
    deleteImage: (id: number) => Promise<void>;
    getMarkerImages: (markerId: number) => Promise<ImageData[]>;
  
    // Статусы
    isLoading: boolean;
    error: Error | null;
  }

  export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

  export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
      throw new Error('useDatabase должна использоваться с DatabaseProvider');
    }
    return context;
  };

  export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      initDatabase()
        .then(setDb)
        .catch(setError)
        .finally(() => setIsLoading(false));

    }, []);
  
    // ... реализация методов контекста
  
    
  const addMarker = async (latitude: number, longitude: number): Promise<number> => {
    if (!db) throw new Error('База данных не инициализирована');
    return db.runAsync(`INSERT INTO markers (latitude, longitude) 
                        VALUES (?, ?);`, 
                        latitude, longitude).then(result => result.lastInsertRowId);
  };

  const deleteMarker = async (id: number): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    await db.runAsync(`DELETE FROM markers WHERE id = ?;`, id);
  };

  const getMarkers = async (): Promise<MarkerData[]> => {
    if (!db) throw new Error('База данных не инициализирована');
    return db.getAllAsync<MarkerData>(`SELECT * FROM markers;`);
  };

  const addImage = async (markerId: number, uri: string): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    await db.runAsync(`INSERT INTO marker_images (marker_id, uri) 
                        VALUES (?, ?);`, 
                        markerId, uri);
  };

  const deleteImage = async (id: number): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    await db.runAsync(`DELETE FROM marker_images WHERE id = ?;`, id);
  };

  const getMarkerImages = async (markerId: number): Promise<any[]> => {
    if (!db) throw new Error('База данных не инициализирована');
    return db.getAllAsync<ImageData>(`SELECT * FROM marker_images
        WHERE marker_id = ?;`,
        markerId);
  };

  const contextValue = {
    addMarker,
    deleteMarker,
    getMarkers,
    addImage,
    deleteImage,
    getMarkerImages,
    isLoading,
    error
  };

  return (
      <DatabaseContext.Provider value={contextValue}>
        {children}
      </DatabaseContext.Provider>
    );
};