import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { ShapeType, ShapeData } from '../../constants/type';
import { loadShapes, loadFromBackend } from '../../utils/saveUtils';

type CanvasContextType = {
  shapes: ShapeData[];
  selectedShapeId: string | null;
  trash: ShapeData[];
  addShape: (shape: ShapeData) => void;
  updateShape: (id: string, updates: Partial<ShapeData>) => void;
  deleteShape: (id: string) => void;
  restoreShape: (id: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  selectShape: (id: string | null) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [trash, setTrash] = useState<ShapeData[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const [history, setHistory] = useState<ShapeData[][]>([]);
  const [future, setFuture] = useState<ShapeData[][]>([]);
useEffect(() => {
  const loadInitialShapes = async () => {
    const localShapes = await loadShapes(); // ShapeType[]
    const backendShapes = await loadFromBackend(); // ShapeType[]

    // Helper to convert ShapeType[] to ShapeData[]
    const toShapeData = (shapes: any[]): ShapeData[] =>
      shapes.map((shape) => ({
        id: shape.id,
        type: shape.type,
        x: shape.x ?? 0,
        y: shape.y ?? 0,
        width: shape.width ?? 100,
        height: shape.height ?? 100,
        rotation: shape.rotation ?? 0,
        color: shape.color ?? '#000',
        text: shape.text ?? '',
        fontSize: shape.fontSize ?? 14,
        fontColor: shape.fontColor ?? '#000',
        isBold: shape.isBold ?? false,
        isItalic: shape.isItalic ?? false,
        uri: shape.uri ?? '',
        borderColor: shape.borderColor ?? '#000',
        borderWidth: shape.borderWidth ?? 1,
      }));

    setShapes(
      backendShapes.length ? toShapeData(backendShapes) : toShapeData(localShapes)
    );
  };

  loadInitialShapes();
}, []);


  const pushToHistory = useCallback(() => {
    setHistory((prev) => [...prev, shapes]);
    setFuture([]); // clear redo on new action
  }, [shapes]);

  const addShape = useCallback((shape: ShapeData) => {
    pushToHistory();
    setShapes((prev) => [...prev, shape]);
  }, [pushToHistory]);

  const updateShape = useCallback((id: string, updates: Partial<ShapeData>) => {
    pushToHistory();
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
    );
  }, [pushToHistory]);

  const deleteShape = useCallback((id: string) => {
    pushToHistory();
    const shapeToTrash = shapes.find((s) => s.id === id);
    if (shapeToTrash) {
      setTrash((prev) => [...prev, shapeToTrash]);
      setShapes((prev) => prev.filter((s) => s.id !== id));
      setSelectedShapeId(null);
    }
  }, [shapes, pushToHistory]);

  const restoreShape = useCallback((id: string) => {
    const shapeToRestore = trash.find((s) => s.id === id);
    if (shapeToRestore) {
      setTrash((prev) => prev.filter((s) => s.id !== id));
      setShapes((prev) => [...prev, shapeToRestore]);
      setFuture([]); // clear redo
    }
  }, [trash]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setFuture((f) => [shapes, ...f]);
      setShapes(previous);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history, shapes]);

  const redo = useCallback(() => {
    if (future.length > 0) {
      const next = future[0];
      setHistory((prev) => [...prev, shapes]);
      setShapes(next);
      setFuture((f) => f.slice(1));
    }
  }, [future, shapes]);

  const clearCanvas = useCallback(() => {
    pushToHistory();
    setShapes([]);
    setTrash([]);
    setSelectedShapeId(null);
  }, [pushToHistory]);

  const selectShape = useCallback((id: string | null) => {
    setSelectedShapeId(id);
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        shapes,
        selectedShapeId,
        trash,
        addShape,
        updateShape,
        deleteShape,
        restoreShape,
        undo,
        redo,
        clearCanvas,
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
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
