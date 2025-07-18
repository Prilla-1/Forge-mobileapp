export type ShapeType = {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  color:string;
  uri?: string; // only for images
};
