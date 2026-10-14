import React, { useState } from 'react';
import {
  View,
  Text,
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
import { storyAPI } from '../../services/api';

const CreateStoryScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('friends');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCreateStory = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setLoading(true);
    try {
      await storyAPI.createStory({
        image_url: image,
        caption,
        privacy
      });
      Alert.alert('Success', 'Story created');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create story');
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
        <Text style={styles.headerTitle}>Create Story</Text>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={handleCreateStory}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Ionicons name="camera" size={48} color={colors.primary} />
            <Text style={styles.pickImageText}>Tap to add photo</Text>
          </TouchableOpacity>
        )}

        <GlassCard style={styles.optionsCard}>
          <Text style={styles.label}>Caption (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Add a caption..."
            placeholderTextColor={colors.text.secondary}
            value={caption}
            onChangeText={setCaption}
          />

          <Text style={styles.label}>Privacy</Text>
          <View style={styles.privacyOptions}>
            <TouchableOpacity
              style={[styles.privacyOption, privacy === 'public' && styles.selectedPrivacy]}
              onPress={() => setPrivacy('public')}
            >
              <Ionicons
                name="globe"
                size={20}
                color={privacy === 'public' ? colors.primary : colors.text.secondary}
              />
              <Text style={[
                styles.privacyText,
                privacy === 'public' && styles.selectedPrivacyText
              ]}>
                Public
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.privacyOption, privacy === 'friends' && styles.selectedPrivacy]}
              onPress={() => setPrivacy('friends')}
            >
              <Ionicons
                name="people"
                size={20}
                color={privacy === 'friends' ? colors.primary : colors.text.secondary}
              />
              <Text style={[
                styles.privacyText,
                privacy === 'friends' && styles.selectedPrivacyText
              ]}>
                Friends
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.privacyOption, privacy === 'custom' && styles.selectedPrivacy]}
              onPress={() => setPrivacy('custom')}
            >
              <Ionicons
                name="person"
                size={20}
                color={privacy === 'custom' ? colors.primary : colors.text.secondary}
              />
              <Text style={[
                styles.privacyText,
                privacy === 'custom' && styles.selectedPrivacyText
              ]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Stories expire after 24 hours
            </Text>
          </View>
        </GlassCard>
      </View>
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
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: colors.text.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  pickImageButton: {
    height: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.glass.border,
    borderStyle: 'dashed',
  },
  pickImageText: {
    marginTop: 15,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  optionsCard: {
    padding: 20,
    marginBottom: 20,
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
  privacyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  selectedPrivacy: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: colors.primary,
  },
  privacyText: {
    marginLeft: 5,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: fonts.regular,
  },
  selectedPrivacyText: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  infoCard: {
    padding: 15,
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
  },
});

export default CreateStoryScreen;
