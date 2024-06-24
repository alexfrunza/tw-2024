import {pool} from "../db.js";
import {APIError, NotFoundError} from "../utils/errors.js";
import {
    validateBoolean,
    validateInteger,
} from "../utils/validations.js";

export const getAwardsActor = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultAward = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');

    const data = {};
    const awards_actor = [];

    if (limit && offset) {
        limit = parseInt(limit, 10);
        validateInteger(limit, "limit");

        offset = parseInt(offset, 10);
        validateInteger(offset, "offset");

        queryStr = 'SELECT DISTINCT id, award_id, actor_id, won, show_id FROM award_actor ORDER BY id ASC LIMIT $1 OFFSET $2';
        resultAward = await pool.query(queryStr, [limit, offset]);

        const queryStrCount = 'SELECT COUNT(*) FROM award_actor';
        const resultCount = await pool.query(queryStrCount);

        data.count = resultCount.rows[0].count;
        data.pages = Math.ceil(data.count / limit);
        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT id, award_id, actor_id, won, show_id FROM award_actor ORDER BY id ASC';
        resultAward = await pool.query(queryStr);
    }

    for await (const row of resultAward.rows) {
        const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [row.award_id]);
        const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [row.actor_id]);
        const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [row.show_id]);

        awards_actor.push({
            id: row.id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
            },
            actor: {
                id: resultActor.rows[0].id,
                name: resultActor.rows[0].name
            },
            show: {
                id: resultShow.rows[0].id,
                name: resultShow.rows[0].name
            },
            won: row.won
        })
    }

    res.jsonBody = {
        message: "Success",
        data: {
            ...data,
            awards_actor
        }
    };
    res.statusCode = 200;
}

export const getAwardActor = async (req, res) => {
    const resultAwardActor = await pool.query('SELECT id, award_id, actor_id, won, show_id FROM award_actor WHERE id = $1', [req.params.id]);

    if (resultAwardActor.rows.length === 0) {
        throw new NotFoundError("Award actor not found");
    }

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [resultAwardActor.rows[0].award_id]);
    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [resultAwardActor.rows[0].actor_id]);
    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [resultAwardActor.rows[0].show_id]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardActor.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
            },
            actor: {
                id: resultActor.rows[0].id,
                name: resultActor.rows[0].name
            },
            show: {
                id: resultShow.rows[0].id,
                name: resultShow.rows[0].name
            },
            won: resultAwardActor.rows[0].won
        }
    };
    res.statusCode = 200;
}

export const deleteAwardActor = async (req, res) => {
    const resultAward = await pool.query('DELETE FROM award_actor WHERE id = $1', [req.params.id]);

    if (resultAward.rowCount === 0) {
        throw new NotFoundError("Award actor not found");
    }

    res.jsonBody = {
        message: "Success"
    };
    res.statusCode = 200;

}

export const createAwardActor = async (req, res) => {
    let {won, award_id, actor_id, show_id} = req.body;

    validateInteger(award_id, "award_id");
    validateInteger(actor_id, "actor_id");
    validateInteger(show_id, "show_id");
    validateBoolean(won, "won");

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [award_id]);

    if (resultAward.rows.length === 0) {
        throw new NotFoundError("Award not found");
    }

    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [actor_id]);

    if (resultActor.rows.length === 0) {
        throw new NotFoundError("Actor not found");
    }

    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [show_id]);

    if (resultShow.rows.length === 0) {
        throw new NotFoundError("Show not found");
    }

    const resultAwardActorGet = await pool.query('SELECT COUNT(*) FROM award_actor WHERE award_id = $1 AND actor_id = $2 AND show_id = $3', [award_id, actor_id, show_id]);

    if (resultAwardActorGet.rows[0].count > 0) {
        throw new APIError("The actor has already been nominated for this award for this show", 'APIError', 400);
    }

    if (won === true) {
        const resultAwardWinnings = await pool.query('SELECT COUNT(*) FROM award_actor WHERE award_id = $1 AND won = true', [award_id]);

        if (resultAwardWinnings.rows[0].count > 0) {
            throw new APIError("An actor has already won this award for this show", 'APIError', 400);
        }
    }

    const resultAwardActor = await pool.query('INSERT INTO award_actor (won, award_id, actor_id, show_id) VALUES ($1, $2, $3, $4) RETURNING id', [won, award_id, actor_id, show_id]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardActor.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
            },
            actor: {
                id: resultActor.rows[0].id,
                name: resultActor.rows[0].name
            },
            show: {
                id: resultShow.rows[0].id,
                name: resultShow.rows[0].name
            },
            won
        }
    };
    res.statusCode = 201;
}

export const modifyAwardActor = async (req, res) => {
    let {won} = req.body;

    validateBoolean(won, "won");

    const resultAwardActor = await pool.query('SELECT id, award_id, actor_id, won, show_id FROM award_actor WHERE id = $1', [req.params.id]);

    if (resultAwardActor.rows.length === 0) {
        throw new NotFoundError("Award actor not found");
    }

    if (won === true) {
        const resultAwardWinnings = await pool.query('SELECT COUNT(*) FROM award_actor WHERE award_id = $1 AND won = true', [resultAwardActor.rows[0].award_id]);

        if (resultAwardWinnings.rows[0].count > 0) {
            throw new APIError("An actor has already won this award for this show", 'APIError', 400);
        }
    }

    const resultAwardActorUpdate = await pool.query('UPDATE award_actor SET won = $1 WHERE id = $2 RETURNING id, award_id, actor_id, won, show_id', [won, req.params.id]);

    if (resultAwardActorUpdate.rowCount === 0) {
        throw new NotFoundError("Award actor not found");
    }

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [resultAwardActorUpdate.rows[0].award_id]);
    const resultActor = await pool.query('SELECT * FROM actor WHERE id = $1', [resultAwardActorUpdate.rows[0].actor_id]);
    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [resultAwardActorUpdate.rows[0].show_id]);


    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardActorUpdate.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
            },
            actor: {
                id: resultActor.rows[0].id,
                name: resultActor.rows[0].name
            },
            show: {
                id: resultShow.rows[0].id,
                name: resultShow.rows[0].name
            },
            won
        }
    };
    res.statusCode = 200;
}