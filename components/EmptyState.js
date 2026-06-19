import { Plus, Search, X } from 'lucide-react-native';
import IFMark from './IFMark';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function EmptyState({
  theme,
  minHeight = 280,
  hasCatalogItems = false,
  onLoadSampleData,
  onClearFilters,
}) {
  const colors = theme.colors;

  return (
    <Animated.View
      entering={FadeInDown.duration(360)}
      style={[
        styles.container,
        {
          minHeight,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Animated.View
        entering={ZoomIn.delay(100).duration(320)}
        style={[
          styles.iconBox,
          {
            backgroundColor: colors.primarySoft,
          },
        ]}
      >
        {hasCatalogItems ? (
            <Search size={30} color={colors.primary} strokeWidth={2.3} />
        ) : (
            <IFMark theme={theme} size={40} fontSize={18} mode="plain" />
        )}
      </Animated.View>

      <Text style={[styles.title, { color: colors.text }]}>
        {hasCatalogItems ? 'Nada encontrado' : 'Nenhum título por aqui'}
      </Text>

      <Text style={[styles.description, { color: colors.textMuted }]}>
        {hasCatalogItems
          ? 'A busca ou o filtro atual não encontrou nenhum título cadastrado.'
          : 'Use o botão Adicionar para cadastrar séries e filmes no seu catálogo.'}
      </Text>

      {hasCatalogItems && onClearFilters ? (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: pressed
                ? colors.primarySoft
                : colors.surfaceMuted,
              borderColor: colors.border,
            },
          ]}
          onPress={onClearFilters}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca e filtros"
        >
          <X size={16} color={colors.primary} strokeWidth={2.5} />

          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            Limpar busca e filtros
          </Text>
        </Pressable>
      ) : null}

      {!hasCatalogItems && onLoadSampleData ? (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: pressed
                ? colors.primarySoft
                : colors.surfaceMuted,
              borderColor: colors.border,
            },
          ]}
          onPress={onLoadSampleData}
          accessibilityRole="button"
          accessibilityLabel="Carregar exemplos de séries e filmes"
        >
          <Plus size={16} color={colors.primary} strokeWidth={2.5} />

          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            Carregar exemplo
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 18,
  },
  actionButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
});