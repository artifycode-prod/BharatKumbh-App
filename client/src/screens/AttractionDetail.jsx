import React from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';

export const AttractionDetail = ({route, navigation}) => {
  const { t } = useLanguage();
  const {attraction} = route.params || {};
  const screenWidth = Dimensions.get('window').width;

  // Get translated text by attraction id (language-aware)
  const id = attraction?.id;
  const displayName = id ? (t(`attraction${id}Name`) || attraction.name) : attraction?.name;
  const displayTag = id ? (t(`attraction${id}Tag`) || attraction.tag) : attraction?.tag;
  const displayInfo = id ? (t(`attraction${id}Info`) || attraction.info) : attraction?.info;
  const displayDescription = id ? (t(`attraction${id}Description`) || attraction.info) : attraction?.info;

  if (!attraction) {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#7C2D12', fontSize: 16}}>{t('attractionNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#FFF7ED'}}>
      <View style={{
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFF7ED',
      }}>
        <Header 
          title={displayName} 
          icon="🛕" 
          onBack={() => navigation.goBack()} 
        />
      </View>
      
      <ScrollView 
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={{
          width: screenWidth,
          height: 280,
          position: 'relative',
        }}>
          <Image
            source={attraction.image}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
            }}
          />
          {/* Tag Badge */}
          <View style={{
            position: 'absolute',
            top: 20,
            right: 16,
            backgroundColor: 'rgba(255,107,53,0.95)',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 4,
            elevation: 5,
          }}>
            <Text style={{color: 'white', fontSize: 12, fontWeight: '700'}}>{displayTag}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={{padding: 20, paddingTop: 24}}>
          {/* Title */}
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#7C2D12',
            marginBottom: 12,
            letterSpacing: 0.3,
            lineHeight: 34,
          }}>
            {displayName}
          </Text>

          {/* Distance */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: 'rgba(255,107,53,0.12)',
            borderRadius: 14,
            alignSelf: 'flex-start',
            borderWidth: 1,
            borderColor: 'rgba(255,107,53,0.2)',
          }}>
            <Text style={{fontSize: 18, marginRight: 10}}>📍</Text>
            <Text style={{color: '#7C2D12', fontSize: 15, fontWeight: '700'}}>{attraction.distance} {t('fromNashik')}</Text>
          </View>

          {/* Description */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: {width: 0, height: 4},
            shadowRadius: 12,
            elevation: 3,
            borderWidth: 1,
            borderColor: 'rgba(251,146,60,0.15)',
          }}>
            <Text style={{
              fontSize: 15,
              color: '#374151',
              lineHeight: 24,
              marginBottom: 16,
              fontWeight: '500',
            }}>
              {displayInfo}
            </Text>
            
            {/* Additional Information - full description */}
            <View style={{
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
              paddingTop: 12,
              marginTop: 12,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#7C2D12',
                marginBottom: 8,
              }}>
                {t('aboutThisPlace')}
              </Text>
              <Text style={{
                fontSize: 13,
                color: '#6B7280',
                lineHeight: 20,
              }}>
                {displayDescription}
              </Text>
            </View>
          </View>

          {/* Visiting Information */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: {width: 0, height: 4},
            shadowRadius: 12,
            elevation: 3,
            borderWidth: 1,
            borderColor: 'rgba(251,146,60,0.15)',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#7C2D12',
              marginBottom: 16,
            }}>
              {t('visitingInformation')}
            </Text>
            <View style={{gap: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,107,53,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{fontSize: 20}}>🕐</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#374151', fontSize: 14, fontWeight: '700', marginBottom: 4}}>{t('timings')}</Text>
                  <Text style={{color: '#6B7280', fontSize: 13, lineHeight: 20}}>{t('open24Hours')}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,107,53,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{fontSize: 20}}>🚗</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#374151', fontSize: 14, fontWeight: '700', marginBottom: 4}}>{t('transport')}</Text>
                  <Text style={{color: '#6B7280', fontSize: 13, lineHeight: 20}}>{t('shuttleServiceAvailable')}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,107,53,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{fontSize: 20}}>👥</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{color: '#374151', fontSize: 14, fontWeight: '700', marginBottom: 4}}>{t('bestTime')}</Text>
                  <Text style={{color: '#6B7280', fontSize: 13, lineHeight: 20}}>{t('bestTimeForDarshan')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};



