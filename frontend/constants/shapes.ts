export const shapeStyles = {
  rectangle: {
    width: 100,
    height: 60,
    backgroundColor: 'skyblue',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'tomato',
  },
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
  diamond: {
    width: 80,
    height: 80,
    backgroundColor: 'deepskyblue',
    transform: [{ rotate: '45deg' }],
  },
  kite: {
    width: 60,
    height: 100,
    backgroundColor: 'orange',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderColor: 'black',
  },
  arrow: {
    width: 100,
    height: 20,
    backgroundColor: 'black',
  },
  text: {
    width: 120,
    height: 40,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
  },
  button: {
    width: 120,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
} as const;

export type ShapeName = keyof typeof shapeStyles;
