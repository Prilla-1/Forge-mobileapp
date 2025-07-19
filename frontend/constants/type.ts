export interface Position {
  x: number;
  y: number;
}
export interface Style {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?:string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  borderWidth?:number;
}


export interface ShapeType {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text'|'button';
  position: Position;
  style: Style;
  color?:string;
  fontSize?:number;
  fontColor?:string;
  uri?: string;   // for image shapes
  text?: string; 
  borderColor?:string;
}
