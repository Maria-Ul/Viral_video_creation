import { Grid2, Stack, Toolbar, Typography } from "@mui/material";
import AppHeader from "../../components/AppHeader";

export const AuthScreen = () => {
    return (
        <Stack>
            <AppHeader>

            </AppHeader>
            <Toolbar />
            <Grid2 container>
                <Grid2 size={6}>
                    <Stack>
                        <Typography>Авторизация</Typography>
                    </Stack>
                </Grid2>
                <Grid2 size={6}>
                    <Stack>
                        <Typography>Регистрация</Typography>
                    </Stack>
                </Grid2>
            </Grid2>
        </Stack>
    );
}