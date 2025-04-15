import { MarkerData } from "@/types";
import { createContext } from "react";

export interface MarkerContextType
{
    markers: MarkerData[]
    setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>
}

export const MarkerContext = createContext({} as MarkerContextType)