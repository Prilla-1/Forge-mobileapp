import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShapeType } from '../../constants/type';
import { generateUUID } from '@/utils/generateUUID';

interface CanvasContextType {
  shapes: ShapeType[];
  setShapes: Dispatch<SetStateAction<ShapeType[]>>;
  trashedShapes: ShapeType[];
  setTrashedShapes: Dispatch<SetStateAction<ShapeType[]>>;
  deleteToTrash: (id: string) => void;
  restoreShape: (id: string) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: Dispatch<SetStateAction<string | null>>;
  undo: () => void;
  redo: () => void;
  saveToHistory: (newShapes: ShapeType[]) => void;
  deleteShapeById: (id: string) => void;
  addShape: (shape: ShapeType) => void;
  addImageFromGallery: () => Promise<void>;
  updateShape: (id: string, updates: Partial<ShapeType>) => void;
  setDeletedShapes: Dispatch<SetStateAction<ShapeType[]>>;
  deletedShapes: ShapeType[];
  saveToStorage: () => Promise<void>;
  deleteShape: (id: string) => void;
  loadTemplate: (index: number) => void;
  saveToMirror: () => void;
  mirrorDesign: ShapeType[];
  savedDesign: ShapeType[];
  setSavedDesign: Dispatch<SetStateAction<ShapeType[]>>;
  templates: ShapeType[][];
  trash: ShapeType[];
  restoreShapeFromTrash: (id: string) => void;
  popupShapeId: string | null;
  setPopupShapeId: (id: string | null) => void;
  updateShapeStyle: (id: string, newStyle: Partial<ShapeType['style']>) => void;
  addTextShape: () => void;
  selectShape: (id: string | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [trashedShapes, setTrashedShapes] = useState<ShapeType[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [history, setHistory] = useState<ShapeType[][]>([]);
  const [redoStack, setRedoStack] = useState<ShapeType[][]>([]);
  const [deletedShapes, setDeletedShapes] = useState<ShapeType[]>([]);
  const [mirrorDesign, setMirrorDesign] = useState<ShapeType[]>([]);
  const [savedDesign, setSavedDesign] = useState<ShapeType[]>([]);
  const [trash, setTrash] = useState<ShapeType[]>([]);
  const [popupShapeId, setPopupShapeId] = useState<string | null>(null);

  const addShape = (shape: ShapeType) => setShapes(prev => [...prev, shape]);

  const initialTemplates: ShapeType[][] = [
    [
      {
        id: generateUUID(),
        type: 'rectangle',
        position: { x: 40, y: 80 },
        style: { width: 120, height: 80, backgroundColor: '#00C853' },
      },
      {
        id: generateUUID(),
        type: 'text',
        position: { x: 50, y: 180 },
        style: { color: '#000', fontSize: 20 },
        text: 'Welcome!',
      },
    ],
    [
      {
        id: generateUUID(),
        type: 'circle',
        position: { x: 80, y: 100 },
        style: { width: 100, height: 100, backgroundColor: '#FF4081' },
      },
    ],
  ];

  const [templates] = useState<ShapeType[][]>(initialTemplates);

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem('shapes', JSON.stringify(shapes));
    } catch (error) {
      console.error('Error saving shapes:', error);
    }
  };

  const loadTemplate = (index: number) => {
    const cloned = templates[index].map((shape) => ({
      ...shape,
      id: generateUUID(),
    }));
    setShapes(cloned);
    saveToHistory(cloned);
  };

  const saveToMirror = () => {
    setMirrorDesign([...shapes]);
  };

  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));


  const saveToHistory = (newShapes: ShapeType[]) => {
    setHistory((prev) => [...prev, shapes]);
    setRedoStack([]);
    setShapes(newShapes);
  };

 const updateShape = (id: string, updates: Partial<ShapeType>) => {
  setShapes((prev) =>
    prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
  );
};


  const updateShapeStyle = (id: string, newStyle: Partial<ShapeType['style']>) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === id
          ? { ...shape, style: { ...shape.style, ...newStyle } }
          : shape
      )
    );
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setRedoStack((r) => [...r, shapes]);
    setShapes(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setHistory((prev) => [...prev, shapes]);
    setShapes(next);
  };

  const deleteShapeById = (id: string) => {
    setShapes((prev) => {
      const shapeToDelete = prev.find((s) => s.id === id);
      if (shapeToDelete) {
        setDeletedShapes((deleted) => [...deleted, shapeToDelete]);
      }
      return prev.filter((s) => s.id !== id);
    });
  };
const deleteToTrash = (id: string) => {
  setShapes(prev => {
    const shape = prev.find(s => s.id === id);
    if (shape) {
      setTrash(old => [...old, shape]);
    }
    return prev.filter(s => s.id !== id);
  });
};
const restoreShape = (id: string) => {
  setDeletedShapes(prev => {
    const shape = prev.find(s => s.id === id);
    if (shape) {
      setShapes(shapes => [...shapes, shape]);
    }
    return prev.filter(s => s.id !== id);
  });
};

  
const restoreShapeFromTrash = (id: string) => {
  setTrash(prev => {
    const shape = prev.find(s => s.id === id);
    if (shape) {
      setShapes(old => [...old, shape]);
    }
    return prev.filter(s => s.id !== id);
  });
};

  const addImageFromGallery = async () => {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) return Alert.alert('Permission Denied');
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
  if (!res.canceled && res.assets.length) {
    const img = res.assets[0];
    saveToHistory([
      ...shapes,
      {
        id: generateUUID(),
        type: 'image',
        uri: img.uri,
        position: { x: 100, y: 100 },
        style: { width: 150, height: 150 },
      },
    ]);
  }
};
  const addTextShape = () => {
    const newShape: ShapeType = {
      id: generateUUID(),
      type: 'text',
      position: { x: 100, y: 100 },
      style: {
        width: 150,
        height: 60,
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderWidth: 1,
      },
      text: 'Edit Me',
      fontSize: 18,
      fontColor: '#000000',
    };
    saveToHistory([...shapes, newShape]);
  };

  const selectShape = (id: string | null) => {
    setSelectedShapeId(id);
  };

  return (
    <CanvasContext.Provider
      value={{
        shapes,
        setShapes,
        trashedShapes,
        setTrashedShapes,
        deleteToTrash,
        restoreShape,
        selectedShapeId,
        setSelectedShapeId,
        undo,
        redo,
        deleteShape,
        saveToStorage,
        saveToHistory,
        deleteShapeById,
        addShape,
        addImageFromGallery,
        updateShape,
        setDeletedShapes,
        deletedShapes,
        loadTemplate,
        saveToMirror,
        mirrorDesign,
        savedDesign,
        setSavedDesign,
        templates,
        trash,
        restoreShapeFromTrash,
        popupShapeId,
        setPopupShapeId,
        updateShapeStyle,
        addTextShape,
        selectShape,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  return context;
};
