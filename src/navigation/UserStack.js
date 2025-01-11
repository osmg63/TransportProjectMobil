import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  LoginPage  from '../pages/authsPages/Login';
import HomePage from '../pages/filterPages/HomePage';
import RegisterPage from '../pages/authsPages/RegisterPage';
import FilterPage from '../pages/filterPages/FilterPage';
import FilterDetailPage from '../pages/filterPages/FilterDetailPage';
import MessageScreen from '../pages/messagePages/MessageScreen';
import AddJob from '../pages/AddPages/AddJob';
import AddPhoto from '../pages/AddPages/AddPhoto';
import MessageBox from '../pages/messagePages/MessageBox';
import OptionPage from '../pages/optionsPage/OptionPage';
import UserJob from '../pages/optionsPage/UserJob';
import UserOffer from '../pages/optionsPage/UserOffer';
import UserProfile from '../pages/optionsPage/UserProfile';
import AddUserPhoto from '../pages/optionsPage/AddUserPhoto';
const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginPage} />
      <Stack.Screen name='HomePage' component={HomePage} />
      <Stack.Screen name='RegisterPage' component={RegisterPage} />
      <Stack.Screen name='FilterPage' component={FilterPage} />
      <Stack.Screen name='FilterDetailPage' component={FilterDetailPage} />
      <Stack.Screen name='MessageScreen' component={MessageScreen} />
      <Stack.Screen name='AddJobScreen' component={AddJob} />
      <Stack.Screen name='AddPhoto' component={AddPhoto} />
      <Stack.Screen name='MessageBox' component={MessageBox} />
      <Stack.Screen name='OptionPage' component={OptionPage} />
      <Stack.Screen name='UserJob' component={UserJob} />
      <Stack.Screen name='UserOffer' component={UserOffer} />
      <Stack.Screen name='UserProfile' component={UserProfile} />
      <Stack.Screen name='AddUserPhoto' component={AddUserPhoto} />


    </Stack.Navigator>
  );
}

export default UserStack;
