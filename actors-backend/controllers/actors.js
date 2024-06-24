import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";
import {validateActorName, validateInteger} from "../utils/validations.js";
import {API_KEY} from '../config.js';

import fetch from 'node-fetch';

export const getActors = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultActor = null;
    let resultActorShows = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');
    let imageActor = queryParams.get('imageActor');
    let showsActor = queryParams.get('showsActor');

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
            actors[row.id] = {id: row.id, name: toTitleCase(row.name), shows: []};
        }
    });

    for await (const actor of Object.values(actors)) {
        if (showsActor !== 'false') {
            queryStr = 'SELECT DISTINCT show.name "showName", show.id "showId", actor.id "id" FROM actor JOIN award_actor ON actor.id = $1 AND actor.id = award_actor.actor_id JOIN show ON show.id = award_actor.show_id ORDER BY actor.id ASC';
            resultActorShows = await pool.query(queryStr, [actor.id]);

            resultActorShows.rows.forEach(row => {
                actor.shows.push({name: toTitleCase(row.showName), id: row.showId});
            });
        }

        if (imageActor !== 'false') {
            const tmdbActor = await getActorDetails(actor.name);
            if (tmdbActor) {
                actor.profile_path = tmdbActor.profile_path;
            } else {
                actor.profile_path = '';
            }
        }
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

const getActorDetails = async (name) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${name}&include_adult=false&language=en-US&page=1`, {
            headers: {
                'Authorization': API_KEY,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tmdbData = await response.json();
        return tmdbData.results[0];
    } catch (error) {
        console.error('Error fetching actor details:', error);
        return null;
    }
};

export const getActor = async (req, res) => {
    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [req.params.id]);

    if (resultActor.rows.length === 0) {
        throw new NotFoundError("Actor not found");
    }

    const actor = resultActor.rows[0];
    actor.name = toTitleCase(actor.name);


    const tmdbActor = await getActorDetails(actor.name);


    if (tmdbActor) {
        actor.profile_path = tmdbActor.profile_path;
        actor.known_for = tmdbActor.known_for.map(movie => ({
            title: movie.title || movie.name,
            release_date: movie.release_date || movie.first_air_date,
            overview: movie.overview
        }));
    } else {
        actor.known_for = [];
        actor.profile_path = '';
    }


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