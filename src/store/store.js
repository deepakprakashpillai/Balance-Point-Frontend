import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'

import React from 'react'

export const store = configureStore({
    reducer : {
        user : userReducer,
    },
})