import {pool} from "../db.js";
import {APIError, NotFoundError} from "../utils/errors.js";
import {
    validateBoolean,
    validateInteger,
} from "../utils/validations.js";

export const getAwardsShow = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultAward = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');

    const data = {};
    const awards_show = [];

    if (limit && offset) {
        limit = parseInt(limit, 10);
        validateInteger(limit, "limit");

        offset = parseInt(offset, 10);
        validateInteger(offset, "offset");

        queryStr = 'SELECT DISTINCT id, award_id, won, show_id FROM award_show ORDER BY id ASC LIMIT $1 OFFSET $2';
        resultAward = await pool.query(queryStr, [limit, offset]);

        const queryStrCount = 'SELECT COUNT(*) FROM award_show';
        const resultCount = await pool.query(queryStrCount);

        data.count = resultCount.rows[0].count;
        data.pages = Math.ceil(data.count / limit);
        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT id, award_id, won, show_id FROM award_show ORDER BY id ASC';
        resultAward = await pool.query(queryStr);
    }

    for await (const row of resultAward.rows) {
        const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [row.award_id]);
        const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [row.show_id]);

        awards_show.push({
            id: row.id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
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
            awards_show
        }
    };
    res.statusCode = 200;
}

export const getAwardShow = async (req, res) => {
    const resultAwardShow = await pool.query('SELECT id, award_id, won, show_id FROM award_show WHERE id = $1', [req.params.id]);

    if (resultAwardShow.rows.length === 0) {
        throw new NotFoundError("Award show not found");
    }

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [resultAwardShow.rows[0].award_id]);
    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [resultAwardShow.rows[0].show_id]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardShow.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
            },
            show: {
                id: resultShow.rows[0].id,
                name: resultShow.rows[0].name
            },
            won: resultAwardShow.rows[0].won
        }
    };
    res.statusCode = 200;
}

export const deleteAwardShow = async (req, res) => {
    const resultAward = await pool.query('DELETE FROM award_show WHERE id = $1', [req.params.id]);

    if (resultAward.rowCount === 0) {
        throw new NotFoundError("Award show not found");
    }

    res.jsonBody = {
        message: "Success"
    };
    res.statusCode = 200;
}

export const createAwardShow = async (req, res) => {
    let {won, award_id, show_id} = req.body;

    validateInteger(award_id, "award_id");
    validateInteger(show_id, "show_id");
    validateBoolean(won, "won");

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [award_id]);

    if (resultAward.rows.length === 0) {
        throw new NotFoundError("Award not found");
    }

    if (resultAward.rows[0].type === 'actor') {
        throw new APIError("Cannot create award show for actor award", 'APIError', 400);
    }

    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [show_id]);

    if (resultShow.rows.length === 0) {
        throw new NotFoundError("Show not found");
    }

    const resultAwardShowGet = await pool.query('SELECT COUNT(*) FROM award_show WHERE award_id = $1 AND show_id = $2', [award_id, show_id]);

    if (resultAwardShowGet.rows[0].count > 0) {
        throw new APIError("The show has already been nominated for this award", 'APIError', 400);
    }

    if (won === true) {
        const resultAwardWinnings = await pool.query('SELECT COUNT(*) FROM award_show WHERE award_id = $1 AND won = true', [award_id]);

        if (resultAwardWinnings.rows[0].count > 0) {
            throw new APIError("A show has already won this award", 'APIError', 400);
        }
    }

    const resultAwardShow = await pool.query('INSERT INTO award_show (won, award_id, show_id) VALUES ($1, $2, $3) RETURNING id', [won, award_id, show_id]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardShow.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
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

export const modifyAwardShow = async (req, res) => {
    let {won} = req.body;

    validateBoolean(won, "won");

    const resultAwardShow = await pool.query('SELECT id, award_id, won, show_id FROM award_show WHERE id = $1', [req.params.id]);

    if (resultAwardShow.rows.length === 0) {
        throw new NotFoundError("Award show not found");
    }

    if (won === true) {
        const resultAwardWinnings = await pool.query('SELECT COUNT(*) FROM award_show WHERE award_id = $1 AND won = true', [resultAwardShow.rows[0].award_id]);

        if (resultAwardWinnings.rows[0].count > 0) {
            throw new APIError("A show has already won this award", 'APIError', 400);
        }
    }

    const resultAwardShowUpdate = await pool.query('UPDATE award_show SET won = $1 WHERE id = $2 RETURNING id, award_id, won, show_id', [won, req.params.id]);

    if (resultAwardShowUpdate.rowCount === 0) {
        throw new NotFoundError("Award show not found");
    }

    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [resultAwardShowUpdate.rows[0].award_id]);
    const resultShow = await pool.query('SELECT * FROM show WHERE id = $1', [resultAwardShowUpdate.rows[0].show_id]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAwardShowUpdate.rows[0].id,
            award: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type
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