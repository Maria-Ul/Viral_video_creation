import { ChevronLeft } from '@mui/icons-material';
import { Grid2, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { ClipItem } from './ClipItem';
import { VideoEditor } from './VideoEditor';
import { useNavigate } from 'react-router-dom';

// https://codepen.io/binaryunit/pen/MWZGRej
function VideoPreviewScreen() {
    const testClip = {
        preview: "https://i.pinimg.com/originals/e8/40/6f/e8406fdb6884a7c76d4a7cf9db55c774.jpg",
        name: "Test clip",
        startTime: 0.0,
        endTime: 100,
        description: "Cool clip",
        tags: ["#cool", "#awesome"]
    }
    const testClip2 = {
        preview: "https://i.pinimg.com/originals/e8/40/6f/e8406fdb6884a7c76d4a7cf9db55c774.jpg",
        name: "Test clip222",
        startTime: 200.0,
        endTime: 250,
        description: "Cool clip",
        tags: ["#cool", "#awesome"]
    }
    const testClip3 = {
        preview: "https://i.pinimg.com/originals/e8/40/6f/e8406fdb6884a7c76d4a7cf9db55c774.jpg",
        name: "Test clip3333333",
        startTime: 600,
        endTime: 629,
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
    const [clipList, setClipList] = useState([testClip, testClip2, testClip3])
    const [selectedClip, setSelectedClip] = useState(clipList[0])
    const navigate = useNavigate()
    return (
        <Stack>
            <AppHeader>
                <Stack
                    width='100vw'
                    direction={'row'}
                    alignItems={'center'}
                >
                    <IconButton onClick={() => { navigate('/')}}>
                        <ChevronLeft/>
                    </IconButton>
                    <Typography ml={2} variant="h6">Клипы</Typography>
                </Stack>
            </AppHeader>
            <Toolbar />
            <Grid2 container>
                <Grid2 size={3} p={2}>
                    <Stack spacing={2}>
                        {
                            clipList.map((clip) =>
                            (
                                <ClipItem clip={clip} onClick={()=>{setSelectedClip(clip)}}/>
                            )
                            )
                        }
                    </Stack>
                </Grid2>
                <Grid2 size={9}>
                    <VideoEditor video={testVideo1} selectedClip={selectedClip} clipList={clipList}/>
                </Grid2>
            </Grid2>
        </Stack>
    );
}

export default VideoPreviewScreen;