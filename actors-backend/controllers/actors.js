import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";

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