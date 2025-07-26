export interface Position {
  x: number;
  y: number;
}

export interface Style {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  fontSize?: number;
  shadowColor?:string;
  shadowOffset?: {
    width: number;
    height: number;
}

  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  rotation?: number;
  shadowOpacity?: number;
  shadowRadius?: number;
  textAlign?:string;
}

export interface ShapeType {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text' | 'button' | 'diamond' | 'kite' | 'arrow';
  position: Position;
  style: Style;
  color?: string;
  isVisible?: boolean;
  isLocked?: boolean;
  uri?: string;
  text?: string;
  fontSize?:number;
  fontColor?:string;
}

export type ShapeData = {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text' | 'button' | 'diamond' | 'kite' | 'arrow';
  x: number;
  y: number;
  position: Position;
  style: Style;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  borderColor?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  fontColor?: string;
  imageUri?: string;
  connections?: string[];
}

export interface LineType {
  id: string;
  startShapeId: string;
  endShapeId: string;
  label?: string;
}
export interface Template {
  id: string;
  name: string;
  shapes: ShapeType[];
  lines: LineType[];
}
export type LinePreview = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};




