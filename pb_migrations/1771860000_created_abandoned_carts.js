/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        "createRule": "",
        "deleteRule": "",
        "fields": [
            {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text3208210256",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_user_email",
                "max": 255,
                "min": 0,
                "name": "user_email",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_guest_id",
                "max": 100,
                "min": 0,
                "name": "guest_id",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "hidden": false,
                "id": "json_cart_data",
                "maxSize": 2000000,
                "name": "cart_data",
                "presentable": false,
                "required": true,
                "system": false,
                "type": "json"
            }
        ],
        "id": "pbc_abandoned_carts",
        "indexes": [],
        "listRule": "",
        "name": "abandoned_carts",
        "system": false,
        "type": "base",
        "updateRule": "",
        "viewRule": ""
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_abandoned_carts");
    return app.delete(collection);
})
