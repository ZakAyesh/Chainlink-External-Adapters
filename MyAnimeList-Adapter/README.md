# MyAnimeList NodeJS External Adapter

This is an external adapter for the Chainlink decentralized oracle network that allows Chainlink nodes to access anime data from MyAnimeList (MAL). MAL's API utilizes Authorization Code Grant with PKCE style OAuth2.0 for authorization.

Specifically this adapter was designed to allow the consumer to request a type of anime (movie, tv show, airing) and ranking (1 , 2 , 3....) to query the top 500 anime of that type and return the animeId of the anime at that rank.

## Input Params

- `type`, `ranking_type`, or `anime_type`: The type of anime you want to query i.e. tv, movie, airing, all
- `rank`, `ranking`, or `ranked`: The current rank of the anime you are searching

## Output

```json
Result:  {
  "jobRunID": 1,
  "data": {
    "data": [
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      ... 400 more items
    ],
    "paging": {
      "next": 'https://api.myanimelist.net/v2/anime/ranking?offset=500&ranking_type=all&limit=500'
    },
    "result": 5114
  },
  "result": 5114,
  "statusCode": 200
}

}
```

## MyAnimeList API Documentation

https://myanimelist.net/clubs.php?cid=13727

This adapter was created using the Chainlink NodeJS External Adapter Template found here:
https://github.com/thodges-gh/CL-EA-NodeJS-Template.git
