import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { chatAPI } from '../../services/api';

const GroupChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getGroupMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await chatAPI.sendGroupMessage({ content: message });
      setMessage('');
      loadMessages();
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Group Chat</Text>
          <Text style={styles.headerSubtitle}>All Users</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
        ) : (
          messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              <View style={[styles.avatar, { backgroundColor: msg.name_color || '#007AFF' }]}>
                <Text style={styles.avatarText}>
                  {msg.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={[styles.userName, { color: msg.name_color || '#000' }]}>
                    {msg.user.name}
                    {msg.user.is_premium && <Text style={styles.premiumBadge}> ⭐</Text>}
                  </Text>
                  <Text style={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                <GlassCard style={styles.messageBubble}>
                  <Text style={styles.messageText}>{msg.content}</Text>
                </GlassCard>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <GlassCard style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message to everyone..."
          placeholderTextColor={colors.text.secondary}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color={colors.primary} />
        </TouchableOpacity>
      </GlassCard>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  premiumBadge: {
    fontSize: fontSizes.sm,
  },
  messageTime: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  messageText: {
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    marginBottom: 30,
  },
  messageInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  sendButton: {
    padding: 8,
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

export default GroupChatScreen;
