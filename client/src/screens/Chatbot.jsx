import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../services/languageService';
import { styles } from '../styles/styles';

export const Chatbot = ({goHome}) => {
  const { t, currentLanguage, translations } = useLanguage();
  const langKey = [LANGUAGES.ENGLISH, LANGUAGES.HINDI, LANGUAGES.MARATHI].includes(currentLanguage) ? currentLanguage : LANGUAGES.ENGLISH;
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    const welcomeText = translations?.selectQuestionBelow || t('selectQuestionBelow');
    setMessages([{ from: 'bot', text: welcomeText }]);
  }, [currentLanguage, translations]);

  const scrollRef = React.useRef(null);
  const messagesRef = React.useRef(null);

  const suggestions = {
    English: [
      {q: 'Ganga Aarti time?', a: 'Ganga Aarti at Ramkund starts ~6:30 PM daily. Best time to visit is 6:00 PM for good seating.'},
      {q: 'Nearest medical help', a: 'Panchavati First Aid Camp is open 24x7 near Ramkund. Emergency number: 108'},
      {q: 'Lost & Found center', a: 'Located beside the Kumbh Control Room at the main entrance. Open 24 hours.'},
      {q: 'Crowd status', a: 'Moderate now; expect higher flow after 5 PM. Peak hours: 6-9 AM and 5-8 PM.'},
      {q: 'Parking facilities', a: 'Multiple parking zones available. Main parking near entry gate. Shuttle service to ghats.'},
      {q: 'Food & water', a: 'Food stalls every 200m. Free water stations along route. Langar available at main areas.'},
      {q: 'Best bathing time', a: 'Early morning 4-6 AM is ideal. Avoid peak hours 8-10 AM and 5-7 PM.'},
      {q: 'Police help desk', a: 'Located near Main Ghat entrance. Emergency: 100. Tourist police available 24x7.'},
      {q: 'ATM & banking', a: 'ATMs at main entrance and near Ramkund. Mobile banking vans also available.'},
      {q: 'Accommodation', a: 'Tent cities and dharamshalas available. Book through registration counter or app.'},
      {q: 'Weather forecast', a: 'Check app for daily updates. Carry umbrella and warm clothes for evenings.'},
      {q: 'Registration process', a: 'Use QR code at entry points. Group registration available. Free for all.'},
      {q: 'Important temples', a: 'Kalaram Temple, Panchavati, Ramkund are main attractions. All within 2km radius.'},
      {q: 'Safety tips', a: 'Stay with group, keep ID safe, use SOS feature in app, follow crowd management.'},
      {q: 'Shopping areas', a: 'Main market near entry gate. Religious items, clothes, souvenirs available.'},
      {q: 'Public transport', a: 'Buses connect to Nashik city. Auto-rickshaws available. Shuttle service to ghats.'},
    ],
    'हिंदी': [
      {q: 'गंगा आरती समय?', a: 'रामकुंड में गंगा आरती रोज़ ~6:30 PM होती है। अच्छी सीट के लिए 6:00 PM पहुंचें।'},
      {q: 'नज़दीकी चिकित्सा', a: 'पंचवटी फर्स्ट एड कैंप 24x7 खुला है। आपातकाल: 108 पर कॉल करें।'},
      {q: 'लॉस्ट एंड फाउंड', a: 'कंट्रोल रूम के बगल में स्थित है। 24 घंटे खुला रहता है।'},
      {q: 'भीड़ स्थिति', a: 'अभी सामान्य; शाम 5 बजे के बाद बढ़ सकती है। चरम घंटे: सुबह 6-9 और शाम 5-8।'},
      {q: 'पार्किंग सुविधा', a: 'कई पार्किंग जोन उपलब्ध। मुख्य प्रवेश द्वार के पास। घाटों तक शटल सेवा।'},
      {q: 'खाना और पानी', a: 'हर 200m पर खाने के स्टॉल। रास्ते में मुफ्त पानी स्टेशन। मुख्य क्षेत्रों में लंगर।'},
      {q: 'स्नान का सबसे अच्छा समय', a: 'सुबह 4-6 बजे आदर्श है। चरम घंटे 8-10 AM और 5-7 PM से बचें।'},
      {q: 'पुलिस हेल्प डेस्क', a: 'मुख्य घाट प्रवेश के पास स्थित। आपातकाल: 100। पर्यटक पुलिस 24x7 उपलब्ध।'},
      {q: 'ATM और बैंकिंग', a: 'मुख्य प्रवेश और रामकुंड के पास ATM। मोबाइल बैंकिंग वैन भी उपलब्ध।'},
      {q: 'आवास', a: 'टेंट सिटी और धर्मशाला उपलब्ध। रजिस्ट्रेशन काउंटर या ऐप से बुक करें।'},
      {q: 'मौसम पूर्वानुमान', a: 'दैनिक अपडेट के लिए ऐप चेक करें। शाम के लिए छाता और गर्म कपड़े लाएं।'},
      {q: 'पंजीकरण प्रक्रिया', a: 'प्रवेश बिंदुओं पर QR कोड का उपयोग करें। समूह पंजीकरण उपलब्ध। सभी के लिए मुफ्त।'},
      {q: 'महत्वपूर्ण मंदिर', a: 'कालाराम मंदिर, पंचवटी, रामकुंड मुख्य आकर्षण। सभी 2km त्रिज्या के भीतर।'},
      {q: 'सुरक्षा सुझाव', a: 'समूह के साथ रहें, ID सुरक्षित रखें, ऐप में SOS का उपयोग करें, भीड़ प्रबंधन का पालन करें।'},
      {q: 'खरीदारी क्षेत्र', a: 'प्रवेश द्वार के पास मुख्य बाजार। धार्मिक सामान, कपड़े, स्मृति चिन्ह उपलब्ध।'},
      {q: 'सार्वजनिक परिवहन', a: 'बसें नासिक शहर से जुड़ती हैं। ऑटो-रिक्शा उपलब्ध। घाटों तक शटल सेवा।'},
    ],
    'मराठी': [
      {q: 'गंगा आरती वेळ?', a: 'रामकुंड येथे गंगा आरती सायं. ~6:30 ला होते. चांगल्या जागेसाठी 6:00 PM ला पोहोचा.'},
      {q: 'जवळचे वैद्यकीय', a: 'पंचवटी फर्स्ट एड कॅम्प 24x7 खुले आहे. आपत्कालीन: 108 वर कॉल करा.'},
      {q: 'हरवले-आढळले', a: 'कंट्रोल रूमच्या शेजारी केंद्र आहे. 24 तास उघडे राहते.'},
      {q: 'गर्दी स्थिती', a: 'सध्या मध्यम; संध्या. 5 नंतर वाढू शकते. शिखर तास: सकाळी 6-9 आणि संध्या. 5-8.'},
      {q: 'पार्किंग सुविधा', a: 'अनेक पार्किंग झोन उपलब्ध. मुख्य प्रवेशद्वाराजवळ. घाटांपर्यंत शटल सेवा.'},
      {q: 'अन्न आणि पाणी', a: 'दर 200m वर अन्न स्टॉल. मार्गावर मोफत पाणी स्टेशन. मुख्य क्षेत्रांमध्ये लंगर.'},
      {q: 'स्नानाची सर्वोत्तम वेळ', a: 'सकाळी 4-6 वाजता आदर्श. शिखर तास 8-10 AM आणि 5-7 PM टाळा.'},
      {q: 'पोलीस मदत केंद्र', a: 'मुख्य घाट प्रवेशाजवळ स्थित. आपत्कालीन: 100. पर्यटक पोलीस 24x7 उपलब्ध.'},
      {q: 'ATM आणि बँकिंग', a: 'मुख्य प्रवेश आणि रामकुंडजवळ ATM. मोबाइल बँकिंग व्हॅन देखील उपलब्ध.'},
      {q: 'निवास', a: 'टेंट शहरे आणि धर्मशाळा उपलब्ध. नोंदणी काउंटर किंवा ऍपद्वारे बुक करा.'},
      {q: 'हवामान अंदाज', a: 'दैनिक अपडेटसाठी ऍप तपासा. संध्याकाळीसाठी छत्री आणि उबदार कपडे आणा.'},
      {q: 'नोंदणी प्रक्रिया', a: 'प्रवेश बिंदूंवर QR कोड वापरा. गट नोंदणी उपलब्ध. सर्वांसाठी मोफत.'},
      {q: 'महत्त्वाचे मंदिरे', a: 'कालाराम मंदिर, पंचवटी, रामकुंड मुख्य आकर्षणे. सर्व 2km त्रिज्येमध्ये.'},
      {q: 'सुरक्षा सुझाव', a: 'गटासह रहा, ID सुरक्षित ठेवा, ऍपमध्ये SOS वापरा, गर्दी व्यवस्थापनाचे पालन करा.'},
      {q: 'खरेदी क्षेत्र', a: 'प्रवेशद्वाराजवळ मुख्य बाजार. धार्मिक वस्तू, कपडे, स्मृती चिन्हे उपलब्ध.'},
      {q: 'सार्वजनिक वाहतूक', a: 'बसे नाशिक शहराशी जोडतात. ऑटो-रिक्षा उपलब्ध. घाटांपर्यंत शटल सेवा.'},
    ],
  };

  const pickSuggestion = (s) => {
    setMessages((m) => [...m, {from: 'user', text: s.q}]);
    setTimeout(() => {
      setMessages((m) => [...m, {from: 'bot', text: s.a}]);
    }, 250);
  };

  React.useEffect(() => {
    messagesRef.current?.scrollToEnd({animated: true});
  }, [messages.length]);

  const suggestionList = suggestions[langKey] || suggestions[LANGUAGES.ENGLISH];

  return (
    <View style={{flex: 1, backgroundColor: '#FFF7ED'}}>
      <ScrollView 
        ref={scrollRef} 
        contentContainerStyle={[styles.screenPad, {paddingBottom: 40}]}
        showsVerticalScrollIndicator={false}
      > 

        {/* Chat Box - Enhanced */}
        <View style={[styles.chatBox, {
          minHeight: 300,
          maxHeight: 400,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderWidth: 2,
          borderColor: 'rgba(251,146,60,0.2)',
        }]}>
          <ScrollView
            ref={messagesRef}
            nestedScrollEnabled
            style={{flex: 1}}
            contentContainerStyle={{gap: 16, padding: 12, paddingBottom: 16}}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m, idx) => (
              m.from === 'bot' ? (
                <View key={idx} style={styles.msgRowBot}>
                  <LinearGradient 
                    colors={['#FEF3C7', '#FDE68A']}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8,
                    }}
                  >
                    <Text style={{fontSize: 20}}>🪷</Text>
                  </LinearGradient>
                  <View style={[styles.msgBubbleBot, {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderWidth: 1,
                    borderColor: 'rgba(251,146,60,0.2)',
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    shadowOffset: {width: 0, height: 2},
                    elevation: 2,
                  }]}>
                    <Text style={[styles.msgTextBot, {lineHeight: 20}]}>{m.text}</Text>
                  </View>
                </View>
              ) : (
                <View key={idx} style={styles.msgRowUser}>
                  <View style={[styles.msgBubbleUser, {
                    shadowColor: '#FB923C',
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    shadowOffset: {width: 0, height: 2},
                    elevation: 3,
                  }]}>
                    <Text style={[styles.msgTextUser, {lineHeight: 20}]}>{m.text}</Text>
                  </View>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,153,51,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                    borderWidth: 2,
                    borderColor: 'rgba(251,146,60,0.3)',
                  }}>
                    <Text style={{fontSize: 20}}>👤</Text>
                  </View>
                </View>
              )
            ))}
          </ScrollView>
        </View>

        {/* Quick suggestions - uses app language */}
        <View style={[styles.card, {marginBottom: 24, paddingBottom: 8}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
            <Text style={[styles.sectionTitle, {marginBottom: 0, flex: 1}]}>
              💡 {t('quickQuestions')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
            {suggestionList.map((s, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => pickSuggestion(s)} 
                activeOpacity={0.7}
                style={{flex: 1, minWidth: '47%'}}
              >
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 2,
                  borderColor: 'rgba(251,146,60,0.25)',
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  shadowOffset: {width: 0, height: 2},
                  elevation: 2,
                }}>
                  <Text style={{
                    color: '#7C2D12',
                    fontSize: 13,
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: 18,
                  }}>
                    {s.q}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

