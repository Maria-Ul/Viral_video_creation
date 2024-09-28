import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import VideoPreviewScreen from './screens/video_details/VideoPreviewScreen';
import ClipEditorScreen from './screens/clip_editor/ClipEditorScreen';
import VideoListScreen from './screens/videos_list/VideosListScreen';
import { AuthScreen } from './screens/auth/AuthScreen';


const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <VideoListScreen/>
  },
  {
    path: "/auth",
    element: <AuthScreen/>
  },
  {
    path: "/preview/:videoId",
    element: <VideoPreviewScreen/>
  },
  {
    path: "/editor/:clipId",
    element: <ClipEditorScreen/>
  }
])
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
