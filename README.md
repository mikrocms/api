<h1  align="center">mikrocms api</h1>

API is default module supported common api to handle some mechanisme process: authentication, user management, user grouping and permission.

| Specification | version |
|:--|:--:|
| mikrocms/core | 1.1.1 |
| mikrocms/swagger | 1.0.1 |


### Environment

-  **mikrocms@api.cors** (*array*) : A list of origin allowed to access resources api.

```js
"cors": [
  "http://allowed.domain"
]
```

- **mikrocms@api.secret** (*string*) : Secret key to secure your data.

```js
"secret": "mikrocms" // default secret key
```

- **mikrocms@api.salt** (*number*) : Number of salt rounds (work factor).

```js
"salt": 10 // default salt number
```

## Schema

| Name | Connection | Description |
|:--|:--|:--|
| activity_log | default | Logs of user activities. |
| permission | default | Available actions a user can perform. |
| role_permission | default | Permissions associated with a role. |
| role | default | User roles within the system. |
| session | default | User login sessions. |
| user | default | All registered users. |

## Model
    
| Name | Method |
|:--|:--|
| activity_log | `add`, `select`, `list`, `update`, `remove` |
| permission | `add`, `select`, `list`, `update`, `remove` |
| role_permission | `add`, `select`, `list`, `update`, `remove` |
| role | `add`, `select`, `list`, `update`, `remove` |
| session | `add`, `select`, `list`, `update`, `remove` |
| user | `add`, `select`, `list`, `update`, `remove` |

<br/>

| Name | Relation |
|:--|:--|
| role_permission | *roled*(`belongsTo`:`Role`), *permission*(`belongsTo`:`Permission`) |
| role | *permissions*(`hasMany`:`RolePermissionSchema`) |
| session | *user*(`belongsTo`:`UserSchema`) |
| user | *role*(`belongsTo`:`RoleSchema`) |

## Locale

| Language Code | Resource |
|:--|:--|
| en-US | [en-US.js](./locales/en-US.js) |

## Middleware

| Name | Description |
|:--|:--|
| auth | Authenticates users using the access token provided in the header in Bearer format. |
| cors | Implements CORS security. |
| permission | Compares the required permissions (req.permission) with the authenticated user's permissions. |

## Router

| Name | Middleware | Description |
|:--|:--|:--|
| /api/v1 | `cors` | Handles all requests for API version 1. |
| /api/v1/u | `cors`, `auth` | Handles all requests for API version 1 that require authentication. |

## Services

You can find detailed documentation of the service in the API documentation.
