import { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

import CatalogScreen from './screens/CatalogScreen';
import DetailScreen from './screens/DetailScreen';

export default function App() {
  const [medias, setMedias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [editingMediaId, setEditingMediaId] = useState(null);

  const [sortMode, setSortMode] = useState('az');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const visibleMedias = useMemo(() => {
    const normalizedSearch = sanitizeText(searchTerm.trim());

    const filteredBySearch = medias.filter((media) => {
      const title = sanitizeText(media.title);
      const genre = sanitizeText(media.genre);

      return (
        title.includes(normalizedSearch) || genre.includes(normalizedSearch)
      );
    });

    const filteredByStatus = filteredBySearch.filter((media) => {
      if (statusFilter === 'watched') {
        return media.watched;
      }

      if (statusFilter === 'pending') {
        return !media.watched;
      }

      return true;
    });

    const mediasCopy = [...filteredByStatus];

    if (sortMode === 'rating') {
      return mediasCopy.sort((a, b) => b.rating - a.rating);
    }

    return mediasCopy.sort((a, b) => a.title.localeCompare(b.title));
  }, [medias, searchTerm, statusFilter, sortMode]);

  const catalogStats = useMemo(() => {
    const watchedCount = medias.filter((media) => media.watched).length;

    return {
      total: medias.length,
      watched: watchedCount,
      pending: medias.length - watchedCount,
      visible: visibleMedias.length,
    };
  }, [medias, visibleMedias.length]);

  const selectedMedia = medias.find((media) => media.id === selectedMediaId);
  const editingMedia = medias.find((media) => media.id === editingMediaId);

  function handleSubmitMedia(mediaData) {
    if (editingMediaId !== null) {
      const mediaIdToEdit = editingMediaId;

      setMedias((currentMedias) =>
        currentMedias.map((media) => {
          if (media.id !== mediaIdToEdit) {
            return media;
          }

          const shouldKeepLocalImage =
            mediaData.keepLocalImage ??
            Boolean(media.imageSource && !mediaData.imageUri);

          return {
            ...media,
            title: mediaData.title.trim(),
            genre: mediaData.genre.trim(),
            rating: Number(mediaData.rating),
            imageUri: mediaData.imageUri || '',
            imageSource: shouldKeepLocalImage ? media.imageSource || null : null,
          };
        })
      );

      setModalVisible(false);
      setEditingMediaId(null);
      setSelectedMediaId(mediaIdToEdit);

      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      return;
    }

    const mediaToAdd = {
      id: Date.now(),
      title: mediaData.title.trim(),
      genre: mediaData.genre.trim(),
      rating: Number(mediaData.rating),
      watched: false,
      notes: '',
      imageUri: mediaData.imageUri || '',
      imageSource: null,
    };

    setMedias((currentMedias) => [...currentMedias, mediaToAdd]);
    setModalVisible(false);

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function handleToggleWatched(id) {
    void Haptics.selectionAsync();

    setMedias((currentMedias) =>
      currentMedias.map((media) =>
        media.id === id
          ? {
              ...media,
              watched: !media.watched,
            }
          : media
      )
    );
  }

  function handleDeleteMedia(id) {
    const mediaToDelete = medias.find((media) => media.id === id);

    if (!mediaToDelete) {
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert(
      'Excluir mídia?',
      `Deseja excluir "${mediaToDelete.title}" do catálogo?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setMedias((currentMedias) =>
              currentMedias.filter((media) => media.id !== id)
            );

            if (selectedMediaId === id) {
              setSelectedMediaId(null);
            }

            if (editingMediaId === id) {
              setEditingMediaId(null);
              setModalVisible(false);
            }

            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
          },
        },
      ]
    );
  }

  function handleOpenDetails(id) {
    void Haptics.selectionAsync();

    setSelectedMediaId(id);
  }

  function handleBackToCatalog() {
    void Haptics.selectionAsync();

    setSelectedMediaId(null);
  }

  function handleChangeNotes(id, notes) {
    setMedias((currentMedias) =>
      currentMedias.map((media) =>
        media.id === id
          ? {
              ...media,
              notes,
            }
          : media
      )
    );
  }

  function handleOpenAddModal() {
    void Haptics.selectionAsync();

    setEditingMediaId(null);
    setModalVisible(true);
  }

  function handleOpenEditMedia(id) {
    void Haptics.selectionAsync();

    setEditingMediaId(id);
    setSelectedMediaId(null);
    setModalVisible(true);
  }

  function handleCloseModal() {
    void Haptics.selectionAsync();

    setModalVisible(false);
    setEditingMediaId(null);
  }

  function handleToggleSortMode() {
    void Haptics.selectionAsync();

    setSortMode((currentSortMode) =>
      currentSortMode === 'az' ? 'rating' : 'az'
    );
  }

  function handleToggleTheme() {
    void Haptics.selectionAsync();

    setIsDarkMode((currentValue) => !currentValue);
  }

  function handleClearFilters() {
    void Haptics.selectionAsync();

    setSearchTerm('');
    setStatusFilter('all');
  }

  function handleLoadSampleData() {
    const now = Date.now();

    const sampleMedias = [
      {
        id: now,
        title: 'Interestelar',
        genre: 'Ficção científica',
        rating: 9.5,
        watched: true,
        notes:
          'Ótimo exemplo de narrativa emocional com escala cósmica. Trilha sonora e fotografia muito fortes.',
        imageUri: '',
        imageSource: require('./assets/posters/interestelar.jpg'),
      },
      {
        id: now + 1,
        title: 'Breaking Bad',
        genre: 'Drama',
        rating: 10,
        watched: true,
        notes:
          'Série com construção de personagem muito consistente e evolução narrativa excelente.',
        imageUri: '',
        imageSource: require('./assets/posters/breaking-bad.jpg'),
      },
      {
        id: now + 2,
        title: 'Cidade de Deus',
        genre: 'Drama',
        rating: 9,
        watched: false,
        notes:
          'Filme brasileiro com montagem marcante, ritmo forte e impacto social evidente.',
        imageUri: '',
        imageSource: require('./assets/posters/cidade-de-deus.jpg'),
      },
      {
        id: now + 3,
        title: 'Todo Mundo em Pânico',
        genre: 'Comédia',
        rating: 6.5,
        watched: false,
        notes: '',
        imageUri: '',
        imageSource: require('./assets/posters/todo-mundo-em-panico.jpg'),
      },
    ];

    setMedias(sampleMedias);
    setSearchTerm('');
    setStatusFilter('all');
    setSortMode('az');
    setSelectedMediaId(null);
    setEditingMediaId(null);
    setModalVisible(false);

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: StatusBar.currentHeight || 0,
        },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {selectedMedia ? (
        <DetailScreen
          media={selectedMedia}
          theme={theme}
          onBack={handleBackToCatalog}
          onChangeNotes={handleChangeNotes}
          onEdit={handleOpenEditMedia}
        />
      ) : (
        <CatalogScreen
          medias={visibleMedias}
          catalogStats={catalogStats}
          theme={theme}
          modalVisible={modalVisible}
          sortMode={sortMode}
          isDarkMode={isDarkMode}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          editingMedia={editingMedia}
          onChangeSearchTerm={setSearchTerm}
          onChangeStatusFilter={setStatusFilter}
          onClearFilters={handleClearFilters}
          onLoadSampleData={handleLoadSampleData}
          onOpenModal={handleOpenAddModal}
          onCloseModal={handleCloseModal}
          onAddMedia={handleSubmitMedia}
          onToggleWatched={handleToggleWatched}
          onDeleteMedia={handleDeleteMedia}
          onOpenDetails={handleOpenDetails}
          onToggleSortMode={handleToggleSortMode}
          onToggleTheme={handleToggleTheme}
        />
      )}
    </SafeAreaView>
  );
}

function sanitizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const darkTheme = {
  name: 'dark',
  colors: {
    name: 'dark',

    background: '#080B12',
    surface: '#111827',
    surfaceElevated: '#172033',
    surfaceMuted: '#1F2937',
    border: '#273449',

    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',

    primary: '#E11D48',
    primarySoft: '#3F1222',

    success: '#22C55E',
    successSoft: '#123322',

    warning: '#F59E0B',
    warningSoft: '#3A2A0A',

    danger: '#EF4444',
    dangerSoft: '#3B1216',

    white: '#FFFFFF',
  },
};

const lightTheme = {
  name: 'light',
  colors: {
    name: 'light',

    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceMuted: '#E5E7EB',
    border: '#D5DAE3',

    text: '#111827',
    textMuted: '#64748B',
    textSubtle: '#94A3B8',

    primary: '#E11D48',
    primarySoft: '#FFE4EA',

    success: '#16A34A',
    successSoft: '#DCFCE7',

    warning: '#D97706',
    warningSoft: '#FEF3C7',

    danger: '#DC2626',
    dangerSoft: '#FEE2E2',

    white: '#FFFFFF',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});