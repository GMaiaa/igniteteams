import { Container, Icon, Title } from "./styles";

import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
    title: string;
}

export function GroupCard({title, ...rest}: Props){
    return(
        <Container {...rest}>
            <Icon name="users"/>
            <Title>{title}</Title>
        </Container>
    )
}