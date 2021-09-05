/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import type { Node } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
} from 'react-native';


if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const SCREEN_WIDTH = Dimensions.get('screen').width

const App: () => Node = () => {

  // let opacity = new Animated.Value(0)
  let data = [...Array(20)].map((val, i) => i)
  const [dataArray, setDataArray] = useState(data)
  let animArray = []

  useEffect(() => {
    Animated.parallel(animArray).start()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView
        onLayout={() => "onlayout scrollview"}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {
          dataArray.map((item, i) => {
            let opacity = new Animated.Value(0)
            let translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current
            let height = new Animated.Value(100)
            let padding = new Animated.Value(10)

            const deleteAction = () => {
              Animated.timing(translateX, {
                useNativeDriver: false,
                toValue: SCREEN_WIDTH,
                duration: 200
              }).start(finished => {
                Animated.parallel([
                  Animated.timing(height, {
                    useNativeDriver: false,
                    toValue: 0,
                    duration: 200
                  }),
                  Animated.timing(padding, {
                    useNativeDriver: false,
                    toValue: 0,
                    duration: 200
                  })
                ]).start(() => {
                  const newArray = dataArray.map(x => x !== item ? x : item)
                  setDataArray(newArray)
                })
              })
            }

            const panResponder = React.useRef(
              PanResponder.create({
                // Ask to be the responder:
                // onStartShouldSetPanResponder: (evt, gestureState) => true,
                // onStartShouldSetPanResponderCapture: (evt, gestureState) =>
                //   true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                // onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                //   true,

                // onPanResponderGrant: (evt, gestureState) => {
                //   // The gesture has started. Show visual feedback so the user knows
                //   // what is happening!
                //   // gestureState.d{x,y} will be set to zero now
                // },
                onPanResponderMove: (evt, gestureState) => {
                  // Animated.timing(translateX, { toValue: gestureState.moveX, duration: 100 })
                  translateX.setValue(gestureState.dx)
                  console.log(gestureState.moveX)
                  // The most recent move distance is gestureState.move{X,Y}
                  // The accumulated gesture distance since becoming responder is
                  // gestureState.d{x,y}
                },
                // onPanResponderTerminationRequest: (evt, gestureState) =>
                //   true,
                onPanResponderRelease: (evt, gestureState) => {
                  if (gestureState.moveX < 200) {
                    // console.log("Should delete")
                    deleteAction()
                  } else {
                    Animated.spring(translateX, {
                      toValue: 0,
                      friction: 5,
                      tension: 70
                    }).start()
                    // translateX.setValue(-SCREEN_WIDTH)
                  }
                  console.log("mvX,", gestureState.moveX)
                  // console.log("dX,", gestureState.dX)
                  // The user has released all touches while this view is the
                  // responder. This typically means a gesture has succeeded
                },
                // onPanResponderTerminate: (evt, gestureState) => {
                //   // Another component has become the responder, so this gesture
                //   // should be cancelled
                // },
                // onShouldBlockNativeResponder: (evt, gestureState) => {
                //   // Returns whether this component should block native components from becoming the JS
                //   // responder. Returns true by default. Is currently only supported on android.
                //   return true;
                // }
              })
            ).current;

            animArray.push(
              Animated.parallel([
                Animated.timing(translateX, {
                  useNativeDriver: false,
                  toValue: 0,
                  easing: Easing.linear(),
                  duration: 200,
                  delay: 100 * i
                }),
                Animated.timing(opacity, {
                  useNativeDriver: false,
                  toValue: 1,
                  easing: Easing.linear(),
                  duration: 500,
                  delay: 100 * i
                })
              ])
            )

            return <Animated.View
              {...panResponder.panHandlers}
              key={i}
              style={{ transform: [{ translateX: translateX }], opacity: opacity, height: height, backgroundColor: 'white', justifyContent: 'center', margin: padding, borderRadius: 5, padding: padding }}>
              <TouchableOpacity
                onPress={() => { deleteAction() }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>{`Item ${item}`}</Text>
              </TouchableOpacity>
            </Animated.View>
          })
        }
      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
