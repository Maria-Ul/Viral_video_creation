import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import { colors } from "./Colors";

const AppHeader = ({children}) => {
    return ( 
        <React.Fragment>
            <AppBar color='primary' position="fixed">
                <Toolbar>{children}</Toolbar>
            </AppBar>
        </React.Fragment>
     );
}

export default AppHeader;