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
import io from 'socket.io-client';

const PrivateChatScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    // Socket connection would go here
  }, []);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getPrivateMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message && !amount) return;

    try {
      await chatAPI.sendPrivateMessage({
        receiver_id: userId,
        content: message,
        amount_sent: parseFloat(amount) || 0
      });
      setMessage('');
      setAmount('');
      loadMessages();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send message');
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
        <Text style={styles.headerTitle}>{userName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.emptyText}>No messages yet</Text>
        ) : (
          messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender_id === userId ? styles.receivedMessage : styles.sentMessage
              ]}
            >
              {msg.amount_sent > 0 && (
                <View style={styles.moneyBubble}>
                  <Ionicons name="cash" size={20} color="#34C759" />
                  <Text style={styles.moneyText}>${msg.amount_sent}</Text>
                </View>
              )}
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.messageTime}>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <GlassCard style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.moneyButton}
          onPress={() => setAmount(amount ? '' : '0')}
        >
          <Ionicons name="cash" size={24} color={amount ? colors.status.success : colors.text.secondary} />
        </TouchableOpacity>
        {amount !== '' && (
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
        )}
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
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
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  moneyBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  moneyText: {
    marginLeft: 8,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: '#34C759',
    fontFamily: fonts.bold,
  },
  messageText: {
    fontSize: fontSizes.md,
    color: '#fff',
    fontFamily: fonts.regular,
  },
  receivedMessage: {
    messageText: {
      color: colors.text.primary,
    },
  },
  messageTime: {
    fontSize: fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: fonts.regular,
  },
  receivedMessage: {
    messageTime: {
      color: colors.text.secondary,
    },
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    marginBottom: 30,
  },
  moneyButton: {
    padding: 8,
  },
  amountInput: {
    width: 70,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  messageInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 8,
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

export default PrivateChatScreen;
