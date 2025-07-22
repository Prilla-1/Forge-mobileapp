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
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  rotation?: number;
}

export interface ShapeType {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text' | 'button';
  position: Position;
  style?: Style;
  color?: string;         
  fontSize?: number;      
  fontColor?: string; 
  groupId?:string;    
  borderColor?: string;  
  uri?: string;           
  text?: string;
  rotation?:number;          
}
