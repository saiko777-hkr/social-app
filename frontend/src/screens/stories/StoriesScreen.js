import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { storyAPI } from '../../services/api';

const { width } = Dimensions.get('window');

const StoriesScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await storyAPI.getStories();
      setStories(response.data);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = async (story) => {
    try {
      await storyAPI.viewStory(story.id);
      navigation.navigate('StoryViewer', { story });
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };

  const renderStory = (story) => (
    <TouchableOpacity
      key={story.id}
      style={styles.storyItem}
      onPress={() => handleViewStory(story)}
    >
      <View style={styles.storyAvatarContainer}>
        <Image source={{ uri: story.image_url }} style={styles.storyImage} />
        <View style={styles.storyAvatar}>
          <Text style={styles.storyAvatarText}>
            {story.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.storyName}>{story.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity
          style={styles.addStoryButton}
          onPress={() => navigation.navigate('CreateStory')}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : stories.length === 0 ? (
          <Text style={styles.emptyText}>No stories yet</Text>
        ) : (
          <View style={styles.storiesGrid}>
            {stories.map(renderStory)}
          </View>
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
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  addStoryButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  storyItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  storyAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  storyImage: {
    width: 80,
    height: 140,
    borderRadius: 12,
  },
  storyAvatar: {
    position: 'absolute',
    bottom: -10,
    left: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyAvatarText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  storyName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: fonts.medium,
    textAlign: 'center',
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

export default StoriesScreen;
