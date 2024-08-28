import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, Animated, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(viewportWidth * 0.7);
const ITEM_HEIGHT = Math.round(viewportHeight * 0.65);

export default function App() {
  const { auth, logout, subContext } = useAuth();
  const [sub, setSub] = useState<any>(subContext || []);
  const [images, setImages] = useState<any[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Array.isArray(sub)) {
      const loadedImages = sub
        .filter(element => element.url !== "" && element.image !== "")
        .map((element, index) => ({ id: index, src: element.image, url: element.url }));
      setImages(loadedImages);
    }
  }, [sub]);

  const openLink = (link: string) => {
    Linking.openURL(link).catch(err => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }: any) => {
    const inputRange = [
      (item.id - 1) * ITEM_WIDTH,
      item.id * ITEM_WIDTH,
      (item.id + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
        <TouchableOpacity onPress={() => openLink(item.url)}>
          <Image source={{ uri: item.src }} style={styles.image} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GradientLayout navigationItems={[
      { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"), status: 1 },
      { label: 'Suscripcion', action: () => undefined, status: 0 },
      { label: 'Configuracion', action: () => router.push('/user/userSettings'), status: 1 },
      { label: 'Logout', action: async () => await logout(), status: auth === true ? 1 : 0 },
    ]} hasDrawer={true}>
      <View style={styles.container}>
        <Animated.FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
        <View style={styles.pagination}>
          {images.map((_, i) => {
            const inputRange = [
              (i - 1) * ITEM_WIDTH,
              i * ITEM_WIDTH,
              (i + 1) * ITEM_WIDTH,
            ];

            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotScale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.4, 0.8],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: dotOpacity,
                    transform: [{ scale: dotScale }],
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 40,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#595959',
    marginHorizontal: 8,
  },
});
