module.exports = {
  "activity_log": {
    "schema": [],
    "migration": [],
    "crud": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },
  "permission": {
    "schema": [],
    "migration": [],
    "crud": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },
  "role_permission": {
    "schema": [
      "role",
      "permission"
    ],
    "migration": [
      {
        "belongsTo": [
          "role",
          {
            "as": "roled",
            "foreignKey": "role_id"
          }
        ]
      },
      {
        "belongsTo": [
          "permission",
          {
            "as": "permission",
            "foreignKey": "permission_id"
          }
        ]
      }
    ],
    "crud": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },
  "role": {
    "schema": [
      "role_permission"
    ],
    "migration": [
      {
        "hasMany": [
          "role_permission",
          {
            "as": "permissions",
            "foreignKey": "role_id"
          }
        ]
      }
    ],
    "crud": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },
  "session": {
    "schema": [
      "user"
    ],
    "migration": [
      {
        "belongsTo": [
          "user",
          {
            "as": "user",
            "foreignKey": "user_id"
          }
        ]
      }
    ],
    "crud": {
      "create": true,
      "read": {
        "include": [
          {
            "association": "user",
            "include": {
              "association": "role",
              "include": {
                "association": "permissions",
                "include": {
                  "association": "permission"
                }
              }
            }
          }
        ]
      },
      "update": true,
      "delete": true
    }
  },
  "user": {
    "schema": [
      "role"
    ],
    "migration": [
      {
        "belongsTo": [
          "role",
          {
            "as": "role",
            "foreignKey": "role_id"
          }
        ]
      }
    ],
    "crud": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  }
};
