import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ContentResponse } from '../api/types';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface ArticleSaveState {
  status: SaveStatus;
  articleId: string | null; // чтобы знать, для какой статьи статус
  isConfirmModalVisible: boolean;
  allCards: ContentResponse[];
  editorData: string | null;
  editorTitle: string;
  complexity: number | null;
  topics: string[];
}

const initialState: ArticleSaveState = {
  status: 'idle',
  articleId: null,
  isConfirmModalVisible: false,
  allCards: [],
  editorData: null,
  editorTitle: '',
  complexity: null,
  topics: [],
};

const articleSaveSlice = createSlice({
  name: 'articleSave',
  initialState,
  reducers: {
    setSavingStatus: (state, action: PayloadAction<{ status: SaveStatus; articleId: string }>) => {
      state.status = action.payload.status;
      state.articleId = action.payload.articleId;
    },
    resetEditorData: (state) => {
      state.editorData = null;
      state.editorTitle = '';
      state.complexity = null;
      state.topics = [];
    },
    setEditorData: (state, action: PayloadAction<string | null>) => {
      state.editorData = action.payload;
    },
    setEditorTitle: (state, action: PayloadAction<string>) => {
      state.editorTitle = action.payload;
    },
    setEditorComplexity: (state, action: PayloadAction<number>) => {
      state.complexity = action.payload;
    },
    setEditorTopics: (state, action: PayloadAction<string[]>) => {
      state.topics = action.payload;
    },
    resetSaveStatus: (state) => {
      state.status = 'idle';
      state.articleId = null;
    },
    showConfirmModal: (state, action: PayloadAction<boolean>) => {
      state.isConfirmModalVisible = action.payload;
    },
    setAllCards: (state, action: PayloadAction<ContentResponse[]>) => {
      state.allCards = action.payload;
    },
    setVote: (
      state,
      action: PayloadAction<{
        id: string;
        alreadyVote: string;
        vote: string;
      }>,
    ) => {
      const { vote, alreadyVote, id } = action.payload;
      const newCards = state.allCards.map((item) =>
        item.id === id ? { ...item, vote, alreadyVote } : item,
      );
      state.allCards = newCards;
    },
  },
});

export const {
  setSavingStatus,
  setEditorData,
  setEditorTitle,
  resetEditorData,
  setEditorComplexity,
  setEditorTopics,
  resetSaveStatus,
  showConfirmModal,
  setAllCards,
  setVote,
} = articleSaveSlice.actions;
export default articleSaveSlice.reducer;
