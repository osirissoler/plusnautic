import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

interface LayoutItem {
  key: string;
  width?: string | number;
  height?: number;
  borderRadius?: number;
  flexDirection?: "row" | "column";
  gap?: number;
  children?: LayoutItem[];
}

interface SkeletonPlaceholderProps {
  isLoading: boolean;
  layout?: LayoutItem[];
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
}

const SkeletonPlaceholder = ({
  isLoading,
  layout,
  containerStyle,
  children,
}: SkeletonPlaceholderProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e0e0e0", "#c0c0c0"],
  });

  if (!isLoading) return <>{children}</>;

  const renderSkeleton = (items: LayoutItem[]) => {
    return items.map(
      ({
        key,
        width = "100%",
        height = 20,
        borderRadius = 10,
        flexDirection,
        gap,
        children,
      }) => (
        <View
          key={key}
          style={[
            flexDirection && { flexDirection, gap }
          ]}
        >
          {children ? (
            renderSkeleton(children)
          ) : (
            <Animated.View
              style={[
                {
                  width:
                    typeof width === "string" ? `${parseFloat(width)}%` : width,
                  height,
                  borderRadius,
                  backgroundColor,
                },
              ]}
            />
          )}
        </View>
      )
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {layout && renderSkeleton(layout)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  }
});

export default SkeletonPlaceholder;
