import React, { useState, useEffect, useContext } from 'react';
import './App.css';

/**
 * Custom use hook
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function
        ? value(storedValue)
        : value

      setStoredValue(valueToStore)

      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Use context
 */
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  }
}

const ThemeContext = React.createContext(themes.light)
 
const AppItem = (props) => {
  const { id, category, comment, amount, date } = props.item
  const theme = useContext(ThemeContext)

  return (
    <div className="App-item" style={{ background: theme.background, color: theme.foreground }}>
      <div className="App-item__title">{category}</div>
      <div className="App-item__comment">{comment}</div>
      <div className="App-item__amount">-{amount}</div>
      <div className="App-item__date-time">{date}</div>
      |
      <button onClick={props.remove.bind(null, id)}>Remove</button>
    </div>
  )
}

const AppEditor = (props) => {
  let [amount, setAmount] = useState('')
  let [date, setDate] = useState('')
  let [comment, setComment] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    props.addItem({
      amount,
      date,
      comment
    })

    clearValues()
  }

  const handleChange = ({ target }) => {
    switch (target.name) {
      case 'amount':
        setAmount(target.value)
        break
      case 'date':
        setDate(target.value)
        break
      case 'comment':
        setComment(target.value)
        break
      default:
    } 
  }

  const clearValues = () => {
    setAmount('')
    setDate('')
    setComment('')
  }

  const submitIsDisabled = !amount || !date

  useEffect(() => {
    if (!date) {
      const currentDate = (new Date()).toISOString().slice(0,10)
  
      setDate(currentDate) 
    }
  }, [date])

  return (
    <form onSubmit={handleSubmit} className="App-editor">
      <label className="Editor-item">
        Amount:
        <input name="amount" type="number" placeholder="0" value={amount} onChange={handleChange} />
      </label>
      <label className="Editor-item">
        Date:
        <input name="date" type="date" value={date} onChange={handleChange} />
      </label>
      <label className="Editor-item">
        Comment:
        <input name="comment" type="text" value={comment} onChange={handleChange} />
      </label>

      <button disabled={submitIsDisabled} type="submit">Add item</button>
    </form>
  )
}

function App() {
  const [items, setItems] = useLocalStorage('items', [])
  const [theme, setTheme] = useLocalStorage('theme', themes.dark)

  const addItem = (item) => {
    const id = items.length + 1

    setItems(items => [...items, { ...item, id }])
  }

  const removeItem = (searchId) => {
    setItems(items.filter(({ id }) => id !== searchId))
  }

  const toggleTheme = () => {
    const newTheme = theme === themes.dark
      ? themes.light
      : themes.dark

    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className="App">
        <div className="App-toggler">
          <button onClick={toggleTheme}>Toggle theme</button>
        </div>
        <div className="App-content">
        <AppEditor addItem={addItem} />
          <div className="App-items">
            {items.length
              ? items.map((item) => <AppItem key={item.id} item={item} remove={removeItem} />)
              : <span>No items</span>
            }
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default App;
