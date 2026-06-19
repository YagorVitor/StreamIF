import { useEffect, useState } from 'react';
import {
  Circle,
  CircleCheck,
  Star,
  Tag,
  Trash2,
} from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import IFMark from './IFMark';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MediaCard({
  media,
  theme,
  compact = false,
  onPress,
  onLongPress,
  onDelete,
}) {
  const colors = theme.colors;
  const ratingColor = getRatingColor(media.rating, colors);
  const genreColor = getGenreColor(media.genre, colors);
  const StatusIcon = media.watched ? CircleCheck : Circle;
  const scale = useSharedValue(1);

  const [imageFailed, setImageFailed] = useState(false);

  const imageSource = getMediaImageSource(media);
  const hasImage = Boolean(imageSource) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [media.imageUri, media.imageSource]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleDeletePress(event) {
    event.stopPropagation?.();
    onDelete();
  }

  function handlePressIn() {
    scale.value = withTiming(0.985, { duration: 90 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 180,
    });
  }

  return (
    <AnimatedPressable
      style={[
        styles.card,
        animatedStyle,
        {
          backgroundColor: colors.surface,
          borderColor: media.watched ? colors.primary : colors.border,
          padding: compact ? 12 : 14,
          borderRadius: compact ? 22 : 24,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${media.title}, gênero ${media.genre}, nota ${media.rating}, ${
        media.watched ? 'assistido' : 'pendente'
      }`}
    >
      <View style={styles.cardRow}>
        <View
          style={[
            styles.posterBox,
            {
              width: compact ? 78 : 86,
              height: compact ? 112 : 122,
              backgroundColor: colors.primarySoft,
            },
          ]}
        >
          {hasImage ? (
            <Image
              source={imageSource}
              style={styles.posterImage}
              onError={() => setImageFailed(true)}
              accessibilityLabel={`Imagem de ${media.title}`}
            />
          ) : (
            <IFMark
              theme={theme}
              size={compact ? 40 : 46}
              fontSize={compact ? 18 : 21}
              mode="plain"
            />
          )}
        </View>

        <View style={styles.contentArea}>
          <View style={styles.topRow}>
            <View style={styles.titleArea}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontSize: compact ? 16 : 18,
                  },
                ]}
                numberOfLines={2}
              >
                {media.title}
              </Text>

              <View
                style={[
                  styles.genreChip,
                  {
                    backgroundColor: genreColor.soft,
                    borderColor: genreColor.main,
                  },
                ]}
              >
                <Tag size={13} color={genreColor.main} strokeWidth={2.2} />

                <Text
                  style={[styles.genreText, { color: genreColor.main }]}
                  numberOfLines={1}
                >
                  {media.genre}
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                {
                  backgroundColor: pressed
                    ? colors.dangerSoft
                    : colors.surfaceMuted,
                },
              ]}
              onPress={handleDeletePress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Excluir ${media.title}`}
            >
              <Trash2 size={17} color={colors.danger} strokeWidth={2.3} />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.ratingBadge,
                {
                  backgroundColor: ratingColor.soft,
                  borderColor: ratingColor.main,
                },
              ]}
            >
              <Star size={14} color={ratingColor.main} strokeWidth={2.4} />

              <Text style={[styles.ratingText, { color: ratingColor.main }]}>
                {media.rating}/10
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: media.watched
                    ? colors.primarySoft
                    : colors.surfaceMuted,
                  borderColor: media.watched ? colors.primary : colors.border,
                },
              ]}
            >
              <StatusIcon
                size={14}
                color={media.watched ? colors.primary : colors.textMuted}
                strokeWidth={2.4}
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color: media.watched ? colors.primary : colors.textMuted,
                  },
                ]}
              >
                {media.watched ? 'Assistido' : 'Pendente'}
              </Text>
            </View>
          </View>

          <Text style={[styles.helperText, { color: colors.textSubtle }]}>
            Toque para status • segure para detalhes
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

function getMediaImageSource(media) {
  if (media.imageSource) {
    return media.imageSource;
  }

  if (media.imageUri) {
    return { uri: media.imageUri };
  }

  return null;
}

function getRatingColor(rating, colors) {
  if (rating >= 7) {
    return {
      main: colors.success,
      soft: colors.successSoft,
    };
  }

  if (rating >= 4) {
    return {
      main: colors.warning,
      soft: colors.warningSoft,
    };
  }

  return {
    main: colors.danger,
    soft: colors.dangerSoft,
  };
}

function getGenreColor(genre, colors) {
  const normalizedGenre = sanitizeText(genre);

  if (
    normalizedGenre.includes('terror') ||
    normalizedGenre.includes('suspense') ||
    normalizedGenre.includes('thriller')
  ) {
    return {
      main: '#EF4444',
      soft: colors.name === 'dark' ? '#3B1216' : '#FEE2E2',
    };
  }

  if (
    normalizedGenre.includes('comedia') ||
    normalizedGenre.includes('humor')
  ) {
    return {
      main: '#F59E0B',
      soft: colors.name === 'dark' ? '#3A2A0A' : '#FEF3C7',
    };
  }

  if (
    normalizedGenre.includes('acao') ||
    normalizedGenre.includes('aventura')
  ) {
    return {
      main: '#3B82F6',
      soft: colors.name === 'dark' ? '#10233F' : '#DBEAFE',
    };
  }

  if (
    normalizedGenre.includes('ficcao') ||
    normalizedGenre.includes('sci') ||
    normalizedGenre.includes('fantasia')
  ) {
    return {
      main: '#06B6D4',
      soft: colors.name === 'dark' ? '#0C2D36' : '#CFFAFE',
    };
  }

  if (
    normalizedGenre.includes('drama') ||
    normalizedGenre.includes('romance')
  ) {
    return {
      main: '#A855F7',
      soft: colors.name === 'dark' ? '#2A153E' : '#F3E8FF',
    };
  }

  if (
    normalizedGenre.includes('documentario') ||
    normalizedGenre.includes('historia')
  ) {
    return {
      main: '#14B8A6',
      soft: colors.name === 'dark' ? '#0F2F2B' : '#CCFBF1',
    };
  }

  return {
    main: colors.primary,
    soft: colors.primarySoft,
  };
}

function sanitizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 13,
  },
  posterBox: {
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentArea: {
    flex: 1,
    minHeight: 112,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontWeight: '900',
    marginBottom: 9,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  genreChip: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  genreText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '900',
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 13,
    marginBottom: 9,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '900',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  helperText: {
    fontSize: 11,
    fontWeight: '700',
  },
});