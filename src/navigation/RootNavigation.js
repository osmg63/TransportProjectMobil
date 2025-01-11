import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import UserStack from './UserStack';

const RootNavigation = () => {
    return (
        <NavigationContainer>
            <UserStack />
        </NavigationContainer>
    );
}

export default RootNavigation;
