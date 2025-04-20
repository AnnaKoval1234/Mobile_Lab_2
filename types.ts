export interface MarkerData {
    id: number;
    latitude: number;
    longitude: number;
    // images: ImageData[];
}

export interface ImageData {
    id: number;
    marker_id: number;
    uri: string;
}