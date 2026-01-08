import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
// import { styles } from '../styles/styles';

// const FloatingIcon = ({icon, index}) => {
//   const floatAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim, {
//           toValue: 1,
//           duration: 2000 + index * 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim, {
//           toValue: 0,
//           duration: 2000 + index * 300,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();
//   }, [floatAnim, index]);

//   const translateY = floatAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -30],
//   });

//   const opacity = floatAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.3, 0.7, 0.3],
//   });

//   return (
//     <Animated.View
//       style={{
//         position: 'absolute',
//         left: `${15 + index * 15}%`,
//         top: `${20 + (index % 3) * 25}%`,
//         transform: [{translateY}],
//         opacity,
//       }}
//     >
//       <Text style={{fontSize: 32}}>{icon}</Text>
//     </Animated.View>
//   );
// };

export const Splash = ({onGetStarted}) => {
  // const pulseAnim = React.useRef(new Animated.Value(1)).current;
  // const rotateAnim = React.useRef(new Animated.Value(0)).current;
  // const fadeAnim = React.useRef(new Animated.Value(0)).current;
  // const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  // const [tapCount, setTapCount] = React.useState(0);
  const [showVideo, setShowVideo] = React.useState(true);

  // const messages = React.useMemo(
  //   () => [
  //     'Welcome to Kumbh Mela Nashik',
  //     'May your sacred journey be blessed',
  //     'Preparing your experience…',
  //     'Connecting millions of devotees...',
  //     'Your spiritual journey begins here',
  //   ],
  //   [],
  // );
  // const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    // Video stays visible until user clicks "Get started"
    // No automatic timer to hide video

    // Pulse animation for main logo
    // const pulseLoop = Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(pulseAnim, {toValue: 1.1, duration: 1000, useNativeDriver: true}),
    //     Animated.timing(pulseAnim, {toValue: 1, duration: 1000, useNativeDriver: true}),
    //   ]),
    // );
    // pulseLoop.start();

    // Rotation animation
    // const rotateLoop = Animated.loop(
    //   Animated.sequence([
    //     Animated.timing(rotateAnim, {toValue: 1, duration: 3000, useNativeDriver: true}),
    //     Animated.timing(rotateAnim, {toValue: 0, duration: 0, useNativeDriver: true}),
    //   ]),
    // );
    // rotateLoop.start();

    // Fade in animation
    // Animated.timing(fadeAnim, {toValue: 1, duration: 1500, useNativeDriver: true}).start();

    // Scale animation
    // Animated.spring(scaleAnim, {toValue: 1, friction: 3, useNativeDriver: true}).start();

    // Message rotation
    // const messageInterval = setInterval(() => {
    //   setIndex((prev) => (prev + 1) % messages.length);
    // }, 2500);

    return () => {
      // pulseLoop.stop();
      // rotateLoop.stop();
      // clearInterval(messageInterval);
    };
  }, []);

  // const rotate = rotateAnim.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '360deg'],
  // });

  // const handleTap = () => {
  //   setTapCount(prev => prev + 1);

  //   // Bounce animation on tap
  //   Animated.sequence([
  //     Animated.timing(scaleAnim, {toValue: 1.2, duration: 100, useNativeDriver: true}),
  //     Animated.timing(scaleAnim, {toValue: 1, duration: 200, useNativeDriver: true}),
  //   ]).start();
  // };

  // const floatingIcons = ['🪔', '🔱', '🕉️', '🙏', '🪷', '✨'];

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {/* Intro Video - visible for first 18 seconds */}
      {showVideo && (
        <>
          <Video
            source={require('../../assets/images/bharatkumbh.mp4')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
            muted={true}
            repeat={true}
            paused={false}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
          />
          {/* Subtle dark overlay for better text contrast */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          />
          {/* Get Started button over video */}
          <View
            style={{
              position: 'absolute',
              bottom: 72,
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (onGetStarted) {
                  onGetStarted();
                }
              }}
              style={{
                borderRadius: 999,
                overflow: 'hidden',
                minWidth: 220,
              }}>
              <LinearGradient
                colors={['#F97316', '#FDBA74']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  columnGap: 8,
                }}>
                <Text
                  style={{
                    color: '#FFF7ED',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  Get Started for Bharatkumbh
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* All other content commented out - keeping only video and welcome button */}
      {/* 
      <LinearGradient
        colors={['#FF9933', '#FFD700', '#800000']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.fullscreenCenter}
      >
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          {floatingIcons.map((icon, i) => (
            <FloatingIcon key={i} icon={icon} index={i} />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={handleTap}>
          <Animated.View style={[styles.splashLogoWrap, {transform: [{scale: scaleAnim}]}]}>
            <View style={styles.splashHalo} />
            <LinearGradient colors={['#FDE68A', '#FB923C']} style={styles.splashInner}>
              <Animated.Text
                style={[
                  styles.splashEmoji,
                  {
                    transform: [{scale: pulseAnim}, {rotate}],
                  },
                ]}
              >
                🔱
              </Animated.Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.splashTitle}>Kumbh Mela</Text>
          <Text style={styles.splashSubtitle}>Divinity in Motion</Text>
        </Animated.View>

        <Animated.View style={{opacity: fadeAnim, marginTop: 20, alignItems: 'center'}}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            padding: 16,
            marginVertical: 12,
            minHeight: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Animated.Text
              key={index}
              style={[
                styles.splashFootnote,
                {
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFF7ED',
                  fontWeight: '600',
                },
              ]}
            >
              {messages[index]}
            </Animated.Text>
          </View>

          <View style={[styles.dotsRow, {marginTop: 8}]}>
            {messages.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: i === index ? 1 : 0.4,
                    transform: [{scale: i === index ? 1.2 : 1}],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {tapCount > 0 && (
          <Animated.Text
            style={[
              styles.splashFootnote,
              {
                position: 'absolute',
                bottom: 40,
                opacity: fadeAnim,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.6)',
              },
            ]}
          >
            {tapCount > 5
              ? '🌟 Devotee Level: ' + tapCount
              : 'Tap the symbol to interact'}
          </Animated.Text>
        )}
      </LinearGradient>
      */}
    </View>
  );
};

