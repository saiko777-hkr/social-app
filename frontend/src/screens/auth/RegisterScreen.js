import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { fonts, fontSizes, fontWeights } from '../../theme/typography';
import { authAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phone || !password || !name || !username) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        phone,
        password,
        name,
        username
      });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join SocialConnect</Text>

        <GlassCard style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={colors.text.secondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.text.secondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.text.secondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: fonts.bold,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: fonts.regular,
  },
  card: {
    padding: 30,
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: fontSizes.md,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.text.light,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    fontFamily: fonts.bold,
  },
  linkText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
});

export default RegisterScreen;
