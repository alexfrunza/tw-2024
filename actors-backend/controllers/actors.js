import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";
import {validateActorName} from "../utils/validations.js";

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
        queryStr = 'SELECT DISTINCT actor.name "name", actor.id "id" FROM actor ORDER BY actor.id ASC LIMIT $1 OFFSET $2';
        resultActor = await pool.query(queryStr, [limit, offset]);

        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT actor.name "name", actor.id "id", show.name "showName" FROM actor JOIN award_actor ON actor.id = award_actor.actor_id JOIN show ON show.id = award_actor.show_id ORDER BY actor.id ASC';
        resultActor = await pool.query(queryStr);
    }

    resultActor.rows.forEach(row => {
        if (actors[row.id] === undefined) {
            actors[row.id] = {id: row.id, name: toTitleCase(row.name), shows: []};
        }
    })

    for await (const actor of Object.values(actors)) {
        queryStr = 'SELECT DISTINCT show.name "showName", actor.id "id" FROM actor JOIN award_actor ON actor.id = $1 AND actor.id = award_actor.actor_id JOIN show ON show.id = award_actor.show_id ORDER BY actor.id ASC';
        resultActorShows = await pool.query(queryStr, [actor.id]);

        resultActorShows.rows.forEach(row => {
            actor.shows.push(toTitleCase(row.showName));
        });
    }

    res.jsonBody = {
        message: "Success",
        data: {
            ...data,
            actors: [...Object.values(actors)]
        }
    };
    res.statusCode = 200;
}

export const getActor = async (req, res) => {
    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [req.params.id]);

    if (resultActor.rows.length === 0) {
        throw new NotFoundError("Actor not found");
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
    const {name} = req.body;

    validateActorName(name);

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
    const {name} = req.body;

    validateActorName(name);

    const resultActor = await pool.query('UPDATE actor SET name = $1 WHERE id = $2 RETURNING id', [name, req.params.id]);
    console.log(resultActor)

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultActor.rows[0].id,
            name
        }
    };
    res.statusCode = 200;
}
