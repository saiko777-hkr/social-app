import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { userAPI } from '../../services/api';

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [nameColor, setNameColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorsList = [
    '#000000', '#007AFF', '#FF3B30', '#34C759',
    '#FF9500', '#5856D6', '#FF2D55', '#AF52DE'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
      setDisplayName(response.data.display_name || '');
      setBio(response.data.bio || '');
      setNameColor(response.data.name_color || '#000000');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      await userAPI.updateProfile({
        display_name: displayName,
        bio: bio,
        name_color: nameColor
      });
      Alert.alert('Success', 'Profile updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangeName = () => {
    Alert.prompt(
      'Change Name',
      'Enter your new name (can change every 7 days)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async (name) => {
            try {
              await userAPI.changeName({ name });
              Alert.alert('Success', 'Name changed');
              loadProfile();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to change name');
            }
          }
        }
      ]
    );
  };

  const handleChangeUsername = () => {
    Alert.prompt(
      'Change Username',
      'Enter your new username (can change every 25 days)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: async (username) => {
            try {
              await userAPI.changeUsername({ username });
              Alert.alert('Success', 'Username changed');
              loadProfile();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to change username');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor={colors.text.secondary}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.text.secondary}
            multiline
            numberOfLines={4}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Name Color</Text>
          <TouchableOpacity
            style={styles.colorPreview}
            onPress={() => setShowColorPicker(true)}
          >
            <View style={[styles.colorCircle, { backgroundColor: nameColor }]} />
            <Text style={styles.colorText}>Tap to change</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleChangeName}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Change Name</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleChangeUsername}>
            <Ionicons name="at" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Change Username</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Support</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Support')}
          >
            <Ionicons name="help-circle" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Get Help</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Support', { type: 'suggestion' })}
          >
            <Ionicons name="lightbulb" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Send Suggestion</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Support', { type: 'report' })}
          >
            <Ionicons name="warning" size={20} color={colors.status.error} />
            <Text style={[styles.settingText, { color: colors.status.error }]}>Report User</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      <Modal
        visible={showColorPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalContainer}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Color</Text>
            <View style={styles.colorsGrid}>
              {colorsList.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => {
                    setNameColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
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
  saveButton: {
    fontSize: fontSizes.md,
    color: colors.primary,
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
  cardTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
    marginBottom: 15,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  colorText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    padding: 30,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.bold,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
});

export default SettingsScreen;
