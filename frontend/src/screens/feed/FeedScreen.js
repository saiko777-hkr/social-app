import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { postAPI } from '../../services/api';

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.likePost(postId, { emoji: '❤️' });
      loadPosts();
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const renderPost = (post) => (
    <GlassCard key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: post.name_color || '#007AFF' }]}>
            <Text style={styles.avatarText}>
              {post.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: post.name_color || '#000' }]}>
              {post.name}
              {post.is_premium && <Text style={styles.premiumBadge}> ⭐</Text>}
            </Text>
            <Text style={styles.userHandle}>@{post.username}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons name="heart" size={24} color={colors.primary} />
          <Text style={styles.actionText}>{post.likes_count}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostComments', { postId: post.id })}
        >
          <Ionicons name="chatbubble" size={24} color={colors.primary} />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : posts.length === 0 ? (
          <Text style={styles.emptyText}>No posts yet</Text>
        ) : (
          posts.map(renderPost)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  newPostButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  postCard: {
    marginBottom: 20,
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  userName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  premiumBadge: {
    fontSize: fontSizes.md,
  },
  userHandle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  postContent: {
    fontSize: fontSizes.md,
    marginBottom: 15,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  actionText: {
    marginLeft: 5,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
});

export default FeedScreen;
