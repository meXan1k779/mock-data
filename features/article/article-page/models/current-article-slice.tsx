import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ContentResponse } from '../../new-article/api/types';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface ArticleState {
  article?: ContentResponse;
}

const initialState: ArticleState = {};

const articleSlice = createSlice({
  name: 'articleSave',
  initialState,
  reducers: {
    setArticleData: (state, action: PayloadAction<ContentResponse>) => {
      state.article = action.payload;
    },
    setArticleVote: (state, action: PayloadAction<{ vote: string; alreadyVote: string }>) => {
      if (state.article) {
        state.article.vote = action.payload.vote;
        state.article.alreadyVote = action.payload.alreadyVote;
      }
    },
  },
});

export const { setArticleData, setArticleVote } = articleSlice.actions;

export default articleSlice.reducer;
