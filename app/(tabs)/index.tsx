import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function HomeScreen() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [cards, setCards] = useState<
    { title: string; text: string }[]
  >([]);
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        'memo',
        JSON.stringify(cards)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('memo');

      if (data !== null) {
        const parsed = JSON.parse(data);

        setCards(parsed);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addCard = () => {
    const newCard = {
      title,
      text,
    };

    const updatedCards = [...cards, newCard];

    setCards(updatedCards);

    setSelectedCard(updatedCards.length - 1);

    setTitle('');
    setText('');
  };

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [cards]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="タイトル"
        placeholderTextColor="#666"
        multiline
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="ここに書く"
        placeholderTextColor="#666"
        multiline
        value={text}
        onChangeText={setText}
      />

      <View style={styles.buttonRow}>

        <Text
          style={styles.button}
          onPress={() => {
            if (selectedCard === null) {
              addCard();
            } else {
              const updatedCards = [...cards];
            
              updatedCards[selectedCard] = {
                title,
                text,
              };
            
              setCards(updatedCards);
            }
          }}
        >
          保存
        </Text>
        
        <Text
          style={styles.button}
          onPress={() => {
            setSelectedCard(null);
            setTitle('');
            setText('');
          }}
        >
          新規
        </Text>
        
      </View>

      <ScrollView style={styles.list}>
        {cards.map((card, index) => (
          <Text
            key={index}
            style={[
              styles.cardTitle,
              selectedCard === index &&
                styles.selectedCardTitle
            ]}
            onPress={() => {
              setSelectedCard(index);
              setTitle(card.title);
              setText(card.text);
            }}
          >
            {card.title || 'タイトルなし'}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    padding: 24,
    paddingTop: 80,
  },

  titleInput: {
    backgroundColor: '#151a22',
    color: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 24,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    backgroundColor: '#151a22',
    color: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    textAlignVertical: 'top',
  },

  preview: {
    color: '#9aa0aa',
    marginTop: 24,
    fontSize: 16,
  },

  button: {
    color: '#7aa2ff',
    fontSize: 18,
    marginVertical: 16,
  },

  card: {
    backgroundColor: '#151a22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    backgroundColor: '#151a22',
    color: '#fff',
    fontSize: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  cardText: {
    color: '#9aa0aa',
    fontSize: 16,
  },

  list: {
    marginTop: 16,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 16,
  },

  selectedCardTitle: {
    borderWidth: 1,
    borderColor: '#7aa2ff',
  },
});