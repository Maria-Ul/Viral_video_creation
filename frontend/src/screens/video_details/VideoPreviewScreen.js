import { ChevronLeft } from '@mui/icons-material';
import { Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { ClipItem } from './ClipItem';
import { VideoEditor } from './VideoEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { clipHistoryRequest } from '../../api/clipHistory';
import { deleteClipRequest } from '../../api/deleteClip';
import { getVideoByIdRequest } from '../../api/getVideoById';

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
    const navigate = useNavigate()
    const onClipClick = (clip) => {
        navigate(`/editor/${clip.id}`)
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
                <Grid2 size={4}>
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
                                    onEdit={onClipClick}
                                    onDelete={() => { deleteClip(clip.id) }}
                                />
                            )
                            )
                        }
                    </Stack>
                </Grid2>
                <Grid2 size={8}>
                    {video != null ?
                        (<VideoEditor videoTime={currentVideoTime}
                            video={video} selectedClip={selectedClip} clipList={clipList} />) : <></>
                    }

                </Grid2>
            </Grid2>
        </Stack>
    );
}

export default VideoPreviewScreen;