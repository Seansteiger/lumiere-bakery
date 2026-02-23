/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("pbc_4092854851");

    // add field
    collection.fields.addAt(11, new Field({
        "hidden": false,
        "id": "json_variations",
        "maxSize": 2000000,
        "name": "variations",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
    }));

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_4092854851");

    // remove field
    collection.fields.removeById("json_variations");

    return app.save(collection);
})
