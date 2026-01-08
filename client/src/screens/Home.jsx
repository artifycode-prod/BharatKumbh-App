import React from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { useLanguage } from '../contexts/LanguageContext';
import { styles } from '../styles/styles';

export const Home = ({go, onProfile, onSignOut}) => {
  const { t, currentLanguage } = useLanguage();
  const [chatbotVisible, setChatbotVisible] = React.useState(false);
  const [chatbotMessages, setChatbotMessages] = React.useState([
    {from: 'bot', text: t('selectQuestionBelow')},
  ]);
  
  // Update chatbot message when language changes
  React.useEffect(() => {
    setChatbotMessages([{from: 'bot', text: t('selectQuestionBelow')}]);
  }, [currentLanguage, t]);
  
  const [cmIndex, setCmIndex] = React.useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = React.useState(0);
  const [attractionsScrollIndex, setAttractionsScrollIndex] = React.useState(0);
  const messagesRef = React.useRef(null);
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
  ], [t]);

  // Nashik Attractions Data
  const nashikAttractions = [
    {id: 1, name: 'Trimbakeshwar Temple', distance: '28 km', tag: 'Jyotirlinga', info: 'One of the 12 Jyotirlingas, sacred Shiva temple', image: require('../../assets/images/trambakeshwar.jpg')},
    {id: 2, name: 'Ramkund & Godavari Ghat', distance: '2 km', tag: 'Holy Dip', info: 'Sacred bathing ghat on the banks of Godavari river', image: require('../../assets/images/ramkund.jpg')},
    {id: 3, name: 'Panchvati', distance: '3 km', tag: 'Ramayana', info: 'Historic site from Ramayana, where Lord Rama stayed', image: require('../../assets/images/panchavati.jpg')},
    {id: 4, name: 'Saptashrungi Devi', distance: '65 km', tag: 'Shakti Peeth', info: 'One of the 51 Shakti Peethas, powerful goddess temple', image: require('../../assets/images/saptashrungi.jpg')},
  ];

  // CM and PM Data for Carousel
  const leaderData = [
    {
      id: 1,
      name: 'Shri Narendra Modi',
      title: 'Prime Minister of India',
      image: require('../../assets/images/pm.jpg'),
    },
    {
      id: 2,
      name: 'Shri Devendra Fadnavis',
      title: 'Chief Minister, Maharashtra',
      image: require('../../assets/images/cm.webp'),
    },
  ];

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

  const nashikFoods = [
    {
      id: 1, 
      name: 'Misal Pav', 
      desc: 'Spicy local favourite for breakfast', 
      emoji: '🍲',
      image: misalImage
    },
    {
      id: 2, 
      name: 'Kanda Poha', 
      desc: 'Light & filling snack near ghats', 
      emoji: '🥣',
      image: pohaImage
    },
    {
      id: 3, 
      name: 'Grapes & Juice', 
      desc: 'Famous Nashik vineyards & fruit', 
      emoji: '🍇',
      image: grapesImage
    },
  ];


  React.useEffect(() => {
    if (chatbotVisible && messagesRef.current) {
      setTimeout(() => {
        messagesRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [chatbotMessages.length, chatbotVisible]);

  const quickQuestions = [
    'Ganga Aarti time?',
    'Nearest medical help',
    'Lost & Found center',
    'Crowd status',
    'Parking facilities',
  ];

  const quickAnswers = {
    'Ganga Aarti time?': 'Ganga Aarti at Ramkund starts ~6:30 PM daily. Best time to visit is 6:00 PM.',
    'Nearest medical help': 'Panchavati First Aid Camp is open 24x7 near Ramkund. Emergency: 108',
    'Lost & Found center': 'Located beside the Kumbh Control Room at the main entrance. Open 24 hours.',
    'Crowd status': 'Moderate now; expect higher flow after 5 PM. Peak hours: 6-9 AM and 5-8 PM.',
    'Parking facilities': 'Multiple parking zones available. Main parking near entry gate. Shuttle service to ghats.',
  };

  const handleQuickQuestion = (question) => {
    setChatbotMessages((m) => [...m, {from: 'user', text: question}]);
    setTimeout(() => {
      setChatbotMessages((m) => [...m, {from: 'bot', text: quickAnswers[question] || 'I can help you with that. Please visit the full chatbot for more details.'}]);
    }, 500);
  };


  return (
    <View style={{flex: 1, backgroundColor: '#FFF7ED'}}>
      {/* Top Bar - Title and Profile - Fixed Sticky Header */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 40 : 12,
        paddingBottom: 8,
        backgroundColor: 'rgba(255,247,237,0.95)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(251,146,60,0.15)',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 5,
      }}>
        {/* Maha Kumbh 2027 Text */}
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#7C2D12',
          flex: 1,
        }}>
          {t('mahaKumbh2027')}
        </Text>

        {/* Profile Icon - Matching App Theme */}
        <TouchableOpacity 
          onPress={onProfile || onSignOut} 
          activeOpacity={0.8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FF6B35',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{fontSize: 20, color: 'white'}}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={{paddingTop: Platform.OS === 'ios' ? 70 : 60, paddingBottom: 120, paddingHorizontal: 0}}
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
                    go('AttractionDetail', {attraction: spot});
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
          <View
            key={item.id}
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
          </View>
        ))}
      </ScrollView>
      
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
        <ServiceTile label={t('navigation')} icon="🧭" onPress={() => go('navigation')} />
        <ServiceTile label={t('medical')} icon="🚑" onPress={() => go('medical')} />
        <ServiceTile label={t('qrCheckin')} icon="📱" onPress={() => go('qr')} />
        <ServiceTile label={t('lostFound')} icon="🔍" onPress={() => go('lost')} />
      </View>


      {/* Chatbot Modal */}
      <Modal
        isVisible={chatbotVisible}
        onBackdropPress={() => setChatbotVisible(false)}
        onSwipeComplete={() => setChatbotVisible(false)}
        swipeDirection={['down']}
        style={{justifyContent: 'flex-end', margin: 0}}
        backdropOpacity={0.5}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, justifyContent: 'flex-end'}}
        >
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            maxHeight: '80%',
            paddingTop: 20,
            paddingBottom: Platform.OS === 'ios' ? 30 : 20
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#F3F4F6'
            }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#FFF5F0',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{fontSize: 20}}>🪷</Text>
                </View>
                <View>
                  <Text style={{fontSize: 16, fontWeight: '700', color: '#1F2937'}}>{t('divineAssistant')}</Text>
                  <Text style={{fontSize: 12, color: '#6B7280'}}>Quick Help</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setChatbotVisible(false);
                    setTimeout(() => {
                      go('chatbot');
                    }, 300);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: '#FF6B35',
                    borderRadius: 12,
                    shadowColor: '#FF6B35',
                    shadowOpacity: 0.3,
                    shadowOffset: {width: 0, height: 2},
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{fontSize: 13, fontWeight: '700', color: 'white'}}>{t('fullAssistant')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setChatbotVisible(false)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 8
                  }}
                >
                  <Text style={{fontSize: 18}}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={messagesRef}
              style={{maxHeight: 300, paddingHorizontal: 20, paddingTop: 15}}
              contentContainerStyle={{paddingBottom: 10}}
              showsVerticalScrollIndicator={false}
            >
              {chatbotMessages.map((m, idx) => (
                m.from === 'bot' ? (
                  <View key={idx} style={{flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start'}}>
                    <View style={{
                      backgroundColor: '#FFF5F0',
                      borderRadius: 12,
                      padding: 12,
                      maxWidth: '80%',
                      borderTopLeftRadius: 4
                    }}>
                      <Text style={{fontSize: 14, color: '#1F2937', lineHeight: 20}}>{m.text}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={idx} style={{flexDirection: 'row', marginBottom: 12, justifyContent: 'flex-end'}}>
                    <View style={{
                      backgroundColor: '#FF6B35',
                      borderRadius: 12,
                      padding: 12,
                      maxWidth: '80%',
                      borderTopRightRadius: 4
                    }}>
                      <Text style={{fontSize: 14, color: 'white', lineHeight: 20}}>{m.text}</Text>
                    </View>
                  </View>
                )
              ))}
            </ScrollView>

            {/* Quick Questions */}
            <View style={{paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10}}>
              <Text style={{fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8}}>{t('quickQuestions')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
                <View style={{flexDirection: 'row', gap: 8}}>
                  {quickQuestions.map((q, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleQuickQuestion(q)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: '#FFF5F0',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#FFE5D9'
                      }}
                    >
                      <Text style={{fontSize: 12, color: '#FF6B35', fontWeight: '600'}}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>

      {/* Modern Floating Chatbot Button */}
      <TouchableOpacity
        onPress={() => setChatbotVisible(true)}
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: 32,
          zIndex: 1000,
        }}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF8C42', '#FF9933']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#FF6B35',
            shadowOpacity: 0.4,
            shadowOffset: {width: 0, height: 6},
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{fontSize: 28}}>🪷</Text>
          </View>
        </LinearGradient>
        {/* Notification Badge */}
        <View style={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: '#3B82F6',
          borderWidth: 3,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'white',
          }} />
        </View>
        {/* Pulse Animation Ring */}
        <View style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: 36,
          borderWidth: 2,
          borderColor: 'rgba(255,107,53,0.3)',
        }} />
      </TouchableOpacity>
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

