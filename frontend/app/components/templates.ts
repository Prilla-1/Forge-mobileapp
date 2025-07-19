import { ShapeType } from '../../constants/type';
import React from 'react';

export const templates: { id: string; name: string; shapes: ShapeType[] }[] = [
  {
    id: 'template1',
    name: 'Basic Layout',
    shapes: [
      {
        id: '1',
        type: 'rectangle',
        position: { x: 50, y: 50 },
        style: {
          width: 120,
          height: 60,
          backgroundColor: '#3498db',
        },
      },
      {
        id: '2',
        type: 'circle',
        position: { x: 200, y: 100 },
        style: {
          width: 80,
          height: 80,
          backgroundColor: '#e67e22',
        },
      },
    ],
  },
  {
    id: 'template2',
    name: 'Poster Design',
    shapes: [
      {
        id: '1',
        type: 'rectangle',
        position: { x: 30, y: 30 },
        style: {
          width: 300,
          height: 500,
          backgroundColor: '#2ecc71',
        },
      },
      {
        id: '2',
        type: 'rectangle',
        position: { x: 60, y: 400 },
        style: {
          width: 200,
          height: 50,
          backgroundColor: '#e74c3c',
        },
      },
    ],
  },
];
