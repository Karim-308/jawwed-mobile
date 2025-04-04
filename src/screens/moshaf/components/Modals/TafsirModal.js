import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import RenderHTML from 'react-native-render-html';
import getTafsir from '../../../../api/tafsir/GetTafsir';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

/** Sub-component for rendering HTML text. */
const TafsirContent = React.memo(({ tafsir, textSize }) => {
  console.log('[Render] TafsirContent rendered');
  return (
    <RenderHTML
      contentWidth={screenWidth * 0.9}
      source={{ html: tafsir }}
      tagsStyles={{
        p: {
          color: '#fff',
          fontSize: textSize,
          textAlign: 'right',
          direction: 'rtl',
        },
        strong: { fontWeight: 'bold', color: '#EFB975' },
      }}
    />
  );
});

/**
 * @param {boolean} isVisible Show modal or not
 * @param {() => void} onClose Called when modal fully closes
 * @param {string} ayahKey e.g. "2:255"
 * @param {string} ayahText The Arabic text to display at top
 * @param {number} selectedSource The ID of the selected tafsir source
 * @param {(srcId: number) => void} onSourceChange Callback to set new source
 */
const TafsirModal = ({
  isVisible,
  onClose,
  ayahKey,
  ayahText,
  selectedSource,
  onSourceChange,
}) => {
  const [tafsir, setTafsir] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textSize, setTextSize] = useState(19);
  const scrollViewRef = useRef(null);

  /**
   * Two states only:
   * expanded => show at 80% of screen (top 20% visible above)
   * collapsed => fully off-screen
   */
  const snapPoints = {
    expanded: screenHeight * 0.005 ,  // 80% visible
    collapsed: screenHeight,       // off-screen
  };

  // We track the current snap (expanded or collapsed)
  const [currentSnapPoint, setCurrentSnapPoint] = useState('collapsed');

  // Anim value for vertical position
  const translateY = useRef(new Animated.Value(snapPoints.collapsed)).current;
  // We store the last offset so we can adjust it during pan
  const lastOffsetY = useRef(snapPoints.collapsed);

  // Example sources
  const tafsirSources = [
    { id: 1, name: 'تفسير ابن كثير' },
    { id: 2, name: 'التفسير الميسر' },
    { id: 3, name: 'تفسير الطبري' },
  ];

  // Animate helper with no bounce
  const animateTo = (toValue, cb) => {
    console.log('[Animation] toValue:', toValue);
    Animated.timing(translateY, {
      toValue,
      duration: 200, // you can adjust speed (ms) or even do 0 for instant
      useNativeDriver: true,
    }).start(cb);
  };

  // Handle open/close
  useEffect(() => {
    console.log('[useEffect:isVisible]', isVisible);
    if (isVisible) {
      console.log('[Modal] => Opening to 80%');
      setCurrentSnapPoint('expanded');
      lastOffsetY.current = snapPoints.expanded;

      // Start from bottom
      translateY.setValue(snapPoints.collapsed);
      animateTo(snapPoints.expanded, () => console.log('[Modal] Opened!'));
    } else {
      console.log('[Modal] => Closing');
      animateTo(snapPoints.collapsed, () => {
        console.log('[Modal] => Fully closed');
        setCurrentSnapPoint('collapsed');
      });
    }
  }, [isVisible]);

  // Fetch data if open & ayahKey
  useEffect(() => {
    if (isVisible && ayahKey) {
      console.log('[FetchTrigger] ayahKey/source changed');
      fetchTafsir(ayahKey, Number(selectedSource));
    }
  }, [isVisible, ayahKey, selectedSource]);

  const fetchTafsir = async (verseKey, mofasirID) => {
    console.log('[Fetch] Start -> verseKey:', verseKey, 'source:', mofasirID);
    setLoading(true);
    setError(null);
    try {
      const tafsirText = await getTafsir(verseKey, mofasirID);
      console.log('[Fetch] Success. length:', tafsirText.length);
      setTafsir(tafsirText);
    } catch (err) {
      console.error('[Fetch] Error:', err);
      setError('Failed to fetch Tafsir.');
    }
    setLoading(false);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 100, y: 0, animated: false });
  }, []);

  // Pan Responder logic
  const panResponder = usePanResponder({
    translateY,
    lastOffsetY,
    snapPoints,
    currentSnapPoint,
    setCurrentSnapPoint,
    onClose,
  });

  // Tapping background closes modal
  const handleBackdropPress = () => {
    console.log('[Backdrop] => Press => Closing modal');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <SafeAreaView>
      <Modal visible={true} transparent animationType="none">
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }],
                // 80% means the top 20% is above the screen
                //maxHeight: screenHeight * 0.8,
              },
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.dragHandle}>
              <View style={styles.notch} />
            </View>

            <View style={styles.contentContainer}>
              {/* AYAH TEXT */}
              <ScrollView style={styles.ayahContainer}>
                <Text style={[styles.ayahText, { fontSize: 20 }]}>
                  {ayahText}
                </Text>
              </ScrollView>

              {/* TAFSIR SOURCE SELECTOR */}
              <ScrollView
                horizontal
                contentContainerStyle={styles.horizontalScrollContainer}
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
              >
                <View style={styles.pickerContainer}>
                  {tafsirSources.slice()
                        .reverse()   // reverse the order
                        .map((source) => (
                    <TouchableOpacity
                      key={source.id}
                      style={[
                        styles.sourceButton,
                        selectedSource === source.id && styles.selectedSourceButton,
                      ]}
                      onPress={() => {
                        console.log('[Source] Changing to:', source.name);
                        onSourceChange(source.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.sourceText,
                          selectedSource === source.id && styles.selectedSourceText,
                        ]}
                      >
                        {source.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* TAFSIR CONTENT */}
              <ScrollView style={styles.tafsirScrollContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#EFB975" />
                ) : error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  <TafsirContent tafsir={tafsir} textSize={textSize} />
                )}
              </ScrollView>

              {/* FONT SIZE SLIDER */}
              <View style={styles.sliderContainer}>
                <Slider
                  style={{ width: '80%' }}
                  minimumValue={14}
                  maximumValue={24}
                  step={1}
                  value={textSize}
                  onValueChange={(val) => {
                    console.log('[Slider] => Font size:', val);
                    setTextSize(val);
                  }}
                  minimumTrackTintColor="#EFB975"
                  maximumTrackTintColor="#888"
                  thumbTintColor="#EFB975"
                />
                <Text style={styles.sliderLabel}>حجم الخط</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/** Use PanResponder with 2 states: "expanded" (80% visible) or "collapsed" (off-screen). */
function usePanResponder({
  translateY,
  lastOffsetY,
  snapPoints,
  currentSnapPoint,
  setCurrentSnapPoint,
  onClose,
}) {
  return useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        console.log('[PanResponder] => Grant');
        translateY.setOffset(lastOffsetY.current);
        translateY.setValue(0);
      },

      onPanResponderMove: (_, gesture) => {
        console.log('[PanResponder] => Move dy:', gesture.dy);
        // If expanded (top=0.2*h) and user drags down => track
        // If collapsed => no need to track because it's off-screen
        if (currentSnapPoint === 'expanded' && gesture.dy > 0) {
          const newY = gesture.dy;
          const nextPos = lastOffsetY.current + newY;

          // Ensure we never go above "expanded" (snapPoints.expanded)
          if (nextPos >= snapPoints.expanded) {
            translateY.setValue(newY);
          } else {
            console.log('[PanResponder] => Block above snapPoints.expanded');
          }
        }
      },

      onPanResponderRelease: (_, gesture) => {
        translateY.flattenOffset();
        const finalPos = lastOffsetY.current + gesture.dy;
        console.log(
          '[PanResponder] => Release dy:', gesture.dy,
          'pos:', finalPos,
          'vy:', gesture.vy
        );

        // If user drags downward enough or velocity is downward => collapse
        if (gesture.dy > 100 || gesture.vy > 0.5) {
          console.log('[PanResponder] => Collapsing');
          Animated.timing(translateY, {
            toValue: snapPoints.collapsed,
            duration: 0, // instantly close (or set small ms if you want)
            useNativeDriver: true,
          }).start(() => {
            console.log('[PanResponder] => Collapsed -> onClose()');
            onClose();
          });
          return;
        }

        console.log('[PanResponder] => Stay expanded');
        // Otherwise snap back up
        Animated.timing(translateY, {
          toValue: snapPoints.expanded,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          console.log('[PanResponder] => Expanded');
          lastOffsetY.current = snapPoints.expanded;
          setCurrentSnapPoint('expanded');
        });
      },
    })
  ).current;
}

export default TafsirModal;

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    position: 'absolute',

    // Start at bottom
    bottom: 0,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 2,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#EFB975',
  },
  dragHandle: {
    paddingTop: 15,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
    zIndex: 10,
  },
  notch: {
    width: 50,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'column',
  },
  ayahContainer: {
    backgroundColor: 'rgba(239,185,117,0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxHeight:200,
  },
  ayahText: {
    color: '#fff',
    textAlign: 'center',
  },
  horizontalScrollContainer: {
    paddingVertical: 5, 
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  sourceButton: {
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#2c2c2c',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedSourceButton: {
    backgroundColor: '#EFB975',
  },
  sourceText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSourceText: {
    color: '#000',
  },
  tafsirScrollContainer: {
    maxHeight: 300,
    marginBottom: 10,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sliderLabel: {
    color: '#EFB975',
    fontSize: 14,
  },
});
