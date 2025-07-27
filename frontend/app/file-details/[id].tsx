import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useProjectContext, Project } from '../../context/ProjectContext';
import { View, Text, StyleSheet, Button, Alert, Share, TouchableOpacity, Image, TextInput, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Import mock data from recents or search tab
import { mockProjects } from '../../mockProjects';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

export default function FileDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { projects, addComment, addReply, setProjects } = useProjectContext();
  const file = projects.find((item: Project) => item.id === id);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Helper functions for replies
  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Mock handlers
  const handleEdit = () => {
    Alert.alert('Edit', 'Edit project feature coming soon!');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this project: ${file ? file.title : id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the project.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Project deleted (mock).') },
      ]
    );
  };

  if (!file) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>File/Project Details</Text>
        <Text style={styles.id}>ID: {id}</Text>
        <Text style={styles.placeholder}>Not found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F6F2F7", "#E9D7F7", "#A07BB7"]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Back Arrow a bit down from the top */}
        <View style={styles.topButtonsRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(drawer)/recents')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{file.title}</Text>
        </View>
        {file.thumbnail && (() => {
          // Pannable image inside a static frame
          const FRAME_WIDTH = 340;
          const FRAME_HEIGHT = 220;
          const IMAGE_WIDTH = 480;
          const IMAGE_HEIGHT = 320;
          const minX = FRAME_WIDTH - IMAGE_WIDTH;
          const minY = FRAME_HEIGHT - IMAGE_HEIGHT;
          const maxX = 0;
          const maxY = 0;
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);
          const gestureHandler = useAnimatedGestureHandler({
            onStart: (_, ctx: any) => {
              ctx.startX = translateX.value;
              ctx.startY = translateY.value;
            },
            onActive: (event, ctx: any) => {
              let nextX = ctx.startX + event.translationX;
              let nextY = ctx.startY + event.translationY;
              // Clamp so image never leaves the frame
              nextX = Math.max(Math.min(nextX, maxX), minX);
              nextY = Math.max(Math.min(nextY, maxY), minY);
              translateX.value = nextX;
              translateY.value = nextY;
            },
          });
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
          }));
          return (
            <View style={styles.imageFrame}>
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.pannableImage, animatedStyle]}>
                  <Image source={file.thumbnail} style={styles.pannableImage} />
                </Animated.View>
              </PanGestureHandler>
            </View>
          );
        })()}
        {/* Documentation Section */}
        <View style={styles.docSection}>
          <Text style={styles.docText}>
            Designs created using{' '}
            <TouchableOpacity onPress={() => Linking.openURL('https://www.figma.com/')}>
              <Text style={styles.docLink}>Figma</Text>
            </TouchableOpacity>.
          </Text>
          <Text style={styles.docText}>
            Get free templates from{' '}
            <TouchableOpacity onPress={() => Linking.openURL('https://unsplash.com/')}>
              <Text style={styles.docLink}>Unsplash</Text>
            </TouchableOpacity>.
          </Text>
          <Text style={styles.docText}>
            Find icons at{' '}
            <TouchableOpacity onPress={() => Linking.openURL('https://icons8.com/')}>
              <Text style={styles.docLink}>Icons8</Text>
            </TouchableOpacity>.
          </Text>
        </View>
        {/* Removed edit and delete buttons; share is now next to title */}
        {/* Comments Section */}
        <View style={styles.commentsSectionCard}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <View style={{ flex: 1, position: 'relative', minHeight: 220, maxHeight: 260 }}>
            <ScrollView style={styles.commentsScroll} contentContainerStyle={{ paddingBottom: 56 }}>
              {file?.comments && file.comments.length > 0 ? (
                file.comments.map((comment: any, idx: number) => (
                  <Swipeable
                    key={comment.id}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setProjects((prev: Project[]) => prev.map((p: Project) =>
                            p.id === file.id
                              ? { ...p, comments: p.comments.filter((c: any) => c.id !== comment.id) }
                              : p
                          ));
                        }}
                      >
                        <Ionicons name="trash" size={22} color="#fff" />
                      </TouchableOpacity>
                    )}
                  >
                    <View style={styles.commentCard}>
                      <Ionicons name="chatbubble-ellipses-outline" size={18} color="#A07BB7" style={{ marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.commentMeta}>{comment.author} • {comment.date}{comment.time ? ` ${comment.time}` : ''}</Text>
                        
                        {/* Reply button */}
                        <TouchableOpacity
                          style={styles.replyButton}
                          onPress={() => {
                            setReplyingTo(comment.id);
                            setNewComment(`@${comment.author} `);
                          }}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#A07BB7" />
                          <Text style={styles.replyButtonText}>Reply</Text>
                        </TouchableOpacity>

                        {/* Show replies count and toggle */}
                        {comment.replies && comment.replies.length > 0 && (
                          <TouchableOpacity
                            style={styles.repliesToggle}
                            onPress={() => toggleReplies(comment.id)}
                          >
                            <Ionicons 
                              name={expandedReplies.has(comment.id) ? "chevron-up" : "chevron-down"} 
                              size={14} 
                              color="#A07BB7" 
                            />
                            <Text style={styles.repliesCount}>
                              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* Nested replies */}
                        {comment.replies && comment.replies.length > 0 && expandedReplies.has(comment.id) && (
                          <View style={styles.repliesContainer}>
                            {comment.replies.map((reply: any) => (
                              <View key={reply.id} style={styles.replyCard}>
                                <Ionicons name="chatbubble-outline" size={14} color="#A07BB7" style={{ marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.replyText}>{reply.text}</Text>
                                  <Text style={styles.replyMeta}>{reply.author} • {reply.date}{reply.time ? ` ${reply.time}` : ''}</Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Reply input for this specific comment */}
                        {replyingTo === comment.id && (
                          <View style={styles.replyInputContainer}>
                            <TextInput
                              style={styles.replyInput}
                              value={newComment}
                              onChangeText={setNewComment}
                              placeholder="Write a reply..."
                              placeholderTextColor="#aaa"
                              multiline
                            />
                            <View style={styles.replyInputActions}>
                              <TouchableOpacity
                                style={styles.cancelReplyButton}
                                onPress={() => {
                                  setReplyingTo(null);
                                  setNewComment('');
                                }}
                              >
                                <Text style={styles.cancelReplyText}>Cancel</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.sendReplyButton}
                                onPress={() => {
                                  if (newComment.trim().length > 0) {
                                    addReply(file.id, {
                                      text: newComment.replace(`@${comment.author} `, ''),
                                      author: 'You',
                                      replyTo: comment.id
                                    });
                                    setReplyingTo(null);
                                    setNewComment('');
                                  }
                                }}
                              >
                                <Ionicons name="send" size={16} color="#fff" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => {
                          file.comments[idx].liked = !file.comments[idx].liked;
                          setNewComment(c => c + ' ');
                        }}
                      >
                        <Ionicons
                          name={comment.liked ? 'heart' : 'heart-outline'}
                          size={20}
                          color={comment.liked ? '#e74c3c' : '#aaa'}
                        />
                      </TouchableOpacity>
                    </View>
                  </Swipeable>
                ))
              ) : (
                <Text style={styles.noComments}>No comments yet.</Text>
              )}
            </ScrollView>
            <View style={[styles.addCommentRowWrapper, { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff' }]}>
              {!replyingTo && (
                <View style={styles.addCommentRow}>
                  <TextInput
                    style={styles.addCommentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity
                    style={styles.addCommentButton}
                    onPress={() => {
                      if (newComment.trim().length === 0) return;
                      addComment(file.id, { text: newComment, author: 'You' });
                      setNewComment('');
                    }}
                  >
                    <Ionicons name="send" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  id: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  meta: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },
  // Removed old thumbnail style; all project images use fullImage style now
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: 24,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  commentsSection: {},
  commentsSectionCard: {
    marginTop: 32,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
    minHeight: 320,
    maxHeight: 380,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C47A6',
    marginBottom: 12,
    textAlign: 'center',
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f6f2f7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  commentMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  noComments: {
    fontSize: 15,
    color: '#aaa',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  fullImage: {
    width: '100%',
    height: 260,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 18,
    resizeMode: 'cover',
  },
  topButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 56,
    left: 0,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 20,
    padding: 8,
  },
  shareButton: {
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 20,
    padding: 8,
  },
  docSection: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 24,
    width: '100%',
  },
  docText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
    textAlign: 'center',
  },
  docLink: {
    color: '#6C47A6',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  imageFrame: {
    width: 340,
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  pannableImage: {
    width: 480,
    height: 320,
    borderRadius: 32,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f6f2f7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  addCommentInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#333',
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  addCommentButton: {
    backgroundColor: '#A07BB7',
    borderRadius: 8,
    padding: 8,
    marginLeft: 6,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  heartButton: {
    marginLeft: 8,
    padding: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    marginBottom: 12,
  },
  commentsScrollWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  commentsScroll: {
    width: '100%',
  },
  addCommentRowWrapper: {
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: '90%',
    borderRadius: 10,
    marginVertical: 4,
    marginRight: 8,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  replyButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#A07BB7',
    fontWeight: '500',
  },
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  repliesCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#A07BB7',
    fontWeight: '500',
  },
  repliesContainer: {
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#e9d7f7',
    paddingLeft: 10,
  },
  replyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f6f2f7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  replyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  replyMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  replyInputContainer: {
    marginTop: 10,
    backgroundColor: '#f6f2f7',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  replyInput: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  replyInputActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  cancelReplyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  cancelReplyText: {
    fontSize: 14,
    color: '#A07BB7',
    fontWeight: '500',
  },
  sendReplyButton: {
    backgroundColor: '#A07BB7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
});