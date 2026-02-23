/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("pbc_4092854851");

    collection.fields.addAt(12, new Field({
        "hidden": false,
        "id": "file_image",
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
        "name": "image_file",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": ["500x500"],
        "type": "file"
    }));

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_4092854851");
    collection.fields.removeById("file_image");
    return app.save(collection);
})
