import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import {
  ArrowDownAZ,
  Circle,
  CircleCheck,
  ListFilter,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from 'lucide-react-native';

import AddMediaForm from '../components/AddMediaForm';
import EmptyState from '../components/EmptyState';
import MediaCard from '../components/MediaCard';
import IFMark from '../components/IFMark';

export default function CatalogScreen({
  medias,
  catalogStats,
  theme,
  modalVisible,
  sortMode,
  isDarkMode,
  searchTerm,
  statusFilter,
  editingMedia,
  onChangeSearchTerm,
  onChangeStatusFilter,
  onClearFilters,
  onOpenModal,
  onCloseModal,
  onAddMedia,
  onToggleWatched,
  onDeleteMedia,
  onOpenDetails,
  onToggleSortMode,
  onToggleTheme,
  onLoadSampleData,
}) {
  const colors = theme.colors;
  const { width, height } = useWindowDimensions();

  const isCompact = width < 390;
  const hasCatalogItems = catalogStats.total > 0;
  const ThemeIcon = isDarkMode ? Sun : Moon;

  const filterOptions = [
    {
      key: 'all',
      label: 'Todos',
      count: catalogStats.total,
      icon: null,
    },
    {
      key: 'watched',
      label: 'Assistidos',
      count: catalogStats.watched,
      icon: CircleCheck,
    },
    {
      key: 'pending',
      label: 'Pendentes',
      count: catalogStats.pending,
      icon: Circle,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isCompact ? 14 : 18,
        },
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(360)}
        style={styles.header}
      >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View
              style={[
                styles.logoBox,
                {
                  backgroundColor: colors.primarySoft,
                },
              ]}
            >
              <IFMark theme={theme} size={30} fontSize={14} mode="plain" />
            </View>

            <View>
              <Text style={[styles.brand, { color: colors.text }]}>
                StreamIF
              </Text>

              <Text style={[styles.brandSubtitle, { color: colors.textMuted }]}>
                {hasCatalogItems
                  ? `${catalogStats.total} títulos • ${catalogStats.watched} assistidos`
                  : 'Catálogo pessoal'}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.themeButton,
              {
                backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={onToggleTheme}
            accessibilityRole="button"
            accessibilityLabel="Alternar tema claro e escuro"
          >
            <ThemeIcon size={19} color={colors.text} strokeWidth={2.4} />
          </Pressable>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: isCompact ? 24 : 26,
              lineHeight: isCompact ? 30 : 32,
            },
          ]}
        >
          {hasCatalogItems
            ? 'Sua watchlist'
            : 'Sua watchlist ainda está vazia.'}
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          {hasCatalogItems
            ? 'Busque, filtre e organize seus títulos cadastrados.'
            : 'Adicione o primeiro filme ou série para começar seu catálogo pessoal.'}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.84 : 1,
              },
            ]}
            onPress={onOpenModal}
            accessibilityRole="button"
            accessibilityLabel="Adicionar nova mídia"
          >
            <Plus size={18} color={colors.white} strokeWidth={2.8} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </Pressable>

          {hasCatalogItems ? (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed
                    ? colors.surfaceMuted
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={onToggleSortMode}
              accessibilityRole="button"
              accessibilityLabel="Alternar ordenação"
            >
              {sortMode === 'az' ? (
                <ArrowDownAZ size={20} color={colors.text} strokeWidth={2.4} />
              ) : (
                <ListFilter size={20} color={colors.text} strokeWidth={2.4} />
              )}
            </Pressable>
          ) : null}
        </View>

        {hasCatalogItems ? (
          <Animated.View entering={FadeInDown.delay(80).duration(300)}>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Search size={18} color={colors.textMuted} strokeWidth={2.4} />

              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Buscar por título ou gênero"
                placeholderTextColor={colors.textSubtle}
                value={searchTerm}
                onChangeText={onChangeSearchTerm}
              />

              {searchTerm ? (
                <Pressable
                  style={styles.clearSearchButton}
                  onPress={() => onChangeSearchTerm('')}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar busca"
                >
                  <X size={18} color={colors.textMuted} strokeWidth={2.4} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.filtersRow}>
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const active = statusFilter === option.key;

                return (
                  <Pressable
                    key={option.key}
                    style={({ pressed }) => [
                      styles.filterChip,
                      {
                        backgroundColor: active
                          ? colors.primary
                          : pressed
                            ? colors.surfaceMuted
                            : colors.surface,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => onChangeStatusFilter(option.key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrar por ${option.label}`}
                  >
                    {Icon ? (
                        <Icon
                            size={14}
                            color={active ? colors.white : colors.textMuted}
                            strokeWidth={2.4}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.filterIf,
                                {
                                    color: active ? colors.white : colors.primary,
                                },
                            ]}
                        >
                            IF
                        </Text>
                    )}

                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: active ? colors.white : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text
                      style={[
                        styles.filterCount,
                        {
                          color: active ? colors.white : colors.textMuted,
                        },
                      ]}
                    >
                      {option.count}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sortHint, { color: colors.textSubtle }]}>
              {sortMode === 'az' ? 'Ordenado por A-Z' : 'Ordenado por nota'} •
              mostrando {catalogStats.visible}
            </Text>
          </Animated.View>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300)} style={styles.listWrapper}>
        <FlatList
          data={medias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 7) * 55).duration(340)}
              layout={LinearTransition.springify().damping(18)}
            >
              <MediaCard
                media={item}
                theme={theme}
                compact={isCompact}
                onPress={() => onToggleWatched(item.id)}
                onLongPress={() => onOpenDetails(item.id)}
                onDelete={() => onDeleteMedia(item.id)}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <EmptyState
              theme={theme}
              minHeight={hasCatalogItems ? Math.max(240, height * 0.3) : 310}
              hasCatalogItems={hasCatalogItems}
              onLoadSampleData={onLoadSampleData}
              onClearFilters={onClearFilters}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
        />
      </Animated.View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={onCloseModal}
      >
        <AddMediaForm
          theme={theme}
          initialMedia={editingMedia}
          onSave={onAddMedia}
          onCancel={onCloseModal}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  addButton: {
    flex: 1,
    height: 50,
    borderRadius: 17,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: 0,
  },
  clearSearchButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 8,
  },
  filterChip: {
    flex: 1,
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '900',
  },
  filterCount: {
    fontSize: 11,
    fontWeight: '900',
  },
  filterIf: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  sortHint: {
    fontSize: 11,
    fontWeight: '700',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingTop: 2,
    paddingBottom: 26,
  },
});