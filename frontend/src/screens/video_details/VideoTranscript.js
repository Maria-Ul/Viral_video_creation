import { Stack } from "@mui/material";
import { TranscriptItem } from "./TranscriptItem";

export const VideoTranscript = ({transcriptsList, onItemClick}) => {
    const testList = [
        {
            timeStart: '0:15',
            text: "Lorem ipsum ejfnjkdnsfj dsfk asdkjfkfnkjasndfjnasdnfjksandfkjasndk"
        },
        {
            timeStart: '0:15',
            text: "Lorem ipsum"
        },
        {
            timeStart: '0:15',
            text: "Lorem ipsum"
        }
    ]
    return ( <Stack height='100%' sx={{overflowY: 'auto'}}>
        {
            testList.map((item) => (<TranscriptItem transcription={item} onClick={() => onItemClick(Math.random() * 360)}/>)
            )
        }
    </Stack> );
}