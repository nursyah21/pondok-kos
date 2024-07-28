# list api

[back](/README.md)

## public

- register => `post` [/api/public/register]()
    - name
    - number_phone
    - password
- login => `post` [/api/public/login]()
    - number_phone
    - password
- logout => `post` [/api/public/logout]()
    - token
- verify => `post` [/api/public/verify]()
    - token
- all-kamar-kos => `get` [/api/public/all-kamar-kos]()
    - id_kos (optional)
    - skip (optional)
    - limit (optional)

## protect

- profile => `post` [/api/protect/profile]()
    - token