import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  ChevronLeft,
  Circle,
  CircleCheck,
  FileText,
  Pencil,
  Star,
  Tag,
} from 'lucide-react-native';

import IFMark from '../components/IFMark';

export default function DetailScreen({
  media,
  theme,
  onBack,
  onChangeNotes,
  onEdit,
}) {
  const colors = theme.colors;
  const { width } = useWindowDimensions();
  const compact = width < 390;

  const [imageFailed, setImageFailed] = useState(false);

  const StatusIcon = media.watched ? CircleCheck : Circle;
  const ratingColor = getRatingColor(media.rating, colors);

  const imageSource = getMediaImageSource(media);
  const hasImage = Boolean(imageSource) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [media.imageUri, media.imageSource]);

  return (
    <Animated.ScrollView
      entering={FadeIn.duration(280)}
      style={[styles.container, { paddingHorizontal: compact ? 14 : 18 }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenActions}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o catálogo"
        >
          <ChevronLeft size={20} color={colors.text} strokeWidth={2.5} />
          <Text style={[styles.backText, { color: colors.text }]}>Voltar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            {
              backgroundColor: pressed ? colors.primarySoft : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onEdit(media.id)}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${media.title}`}
        >
          <Pencil size={17} color={colors.primary} strokeWidth={2.4} />
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            Editar
          </Text>
        </Pressable>
      </View>

      <Animated.View
        entering={FadeInDown.duration(380)}
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: compact ? 24 : 28,
            padding: compact ? 18 : 22,
          },
        ]}
      >
        <View
          style={[
            styles.detailPosterBox,
            {
              backgroundColor: colors.primarySoft,
            },
          ]}
        >
          {hasImage ? (
            <Image
              source={imageSource}
              style={styles.detailPosterImage}
              onError={() => setImageFailed(true)}
              accessibilityLabel={`Imagem de ${media.title}`}
            />
          ) : (
            <IFMark theme={theme} size={56} fontSize={25} mode="plain" />
          )}
        </View>

        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          Detalhes da mídia
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: compact ? 30 : 34,
              lineHeight: compact ? 36 : 40,
            },
          ]}
        >
          {media.title}
        </Text>

        <View style={styles.infoGrid}>
          <InfoBox
            colors={colors}
            icon={Tag}
            label="Gênero"
            value={media.genre}
          />

          <InfoBox
            colors={colors}
            icon={Star}
            label="Nota"
            value={`${media.rating}/10`}
            accent={ratingColor}
            large
          />

          <InfoBox
            colors={colors}
            icon={StatusIcon}
            label="Status"
            value={media.watched ? 'Assistido' : 'Não assistido'}
            accent={
              media.watched
                ? { main: colors.primary, soft: colors.primarySoft }
                : null
            }
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(80).duration(380)}
        style={[
          styles.notesCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: compact ? 24 : 28,
          },
        ]}
      >
        <View style={styles.notesHeader}>
          <View
            style={[
              styles.notesIconBox,
              {
                backgroundColor: colors.primarySoft,
              },
            ]}
          >
            <FileText size={21} color={colors.primary} strokeWidth={2.4} />
          </View>

          <View style={styles.notesTitleArea}>
            <Text style={[styles.notesTitle, { color: colors.text }]}>
              Anotações pessoais
            </Text>

            <Text style={[styles.notesSubtitle, { color: colors.textMuted }]}>
              Comentários, impressões ou observações sobre o título.
            </Text>
          </View>
        </View>

        <TextInput
          style={[
            styles.notesInput,
            {
              color: colors.text,
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              minHeight: compact ? 170 : 190,
            },
          ]}
          placeholder="Ex.: Gostei da direção e da construção dos personagens..."
          placeholderTextColor={colors.textSubtle}
          value={media.notes}
          onChangeText={(text) => onChangeNotes(media.id, text)}
          multiline
          textAlignVertical="top"
        />
      </Animated.View>
    </Animated.ScrollView>
  );
}

function InfoBox({ colors, icon: Icon, label, value, accent, large = false }) {
  const mainColor = accent?.main || colors.textMuted;
  const backgroundColor = accent?.soft || colors.surfaceElevated;
  const borderColor = accent?.main || colors.border;

  return (
    <View
      style={[
        styles.infoBox,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.infoHeader}>
        <Icon size={16} color={mainColor} strokeWidth={2.3} />
        <Text style={[styles.infoLabel, { color: mainColor }]}>{label}</Text>
      </View>

      <Text
        style={[
          large ? styles.ratingValue : styles.infoValue,
          { color: large ? mainColor : colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 14,
    paddingBottom: 32,
  },
  screenActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  backButton: {
    height: 43,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 14,
    fontWeight: '900',
  },
  editButton: {
    height: 43,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  heroCard: {
    borderWidth: 1,
    marginBottom: 14,
    elevation: 3,
  },
  detailPosterBox: {
    width: '100%',
    height: 260,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  detailPosterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 10,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 19,
    padding: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 7,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '900',
  },
  ratingValue: {
    fontSize: 25,
    fontWeight: '900',
  },
  notesCard: {
    borderWidth: 1,
    padding: 18,
    elevation: 2,
  },
  notesHeader: {
    flexDirection: 'row',
    gap: 11,
    alignItems: 'center',
    marginBottom: 15,
  },
  notesIconBox: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesTitleArea: {
    flex: 1,
  },
  notesTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 3,
  },
  notesSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
});