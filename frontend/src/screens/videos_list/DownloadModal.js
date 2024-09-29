import { Box, Button, colors, Modal, Stack, Typography } from "@mui/material";
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { useState } from "react";
import { SESSION_TOKEN } from "../../api/login";
import { BACKEND_URL, VIDEOS_UPLOAD_URL, viralClipsApi } from "../../api/baseApi";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export const DownloadModal = ({ open, handleOpen, handleClose, onLoad }) => {
    const [files, setFiles] = useState([])
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}>
                <Box p='10%' >
                    <Stack height={500} bgcolor={"white"} 
                    sx={{
                        overflowY: 'auto'
                    }}
                    p={5} borderRadius={1} spacing={5}>
                        <Typography variant="h5">Загрузка видео</Typography>
                        <FilePond
                            
                            files={files}
                            acceptedFileTypes={['video/*']}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={5}
                            server={{
                                url: BACKEND_URL,
                                process: {
                                    url: VIDEOS_UPLOAD_URL,
                                    //withCredentials: true,
                                    headers: {
                                        'Authorization': `Bearer ${sessionStorage.getItem(SESSION_TOKEN)}`
                                    },
                                    onload: onLoad
                                }
                            }
                            }
                            name="video" /* sets the file input name, it's filepond by default */
                            labelIdle='Перетащите или <span class="filepond--label-action">Выберете файл</span>'
                        />
                        <Typography variant='subtitle1' color={colors.grey[600]}>После загрузки клипы и транскрипт появятся через несколько минут (~0.1 от длины видео). Чтобы увидеть актуальный статус обработки видео - обновите страницу.</Typography>
                        <Button mt={10} onClick={handleClose}>Закрыть</Button>
                    </Stack>
                </Box>
            </Modal>
        </div>

    );
}