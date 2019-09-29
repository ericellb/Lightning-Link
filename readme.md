# Simple URL

> Scalable URL Shortener written in TypeScript / Express with React frontend.

Goal of the project is to design a highly scalable URL shortener that does not have collisions when generating a new url. The API servers sit behind a Load Balancer, as many API Servers can be booted as needed. Load balancing occurs in a round robin format. There are plans to provide analytics on each of the links

![layout image](layout.png)

Implemented Features

- [x] Basic Scalable URL Shortener Backend
- [x] Backend Analytics (See visits, geographic data etc..)

Planned Features

- [ ] Frontend for URL Shortener (Only url shortening)
- [ ] Frontend implement analytics viewing

---

# API Documentation

## Shorten URL

Returns an Short URL for Given Destination URL.

If userId given allows you to pull analytic data and links shortened route to your userId

- **URL**

  /shorten

- **Method:**

  `POST`

- **URL Params**

  **Required:**

  `destination=[string]`

  **Optional:**

  `forceNewUrl=[boolean]`

  `userId=[string]`

* **Success Response:**

  - **Code:** 200 <br />
    **Content:** `slug : 0daajd`

* **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `Must provide a long url`

- **Sample Call:**

  ```javascript
    axios.post('/shorten?destination=www.google.com')
    .then((res) => {
    	console.log(res) -> "0004c92"
    }
  ```

## Get Redicretion URL

Returns the original URL for you to redirect the user to

- **URL**

  /:slug

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `slug=[string]`

* **Success Response:**

  - **Code:** 200 <br />
    **Content:** `destination : www.google.com`

* **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `Must provide a long url`

- **Sample Call:**

  ```javascript
    axios.get('/0004c92')
    .then((res) => {
    	console.log(res) -> "http://www.google.com"
    }
  ```

## Get Analytic Data

Returns the Analytic Data of a Short URL given your UserID is the creator

- **URL**

  /analytic/:slug

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `slug=[string]`

  `userId=[string]`

* **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ "urls_slug": "000BLjl", "creator_user_id": "some_user_id", "visits": 3, "worlds": "[{\"city\": \"Montreal\", \"visits\": \"2\", \"country\": \"Canada\", \"continent\": \"NA\"}]" }`

* **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized Route`

- **Sample Call:**

  ```javascript
    axios.get('/analytics/0004c92')
    .then((res) => {
    	console.log(res)
    }
  ```

## License

Copyright Eric Ellbogen 2019

- This project is under the **GNU V3** license. [Find it here](https://github.com/ericellb/Simple-URL/blob/master/LICENSE).
