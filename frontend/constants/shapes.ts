
export const shapeStyles = {
  rectangle: { width: 100, height: 60, backgroundColor: 'skyblue' },
  circle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'tomato' },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'purple',
  },
} as const;

export type ShapeName = keyof typeof shapeStyles; 
