import { Button, colors, Divider, Stack, Typography } from "@mui/material";

export const ClipItem = ({ clip, onClick, onEdit, onDelete}) => {
    return (
        <Stack direction={'column'} onClick={onClick} spacing={1} alignItems='flex-start'
            bgcolor={colors.grey[50]} borderRadius={5}
            pl={2} pr={2} pt={3} pb={2}
        >
            <Stack direction="row" spacing={1}>
                <img style={{ borderRadius: 32, width: 100, height: 100 }} src={clip.preview} />
                <Stack spacing={0.5}>
                    <Typography>{clip.options.name}</Typography>
                    <Typography>{`Описание: ${clip.options.desc}`}</Typography>
                    <Typography>{`Начало: ${clip.options.start_at}c`}</Typography>
                    <Typography>{`Конец: ${clip.options.end_at}c`}</Typography>
                </Stack>
            </Stack>
            <Divider orientation='horizontal' />
            <Stack width='100%' direction={'row'} justifyContent={'flex-end'}>
                <Button color="error" onClick={onDelete}>Удалить</Button>
                <Button color="primary" onClick={onEdit}>Редактировать</Button>
            </Stack>
        </Stack>

    );
}