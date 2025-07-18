
import React, { createContext, useContext, useState,useEffect } from 'react';
import { ShapeType } from '../../constants/type';
import { saveShapes,saveToBackend,loadShapes } from '@/utils/saveUtils';


interface CanvasContextType {
  shapes: ShapeType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  trashedShapes: ShapeType[];
  setTrashedShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  deleteToTrash: (id: string) => void;
  restoreShape: (shape: ShapeType) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
  undo: () => void; 
  redo: () => void; 
  saveToHistory: (newShapes: ShapeType[]) => void; 
   deleteShapeById: (id: string) => void; 
}

export const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [trashedShapes, setTrashedShapes] = useState<ShapeType[]>([]);
   const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
   const [history, setHistory] = useState<ShapeType[][]>([]);
const [redoStack, setRedoStack] = useState<ShapeType[][]>([]);



   // Load shapes from local storage on first load
  useEffect(() => {
    const fetchShapes = async () => {
      const saved = await loadShapes();
      setShapes(saved);
    };
    fetchShapes();
  }, []);

  // Auto-save whenever shapes change
  useEffect(() => {
    if (shapes.length > 0) {
      saveShapes(shapes);       // Save to local storage
      saveToBackend(shapes);    // Save to backend
    }
  }, [shapes]);
  
const saveToHistory = (newShapes: ShapeType[]) => {
  setHistory((prev) => [...prev, shapes]); // Save current state
  setRedoStack([]); // Clear redo stack on new action
  setShapes(newShapes);
};

const undo = () => {
  if (history.length === 0) return;
  const prev = history[history.length - 1];
  setHistory((prevStack) => prevStack.slice(0, -1));
  setRedoStack((r) => [...r, shapes]);
  setShapes(prev);
};

const redo = () => {
  if (redoStack.length === 0) return;
  const next = redoStack[redoStack.length - 1];
  setRedoStack((r) => r.slice(0, -1));
  setHistory((prev) => [...prev, shapes]);
  setShapes(next);
};
const deleteShapeById = (id: string) => {
  setShapes((prev) => prev.filter((s) => s.id !== id));
};


  const deleteToTrash = (id: string) => {
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      setTrashedShapes(prev => [...prev, shape]);
      setShapes(prev => prev.filter(s => s.id !== id));
    }
  };

  const restoreShape = (shape: ShapeType) => {
    setShapes(prev => [...prev, shape]);
    setTrashedShapes(prev => prev.filter(s => s.id !== shape.id));
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
        saveToHistory,
        deleteShapeById,
      }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error('useCanvas must be used within CanvasProvider');
  return context;
};
export default CanvasContext;