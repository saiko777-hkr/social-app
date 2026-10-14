import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { userAPI } from '../../services/api';

const EditProfileScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current profile data
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setDisplayName(response.data.display_name || '');
      setBio(response.data.bio || '');
      setAvatar(response.data.avatar_url);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile({
        display_name: displayName,
        bio: bio,
        avatar_url: avatar
      });
      Alert.alert('Success', 'Profile updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <GlassCard style={styles.card}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickAvatar}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color={colors.text.secondary} />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your display name"
            placeholderTextColor={colors.text.secondary}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.text.secondary}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </GlassCard>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Display name and bio are visible to all users
            </Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.warningCard}>
          <View style={styles.warningItem}>
            <Ionicons name="shield-checkmark" size={20} color={colors.status.success} />
            <View style={styles.warningText}>
              <Text style={styles.warningTitle}>Privacy Note</Text>
              <Text style={styles.warningDescription}>
                Your actual name and username can only be changed periodically (7 days for name, 25 days for username)
              </Text>
            </View>
          </View>
        </GlassCard>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.glass.border,
    borderStyle: 'dashed',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    marginTop: 10,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
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
    height: 100,
    paddingTop: 15,
  },
  infoCard: {
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 10,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  warningCard: {
    padding: 15,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
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
    color: colors.status.success,
    fontFamily: fonts.bold,
    marginBottom: 5,
  },
  warningDescription: {
    fontSize: fontSizes.sm,
    color: colors.status.success,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
});

export default EditProfileScreen;
