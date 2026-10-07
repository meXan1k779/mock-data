import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { getJSON, setJSON } from '@/shared/utils/local-storage';

const STORAGE_KEY = 'learningPathsProgress';

interface PersistedProgress {
  readArticleIds: string[];
  startedPaths: Record<string, boolean>;
  completedModalShown: Record<string, boolean>;
}

interface LearningPathsState extends PersistedProgress {}

const defaultProgress: PersistedProgress = {
  readArticleIds: [],
  startedPaths: {},
  completedModalShown: {},
};

const initialState: LearningPathsState = getJSON(STORAGE_KEY, defaultProgress);

function persist(state: LearningPathsState) {
  setJSON<PersistedProgress>(STORAGE_KEY, {
    readArticleIds: state.readArticleIds,
    startedPaths: state.startedPaths,
    completedModalShown: state.completedModalShown,
  });
}

const learningPathsSlice = createSlice({
  name: 'learningPaths',
  initialState,
  reducers: {
    markArticleRead: (state, action: PayloadAction<string>) => {
      if (!state.readArticleIds.includes(action.payload)) {
        state.readArticleIds.push(action.payload);
        persist(state);
      }
    },
    markPathStarted: (state, action: PayloadAction<string>) => {
      if (!state.startedPaths[action.payload]) {
        state.startedPaths[action.payload] = true;
        persist(state);
      }
    },
    markCompletedModalShown: (state, action: PayloadAction<string>) => {
      if (!state.completedModalShown[action.payload]) {
        state.completedModalShown[action.payload] = true;
        persist(state);
      }
    },
  },
});

export const { markArticleRead, markPathStarted, markCompletedModalShown } =
  learningPathsSlice.actions;

export default learningPathsSlice.reducer;
