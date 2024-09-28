import { ChevronLeft } from '@mui/icons-material';
import { Box, colors, Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { ClipItem } from './ClipItem';
import { VideoEditor } from './VideoEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { clipHistoryRequest } from '../../api/clipHistory';
import { deleteClipRequest } from '../../api/deleteClip';
import { getVideoByIdRequest } from '../../api/getVideoById';
import { VideoTranscript } from './VideoTranscript';

// https://codepen.io/binaryunit/pen/MWZGRej
function VideoPreviewScreen() {
    const params = useParams()
    const videoId = params.videoId
    console.log("VID" + videoId.toString())

    const [video, setVideo] = useState(null)

    const loadVideo = () => {
        getVideoByIdRequest(
            {
                videoId: videoId,
                onSuccess: (data) => { setVideo(data[0]) }
            }
        )
    }
    useEffect(() => {
        loadVideo()
    }, [])

    // const testVideo = {
    //     "id": 1,
    //     "object_name": "a45134be-37a0-4c91-a6d9-9053dd54fe60.mp4",
    //     "options": {
    //         "created_at": "created_at",
    //         "duration": "duration",
    //         "name": "name",
    //         "size": "size"
    //     },
    //     "status": "created",
    //     "user_id": 2
    // }
    useEffect(
        () => {
            refreshList()
        }, []
    )
    const refreshList = () => {
        clipHistoryRequest(
            {
                videoId: videoId,
                onSuccess: (data) => { setClipList(data) }
            }
        )
    }
    const deleteClip = (clipId) => {
        deleteClipRequest(
            {
                clipId: clipId,
                onSuccess: () => { refreshList() }
            }
        )
    }
    const [clipList, setClipList] = useState([])
    const [selectedClip, setSelectedClip] = useState(null)
    const [currentVideoTime, setVideoTime] = useState(0)
    const onSelectTiming = (timingS) => {
        setVideoTime(0)
        setVideoTime(timingS)
    }
    const navigate = useNavigate()
    const onClipClick = (clipId) => {
        navigate(`/editor/${video.id}/${clipId}`)
    }
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
                    <Typography ml={2} variant="h6">Клипы</Typography>
                </Stack>
            </AppHeader>
            <Toolbar />
            <Grid2 container>
                <Grid2 size={3}>
                    <Stack p={2} spacing={2} height={'87vh'} sx={{ overflowY: 'auto' }}>
                        {
                            clipList.map((clip) =>
                            (
                                <ClipItem
                                    clip={clip}
                                    onClick={() => {
                                        setSelectedClip(clip)
                                        setVideoTime(clip.options.start_at)
                                    }}
                                    onEdit={() => { onClipClick(clip.id) }}
                                    onDelete={() => { deleteClip(clip.id) }}
                                />
                            )
                            )
                        }
                    </Stack>
                </Grid2>
                <Grid2 size={6}>
                    <Stack pt='10%' height='80vh'bgcolor={colors.grey[200]} sx={{ overflowY: 'hidden' }}>
                        {video != null ?
                            (<VideoEditor videoTime={currentVideoTime}
                                video={video} selectedClip={selectedClip} clipList={clipList} />) : <></>
                        }
                        <Box width={'100%'} height={'50vh'}></Box>
                    </Stack>
                </Grid2>
                <Grid2 size={3}>
                    <VideoTranscript video={video} onItemClick={(timingS) => { onSelectTiming(timingS) }} />
                </Grid2>
            </Grid2>
        </Stack>
    );
}

export default VideoPreviewScreen;