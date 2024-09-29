import { Box, Button, colors, Grid2, Stack, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import VideoDetails from "./VideoDetails";
import AppHeader from "../../components/AppHeader";
import { FileUpload, VideoCameraBackTwoTone } from "@mui/icons-material";
import { VideoItem } from "./VideoItem";
import { useNavigate } from "react-router-dom";
import { DownloadModal } from "./DownloadModal";
import { videoHistoryRequest } from "../../api/videoHistory";
import { CURRENT_LOGIN, SESSION_TOKEN } from "../../api/login";
import { deleteVideoRequest } from "../../api/deleteVideo";

const VideoListScreen = () => {
    // const testVideo1 = {
    //     id: "123123",
    //     name: "TEST.mp4",
    //     summary: "Cool video",
    //     preview: "https://lh3.googleusercontent.com/_X4oEpRu4O-nv0KuFwJQV2zX5SLuwRg9fIM1_-Q29L50zDgRd2eLdEr0ZmLVk_cPLA4",
    //     size: "10 Гб"
    // }
    // const testVideo2 = {
    //     id: "1231423423",
    //     name: "LongLongLongLongLongLongLongLongLongLong Name.mp4",
    //     summary: "Cool video",
    //     preview: "https://lh3.googleusercontent.com/_X4oEpRu4O-nv0KuFwJQV2zX5SLuwRg9fIM1_-Q29L50zDgRd2eLdEr0ZmLVk_cPLA4",
    //     size: "10 Гб"
    // }
    const [videosList, setVideosList] = useState([]);
    //const [selectedVideo, setSelectedVideo] = useState(null);
    const refreshList = () => {
        videoHistoryRequest({
            onSuccess: (data) => { setVideosList(data) }
        })
    }
    const deleteVideo = (videoId) => {
        deleteVideoRequest({
            videoId: videoId,
            onSuccess: () => {
                refreshList()
            }
        })
    }
    const token = sessionStorage.getItem(SESSION_TOKEN)
    const navigate = useNavigate();
    useEffect(() => {
        if (token == null || token == '') {
            navigate('/auth')
        } else {
            refreshList()
        }
    }, [])

    const onVideoClick = (video) => {
        navigate(`/preview/${video.id}`);
    }

    // TODO обновление при загрузке
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
                    <Stack direction={'row'} spacing={3} alignItems={'center'}>
                        <Typography variant="h6" mr={5}>{`Добро пожаловать, ${sessionStorage.getItem(CURRENT_LOGIN)}`}</Typography>
                        <Button color='white' variant='outlined' startIcon={<FileUpload />}
                            onClick={handleOpen}>Загрузить видео</Button>
                        <Button color='white' variant='outlined' onClick={() => {
                            navigate('/auth')
                            sessionStorage.setItem(SESSION_TOKEN, null)
                            sessionStorage.setItem(CURRENT_LOGIN, null)
                        }
                        } >Выйти</Button>
                    </Stack>

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
                    <Grid2 key={index} size={{ xs: 3, sm: 4, md: 3 }}>
                        <VideoItem video={video} onClick={() => {
                            onVideoClick(video)
                            //if (video == selectedVideo) {
                            //setSelectedVideo(null)
                            //} else {
                            //setSelectedVideo(video)
                            //}
                        }}
                            onDelete={() => { deleteVideo(video.id) }}
                        />
                    </Grid2>
                )
                )}
            </Grid2>
            <DownloadModal open={open} handleOpen={handleOpen} handleClose={handleClose} onLoad={refreshList} />
        </Stack>
    );
}

export default VideoListScreen;