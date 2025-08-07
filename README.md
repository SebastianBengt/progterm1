

# Rock Catalog API Documentation

Base URL: `http://127.0.0.1:8090`

---

## Authentication

*None required.*

---

## Endpoints

### GET `/api/rocks`

Retrieve a list of rocks. Supports optional search query.

**Query Parameters**

| Name          | Type   | Description                                                                |
| ------------- | ------ | -------------------------------------------------------------------------- |
| `search_term` | string | Optional. Filter rocks by name or type (case-insensitive substring match). |

**Response**

* Status: `200 OK`
* Content-Type: `application/json`
* Body: Array of rock objects.

**Example Request**

```http
GET /api/rocks?search_term=igneous HTTP/1.1
Host: 127.0.0.1:8090
```

**Example Response**

```json
[
  {
    "id": "uuid-1234",
    "name": "Granite",
    "type": "Igneous",
    "color": "Gray",
    "grain_size": "Coarse",
    "minerals": ["Quartz", "Feldspar", "Mica"],
    "image": "/images/1691700000000-granite.jpg"
  },
  ...
]
```

---

### GET `/api/rocks/list`

Get a lightweight list of rocks (only `id` and `name`). Supports optional search.

**Query Parameters**

| Name          | Type   | Description                                         |
| ------------- | ------ | --------------------------------------------------- |
| `search_term` | string | Optional filter by name or type (case-insensitive). |

**Response**

* Status: `200 OK`
* Content-Type: `application/json`
* Body: Array of objects with `id` and `name` fields.

---

### GET `/rock/search`

Search rocks by term.

**Query Parameters**

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| `search_term` | string | Required search term. |

**Response**

* Status: `200 OK` or `400 Bad Request` if missing `search_term`
* Content-Type: `application/json`
* Body: Array of rock objects matching the search term.

**Example Request**

```http
GET /rock/search?search_term=sedimentary HTTP/1.1
Host: 127.0.0.1:8090
```

**Example Response**

```json
[
  {
    "id": "uuid-5678",
    "name": "Sandstone",
    "type": "Sedimentary",
    "color": "Tan",
    "grain_size": "Medium",
    "minerals": ["Quartz", "Feldspar"],
    "image": "/images/1691700100000-sandstone.jpg"
  }
]
```

---

### GET `/api/rocks/:id`

Retrieve detailed info about a single rock by its `id`.

**Path Parameters**

| Name | Type   | Description    |
| ---- | ------ | -------------- |
| `id` | string | Unique rock ID |

**Response**

* Status: `200 OK` or `404 Not Found` if no rock matches
* Content-Type: `application/json`
* Body: Rock object.

---

### POST `/api/rocks`

Add a new rock. Supports multipart/form-data with optional image upload.

**Request**

* Content-Type: `multipart/form-data`
* Fields:

  * `name` (string, required)
  * `type` (string, required; one of "Igneous", "Sedimentary", "Metamorphic")
  * `color` (string)
  * `grain_size` (string)
  * `minerals` (string; comma-separated list)
  * `image` (file; optional)

**Response**

* Status: `201 Created` or `400 Bad Request` if missing required fields
* Content-Type: `application/json`
* Body:

```json
{
  "msg": "Rock added!",
  "rock": {
    "id": "uuid-new",
    "name": "Basalt",
    "type": "Igneous",
    "color": "Black",
    "grain_size": "Fine",
    "minerals": ["Pyroxene", "Plagioclase"],
    "image": "/images/1691700200000-basalt.jpg"
  }
}
```

---

## Error Responses

| Status Code | Description                                     | Body Example                              |
| ----------- | ----------------------------------------------- | ----------------------------------------- |
| 400         | Bad Request (e.g., missing required parameters) | `{ "msg": "Name and type are required" }` |
| 404         | Not Found (rock ID not found)                   | `{ "msg": "Rock not found" }`             |
| 500         | Internal Server Error (unexpected errors)       | `{ "msg": "Internal server error" }`      |

---
Test Results:

 PASS  tests/rockRoutes.test.js
  Rock API
    ✓ GET /api/rocks - should return array of rocks (9 ms)
    ✓ GET /api/rocks/list - should return list of rock summaries (1 ms)
    ✓ GET /api/rocks/:id - valid id (2 ms)
    ✓ GET /api/rocks/:id - invalid id (2 ms)
    ✓ POST /api/rocks - should add a rock without image (3 ms)
    ✓ POST /api/rocks - should add a rock with image (3 ms)
    ✓ GET /rock/search - should return filtered results (1 ms)
    ✓ GET /rock/search - should return 400 if search_term is missing (2 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   93.54 |     62.5 |   84.61 |   93.33 |
 app.js   |   93.54 |     62.5 |   84.61 |   93.33 | 16,45,58,104
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.181 s, estimated 1 s
Ran all test suites.

## Notes

* Uploaded images are stored in `/images/` and served statically.
* Mineral lists in requests can be passed as comma-separated strings.
* Search queries are case-insensitive substring matches on rock `name` and `type`.

---


