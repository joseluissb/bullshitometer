import type React from "react";
import { useState } from "react";
import "./WordList.css";

interface WordListProps {
  words: string[];
  setWords: React.Dispatch<React.SetStateAction<string[]>>;
}

const WordList: React.FC<WordListProps> = ({ words, setWords }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addWord = () => {
    if (inputValue.trim()) {
      if (editingIndex !== null) {
        const updatedWords = [...words];
        updatedWords[editingIndex] = inputValue.trim();
        setWords(updatedWords);
        setEditingIndex(null);
      } else {
        setWords([...words, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const editWord = (index: number) => {
    setInputValue(words[index]);
    setEditingIndex(index);
  };

  const deleteWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  return (
    <div className="word-list-container">
      <h2>Add or Edit Words or Phrases</h2>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a word or phrase"
        />
        <button type="button" onClick={addWord}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <ul>
        {words.map((word, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <li key={index}>
            <div className="word-text">{word}</div>
            <div>
              <button type="button" onClick={() => editWord(index)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteWord(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
