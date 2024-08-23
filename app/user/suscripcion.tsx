import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, Animated, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';
import { getStorageItemAsync } from '../../services/storage';

const { width: viewportWidth, height: viewportHeigth } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(viewportWidth * 0.7);
const ITEM_HEIGHT = Math.round(viewportHeigth * 0.65);

export default function App() {
  const { user, auth, logout } = useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"), status: 1 },
    { label: 'Suscripcion', action: () => undefined, status: 0 },
    { label: 'Configuracion', action: () => router.push('/user/userSettings'), status: 1 },
    { label: 'Logout', action: async () => await logout(), status: auth === true ? 1 : 0 },
  ];

  const [sub, setSub] = useState<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    handleConfig();
  }, []);

  const openLink = (link:string) => {
  //  const url = 'https://www.mercadopago.com.co/subscriptions/checkout?preapproval_plan_id=2c9380849007283701903771e1850ce0';
    Linking.openURL(link).catch(err => console.error('Failed to open URL:', err));
  };

  const handleConfig = async () => {
    const sub = await getStorageItemAsync("subscriptions");
    setSub(sub ? JSON.parse(sub) : null);
  };

  const images:any = [];

  useEffect(() => {
    if (sub !== null && Array.isArray(sub)) {
      sub.map((element, index) => {
        // Si el elemento tiene una URL, retorna el objeto completo
        if (element.url !== "" && element.image!=="") {
           images.push({ id: index, src:element.image, url: element.url });
        }
        // Si no tiene URL, retorna un objeto con solo el id y un mensaje vacío o null
       
      });
      
      
      // Aquí puedes hacer algo con `result`, como actualizar el estado, etc.
    }
  }, [sub]);
  
  const renderItem = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
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
        <TouchableOpacity key={index} onPress={ ()=>openLink(item.url)}>
          <Image source={{ uri: item.src }} style={styles.image} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GradientLayout navigationItems={navigationItems} hasDrawer={true}>
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
          {images.map((_:any, i:any) => {
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
