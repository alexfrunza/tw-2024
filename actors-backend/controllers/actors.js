import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";
import {validateActorName, validateInteger} from "../utils/validations.js";

import fetch from 'node-fetch';

async function getActorImage(actorName) {
    const formattedName = actorName.replace(/ /g, '_');
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${formattedName}&origin=*`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const imageUrl = pages[pageId].thumbnail?.source || pages[pageId].original?.source;

        if (imageUrl) {
            return imageUrl;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Eroare la preluarea imaginii:', error);
        return null;
    }
}

export const getActors = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultActor = null;
    let resultActorShows = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');

    const data = {};
    const actors = {};

    if (limit && offset) {
        limit = parseInt(limit, 10);
        validateInteger(limit, "limit");

        offset = parseInt(offset, 10);
        validateInteger(offset, "offset");

        queryStr = 'SELECT DISTINCT actor.name "name", actor.id "id" FROM actor ORDER BY actor.id ASC LIMIT $1 OFFSET $2';
        resultActor = await pool.query(queryStr, [limit, offset]);

        const queryStrCount = 'SELECT COUNT(*) FROM actor';
        const resultCount = await pool.query(queryStrCount);

        data.count = resultCount.rows[0].count;
        data.pages = Math.ceil(data.count / limit);
        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT actor.name "name", actor.id "id" FROM actor ORDER BY actor.id ASC';
        resultActor = await pool.query(queryStr);
    }

    resultActor.rows.forEach(row => {
        if (actors[row.id] === undefined) {
            actors[row.id] = {id: row.id, name: toTitleCase(row.name), shows: [], imageUrl: ''};
        }
    });

    for await (const actor of Object.values(actors)) {
        queryStr = 'SELECT DISTINCT show.name "showName", show.id "showId", actor.id "id" FROM actor JOIN award_actor ON actor.id = $1 AND actor.id = award_actor.actor_id JOIN show ON show.id = award_actor.show_id ORDER BY actor.id ASC';
        resultActorShows = await pool.query(queryStr, [actor.id]);

        resultActorShows.rows.forEach(row => {
            actor.shows.push({name: toTitleCase(row.showName), id: row.showId});
        });

        // Obține URL-ul imaginii pentru actor
        const imageUrl = await getActorImage(actor.name);
        actor.imageUrl = imageUrl || '';
    }

    res.jsonBody = {
        message: "Success",
        data: {
            ...data,
            actors: [...Object.values(actors)]
        }
    };
    res.statusCode = 200;
};


export const getActor = async (req, res) => {
    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [req.params.id]);

    if (resultActor.rows.length === 0) {
        throw new NotFoundError("Actor not found");
    }

    resultActor.rows[0].name = toTitleCase(resultActor.rows[0].name);
    const imageUrl = await getActorImage(resultActor.rows[0].name);
    resultActor.rows[0].imageUrl = imageUrl || '';


    res.jsonBody = {
        message: "Success",
        data: resultActor.rows[0]
    };
    res.statusCode = 200;
}

export const deleteActor = async (req, res) => {
    const resultActor = await pool.query('DELETE FROM actor WHERE id = $1', [req.params.id]);

    if (resultActor.rowCount === 0) {
        throw new NotFoundError("Actor not found");
    }

    res.jsonBody = {
        message: "Success"
    };
    res.statusCode = 200;

}

export const createActor = async (req, res) => {
    let {name} = req.body;

    validateActorName(name);
    name = name.trim();

    const resultActor = await pool.query('INSERT INTO actor (name) VALUES ($1) RETURNING id', [name]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultActor.rows[0].id,
            name
        }
    };
    res.statusCode = 201;
}

export const modifyActor = async (req, res) => {
    let {name} = req.body;

    validateActorName(name);
    name = name.trim();

    const resultActor = await pool.query('UPDATE actor SET name = $1 WHERE id = $2 RETURNING id', [name, req.params.id]);

    if (resultActor.rows.length === 0) {
        throw new NotFoundError("Actor not found");
    }

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultActor.rows[0].id,
            name
        }
    };
    res.statusCode = 200;
}