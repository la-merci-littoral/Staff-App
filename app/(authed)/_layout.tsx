import useStaffStore from '@/stores/staffStore';
import { Redirect, router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

export default function RootLayout() {
    const isLoggedIn = useStaffStore(state => state.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return router.replace('/login')
        }
    }, [isLoggedIn])

    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
        }} />
    );
}
