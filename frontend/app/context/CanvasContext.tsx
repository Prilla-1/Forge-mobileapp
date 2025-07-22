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
  selectedShapeIds: string[];
  setSelectedShapeIds: Dispatch<SetStateAction<string[]>>;
  undo: () => void;
  redo: () => void;
  saveToHistory: (newShapes: ShapeType[]) => void;
  deleteShapeById: (id: string) => void;
  addShape: (shape: ShapeType) => void;
  addImageFromGallery: () => Promise<void>;
  updateShape: (id: string, updates: Partial<ShapeType>) => void;
  setDeletedShapes: Dispatch<SetStateAction<ShapeType[]>>;
  selectedShapes: ShapeType[];
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
  selectedShape: ShapeType | null;
  saveCanvas: () => Promise<void>;
  loadCanvas: () => Promise<void>;
  deselectAllShapes: () => void;
  groupShapes: () => void;
  ungroupShapes: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  selectedShapeId: string | null;
setSelectedShapeId: (id: string) => void;

  
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [trashedShapes, setTrashedShapes] = useState<ShapeType[]>([]);
 const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [history, setHistory] = useState<ShapeType[][]>([]);
  const [redoStack, setRedoStack] = useState<ShapeType[][]>([]);
  const [deletedShapes, setDeletedShapes] = useState<ShapeType[]>([]);
  const [mirrorDesign, setMirrorDesign] = useState<ShapeType[]>([]);
  const [savedDesign, setSavedDesign] = useState<ShapeType[]>([]);
  const [trash, setTrash] = useState<ShapeType[]>([]);
  const [popupShapeId, setPopupShapeId] = useState<string | null>(null);
  const deselectAllShapes = () => setSelectedShapeIds([]);


  const saveCanvas = async () => {
    try {
      await fetch('http://10.222.231.165:8081/api/saveCanvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shapes),
      });
      alert('Canvas saved to backend!');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const loadCanvas = async () => {
    try {
      const res = await fetch('http://10.222.231.165:8081/api/loadCanvas');
      const data = await res.json();
      setShapes(data);
    } catch (error) {
      console.error('Load error:', error);
    }
  };
  const selectedShapeId = selectedShapeIds[0] ?? null;

const setSelectedShapeId = (id: string) => {
  setSelectedShapeIds([id]);
};


  const saveToHistory = (newShapes: ShapeType[]) => {
    setHistory(prev => [...prev, shapes]);
    setRedoStack([]);
    setShapes(newShapes);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setRedoStack(r => [...r, shapes]);
    setShapes(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(r => r.slice(0, -1));
    setHistory(prev => [...prev, shapes]);
    setShapes(next);
  };

  const deleteShapeById = (id: string) => {
    setShapes(prev => {
      const shapeToDelete = prev.find(s => s.id === id);
      if (shapeToDelete) {
        setDeletedShapes(deleted => [...deleted, shapeToDelete]);
      }
      return prev.filter(s => s.id !== id);
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

  const deleteShape = (id: string) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
  };

  const updateShape = (id: string, updates: Partial<ShapeType>) => {
    setShapes(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const updateShapeStyle = (id: string, newStyle: Partial<ShapeType['style']>) => {
    setShapes(prev =>
      prev.map(shape =>
        shape.id === id
          ? { ...shape, style: { ...shape.style, ...newStyle } }
          : shape
      )
    );
  };

  const addShape = (shape: ShapeType) => {
    saveToHistory([...shapes, shape]);
  };

  const addImageFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permission Denied');

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled && res.assets.length) {
      const img = res.assets[0];
      const newShape: ShapeType = {
        id: generateUUID(),
        type: 'image',
        uri: img.uri,
        position: { x: 100, y: 100 },
        style: { width: 150, height: 150 },
      };
      saveToHistory([...shapes, newShape]);
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
  if (id === null) {
    setSelectedShapeIds([]);
  } else {
    setSelectedShapeIds(prev =>
      prev.includes(id) ? prev.filter(existingId => existingId !== id) : [...prev, id]
    );
  }
};
const selectedShapes = shapes.filter(shape => selectedShapeIds.includes(shape.id));



  const groupShapes = () => {
  if (selectedShapeIds.length < 2) return;
  const newGroupId = generateUUID();
  setShapes(prev =>
    prev.map(shape =>
      selectedShapeIds.includes(shape.id)
        ? { ...shape, groupId: newGroupId }
        : shape
    )
  );
};

const ungroupShapes = () => {
  setShapes(prev =>
    prev.map(shape =>
      selectedShapeIds.includes(shape.id)
        ? { ...shape, groupId: undefined }
        : shape
    )
  );
};

const bringForward = () => {
  const selectedId = selectedShapeIds[0];
  setShapes(prev => {
    const index = prev.findIndex(s => s.id === selectedId);
    if (index === -1 || index === prev.length - 1) return prev;
    const newShapes = [...prev];
    [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]];
    return newShapes;
  });
};


const sendBackward = () => {
  const selectedId = selectedShapeIds[0];
  setShapes(prev => {
    const index = prev.findIndex(s => s.id === selectedId);
    if (index <= 0) return prev;
    const newShapes = [...prev];
    [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]];
    return newShapes;
  });
};

const bringToFront = () => {
  const selectedId = selectedShapeIds[0];
  setShapes(prev => {
    const shape = prev.find(s => s.id === selectedId);
    if (!shape) return prev;
    return [...prev.filter(s => s.id !== selectedId), shape];
  });
};

const sendToBack = () => {
  const selectedId = selectedShapeIds[0];
  setShapes(prev => {
    const shape = prev.find(s => s.id === selectedId);
    if (!shape) return prev;
    return [shape, ...prev.filter(s => s.id !== selectedId)];
  });
};


const selectedShape = shapes.find(shape => shape.id === selectedShapeIds[0]) || null;

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem('shapes', JSON.stringify(shapes));
    } catch (error) {
      console.error('Error saving shapes:', error);
    }
  };

  const saveToMirror = () => {
    setMirrorDesign([...shapes]);
  };

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

  const loadTemplate = (index: number) => {
    const cloned = templates[index].map(shape => ({ ...shape, id: generateUUID() }));
    setShapes(cloned);
    saveToHistory(cloned);
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
        selectedShapeIds,
        setSelectedShapeIds,
        undo,
        redo,
        saveToHistory,
        deleteShapeById,
        addShape,
        addImageFromGallery,
        updateShape,
        setDeletedShapes,
        deletedShapes,
        saveToStorage,
        deleteShape,
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
        selectedShape,
        saveCanvas,
        deselectAllShapes,
        loadCanvas,
        groupShapes,
        ungroupShapes,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        selectedShapes,
        selectedShapeId,
        setSelectedShapeId,

      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
