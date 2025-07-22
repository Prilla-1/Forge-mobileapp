
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { useCanvas } from '../../../context/CanvasContext';
import { ShapeType } from '../../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

const typeIcons: Record<string, string> = {
  rectangle: 'square-outline',
  circle: 'ellipse-outline',
  oval: 'ellipse',
  diamond: 'diamond-outline',
  kite: '',
  arrow: '',
  image: 'image-outline',
  text: 'text',
  button: 'radio-button-off-outline',
};
const typeEmojis: Record<string, string> = {
  kite: '🪁',
  arrow: '➔',
};

function ShapePreview({ shape }: { shape: ShapeType }) {
  const size = 28;
  if (shape.type === 'rectangle') {
    return <View style={{ width: size, height: size * 0.7, backgroundColor: shape.style.backgroundColor || '#ccc', borderRadius: 6 }} />;
  }
  if (shape.type === 'circle') {
    return <View style={{ width: size, height: size, backgroundColor: shape.style.backgroundColor || '#ccc', borderRadius: size / 2 }} />;
  }
  if (shape.type === 'oval') {
    return <View style={{ width: size, height: size * 0.6, backgroundColor: shape.style.backgroundColor || '#ccc', borderRadius: size / 2 }} />;
  }
  if (shape.type === 'diamond') {
    return <View style={{ width: size, height: size, backgroundColor: shape.style.backgroundColor || '#ccc', transform: [{ rotate: '45deg' }], borderRadius: 8 }} />;
  }
  if (shape.type === 'kite') {
    return <Text style={{ fontSize: 24 }}>🪁</Text>;
  }
  if (shape.type === 'arrow') {
    return <Text style={{ fontSize: 24 }}>➔</Text>;
  }
  if (shape.type === 'image' && shape.uri) {
    return <Image source={{ uri: shape.uri }} style={{ width: size, height: size, borderRadius: 6 }} />;
  }
  if (shape.type === 'text') {
    return <View style={{ width: size, height: size * 0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf7fd', borderRadius: 6 }}><Text numberOfLines={1} style={{ fontSize: 12, color: '#333' }}>{shape.text || 'T'}</Text></View>;
  }
  return <View style={{ width: size, height: size, backgroundColor: '#eee', borderRadius: 6 }} />;
}

function LayerShapeItem({ shape, isSelected, onSelect, onReorder, onLock, onHide, onDelete }: any) {
  // Swipeable actions
  const renderRightActions = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
      <TouchableOpacity onPress={() => onLock(shape.id)} style={styles.actionBtn}><Ionicons name={shape.isLocked ? 'lock-closed' : 'lock-open'} size={22} color={shape.isLocked ? '#e74c3c' : '#2ecc71'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => onHide(shape.id)} style={styles.actionBtn}><Ionicons name={shape.isVisible === false ? 'eye-off' : 'eye'} size={22} color={shape.isVisible === false ? '#95a5a6' : '#2ecc71'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(shape.id)} style={styles.actionBtn}><Ionicons name="trash-outline" size={22} color="#d32f2f" /></TouchableOpacity>
    </View>
  );
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={[styles.shapeRow, isSelected && styles.selectedRow]} onPress={() => onSelect(shape.id)}>
        <ShapePreview shape={shape} />
        <Text style={styles.shapeLabel} numberOfLines={1}>{shape.text || shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}</Text>
        <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
          <TouchableOpacity onPress={() => onReorder(shape.id, 'up')}><Ionicons name="arrow-up-circle" size={22} color="#3498db" /></TouchableOpacity>
          <TouchableOpacity onPress={() => onReorder(shape.id, 'down')}><Ionicons name="arrow-down-circle" size={22} color="#3498db" /></TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export default function LayerScreen() {
  const { shapes, selectedShapeId, setSelectedShapeId, reorderShape, toggleShapeVisibility, toggleShapeLock, deleteToTrash } = useCanvas();
  // Group shapes by type
  const typeCounts: Record<string, ShapeType[]> = {};
  shapes.forEach(shape => {
    if (!typeCounts[shape.type]) typeCounts[shape.type] = [];
    typeCounts[shape.type].push(shape);
  });
  const grouped = Object.entries(typeCounts);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Layers</Text>
      </View>
      {grouped.length === 0 ? (
        <Text style={styles.empty}>No shapes on canvas yet.</Text>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={([type]) => type}
          renderItem={({ item }) => {
            const [type, shapesOfType] = item;
            const isOpen = expanded[type];
            return (
              <View>
                <TouchableOpacity style={styles.groupRow} onPress={() => setExpanded(e => ({ ...e, [type]: !e[type] }))}>
                  {typeIcons[type] ? (
                    <Ionicons name={typeIcons[type] as any} size={24} color="#3498db" />
                  ) : (
                    <Text style={{ fontSize: 22 }}>{typeEmojis[type] || '?'}</Text>
                  )}
                  <Text style={styles.groupLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}{shapesOfType.length > 1 ? ` (${shapesOfType.length})` : ''}</Text>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#888" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                {isOpen && (
                  <View style={{ marginLeft: 16 }}>
                    {shapesOfType.map(shape => (
                      <LayerShapeItem
                        key={shape.id}
                        shape={shape}
                        isSelected={selectedShapeId === shape.id}
                        onSelect={setSelectedShapeId}
                        onReorder={reorderShape}
                        onLock={toggleShapeLock}
                        onHide={toggleShapeVisibility}
                        onDelete={deleteToTrash}
                      />
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

LayerScreen.title = 'Layers';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  headerBar: { paddingBottom: 10, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#6C47A6', textAlign: 'left', letterSpacing: 1 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  groupRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  groupLabel: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: 'bold' },
  shapeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f3f3f3', paddingRight: 8, borderRadius: 8, backgroundColor: '#f9f9fb', marginBottom: 2 },
  selectedRow: { backgroundColor: '#e6e0f3' },
  shapeLabel: { fontSize: 15, color: '#333', marginLeft: 10, flex: 1 },
  actionBtn: { marginHorizontal: 4, padding: 4, borderRadius: 6, backgroundColor: '#f3f3f3' },
  empty: { fontSize: 16, color: '#888', textAlign: 'center' },
});
