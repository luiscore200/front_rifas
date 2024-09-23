import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, Animated, TouchableOpacity, Linking, Text, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';
import { getStorageItemAsync } from '../../services/storage';
import { generalConfig } from '../../services/api';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(viewportWidth * 0.7);
const ITEM_HEIGHT = Math.round(viewportHeight * 0.65);

export default function App() {
  const { auth, logout, subContext,mySubContext,setSubContext } = useAuth();
  const [sub, setSub] = useState<any>();
  const [images, setImages] = useState<any[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);

  useEffect(() => {
    console.log('sub',subContext);
    console.log('mysub',mySubContext);
  
    if (Array.isArray(subContext)) {
      const loadedImages = subContext
        .filter(element => element.url !== "" && element.image !== "")
        .map((element, index) => ({ id: index, src: element.image, url: element.url }));
      setImages(loadedImages);
    }else{
       handle();
    }
 
  }, []);

  const handle = async () => {
    try {
      const aa = await getStorageItemAsync('subscriptions');
      const subscriptions = aa ? JSON.parse(aa) : [];
  
      if (Array.isArray(subscriptions) && subscriptions.length > 0) {
        setSubContext(subscriptions);
        // Process local storage data
        const loadedImages = subscriptions
          .filter((element: any) => element.url !== "" && element.image !== "")
          .map((element: any, index: number) => ({ id: index, src: element.image, url: element.url }));
        setImages(loadedImages);
      } else {
        try {
          // Fetch remote data if local storage is empty
          const response = await generalConfig();
          if (response.mensaje) {
            const remoteSubscriptions = response.subscriptions || [];
            if (Array.isArray(remoteSubscriptions) && remoteSubscriptions.length > 0) {
              setSubContext(remoteSubscriptions);
              const loadedImages = remoteSubscriptions
                .filter((element: any) => element.url !== "" && element.image !== "")
                .map((element: any, index: number) => ({ id: index, src: element.image, url: element.url }));
              setImages(loadedImages);
            }
          }
        } catch (error) {
          console.error('Failed to fetch remote configuration:', error);
        }
      }
    } catch (error) {
      console.error('Failed to retrieve or parse storage item:', error);
    }
  };
  
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


const CarouselItem = ({ item }:any) => (
 
      <TouchableOpacity style={{margin:20,borderRadius:15,   
        height: ITEM_HEIGHT,}}  onPress={() => openLink(item.url)}>
          <Image source={{ uri: item.src }} style={[styles.image,
              
                isSmallScreen && {width:300 },
                isMediumScreen && {width:300},
                isLargeScreen &&  {width:400},
                isXLargeScreen &&  {width:400},]}
            />
        </TouchableOpacity>
  
);


  return (
    <GradientLayout navigationItems={[
      { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"), status: 1 },
      { label: 'Suscripcion', action: () => undefined, status: 0 },
      { label: 'Configuracion', action: () => router.push('/user/userSettings'), status: 1 },
      { label: 'Logout', action: async () => await logout(), status: auth === true ? 1 : 0 },
    ]} hasDrawer={true} size={(a,b,c,d)=>{setIsSmallScreen(a);setIsMediumScreen(b);setIsLargeScreen(c);setIsXLargeScreen(d)}}>
      <View style={styles.container}>
      {Platform.OS === 'web' ? (
  (isSmallScreen || isMediumScreen) ? (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ width: '100%' }}
    >
      {images.map((item) => (
        <CarouselItem key={item.id} item={item} />
      ))}
    </ScrollView>
  ) : (
    <View style={{ width: '100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      {images.map((item) => (
        <CarouselItem key={item.id} item={item} />
      ))}
    </View>
  )
) : (
  <View style={{ width: '100%' }}>
    {images.map((item) => (
      <CarouselItem key={item.id} item={item} />
    ))}
  </View>
)}

            {(Platform.OS==='android' || Platform.OS==='ios') && (
           <View>
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
        )
        }
      
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
    overflow:'hidden'
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
