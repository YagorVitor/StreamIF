import { StyleSheet, Text, View } from 'react-native';

export default function IFMark({
  theme,
  size = 34,
  fontSize = 15,
  mode = 'plain',
}) {
  const colors = theme.colors;

  const backgroundColor =
    mode === 'solid'
      ? colors.primary
      : mode === 'soft'
        ? colors.primarySoft
        : 'transparent';

  const textColor = mode === 'solid' ? colors.white : colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.34,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
          },
        ]}
      >
        IF
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.7,
  },
});