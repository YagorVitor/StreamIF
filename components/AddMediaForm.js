import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  AlertCircle,
  ImagePlus,
  Save,
  Star,
  Tag,
  Type,
  X,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const GENRE_OPTIONS = [
  'Ação',
  'Drama',
  'Comédia',
  'Terror',
  'Ficção científica',
  'Romance',
  'Documentário',
];

export default function AddMediaForm({
  theme,
  initialMedia = null,
  onSave,
  onCancel,
}) {
  const colors = theme.colors;
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;
  const isEditing = Boolean(initialMedia);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialMedia) {
      setTitle(initialMedia.title);
      setGenre(initialMedia.genre);
      setRating(String(initialMedia.rating));
      setImageUri(initialMedia.imageUri || '');
      setError('');
      return;
    }

    setTitle('');
    setGenre('');
    setRating('');
    setImageUri('');
    setError('');
  }, [initialMedia]);

  function showValidationError(message) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setError(message);
  }

  async function handlePickImage() {
    void Haptics.selectionAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.75,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setError('');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function handleRemoveImage() {
    void Haptics.selectionAsync();

    setImageUri('');
    setError('');
  }

  function handleSelectGenre(selectedGenre) {
    void Haptics.selectionAsync();

    setGenre(selectedGenre);
    setError('');
  }

  function handleSave() {
    const parsedRating = Number(rating.replace(',', '.'));

    if (!title.trim()) {
      showValidationError('Informe o título da série ou filme.');
      return;
    }

    if (!genre.trim()) {
      showValidationError('Informe o gênero da mídia.');
      return;
    }

    if (!rating.trim() || Number.isNaN(parsedRating)) {
      showValidationError('Informe uma nota numérica entre 1 e 10.');
      return;
    }

    if (parsedRating < 1 || parsedRating > 10) {
      showValidationError('A nota precisa estar dentro do intervalo de 1 a 10.');
      return;
    }

    onSave({
        title,
        genre,
        rating: parsedRating,
        imageUri,
        keepLocalImage: Boolean(initialMedia?.imageSource && !imageUri),
    });

    setTitle('');
    setGenre('');
    setRating('');
    setImageUri('');
    setError('');
  }

  function handleCancel() {
    void Haptics.selectionAsync();

    setTitle('');
    setGenre('');
    setRating('');
    setImageUri('');
    setError('');
    onCancel();
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.ScrollView
        entering={FadeInDown.duration(360)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: compact ? 18 : 22,
            paddingTop: compact ? 22 : 32,
            paddingBottom: compact ? 20 : 28,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTextArea}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              {isEditing ? 'Editar mídia' : 'Nova mídia'}
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontSize: compact ? 27 : 30,
                  lineHeight: compact ? 33 : 36,
                },
              ]}
            >
              {isEditing ? 'Atualizar catálogo' : 'Adicionar ao catálogo'}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: pressed
                  ? colors.surfaceMuted
                  : colors.surface,
              },
            ]}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Fechar formulário"
          >
            <X size={21} color={colors.text} strokeWidth={2.4} />
          </Pressable>
        </View>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {isEditing
            ? 'Altere as informações principais da mídia selecionada.'
            : 'Preencha os dados essenciais e selecione uma imagem opcional para o pôster.'}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.imagePicker,
            {
              backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={handlePickImage}
          accessibilityRole="button"
          accessibilityLabel="Selecionar imagem da mídia"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                {
                  backgroundColor: colors.primarySoft,
                },
              ]}
            >
              <ImagePlus size={28} color={colors.primary} strokeWidth={2.4} />

              <Text
                style={[styles.imagePlaceholderText, { color: colors.text }]}
              >
                Selecionar pôster
              </Text>

              <Text style={[styles.imageHint, { color: colors.textMuted }]}>
                Opcional
              </Text>
            </View>
          )}
        </Pressable>

        {imageUri ? (
          <Pressable
            style={styles.removeImageButton}
            onPress={handleRemoveImage}
            accessibilityRole="button"
            accessibilityLabel="Remover imagem selecionada"
          >
            <X size={15} color={colors.danger} strokeWidth={2.4} />
            <Text style={[styles.removeImageText, { color: colors.danger }]}>
              Remover imagem
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.form}>
          <FormField
            icon={Type}
            label="Título"
            placeholder="Ex.: Interestelar"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              setError('');
            }}
            colors={colors}
          />

          <FormField
            icon={Tag}
            label="Gênero"
            placeholder="Ex.: Ficção científica"
            value={genre}
            onChangeText={(value) => {
              setGenre(value);
              setError('');
            }}
            colors={colors}
          />

          <View style={styles.genreSuggestions}>
            {GENRE_OPTIONS.map((option) => {
              const active = genre === option;

              return (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.genreChip,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : pressed
                          ? colors.surfaceMuted
                          : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectGenre(option)}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar gênero ${option}`}
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      {
                        color: active ? colors.white : colors.textMuted,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FormField
            icon={Star}
            label="Nota pessoal"
            placeholder="1 a 10"
            value={rating}
            onChangeText={(value) => {
              setRating(value);
              setError('');
            }}
            keyboardType="numeric"
            colors={colors}
          />

          {error ? (
            <Animated.View
              entering={FadeInDown.duration(240)}
              style={[
                styles.errorBox,
                {
                  backgroundColor: colors.dangerSoft,
                  borderColor: colors.danger,
                },
              ]}
            >
              <AlertCircle size={18} color={colors.danger} strokeWidth={2.3} />
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: colors.border,
                backgroundColor: pressed
                  ? colors.surfaceMuted
                  : colors.surface,
              },
            ]}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancelar formulário"
          >
            <X size={17} color={colors.text} strokeWidth={2.4} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.84 : 1,
              },
            ]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Atualizar mídia' : 'Salvar mídia'}
          >
            <Save size={17} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.primaryButtonText}>
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Text>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  colors,
}) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.labelRow}>
        <Icon size={15} color={colors.textMuted} strokeWidth={2.2} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 10,
  },
  headerTextArea: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  imagePicker: {
    height: 180,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  imagePlaceholderText: {
    fontSize: 15,
    fontWeight: '900',
  },
  imageHint: {
    fontSize: 12,
    fontWeight: '700',
  },
  removeImageButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 18,
  },
  removeImageText: {
    fontSize: 13,
    fontWeight: '900',
  },
  form: {
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '900',
  },
  input: {
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '600',
  },
  genreSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
    marginBottom: 16,
  },
  genreChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: '900',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 11,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 17,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 17,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});