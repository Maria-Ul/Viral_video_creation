import { Box, Button, Stack, Typography } from "@mui/material";
import { colors } from "../../components/Colors";

const VideoDetails = ({ video }) => {
    return (
        <Box>
            <Stack bgcolor={colors.cadet_gray} alignItems={'center'} textAlign={"start"}>
                <img style={{
                    width: 300,
                    height: 300,
                }} src={video.preview} />
                
                <Typography>{video.name}</Typography>
                <Typography>{video.size}</Typography>
                <Button/>
            </Stack>
        </Box>
    );
}

export default VideoDetails;