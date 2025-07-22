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

  color?: string; // For text shapes
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';

  rotation?: number;
}

export interface ShapeType {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text' | 'button' | 'diamond' | 'kite' | 'arrow';
  position: Position;
  style: Style;
  color?:string;

  isVisible?: boolean;
  isLocked?: boolean;

  // Specific to certain types
  uri?: string;     // for images
  text?: string;    // for text/button shapes
}
export type ShapeData = {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
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
  connections?: string[]; // optional for lines or connecting shapes
};

export interface LineType {
  id: string;
  startShapeId: string;
  endShapeId: string;
  label?: string;
}

export interface Template {
  shapes: ShapeType[];
  lines: LineType[];
  image?:string;
}
