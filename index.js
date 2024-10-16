const express = require('express');
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

// Initialize the Express app
const app = express();
const cors = require('cors');
app.use(cors());

// Apollo Client to connect to SWAPI GraphQL API
const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
        fetch,
    }),
    cache: new InMemoryCache(),
});

// GraphQL Query to fetch all Star Wars films
const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
      films {
        title
        releaseDate
        director
        openingCrawl
      }
    }
  }
`;

// Route to get all Star Wars films
app.get('/films', async (req, res) => {
    try {
        const response = await client.query({
            query: GET_ALL_FILMS,
        });
        res.json(response.data.allFilms.films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch films' });
    }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
