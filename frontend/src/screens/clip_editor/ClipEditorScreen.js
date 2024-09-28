import { Box, colors, Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
// https://github.com/vladmandic/face-api
function ClipEditorScreen() {
    const params = useParams()
    const clipId = params.clipId

    
    const navigate = useNavigate()
    return (
        <Stack>
            <AppHeader>
                <Stack
                    width='100vw'
                    direction={'row'}
                    alignItems={'center'}
                >
                    <IconButton onClick={() => { navigate(`/preview/${testVideo1.id}`) }}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography ml={2} variant="h6">{`Редактировать клип ${testClip.name}`}</Typography>
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