import { Header } from "@components/Header";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { AppError } from "@utils/AppError";
import { playerGetByGroup } from "@storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayersStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
    group: string;
}

export function Players() {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayersStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();

    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert("Nova pessoa", "Informe o nome da pessoa para adiciona-la no grupo.")
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            setNewPlayerName('')
            fetchPlayersByTeam()
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert("Nova Pessoa", error.message);
            } else {
                console.log(error);
                Alert.alert("Nova Pessoa", "Não foi possível adicionar.")
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            const playersByTeam = await playersGetByGroupAndTeam(group, team);

            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error)
            Alert.alert("Pessoas", "Não foi possível carregar as pessoas desse time.")
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
          await playerRemoveByGroup(playerName, group);
          fetchPlayersByTeam()
        } catch (error) {
          console.log(error);
          Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
        }
      }

      async function groupRemove() {
        try {
          await groupRemoveByName(group);
          navigation.navigate('groups');
        } catch (error) {
          console.log(error);
          Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
        }
      }
      async function handleGroupRemove() {
        Alert.alert(
          'Remover',
          'Deseja remover o grupo?',
          [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim', onPress: () => groupRemove() }
          ]
        )
      }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [team]);
    return (
        <Container>
            <Header showBackButton />

            <Highlight title={group} subtitle="Adicione a galera e separe os times" />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder="Nome da Pessoa"
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumbersOfPlayers>
                    {players.length}
                </NumbersOfPlayers>
            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item.name}
                        onRemove={() => handlePlayerRemove(item.name)}
                    />
                )}
                ListEmptyComponent={() =>
                    <ListEmpty message="Não há pessoas nesse time" />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && { flex: 1 }
                ]}
            />

            <Button
                title="Remover Turma"
                type='SECONDARY'
                onPress={handleGroupRemove}
            />
        </Container>
    )
}