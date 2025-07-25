export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Region extends LocationCoords {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapProps {
  location: LocationCoords | null;
  initialRegion: Region;
} 