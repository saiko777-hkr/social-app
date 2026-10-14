import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { postAPI } from '../../services/api';

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Error', 'Please add content or image');
      return;
    }

    setLoading(true);
    try {
      await postAPI.createPost({
        content,
        image_url: image
      });
      Alert.alert('Success', 'Post created');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
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
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={[styles.postButton, loading && styles.disabledButton]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <GlassCard style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.text.secondary}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Photo</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Your post will be visible to all users
            </Text>
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
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  postButtonText: {
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
  input: {
    fontSize: fontSizes.md,
    minHeight: 120,
    fontFamily: fonts.regular,
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 250,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: fontSizes.md,
    color: colors.primary,
    fontFamily: fonts.medium,
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

export default CreatePostScreen;
