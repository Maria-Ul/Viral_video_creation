import { Box, Button, Divider, Grid2, Stack, TextField, Toolbar, Typography } from "@mui/material";
import AppHeader from "../../components/AppHeader";
import { useState } from "react";
import { loginRequest } from "../../api/login";
import { registerReguset } from "../../api/register";
import { useNavigate } from "react-router-dom";

export const AuthScreen = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [loginR, setLoginR] = useState('')
    const [passwordR, setPasswordR] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const navigate = useNavigate()
    const onRegister = () => {
        registerReguset(
            {
                username: loginR,
                password: passwordR,
                onSuccess: () => {
                    navigate('/')
                }
            }
        )
    }

    const onLogIn = () => {
        loginRequest({
            username: login, password: password, onSuccess: () => {
                navigate('/')
            }
        })
    }
    return (
        <Stack>
            <AppHeader>
                <Typography>Сервис генерации виральных клипов</Typography>
            </AppHeader>
            <Toolbar />
            <Grid2 container columns={13}>
                <Grid2 size={6}>
                    <Stack spacing={2} padding={5} alignItems={'center'}>
                        <Typography mb={4}>Авторизация</Typography>
                        <TextField id="outlined-basic" label="Логин" variant="outlined"
                            value={login}
                            onChange={(event) => { setLogin(event.target.value) }}
                        />
                        <TextField id="outlined-basic" label="Пароль" variant="outlined" type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                        />
                        <Button variant='outlined' onClick={onLogIn}>Войти</Button>
                    </Stack>
                </Grid2>
                <Grid2 size={1} justifyContent={'center'}

                > <Stack width={'100%'}
                    height={'100%'} alignItems={'center'} p={2}
                ><Divider bgcolor='green' orientation='vertical' /></Stack> </Grid2>
                <Grid2 size={6}>
                    <Stack spacing={2} padding={5} alignItems={'center'}>
                        <Typography mb={4}>Регистрация</Typography>
                        <TextField id="outlined-basic" label="Логин" variant="outlined"
                            value={loginR}
                            onChange={(event) => { setLoginR(event.target.value) }}
                        />
                        <TextField id="outlined-basic" label="Пароль" variant="outlined" type="password"
                            value={passwordR}
                            onChange={(event) => { setPasswordR(event.target.value) }}
                        />
                        <TextField id="outlined-basic" label="Повторите пароль" variant="outlined" type="password"
                            value={passwordRepeat}
                            onChange={(event) => { setPasswordRepeat(event.target.value) }} />
                        <Button variant='contained'
                            onClick={onRegister}
                        >Зарегистрироваться</Button>
                    </Stack>
                </Grid2>
            </Grid2>
        </Stack>
    );
}