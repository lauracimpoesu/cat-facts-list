import React, { useState, useContext, useEffect } from "react"
import { MBSHeader } from "./components/MBSHeader"
import { useCatFacts } from "./lib/useCatFacts"
import { Container, Grid, Icon, List, Button, Header, Checkbox } from "semantic-ui-react"
import { ThemeContext } from "./ThemeContext"
import "./index.css"

export default function App() {
  // initialising state for bookmarked facts and set function to update state
  const [bookmarkedFacts, setBookmarkedFacts] = useState([])
  // initialising state for the current page and set function
  const [currentPage, setCurrentPage] = useState(1)
  // calling the custom hook useCatFacts to fetch the cat facts for the current page and number of facts per page
  // destructuring the returned values, list is the array of cat facts and hasNextPage is a boolean that indicates whether there are more pages to fetch
  const { list, hasNextPage } = useCatFacts(currentPage, 15)
  // getting the theme state and dispatch function from the ThemeContext using useContext hook 
  const { state, dispatch } = useContext(ThemeContext)

  const handleBookmark = (fact) => {
      // check if the current fact is already bookmarked 
    const isBookmarked = bookmarkedFacts.some((item) => item.id === fact.id)

    // if the fact is already bookmarked, REMOVE it from the bookmarked list
    if (isBookmarked) {
      setBookmarkedFacts(bookmarkedFacts.filter((item) => item.id !== fact.id))
    // if the fact is not bookmarked, ADD it to the bookmarked list
    } else {
      setBookmarkedFacts([...bookmarkedFacts, fact])
    }
  };

  const isBookmarked = (fact) => {
    // checking if the current fact exists in the bookmarkedFacts array
    return bookmarkedFacts.some((item) => item.id === fact.id)
  };

  // function to handle "load more" button click by updating the current page number
  const loadMore = () => {
    setCurrentPage(currentPage + 1)
  };

  // function to toggle the dark mode theme by dispatching an action
  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" })
  };

  // fffect hook to update the body class based on the current theme state
  useEffect(() => {
      // checking if the current theme is dark mode, then add "dark-mode" class to body element
    if (state.darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      // if the current theme is not dark mode, remove "dark-mode" class from body element
      document.body.classList.remove("dark-mode")
    }
  }, [state.darkMode])

  return (
// color based on whether the darkMode flag in the ThemeContext is enabled or not
    <Container inverted={state.darkMode}>
      <MBSHeader />
      {/* grid layout with 2 columns */}
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            {/* creating a list of cat facts */}
            <List divided inverted={state.darkMode} verticalAlign='middle'>
              {/* creating a list of List.Item components based on the cat facts obtained from the useCatFacts hook */}
              {list.map((fact) => (
                <List.Item key={fact.id} onClick={() => handleBookmark(fact)}>
                  <List.Content>
                    {/* displaying the bookmark icon and its color based on whether the book-marked or not. */}
                    <Icon
                      name={isBookmarked(fact) ? 'bookmark' : 'bookmark outline'}
                      color={isBookmarked(fact) ? 'pink' : null}
                    />
                    {/* displaying the cat fact text */}
                    <List.Header>{fact.fact}</List.Header>
                  </List.Content>
                </List.Item>
              ))}
            </List>
            {/* button loading more cat facts when clicked */}
            {hasNextPage && (
              <Button color='green' style={{ color: "white", marginTop: "20px" }} onClick={loadMore}>
                Load More
              </Button>
            )}
          </Grid.Column>
          <Grid.Column width={6}>
          {/* bookmarked facts list on the right side */}
            <Header as='h3' color='purple'>Bookmarked Facts</Header>
            {/* create the list with the book-marked cat facts */}
            <List divided verticalAlign='middle'>
              {/* creating a list of List.Item components based on the bookmarked cat facts obtained from the bookmarkedFacts state. */}
              {bookmarkedFacts.map((fact) => (
                <List.Item key={fact.id}>
                  <List.Content>
                    {/* displaying the bookmark icon */}
                    <Icon
                      name='bookmark'
                      color='pink'
                      onClick={() => handleBookmark(fact)}
                    />
                    {/* displaying the bookmarked cat fact text */}
                    <List.Header>{fact.fact}</List.Header>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* dark mode toggle */}
      <Checkbox
        toggle
        label='DARK MODE'
        checked={state.darkMode}
        onChange={toggleTheme}
        style={{ marginBottom: "8rem", marginTop: "3rem" }}
        labelStyle={{ color: state.darkMode ? "white" : "inherit" }}
      />
    </Container>
  )
}