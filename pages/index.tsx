import * as React from 'react';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";

import RegsView from "../components/views/regsView";
import AddButton from "../components/modals/addButton";
import Loading from "../components/misc/loading"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Modal from "@mui/material/Modal"
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button"
import Stack from '@mui/material/Stack';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

const Home = () => {
    const { data: session, status } = useSession()

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [modalName, setModalName] = React.useState<boolean>(false)
    const [name, setName] = React.useState<String>("")

    useEffect(() => {
        if(session?.user?.name == null && status === "authenticated"){
            setModalName(true)
        }
      }, []);

    if (status === "loading") {
        return (
            <Loading />
        )
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    async function updateName(){
        const url = `${window.location.origin}/api/regs`;
        console.log(url)
        const options = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: session?.user?.email,
                name: name
            }),
        };

        const res = await fetch(url, options)
        const data = await res.json()
        if (data.success) {
            setModalName(false)
        }
    }

    return (
        <>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <ModeStandbyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            CAMPO
                        </Typography>

                        <ModeStandbyIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            CAMPO
                        </Typography>

                        <Box sx={{ flexGrow: 0 }}>
                            {session
                                ?
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src="user.png" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >

                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" onClick={() => signOut()}>Logout</Typography>
                                        </MenuItem>

                                    </Menu>
                                </>
                                :
                                <>
                                    <Typography
                                        onClick={() => signIn()}
                                        variant={"h5"}
                                        noWrap
                                        sx={{
                                            mr: 2,
                                            display: { xs: "flex", md: "none" },
                                            flexGrow: 1,
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            letterSpacing: ".3rem",
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        LOGIN
                                    </Typography>
                                </>
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <RegsView />

            {session
                ?
                <AddButton />
                :
                <></>
            }

            <Modal
                open={modalName}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} fullWidth/>                        
                        <Button
                            onClick={updateName}
                            variant="contained"
                            color="success"
                            sx={{ width: "100%" }}
                        >
                            Definir nombre
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};
export default Home;