import styled from "styled-components/native";
import UsersThree from '@expo/vector-icons/FontAwesome';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SafeAreaView } from 'react-native-safe-area-context';



export const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${({theme}) => theme.COLORS.GRAY_600};
    padding: 24px;
`

export const Content = styled.View`
    flex: 1;
    justify-content: center;
`

export const Icon = styled(UsersThree).attrs(({theme}) => ({
    size: 56,
    color: theme.COLORS.GREEN_700,
}))`
    align-self: center;
`