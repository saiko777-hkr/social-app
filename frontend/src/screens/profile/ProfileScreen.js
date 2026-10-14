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
import { userAPI, postAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userResponse = await userAPI.getProfile();
      setUser(userResponse.data);

      const postsResponse = await postAPI.getUserPosts(userResponse.data.id);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <GlassCard style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: user.name_color || '#007AFF' }]}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: user.name_color || '#000' }]}>
            {user.name}
            {user.is_premium && <Text style={styles.premiumBadge}> ⭐</Text>}
          </Text>
          <Text style={styles.userHandle}>@{user.username}</Text>
          {user.display_name && (
            <Text style={styles.displayName}>{user.display_name}</Text>
          )}
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.balance}</Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>

          {user.is_admin && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Ionicons name="shield-checkmark" size={20} color={colors.status.success} />
              <Text style={styles.adminButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.status.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          {posts.length === 0 ? (
            <Text style={styles.emptyText}>No posts yet</Text>
          ) : (
            posts.map((post) => (
              <GlassCard key={post.id} style={styles.postCard}>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postStats}>
                  <Text style={styles.postStat}>❤️ {post.likes_count}</Text>
                  <Text style={styles.postStat}>💬 {post.comments_count}</Text>
                </View>
              </GlassCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: 20,
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
  },
  userName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
    marginBottom: 5,
  },
  premiumBadge: {
    fontSize: fontSizes.xl,
  },
  userHandle: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
    marginBottom: 5,
  },
  displayName: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    fontFamily: fonts.medium,
    marginBottom: 5,
  },
  bio: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  editButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingsButtonText: {
    marginLeft: 10,
    fontSize: fontSizes.md,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  adminButtonText: {
    marginLeft: 10,
    fontSize: fontSizes.md,
    color: colors.status.success,
    fontFamily: fonts.regular,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: fontSizes.md,
    color: colors.status.error,
    fontFamily: fonts.regular,
  },
  postsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
    marginBottom: 15,
  },
  postCard: {
    marginBottom: 15,
    padding: 15,
  },
  postContent: {
    fontSize: fontSizes.md,
    marginBottom: 10,
    fontFamily: fonts.regular,
  },
  postStats: {
    flexDirection: 'row',
    gap: 20,
  },
  postStat: {
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
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
});

export default ProfileScreen;
