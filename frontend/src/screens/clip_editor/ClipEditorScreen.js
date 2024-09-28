import { Box, colors, Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// https://github.com/vladmandic/face-api
function ClipEditorScreen({ video, clip }) {
    const testClip = {
        preview: "https://i.pinimg.com/originals/e8/40/6f/e8406fdb6884a7c76d4a7cf9db55c774.jpg",
        name: "Test clip",
        startTime: 0.0,
        endTime: 100,
        description: "Cool clip",
        tags: ["#cool", "#awesome"]
    }
    const testVideo1 = {
        id: "123123",
        name: "TEST.mp4",
        summary: "Cool video",
        durationS: 629,
        url: "https://files.vidstack.io/sprite-fight/720p.mp4",
        preview: "https://lh3.googleusercontent.com/_X4oEpRu4O-nv0KuFwJQV2zX5SLuwRg9fIM1_-Q29L50zDgRd2eLdEr0ZmLVk_cPLA4",
        size: "10 Гб"
    }
    const navigate = useNavigate()
    return (
        <Stack>
            <AppHeader>
                <Stack
                    width='100vw'
                    direction={'row'}
                    alignItems={'center'}
                >
                    <IconButton onClick={() => { navigate('/') }}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography ml={2} variant="h6">Редактировать клип</Typography>
                </Stack>
            </AppHeader>
            <Toolbar />
            <Grid2 container>
                <Grid2 size={3}>

                </Grid2>
                <Grid2 size="grow">
                    <Stack p={4} bgcolor={colors.grey[200]}>
                        <MediaPlayer
                            style={{
                                background: 'red',
                            }}
                            title="Sprite Fight"
                            src={testVideo1.url}
                            autoplay
                            clipStartTime={testClip.startTime}
                            clipEndTime={testClip.endTime}
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
                                <canvas>
                                    <rect></rect>
                                </canvas>
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
                        </MediaPlayer>
                    </Stack>
                </Grid2>
            </Grid2>

        </Stack>


    );
}

export default ClipEditorScreen;