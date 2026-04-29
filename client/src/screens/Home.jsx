import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { useLanguage } from '../contexts/LanguageContext';
import { styles } from '../styles/styles';

export const Home = ({go, onProfile, onSignOut}) => {
  const { t, currentLanguage, languageVersion } = useLanguage();
  const [foodDetailVisible, setFoodDetailVisible] = React.useState(false);
  const [selectedFood, setSelectedFood] = React.useState(null);
  const [cmIndex, setCmIndex] = React.useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = React.useState(0);
  const [attractionsScrollIndex, setAttractionsScrollIndex] = React.useState(0);
  const heroSlidesRef = React.useRef(null);
  const attractionsScrollRef = React.useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const heroCardWidth = screenWidth; // Full screen width
  const heroCardHeight = screenHeight * 0.55; // 55% of screen height (increased)

  // Hero Slides Data with Images - Updates when language changes
  const heroSlides = React.useMemo(() => [
    {
      id: 1,
      title: t('mahaKumbh2027'),
      // subtitle: 'Nashik - Sacred dip on the banks of Godavari',
      // dates: '13 January - 26 February',
      image: require('../../assets/images/sadhu1.jpg'), // First sadhu image
    },
    {
      id: 2,
      title: t('mahaKumbh2027'),
      // subtitle: 'Join millions of devotees in this divine gathering',
      // dates: '13 January - 26 February',
      image: require('../../assets/images/sadhu2.jpg'), // Second sadhu image
    },
    {
      id: 3,
      title: t('mahaKumbh2027'),
      // subtitle: 'Experience the spiritual journey of a lifetime',
      // dates: '13 January - 26 February',
      image: require('../../assets/images/sadhu3.jpg'), // Third sadhu image
    },
  ], [t, currentLanguage, languageVersion]);

  // Nashik Attractions Data - uses t() for language support
  const nashikAttractions = React.useMemo(() => [
    {id: 1, name: t('attraction1Name'), distance: '28 km', tag: t('attraction1Tag'), info: t('attraction1Info'), image: require('../../assets/images/trambakeshwar.jpg')},
    {id: 2, name: t('attraction2Name'), distance: '2 km', tag: t('attraction2Tag'), info: t('attraction2Info'), image: require('../../assets/images/ramkund.jpg')},
    {id: 3, name: t('attraction3Name'), distance: '3 km', tag: t('attraction3Tag'), info: t('attraction3Info'), image: require('../../assets/images/panchavati.jpg')},
    {id: 4, name: t('attraction4Name'), distance: '65 km', tag: t('attraction4Tag'), info: t('attraction4Info'), image: require('../../assets/images/saptashrungi.jpg')},
  ], [t, currentLanguage, languageVersion]);

  // CM and PM Data for Carousel - uses t() for language support
  const leaderData = React.useMemo(() => [
    {
      id: 1,
      name: t('pmName'),
      title: t('pmTitle'),
      image: require('../../assets/images/pm.jpg'),
    },
    {
      id: 2,
      name: t('cmName'),
      title: t('cmTitle'),
      image: require('../../assets/images/cm.webp'),
    },
  ], [t, currentLanguage, languageVersion]);

  // Auto-rotate hero slides
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (heroSlideIndex + 1) % heroSlides.length;
      setHeroSlideIndex(nextIndex);
      if (heroSlidesRef.current) {
        heroSlidesRef.current.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
      }
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [heroSlideIndex, screenWidth]);

  // Auto-scroll attractions
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (attractionsScrollRef.current && nashikAttractions.length > 0) {
        const cardWidth = 220 + 16; // card width + margin
        const maxScroll = (nashikAttractions.length - 1) * cardWidth;
        const currentScroll = attractionsScrollIndex * cardWidth;
        
        if (currentScroll >= maxScroll) {
          // Reset to beginning
          setAttractionsScrollIndex(0);
          attractionsScrollRef.current.scrollTo({
            x: 0,
            animated: true,
          });
        } else {
          // Move to next
          const nextIndex = attractionsScrollIndex + 1;
          setAttractionsScrollIndex(nextIndex);
          attractionsScrollRef.current.scrollTo({
            x: nextIndex * cardWidth,
            animated: true,
          });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, [attractionsScrollIndex, nashikAttractions.length]);

  // Food images using local images - require statements must be at module level
  const misalImage = require('../../assets/images/misal.jpg');
  const pohaImage = require('../../assets/images/Kanda-Poha.jpg');
  const grapesImage = require('../../assets/images/grapes.jpg');

  const nashikFoods = React.useMemo(() => [
    {
      id: 1,
      name: t('food1Name'),
      desc: t('food1Desc'),
      emoji: '🍲',
      image: misalImage
    },
    {
      id: 2,
      name: t('food2Name'),
      desc: t('food2Desc'),
      emoji: '🥣',
      image: pohaImage
    },
    {
      id: 3,
      name: t('food3Name'),
      desc: t('food3Desc'),
      emoji: '🍇',
      image: grapesImage
    },
  ], [t, currentLanguage, languageVersion]);


  return (
    <View style={{flex: 1, backgroundColor: '#FFF7ED'}}>
      {/* Top Bar - Title and Profile - Fixed Sticky Header */}


      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={{paddingTop: 0, paddingBottom: 120, paddingHorizontal: 0}}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Large Image with Carousel - Scrollable - Full Width */}
        <View style={{
          height: heroCardHeight,
          width: screenWidth,
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 20,
        }}>
        <ScrollView
          ref={heroSlidesRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setHeroSlideIndex(slideIndex);
          }}
          scrollEventThrottle={16}
        >
          {heroSlides.map((slide, index) => (
            <View
              key={slide.id}
              style={{
                width: screenWidth,
                height: heroCardHeight,
                position: 'relative',
                backgroundColor: '#000',
              }}
            >
              {/* Hero Image Background */}
              <Image
                source={slide.image}
                style={{
                  width: screenWidth,
                  height: heroCardHeight,
                  resizeMode: 'cover',
                }}
                defaultSource={require('../../assets/images/app-icon.png')}
              />

              {/* Dark Overlay */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }} />

              {/* Content Overlay - Text at Bottom */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'flex-end',
                padding: 24,
                paddingBottom: 30,
              }}>
                {/* Text Content at Bottom - Only Title - Single Line Small */}
                <View style={{alignItems: 'center'}}>
                  <Text 
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      textShadowColor: 'rgba(0,0,0,0.8)',
                      textShadowOffset: {width: 0, height: 2},
                      textShadowRadius: 6,
                      marginBottom: 16,
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {slide.title}
                  </Text>

                  {/* Dots Indicator */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    {heroSlides.map((_, idx) => (
                      <View
                        key={idx}
                        style={{
                          width: idx === heroSlideIndex ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: idx === heroSlideIndex ? 'white' : 'rgba(255,255,255,0.5)',
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

        {/* Attractions around Nashik */}
        <View style={{
          paddingHorizontal: 16,
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 22,
            fontWeight: '800',
            color: '#7C2D12',
            marginBottom: 4,
            letterSpacing: 0.3,
          }}>
            {t('attractionsAroundNashik')}
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#9A3412',
            fontWeight: '500',
          }}>
            {t('exploreSacredPlaces')}
          </Text>
        </View>
        <ScrollView
          ref={attractionsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 12}}
          contentContainerStyle={{paddingRight: 16}}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const cardWidth = 220 + 16; // card width + margin
            const scrollIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
            setAttractionsScrollIndex(scrollIndex);
          }}
        >
          <View style={{flexDirection: 'row', paddingVertical: 4}}>
            {nashikAttractions.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                activeOpacity={0.9}
                onPress={() => {
                  try {
                    go && go('AttractionDetail', {attraction: spot});
                  } catch (error) {
                    console.error('Error navigating to AttractionDetail:', error);
                  }
                }}
                style={{
                  width: 220,
                  marginRight: 16,
                  borderRadius: 20,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: 'rgba(251,146,60,0.2)',
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: {width: 0, height: 2},
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {/* Image Section */}
                <View
                  style={{
                    height: 140,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={spot.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                    }}
                  />
                  {/* Tag Badge */}
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(255,107,53,0.95)',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                    <Text style={{color: 'white', fontSize: 10, fontWeight: '700'}}>{spot.tag}</Text>
                  </View>
                  {/* Name Overlay */}
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 12,
                  }}>
                    <Text style={{color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 4}} numberOfLines={2}>
                      {spot.name}
                    </Text>
                  </View>
                </View>
                {/* Info Section */}
                <View style={{
                  padding: 12,
                  backgroundColor: 'white',
                }}>
                  <Text style={{
                    color: '#6B7280',
                    fontSize: 11,
                    lineHeight: 16,
                    numberOfLines: 2,
                  }} numberOfLines={2}>
                    {spot.info}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      {/* PM and CM Section - Sliding Carousel */}
      <View style={{
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 3,
      }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const cardWidth = screenWidth - 64; // Account for margins
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
            setCmIndex(slideIndex);
          }}
          scrollEventThrottle={16}
        >
          {leaderData.map((leader, index) => (
            <View
              key={leader.id}
              style={{
                width: screenWidth - 64,
                alignItems: 'center',
                paddingHorizontal: 8,
              }}
            >
              <View style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                overflow: 'hidden',
                marginBottom: 12,
                borderWidth: 3,
                borderColor: '#FF6B35',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: {width: 0, height: 4},
                shadowRadius: 8,
                elevation: 5,
              }}>
                <Image
                  source={leader.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              </View>
              <Text style={{
                fontSize: 17,
                fontWeight: '700',
                color: '#1F2937',
                textAlign: 'center',
                marginBottom: 4,
              }}>
                {leader.name}
              </Text>
              <Text style={{
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                fontWeight: '500',
              }}>
                {leader.title}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Dots Indicator */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          marginTop: 12,
        }}>
          {leaderData.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: idx === cmIndex ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: idx === cmIndex ? '#FF6B35' : '#E5E7EB',
              }}
            />
          ))}
        </View>
      </View>

      {/* Taste of Nashik */}
      <View style={{
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 22,
          fontWeight: '800',
          color: '#7C2D12',
          marginBottom: 4,
          letterSpacing: 0.3,
        }}>
          {t('tasteOfNashik')}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#9A3412',
          fontWeight: '500',
          marginBottom: 16,
        }}>
          {t('discoverLocalDelicacies')}
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 12}}
        contentContainerStyle={{paddingRight: 16, paddingLeft: 16}}
      >
        {nashikFoods.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => {
              setSelectedFood(item);
              setFoodDetailVisible(true);
            }}
            style={{
              width: 200,
              marginRight: 16,
              borderRadius: 20,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'rgba(251,146,60,0.2)',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: {width: 0, height: 2},
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {/* Image Header */}
            <View style={{
              height: 140,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {item.image ? (
                <>
                  <Image
                    source={item.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                    onError={(error) => {
                      console.log('Image load error:', error.nativeEvent.error, 'for item:', item.name);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully for:', item.name);
                    }}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                    }}
                  />
                </>
              ) : (
                <View style={{
                  height: '100%',
                  backgroundColor: 'rgba(255,107,53,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: {width: 0, height: 2},
                    shadowRadius: 4,
                    elevation: 3,
                  }}>
                    <Text style={{fontSize: 40}}>{item.emoji}</Text>
                  </View>
                </View>
              )}
              {/* Emoji Badge Overlay */}
              <View style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255,255,255,0.95)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 4,
                elevation: 4,
              }}>
                <Text style={{fontSize: 24}}>{item.emoji}</Text>
              </View>
            </View>
            
            {/* Content */}
            <View style={{padding: 16}}>
              <Text style={{
                color: '#7C2D12',
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 6,
              }}>
                {item.name}
              </Text>
              <Text style={{
                color: '#6B7280',
                fontSize: 12,
                lineHeight: 18,
              }} numberOfLines={2}>
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Detail Modal */}
      <Modal
        isVisible={foodDetailVisible}
        onBackdropPress={() => setFoodDetailVisible(false)}
        onSwipeComplete={() => setFoodDetailVisible(false)}
        swipeDirection={['down']}
        style={{justifyContent: 'center', margin: 20}}
        backdropOpacity={0.5}
      >
        {selectedFood && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
          }}>
            <Text style={{fontSize: 24, fontWeight: '800', color: '#7C2D12', marginBottom: 8}}>{selectedFood.name}</Text>
            <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16}}>{selectedFood.desc}</Text>
            <TouchableOpacity
              onPress={() => setFoodDetailVisible(false)}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: '#FF6B35',
                borderRadius: 12,
              }}
            >
              <Text style={{color: 'white', fontWeight: '700'}}>{t('ok')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
      
      {/* Safety Note */}
      <View style={{
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        padding: 12,
        backgroundColor: 'rgba(255,251,235,0.8)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(251,146,60,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Text style={{fontSize: 18, marginRight: 10}}>⚠️</Text>
        <Text style={{
          color: '#7C2D12',
          fontSize: 11,
          flex: 1,
          lineHeight: 16,
        }}>
          {t('eatOnlyCleanStalls')}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, {marginHorizontal: 16, marginTop: 8}]}>{t('sacredServices')}</Text>
      <View style={[styles.grid, {marginHorizontal: 16}]}>
        <ServiceTile label={t('navigation')} icon="🧭" onPress={() => go && go('Navigation')} />
        <ServiceTile label={t('medical')} icon="🚑" onPress={() => go && go('Medical')} />
        <ServiceTile label={t('qrCheckin')} icon="📱" onPress={() => go && go('QR')} />
        <ServiceTile label={t('lostFound')} icon="🔍" onPress={() => go && go('Lost')} />
      </View>
    </ScrollView>
    </View>
  );
};

const getSubtitle = (label) => {
  switch (label) {
    case 'Navigation':
      return 'Sacred Routes';
    case 'Medical':
      return 'Health Support';
    case 'QR Check-in':
      return 'Group Registry';
    default:
      return '';
  }
};

const ServiceTile = ({label, icon, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.tile}>
    <LinearGradient colors={['#FFB74D', '#FF9800']} style={styles.tileBadge}>
      <Text style={styles.tileEmoji}>{icon}</Text>
    </LinearGradient>
    <Text style={styles.tileTitle}>{label}</Text>
    <Text style={styles.tileSubtitle}>{getSubtitle(label)}</Text>
  </TouchableOpacity>
);

