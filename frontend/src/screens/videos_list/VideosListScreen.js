import { Box, Button, colors, Grid2, Stack, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import VideoDetails from "./VideoDetails";
import AppHeader from "../../components/AppHeader";
import { FileUpload, VideoCameraBackTwoTone } from "@mui/icons-material";
import { VideoItem } from "./VideoItem";
import { useNavigate } from "react-router-dom";

const VideoListScreen = () => {
    const testVideo1 = {
        id: "123123",
        name: "TEST.mp4",
        summary: "Cool video",
        preview: "https://lh3.googleusercontent.com/_X4oEpRu4O-nv0KuFwJQV2zX5SLuwRg9fIM1_-Q29L50zDgRd2eLdEr0ZmLVk_cPLA4",
        size: "10 Гб"
    }
    const testVideo2 = {
        id: "1231423423",
        name: "LongLongLongLongLongLongLongLongLongLong Name.mp4",
        summary: "Cool video",
        preview: "https://lh3.googleusercontent.com/_X4oEpRu4O-nv0KuFwJQV2zX5SLuwRg9fIM1_-Q29L50zDgRd2eLdEr0ZmLVk_cPLA4",
        size: "10 Гб"
    }
    const [videosList, setVideosList] = useState([testVideo1, testVideo2, testVideo1, testVideo2,
        testVideo1, testVideo2, testVideo1, testVideo2,
        testVideo1, testVideo2, testVideo1, testVideo2,
    ]);
    //const [selectedVideo, setSelectedVideo] = useState(null);

    const navigate = useNavigate();
    const onVideoClick = (video) => {
        navigate(`/preview/${video.id}`);
    }
    return (
        <Stack direction={"column"} bgcolor={colors.grey[200]} height={'100vh'}
            sx={{
                overflowY: 'hidden'
            }}>
            <AppHeader>
                <Stack
                    width='100vw'
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Stack direction={'row'} alignItems={'center'}>
                        <VideoCameraBackTwoTone />
                        <Typography ml={2} variant="h6">Ваши видео</Typography>
                    </Stack>
                    <Button color='white' variant='outlined' startIcon={<FileUpload />}>Загрузить видео</Button>
                </Stack>
            </AppHeader>
            <Toolbar />
            <Grid2 
            pt={2}
            pb={2}
            container
                sx={{
                    overflowY: 'auto',
                    height: '100%'
                }}
                size={12}
                spacing={{ xs: 2, md: 3 }}
                pl={2} pr={2}
                columns={{ xs: 6, sm: 8, md: 12 }}>
                {videosList.map((video, index) => (
                    <Grid2 key={index} size={{ xs: 2, sm: 4, md: 3 }}>
                        <VideoItem video={video} onClick={() => {
                            onVideoClick(video)
                            //if (video == selectedVideo) {
                            //setSelectedVideo(null)
                            //} else {
                            //setSelectedVideo(video)
                            //}
                        }} />
                    </Grid2>
                )
                )}
            </Grid2>
        </Stack>
    );
}

export default VideoListScreen;