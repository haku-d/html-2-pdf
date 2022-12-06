# html-2-pdf

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Docker

```bash
docker build -t html-2-pdf .
```

## Endpoints

The service only exposes 2 endpoints.

| **Method** | **URL** | **Remark**                                                                                                  |
|------------|---------|-------------------------------------------------------------------------------------------------------------|
| GET        | /       | Default endpoint which might being used for health check purpose                                            |
| POST       | /       | Main endpoint to generate pdf file from html content. HTML content can be provided by request param or file |

```bash
curl --location --request POST 'http://localhost:5000?content=Hello world'
```

```bash
curl --location --request POST 'http://localhost:5000' \
--form 'file=@"index.html"
```
