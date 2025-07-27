import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TrashScreen = () => {
  const { trash, restoreFromTrash, clearTrash } = useCanvas();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAll = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAll = () => {
    clearTrash();
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const renderShapeItem: ListRenderItem<ShapeType> = ({ item }) => (
    <View style={styles.shapeCard}>
      <Text style={styles.shapeType}>
        {item.type.toUpperCase()} - {item.id.slice(0, 6)}
      </Text>

      {item.type === 'text' && item.text ? (
        <Text style={styles.shapeText}>{item.text}</Text>
      ) : (
        <Text style={styles.preview}>Preview: {item.type}</Text>
      )}

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => restoreFromTrash(item.id)}
        activeOpacity={0.8}
      >
        <Ionicons name="refresh" size={16} color="#fff" />
        <Text style={styles.buttonText}>Restore</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="trash-outline" size={64} color="#A07BB7" />
      <Text style={styles.emptyText}>Trash is empty.</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#F6F2F7", "#E9D7F7", "#A07BB7"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {trash.length > 0 && (
          <View style={styles.deleteAllContainer}>
            <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.deleteAllText}>Delete All</Text>
            </TouchableOpacity>
          </View>
        )}

        {trash.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={trash}
            keyExtractor={(item) => item.id}
            renderItem={renderShapeItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Custom Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="warning" size={48} color="#f44336" />
              </View>
              <Text style={styles.modalTitle}>Delete All Items</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to permanently delete all items in trash? This action cannot be undone.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDeleteAll}>
                  <Text style={styles.confirmButtonText}>Delete All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TrashScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6C47A6',
    marginTop: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  shapeCard: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(160,123,183,0.08)',
  },
  shapeType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#6C47A6',
  },
  shapeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    backgroundColor: 'rgba(108,71,166,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  preview: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
    backgroundColor: 'rgba(108,71,166,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  deleteAllContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});