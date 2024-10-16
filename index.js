const express = require('express');
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

// Initialize the Express app
const app = express();

// Initialize Apollo Client to connect to SWAPI GraphQL endpoint
const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
        fetch,
    }),
    cache: new InMemoryCache(),
});

// GraphQL Query to fetch Star Wars data (e.g., get a specific film by its ID)
const GET_FILM_QUERY = gql`
  query GetFilm($id: ID!) {
    film(filmID: $id) {
      title
      releaseDate
      director
      producers
      openingCrawl
    }
  }
`;

// Define a route to fetch Star Wars film data
app.get('/film/:id', async (req, res) => {
    const filmID = req.params.id;

    try {
        // Send query to SWAPI GraphQL API
        const response = await client.query({
            query: GET_FILM_QUERY,
            variables: { id: filmID },
        });

        // Send the data back to the client
        res.json(response.data.film);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from SWAPI GraphQL' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
