import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";

export const VideoItem = ({video, 
    onClick,
    onDelete,
}) => {
    return ( 
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    component='img'
                    height={'25%'}
                    image={video.preview}
                />
                <CardContent>
                    <Typography>{video.name}</Typography>
                    <Typography>{video.size}</Typography>

                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color='error' onClick={onDelete}>Удалить</Button>
            </CardActions>
        </Card>
     );
}