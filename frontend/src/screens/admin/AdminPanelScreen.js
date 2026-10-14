import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { userAPI, supportAPI } from '../../services/api';

const AdminPanelScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await userAPI.getAllUsers();
        setUsers(response.data);
      } else {
        const response = await supportAPI.getAllTickets();
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      await userAPI.blockUser(userId, { is_blocked: !currentStatus });
      loadData();
      Alert.alert('Success', 'User status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const handlePremiumUser = async (userId, currentStatus) => {
    try {
      await userAPI.makePremium(userId, { is_premium: !currentStatus });
      loadData();
      Alert.alert('Success', 'Premium status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update premium');
    }
  };

  const handleRespondTicket = async (ticketId) => {
    Alert.prompt(
      'Response',
      'Enter your response',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send',
          onPress: async (response) => {
            try {
              await supportAPI.respondTicket(ticketId, {
                admin_response: response,
                status: 'resolved'
              });
              loadData();
              Alert.alert('Success', 'Response sent');
            } catch (error) {
              Alert.alert('Error', 'Failed to send response');
            }
          }
        }
      ]
    );
  };

  const renderUser = (user) => (
    <GlassCard key={user.id} style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userHandle}>@{user.username}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, user.is_blocked && styles.blockedButton]}
          onPress={() => handleBlockUser(user.id, user.is_blocked)}
        >
          <Ionicons
            name={user.is_blocked ? 'lock-open' : 'lock-closed'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, user.is_premium && styles.premiumButton]}
          onPress={() => handlePremiumUser(user.id, user.is_premium)}
        >
          <Ionicons name="star" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  const renderTicket = (ticket) => (
    <GlassCard key={ticket.id} style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketType}>{ticket.type.toUpperCase()}</Text>
        <Text style={[
          styles.ticketStatus,
          ticket.status === 'resolved' && styles.resolved
        ]}>
          {ticket.status}
        </Text>
      </View>
      <Text style={styles.ticketSubject}>{ticket.subject}</Text>
      <Text style={styles.ticketContent}>{ticket.content}</Text>
      <Text style={styles.ticketUser}>By: {ticket.name} (@{ticket.username})</Text>
      {ticket.admin_response && (
        <View style={styles.adminResponse}>
          <Text style={styles.adminResponseLabel}>Admin Response:</Text>
          <Text style={styles.adminResponseText}>{ticket.admin_response}</Text>
        </View>
      )}
      {ticket.status !== 'resolved' && (
        <TouchableOpacity
          style={styles.respondButton}
          onPress={() => handleRespondTicket(ticket.id)}
        >
          <Text style={styles.respondButtonText}>Respond</Text>
        </TouchableOpacity>
      )}
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
          onPress={() => setActiveTab('tickets')}
        >
          <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
            Support
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : activeTab === 'users' ? (
          users.map(renderUser)
        ) : (
          tickets.map(renderTicket)
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
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: fonts.medium,
  },
  activeTabText: {
    color: colors.text.light,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
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
  userPhone: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedButton: {
    backgroundColor: colors.status.error,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
  },
  ticketCard: {
    marginBottom: 15,
    padding: 15,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ticketType: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  ticketStatus: {
    fontSize: fontSizes.sm,
    color: colors.status.warning,
    fontFamily: fonts.medium,
  },
  resolved: {
    color: colors.status.success,
  },
  ticketSubject: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
    marginBottom: 5,
  },
  ticketContent: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: 10,
    fontFamily: fonts.regular,
  },
  ticketUser: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: 10,
    fontFamily: fonts.regular,
  },
  adminResponse: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  adminResponseLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: 5,
    fontFamily: fonts.bold,
  },
  adminResponseText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.regular,
  },
  respondButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  respondButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
});

export default AdminPanelScreen;
