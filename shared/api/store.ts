import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux';

import articleReducer from '@/features/article/article-page/models/current-article-slice';
import articleSaveReducer from '@/features/article/new-article/models/article-slice';
import authReducer from '@/features/auth/models/auth-slice';
import learningPathsReducer from '@/features/learning-paths/models/learning-paths-slice';

import { baseApi } from './base-api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articleSave: articleSaveReducer,
    article: articleReducer,
    learningPaths: learningPathsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
