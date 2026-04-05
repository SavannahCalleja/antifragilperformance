import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const handleEnter = () => {
    setShowEntry(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const diamondEmblem = (
    <Animated.View style={[styles.diamondContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleEnter} disabled={showEntry}>
        <View style={styles.diamond}>
          <View style={styles.textWrapper}>
            <Text style={styles.emblemMain}>ANTIFRAGIL</Text>
            <Text style={styles.emblemSub}>PERFORMANCE</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, showEntry && styles.containerPostEntry]}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {!showEntry ? (
            <>
              {diamondEmblem}
              <TouchableOpacity style={styles.startBtn} onPress={handleEnter}>
                <Text style={styles.startBtnText}>TAP TO BEGIN</Text>
              </TouchableOpacity>
              <View style={styles.footer}>
                <Text style={styles.tagline}>REFINED BY FIRE</Text>
                <Text style={styles.verse}>James 1:12</Text>
              </View>
            </>
          ) : (
            <Animated.View
              style={[
                styles.postEntryCenter,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {diamondEmblem}
              <View style={styles.authBlock}>
                <TouchableOpacity
                  style={styles.mainBtn}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.mainBtnText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.secondaryBtnText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  containerPostEntry: { backgroundColor: '#050505' },
  keyboardRoot: { flex: 1, width: '100%' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  postEntryCenter: {
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 400,
  },
  authBlock: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
  },
  diamondContainer: {
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
  },
  diamond: {
    width: 240,
    height: 240,
    borderWidth: 4,
    borderColor: '#FF69B4',
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: { transform: [{ rotate: '-45deg' }], alignItems: 'center' },
  emblemMain: { color: '#C0C0C0', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  emblemSub: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 6,
    marginTop: 5,
  },

  startBtn: { position: 'absolute', bottom: 150 },
  startBtnText: { color: '#FF69B4', fontWeight: 'bold', letterSpacing: 3, fontSize: 14 },

  mainBtn: {
    backgroundColor: '#FF69B4',
    width: '100%',
    padding: 18,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 2 },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: '#C0C0C0',
    width: '100%',
    padding: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#C0C0C0', fontWeight: '700', fontSize: 16, letterSpacing: 2 },

  footer: { position: 'absolute', bottom: 60, alignItems: 'center' },
  tagline: { color: '#FF69B4', fontSize: 18, fontWeight: '800', letterSpacing: 4 },
  verse: { color: '#C0C0C0', fontSize: 13, marginTop: 15, fontStyle: 'italic' },
});
