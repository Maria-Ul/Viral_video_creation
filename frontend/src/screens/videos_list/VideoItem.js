import { Badge, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { getVideoLink, getVideoPreview } from "../video_details/VideoEditor";


const statuses = {
    'created': { text: 'Создано', color: 'primary' },
    'in_progress': { text: 'Обрабатывается', color: 'secondary' },
    'done': { text: 'Обработано', color: 'success' }
}
export const VideoItem = ({ video,
    onClick,
    onDelete,
}) => {
    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    component='img'
                    height={200}
                    image={getVideoPreview(video)}
                />
                <CardContent>
                    <Typography variant="h6">{`${video.options.name}`}</Typography>
                    <Typography>{`Файл: ${video.object_name}`}</Typography>
                    <Typography>{`Размер: ${video.options.size}`}</Typography>
                    <Chip label={statuses[video.status].text} color={statuses[video.status].color} />

                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color='error' onClick={onDelete}>Удалить</Button>
            </CardActions>
        </Card>
    );
}