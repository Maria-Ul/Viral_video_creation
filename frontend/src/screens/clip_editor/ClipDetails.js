import { Add, PlusOne } from "@mui/icons-material";
import { Button, Chip, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const ClipDetails = ({ clip }) => {
    const [clipName, setClipName] = useState(clip.options.name)
    const [clipDescription, setClipDesc] = useState(clip.options.desc)
    const [clipTags, setClipTags] = useState(clip.options.tags)
    const [tagInput, setTagInput] = useState('')
    const handleDelete = (tag) => {
        setClipTags(clipTags.filter((item) => item != tag))
    }

    const onAddTag = () => {
        clipTags.push(tagInput)
        setTagInput('')
    }
    return (<Stack spacing={2} p={2}>
        <Typography variant="h4">О клипе</Typography>
        <TextField label="Название" value={clipName} onChange={(event) => {
                setClipName(event.target.value);
            }} />
        <Typography></Typography>
        <TextField label='Описание' rows={3} multiline value={clipDescription}
            onChange={(event) => {
                setClipDesc(event.target.value);
            }}
        />
        <Typography>Теги</Typography>
        <Stack direction='row' spacing={1} width={'100%'} sx={{overflowX: 'auto'}} p={1}>
            {clipTags.map((tag, index) => (<Chip label={tag} onDelete={() => handleDelete(tag)} />))}
        </Stack>
        <Stack direction={'row'} spacing={1} width='100%'>
            <TextField label='Введите тег' value={tagInput} onChange={(event) => {
                setTagInput(event.target.value);
            }} />
            <Button variant='contained' color="primary" onClick={onAddTag}
            startIcon={(<Add/>)} 
            >Добавить</Button>
        </Stack>
        <Button mt={5} variant='contained' color="primary">Сохранить изменения</Button>
        <Button variant='contained' color="error">Удалить клип</Button>
    </Stack>);
}