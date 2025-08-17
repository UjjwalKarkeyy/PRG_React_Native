import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../../config/api';

export default function ComplainDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch complaint details
  const fetchComplaintDetails = async () => {
    try {
      const apiUrl = `${API_BASE_URL}/api/complains/${id}/`;
      const response = await axios.get(apiUrl);
      setComplaint(response.data);
      setLoading(false);
    } catch (error) {
      console.log(`Error fetching complaint: ${error}`);
      Alert.alert('Error', 'Failed to load complaint details');
      setLoading(false);
    }
  };

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const apiUrl = `${API_BASE_URL}/api/complains/${id}/comments/`;
      const response = await axios.get(apiUrl);
      setComments(response.data);
    } catch (error) {
      console.log('Error fetching comments:', error);
      // If no comments exist yet, just set empty array
      setComments([]);
    }
  };

  // Submit new comment
  const submitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      const commentData = {
        text: newComment,
        author_name: "User", // This should come from user context/auth
        is_admin: false,
        parent: replyTo
      };

      const apiUrl = `${API_BASE_URL}/api/complains/${id}/add_comment/`;
      const response = await axios.post(
        apiUrl,
        commentData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Refresh comments to get updated data with proper structure
      await fetchComments();

      setNewComment('');
      setReplyTo(null);
      Alert.alert('Success', 'Comment added successfully');
    } catch (error) {
      console.log('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchComplaintDetails(), fetchComments()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchComplaintDetails();
    fetchComments();
  }, [id]);

  // Get status color and text
  const getStatusInfo = (status = 'pending') => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return { color: '#28a745', text: 'Resolved', icon: 'checkmark-circle' };
      case 'in_progress':
        return { color: '#ffc107', text: 'In Progress', icon: 'time' };
      case 'seen':
        return { color: '#17a2b8', text: 'Seen', icon: 'eye' };
      default:
        return { color: '#6c757d', text: 'Pending', icon: 'hourglass' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render comment thread
  const renderComment = (comment, isReply = false) => {
    return (
      <View key={comment.id} style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <View style={styles.commentHeader}>
          <View style={[styles.authorBadge, comment.is_admin && styles.adminBadge]}>
            <Text style={[styles.authorText, comment.is_admin && styles.adminText]}>
              {comment.author_name}
            </Text>
            {comment.is_admin && <Ionicons name="shield-checkmark" size={12} color="white" />}
          </View>
          <Text style={styles.timestampText}>{formatDate(comment.created_at)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        {!isReply && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => setReplyTo(comment.id)}
          >
            <Ionicons name="arrow-undo" size={16} color="#007bff" />
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )}

        {/* Render replies */}
        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading complaint details...</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(complaint.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaint Details</Text>
        </View>

        {/* Complaint Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.statusContainer}>
            <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>

          <Text style={styles.title}>{complaint.title}</Text>
          <Text style={styles.description}>{complaint.description}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.metaText}>
                {complaint.municipality}, {complaint.district}, {complaint.state}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="pricetag" size={16} color="#666" />
              <Text style={styles.metaText}>{complaint.category} - {complaint.subcategory}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.metaText}>
                Submitted: {complaint.created_at ? formatDate(complaint.created_at) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Attachments */}
          {(complaint.image || complaint.file) && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              {complaint.image && (
                <Image source={{ uri: complaint.image }} style={styles.attachedImage} />
              )}
              {complaint.file && (
                <TouchableOpacity style={styles.fileAttachment}>
                  <Ionicons name="document" size={20} color="#007bff" />
                  <Text style={styles.fileName}>Attached Document</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Progress Timeline</Text>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#28a745' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Complaint Submitted</Text>
              <Text style={styles.timelineDate}>
                {complaint.created_at ? formatDate(complaint.created_at) : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Timeline for status changes */}
          {complaint.status && complaint.status.toLowerCase() !== 'pending' ? (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#17a2b8' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Under Review</Text>
                <Text style={styles.timelineDate}>
                  {complaint.updated_at ? formatDate(complaint.updated_at) : 'Status changed'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#dee2e6' }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: '#6c757d' }]}>Under Review</Text>
                <Text style={[styles.timelineDate, { color: '#6c757d' }]}>Not seen yet</Text>
              </View>
            </View>
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.commentsCard}>
          <Text style={styles.sectionTitle}>Comments & Updates</Text>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
          ) : (
            comments.map(comment => renderComment(comment))
          )}

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            {replyTo && (
              <View style={styles.replyIndicator}>
                <Text style={styles.replyIndicatorText}>Replying to comment</Text>
                <TouchableOpacity onPress={() => setReplyTo(null)}>
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  attachmentsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  attachedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007bff',
  },
  timelineCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: '#666',
  },
  commentsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  commentContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  replyContainer: {
    marginLeft: 20,
    marginTop: 8,
    borderLeftColor: '#28a745',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: '#007bff',
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginRight: 4,
  },
  adminText: {
    color: 'white',
  },
  timestampText: {
    fontSize: 12,
    color: '#6c757d',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#007bff',
    fontWeight: '500',
  },
  commentInputContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  replyIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  replyIndicatorText: {
    fontSize: 12,
    color: '#856404',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
