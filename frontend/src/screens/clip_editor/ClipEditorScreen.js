import { Box, colors, Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import React, { useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { clipHistoryRequest } from '../../api/clipHistory';
import { getVideoByIdRequest } from '../../api/getVideoById';
import { getVideoLink } from '../video_details/VideoEditor';
import { ClipDetails } from './ClipDetails';
// https://github.com/vladmandic/face-api
function ClipEditorScreen() {
    const params = useParams()
    const clipId = params.clipId
    const videoId = params.videoId

    const [video, setVideo] = useState(null)
    const [clip, setClip] = useState(null)
    const loadVideo = () => {
        getVideoByIdRequest(
            {
                videoId: videoId,
                onSuccess: (data) => { setVideo(data[0]) }
            }
        )
    }
    const loadClip = () => {
        clipHistoryRequest(
            {
                videoId: videoId,
                onSuccess: (data) => {
                    setClip(data.find((item) => item.id == clipId))
                }
            }
        )
    }
    useEffect(() => {
        loadVideo()
        loadClip()
    }, [])


    console.log(clipId)
    const navigate = useNavigate()
    return (
        <Stack>
            <AppHeader>
                <Stack
                    width='100vw'
                    direction={'row'}
                    alignItems={'center'}
                >
                    <IconButton onClick={() => { navigate(`/preview/${videoId}`) }}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography ml={2} variant="h6">{`Редактировать клип ${clipId}`}</Typography>
                </Stack>
            </AppHeader>
            <Toolbar />
            <Grid2 container>
                <Grid2 size={4}>
                    { clip != null ? (<ClipDetails clip={clip}/>) : <></>}
                </Grid2>
                <Grid2 size={4}>
                    <Stack p={4} bgcolor={colors.grey[200]} justifyContent={'center'}
                    alignItems={'center'}>
                        {
                            video != null && clip != null ? (<MediaPlayer
                            style={{
                                maxWidth: "24vw"
                            }}
                                aspectRatio='9/16'
                                title="Sprite Fight"
                                src={getVideoLink(clip)}
                                autoplayS
                            >
                                <Box
                                    position='absolute'
                                    width='100%'
                                    height='100%'
                                    sx={{
                                        opacity: 0.5
                                    }}
                                    bgcolor={'black'}
                                    zIndex={2}
                                >
                                </Box>

                                <MediaProvider />

                                <DefaultVideoLayout icons={defaultLayoutIcons}
                                    slots={{
                                        fullscreenButton: null,
                                        settingsMenu: null,
                                        googleCastButton: null,
                                        pipButton: null,
                                        chapterTitle: null,
                                    }}>
                                </DefaultVideoLayout>
                            </MediaPlayer>) : <></>
                        }
                    </Stack>
                </Grid2>
                <Grid2 size={4}>

                </Grid2>
            </Grid2>
        </Stack>
    );
}

export default ClipEditorScreen;