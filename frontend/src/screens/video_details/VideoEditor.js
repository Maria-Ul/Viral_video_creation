import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { Box, colors, Stack, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, TimeSlider, useStore } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL, FILE_ACCESS_LINK } from '../../api/baseApi';

export const getVideoLink =  (video) => { return BACKEND_URL + FILE_ACCESS_LINK + `/${video.object_name}` }
export const getVideoPreview = (video) => { return BACKEND_URL + FILE_ACCESS_LINK + `/${video.options.preview}` }

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export const VideoEditor = (
    { videoTime, video, selectedClip, clipList }
) => {
    const navigate = useNavigate()
    const onClipClick = (clip) => {
        navigate(`/editor/${clip.id}`)
    } 
    return (
        <Stack p={4} bgcolor={colors.grey[200]}>
            <MediaPlayer
                title="Sprite Fight"
                src={getVideoLink(video)}
                autoplay
                currentTime={videoTime}
            >
                <MediaProvider />

                <DefaultVideoLayout icons={defaultLayoutIcons}
                    slots={{
                        fullscreenButton: null,
                        settingsMenu: null,
                        googleCastButton: null,
                        pipButton: null,
                        chapterTitle: null,
                        timeSlider:
                            (
                                <>
                                    {
                                        clipList.map((clip) => {
                                            console.log((clip.options.end_at - clip.options.start_at) / video.durationS * 100)
                                            return (
                                                <Box sx={{
                                                    bgcolor: colors.blue[800],
                                                    position: 'absolute',
                                                    height: 30,
                                                    borderRadius: '0 8px 8px 8px',
                                                    //border: 'white solid 1px',
                                                    width: `${(clip.options.end_at - clip.options.start_at) / video.durationS * 100}%`,
                                                    top: 8,
                                                    left: `${clip.options.start_at / video.durationS * 100 + 1.5}%`,
                                                }}></Box>
                                            )
                                        }

                                        )
                                    }
                                    {
                                        clipList.map((clip) => {
                                            console.log((clip.endTime - clip.startTime) / video.durationS * 100)
                                            return (
                                                <HtmlTooltip
                                                placement="top"
                                                    title={
                                                        <React.Fragment>
                                                            <Typography variant='h5'>{clip.name}</Typography>
                                                            <Typography>{`${clip.startTime}-${clip.endTime}`}</Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <Stack onClick={onClipClick} sx={{
                                                        bgcolor: colors.blue[800],
                                                        position: 'absolute',
                                                        //border: 'white solid 1px',
                                                        borderRadius: '8px 8px 0px 0px',
                                                        left: `${clip.startTime / video.durationS * 100 + 1.5}%`,
                                                        mt: -6,
                                                        p: 0.2,
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                    }}><Typography>{clip.name}</Typography></Stack>
                                                </HtmlTooltip>

                                            )
                                        }

                                        )
                                    }

                                    <TimeSlider.Root className="vds-time-slider vds-slider">
                                        <TimeSlider.Root className="vds-time-slider vds-slider">
                                            <TimeSlider.Track className="vds-slider-track" />
                                            <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
                                            <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
                                            <TimeSlider.Thumb className="vds-slider-thumb" />
                                        </TimeSlider.Root>
                                    </TimeSlider.Root>
                                </>
                            ),
                    }}>
                    {/* <Stack bgcolor={'red'} width='100%' height='100%' justifyContent={'center'} alignItems={'center'}>
                        <Box>Hello</Box>
                    </Stack> */}
                </DefaultVideoLayout>
            </MediaPlayer>
            {/* <video controls
        style={{ maxHeight: "60vh"}}
        src=""/> */}
        </Stack>
    );
}