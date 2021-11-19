import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Analytics, Notifications } from 'aws-amplify';
import {
  InAppMessagingProvider,
  InAppMessageDisplay,
} from 'aws-amplify-react-native';

const { InAppMessaging } = Notifications;

const App = () => {
  const [bannerDisplayCount, setBannerDisplayCount] = useState(0);
  const [fullscreenDisplayCount, setFullscreenDisplayCount] = useState(0);

  useEffect(() => {
    InAppMessaging.syncMessages();
    const listener = InAppMessaging.onMessageDisplayed(message => {
      if (message.layout === 'TOP_BANNER') {
        setBannerDisplayCount(currentCount => currentCount + 1);
      }
      if (message.layout === 'FULL_SCREEN') {
        setFullscreenDisplayCount(currentCount => currentCount + 1);
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  const triggerBannerMessage = useCallback(() => {
    Analytics.record({ name: 'display_banner' });
  }, []);

  const triggerFullscreenMessage = useCallback(() => {
    InAppMessaging.dispatchEvent({ name: 'display_fullscreen' });
  }, []);

  return (
    <SafeAreaView>
      <InAppMessagingProvider>
        <ScrollView>
          <Widget
            title="Banner message"
            buttonText="Record analytics event"
            count={bannerDisplayCount}
            onButtonPress={triggerBannerMessage}
          />
          <Widget
            title="Fullscreen message"
            buttonText="Send event"
            count={fullscreenDisplayCount}
            onButtonPress={triggerFullscreenMessage}
          />
        </ScrollView>
        <InAppMessageDisplay />
      </InAppMessagingProvider>
    </SafeAreaView>
  );
};

const Widget = ({ title, buttonText, count, onButtonPress }) => {
  return (
    <View style={styles.widgetView}>
      <Text style={styles.widgetTitle}>{title}</Text>
      <Pressable
        onPress={onButtonPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.text}>{buttonText}</Text>
      </Pressable>
      <View style={styles.counterView}>
        <Text style={styles.text}>Displayed</Text>
        <Text style={[styles.text, styles.counterText]}>{count}</Text>
        <Text style={styles.text}>times</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff9900',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  counterText: {
    fontSize: 24,
    margin: 4,
  },
  counterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  widgetView: {
    backgroundColor: '#EAEDED',
    borderRadius: 4,
    margin: 8,
    padding: 16,
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default App;
