import { PlayCircleRounded } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/material";

export const TranscriptItem = ({
    transcription, onClick,
}) => {
    return (
        <Stack direction={'column'} p={1}>
            <Stack mb={1} direction='row' spacing={1} onClick={onClick}>
                <PlayCircleRounded />
                <Typography>{transcription.timeStart}</Typography>
                <Typography>{transcription.text}</Typography>

            </Stack>
            <Divider />
        </Stack>
    );
}