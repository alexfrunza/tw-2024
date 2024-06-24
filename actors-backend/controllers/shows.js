import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";
import {validateInteger, validateShowName} from "../utils/validations.js";
import fetch from "node-fetch";
import {API_KEY} from "../config.js";

export const getShows = async (req, res) => {

    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultShow = null;
    let resultShowActors = null;


    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');
    let actorsShow = queryParams.get('actorsShow');

    const data = {};
    const shows = {};

    if (limit && offset) {
        limit = parseInt(limit, 10);
        validateInteger(limit, "limit");

        offset = parseInt(offset, 10);
        validateInteger(offset, "offset");

        queryStr = 'SELECT DISTINCT show.name "name", show.id "id" FROM show ORDER BY show.id ASC LIMIT $1 OFFSET $2';
        resultShow = await pool.query(queryStr, [limit, offset]);

        const queryStrCount = 'SELECT COUNT(*) FROM show';
        const resultCount = await pool.query(queryStrCount);

        data.count = resultCount.rows[0].count;
        data.pages = Math.ceil(data.count / limit);
        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT show.name "name", show.id "id" FROM show ORDER BY show.id ASC';
        resultShow = await pool.query(queryStr);
    }

    resultShow.rows.forEach(row => {
        if (shows[row.id] === undefined) {
            shows[row.id] = {id: row.id, name: toTitleCase(row.name), actors: []};
        }
    })

    for await (const show of Object.values(shows)) {
        if (actorsShow === 'false') continue;

        queryStr = 'SELECT DISTINCT actor.name "actorName", actor.id "actorId", show.id "id" FROM show JOIN award_actor ON show.id = $1 AND show.id = award_actor.show_id JOIN actor ON actor.id = award_actor.actor_id ORDER BY show.id ASC';
        resultShowActors = await pool.query(queryStr, [show.id]);

        resultShowActors.rows.forEach(row => {
            show.actors.push({name: toTitleCase(row.actorName), id: row.actorId});
        });
    }

    res.jsonBody = {
        message: "Success",
        data: {
            ...data,
            shows: [...Object.values(shows)]
        }
    };
    res.statusCode = 200;
}

const getShowDetails = async (name) => {
    try {
        let responseMovie;
        let responseTv = await fetch(`https://api.themoviedb.org/3/search/tv?query=${name}&include_adult=false&language=en-US&page=1`, {
            headers: {
                'Authorization': API_KEY,
                'accept': 'application/json'
            }
        });

        let tmdbDataTv;
        let tmdbDataMovie;

        responseMovie = await fetch(`https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`, {
            headers: {
                'Authorization': API_KEY,
                'accept': 'application/json'
            }
        });


        if (!responseMovie.ok && !responseTv.ok) {
            throw new Error('Network response was not ok');
        } else if (!responseMovie.ok) {
            tmdbDataTv = await responseTv.json();
            return tmdbDataTv.results[0];
        } else if (!responseTv.ok) {
            tmdbDataMovie = await responseMovie.json();
            return tmdbDataMovie.results[0];
        } else {
            tmdbDataMovie = await responseMovie.json();
            tmdbDataTv = await responseTv.json();

            if (tmdbDataTv.results[0].popularity > tmdbDataMovie.results[0].popularity) {
                return tmdbDataTv.results[0];
            } else {
                return tmdbDataMovie.results[0];
            }
        }
    } catch (error) {
        console.error('Error fetching actor details:', error);
        return null;
    }
};

export const getShow = async (req, res) => {
    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [req.params.id]);

    const queryStr = 'SELECT DISTINCT actor.name "actorName", actor.id "actorId" FROM show JOIN award_actor ON show.id = $1 AND show.id = award_actor.show_id JOIN actor ON actor.id = award_actor.actor_id';
    const resultShowActors = await pool.query(queryStr, [req.params.id]);
    const actors = [];

    resultShowActors.rows.forEach(row => {
        actors.push({name: toTitleCase(row.actorName), id: row.actorId});
    })

    if (resultShow.rows.length === 0) {
        throw new NotFoundError("Show not found");
    }

    res.jsonBody = {
        message: "Success",
        data: {db: {...resultShow.rows[0], actors}, tmdb: await getShowDetails(resultShow.rows[0].name)}
    };
    res.statusCode = 200;
}

export const deleteShow = async (req, res) => {
    const resultShow = await pool.query('DELETE FROM show WHERE id = $1', [req.params.id]);

    if (resultShow.rowCount === 0) {
        throw new NotFoundError("Show not found");
    }

    res.jsonBody = {
        message: "Success"
    };
    res.statusCode = 200;

}

export const createShow = async (req, res) => {
    let {name} = req.body;

    validateShowName(name);
    name = name.trim();

    const resultShow = await pool.query('INSERT INTO show (name) VALUES ($1) RETURNING id', [name]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultShow.rows[0].id,
            name
        }
    };
    res.statusCode = 201;
}

export const modifyShow = async (req, res) => {
    let {name} = req.body;

    validateShowName(name);
    name = name.trim();

    const resultShow = await pool.query('UPDATE show SET name = $1 WHERE id = $2 RETURNING id', [name, req.params.id]);

    if (resultShow.rows.length === 0) {
        throw new NotFoundError("Show not found");
    }

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultShow.rows[0].id,
            name
        }
    };
    res.statusCode = 200;
}