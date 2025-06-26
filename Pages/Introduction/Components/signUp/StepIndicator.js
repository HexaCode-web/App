import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import styles from "./SignUpStyles";

const StepIndicator = ({ currentStep, totalSteps }) => {
  // Create animated values for each step
  const animatedValues = useRef(
    Array.from({ length: totalSteps }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.5),
      lineWidth: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animate each step based on current step
    animatedValues.forEach((animatedValue, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber <= currentStep;
      const isCompleted = stepNumber < currentStep;

      // Animate step circle
      Animated.parallel([
        Animated.spring(animatedValue.scale, {
          toValue: isActive ? 1.1 : 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(animatedValue.opacity, {
          toValue: isActive ? 1 : 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        // Animate connecting line
        Animated.timing(animatedValue.lineWidth, {
          toValue: isCompleted ? 1 : 0,
          duration: 400,
          delay: isCompleted ? 200 : 0,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [currentStep, animatedValues]);

  const AnimatedStepCircle = ({ stepNumber, animatedValue }) => {
    const isActive = stepNumber <= currentStep;

    return (
      <Animated.View
        style={[
          styles.stepCircle,
          isActive ? styles.activeStep : styles.inactiveStep,

          {
            transform: [{ scale: animatedValue.scale }],
            opacity: animatedValue.opacity,
            shadowColor: currentStep === stepNumber ? "#007AFF" : "transparent",
            shadowOpacity: currentStep === stepNumber ? 0.8 : 0,
            shadowRadius: currentStep === stepNumber ? 10 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            isActive ? styles.activeStepText : styles.inactiveStepText,
          ]}
        >
          {stepNumber}
        </Text>
      </Animated.View>
    );
  };

  const AnimatedStepLine = ({ stepNumber, animatedValue }) => {
    const isCompleted = stepNumber < currentStep;

    return (
      <View style={styles.stepLineContainer}>
        <View style={[styles.stepLine, styles.inactiveStepLine]} />
        <Animated.View
          style={[
            styles.stepLine,
            styles.activeStepLine,
            {
              transform: [
                {
                  scaleX: animatedValue.lineWidth,
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={{ display: "flex", direction: "row-reverse" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepIndicatorScroll}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isLast = stepNumber === totalSteps;

          return (
            <View key={index} style={styles.stepContainer}>
              <AnimatedStepCircle
                stepNumber={stepNumber}
                animatedValue={animatedValues[index]}
              />
              {!isLast && (
                <AnimatedStepLine
                  stepNumber={stepNumber}
                  animatedValue={animatedValues[index]}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default StepIndicator;
