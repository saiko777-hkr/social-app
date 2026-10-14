import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { supportAPI } from '../../services/api';

const SupportScreen = ({ navigation, route }) => {
  const [type, setType] = useState(route.params?.type || 'support');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !content) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await supportAPI.createTicket({ type, subject, content });
      Alert.alert('Success', 'Your ticket has been submitted');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  const getTypeTitle = () => {
    switch (type) {
      case 'support':
        return 'Get Help';
      case 'suggestion':
        return 'Send Suggestion';
      case 'report':
        return 'Report User';
      default:
        return 'Support';
    }
  };

  const getTypePlaceholder = () => {
    switch (type) {
      case 'support':
        return 'Describe your issue';
      case 'suggestion':
        return 'What would you like to suggest?';
      case 'report':
        return 'Describe the issue and provide username if applicable';
      default:
        return 'Describe your request';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTypeTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Brief summary"
            placeholderTextColor={colors.text.secondary}
          />

          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder={getTypePlaceholder()}
            placeholderTextColor={colors.text.secondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Response Time</Text>
              <Text style={styles.infoDescription}>
                We typically respond within 24-48 hours
              </Text>
            </View>
          </View>
        </GlassCard>

        {type === 'report' && (
          <GlassCard style={styles.warningCard}>
            <View style={styles.warningItem}>
              <Ionicons name="warning" size={24} color={colors.status.error} />
              <View style={styles.warningText}>
                <Text style={styles.warningTitle}>False Reports</Text>
                <Text style={styles.warningDescription}>
                  Submitting false reports may result in account restrictions
                </Text>
              </View>
            </View>
          </GlassCard>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    padding: 20,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
    marginBottom: 10,
    fontFamily: fonts.bold,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: 20,
  },
  textArea: {
    height: 150,
    paddingTop: 15,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  infoCard: {
    marginBottom: 20,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  warningCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    marginLeft: 15,
  },
  warningTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.status.error,
    fontFamily: fonts.bold,
    marginBottom: 5,
  },
  warningDescription: {
    fontSize: fontSizes.sm,
    color: colors.status.error,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
});

export default SupportScreen;
