import { Stack, Typography } from "@mui/material";

export const ClipItem = ({ clip, onClick, }) => {
    return (
        <Stack direction="row" onClick={onClick} spacing={2} alignItems='center'>
            <img style={{ borderRadius: 32, width: 100, height: 100 }} src={clip.preview} />
            <Stack>
                <Typography>{clip.name}</Typography>
                <Typography>{`Начало: ${clip.startTime}c`}</Typography>
                <Typography>{`Конец: ${clip.endTime}c`}</Typography>
            </Stack>
        </Stack>
    );
}