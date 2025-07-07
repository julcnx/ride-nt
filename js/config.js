export const clipBounds = {
  minLat: 16.0,   // Slightly extended south to cover below Khon Kaen
  maxLat: 20.5,   // Still up to Mae Sai
  minLon: 97.5,   // Western edge (Mae Sot)
  maxLon: 103.0   // Extended east to include Khon Kaen
};

export const regionBounds = [
  [clipBounds.minLat, clipBounds.minLon],
  [clipBounds.maxLat, clipBounds.maxLon]
];