import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { chatAPI } from '../../services/api';

const ChatListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('PrivateChat', { userId: item.user_id, userName: item.name })}
    >
      <View style={[styles.avatar, { backgroundColor: '#007AFF' }]}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userHandle}>@{item.username}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.groupButton}
          onPress={() => navigation.navigate('GroupChat')}
        >
          <Ionicons name="people" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.searchCard}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <Text style={styles.searchPlaceholder}>Search users...</Text>
        </View>
      </GlassCard>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : conversations.length === 0 ? (
        <Text style={styles.emptyText}>No conversations yet</Text>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.user_id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
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
  groupButton: {
    padding: 10,
  },
  searchCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  list: {
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  conversationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  userHandle: {
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

export default ChatListScreen;
