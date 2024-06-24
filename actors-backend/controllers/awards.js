import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {APIError, NotFoundError} from "../utils/errors.js";
import {
    validateAwardName,
    validateAwardType,
    validateAwardYear,
    validateInteger,
    validateShowName
} from "../utils/validations.js";

export const getAwards = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultAward = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');

    const data = {};
    const awards = [];

    if (limit && offset) {
        limit = parseInt(limit, 10);
        validateInteger(limit, "limit");

        offset = parseInt(offset, 10);
        validateInteger(offset, "offset");

        queryStr = 'SELECT DISTINCT award.name "name", award.id "id", award.year "year", award.type "type" FROM award ORDER BY award.id ASC LIMIT $1 OFFSET $2';
        resultAward = await pool.query(queryStr, [limit, offset]);

        const queryStrCount = 'SELECT COUNT(*) FROM award';
        const resultCount = await pool.query(queryStrCount);

        data.count = resultCount.rows[0].count;
        data.pages = Math.ceil(data.count / limit);
        data.limit = limit;
        data.offset = offset;
    } else {
        queryStr = 'SELECT DISTINCT award.name "name", award.id "id", award.year "year", award.type "type" FROM award ORDER BY award.id ASC';
        resultAward = await pool.query(queryStr);
    }

    resultAward.rows.forEach(row => {
        awards.push({id: row.id, name: toTitleCase(row.name), year: row.year, type: row.type});
    })

    res.jsonBody = {
        message: "Success",
        data: {
            ...data,
            awards
        }
    };
    res.statusCode = 200;
}

export const getAward = async (req, res) => {
    const resultAward = await pool.query('SELECT * FROM award WHERE id = $1', [req.params.id]);

    if (resultAward.rows.length === 0) {
        throw new NotFoundError("Award not found");
    }

    if (resultAward.rows[0].type === 'actor') {
        const resultActor = await pool.query('SELECT award_actor.won "won", award_actor.id "awardId", actor.id, actor.name FROM actor JOIN award_actor ON actor.id = award_actor.actor_id AND award_actor.award_id = $1 ORDER BY award_actor.id', [req.params.id]);
        res.jsonBody = {
            message: "Success",
            data: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type,
                actors: resultActor.rows
            }
        };
    } else {
        const resultShow = await pool.query('SELECT award_show.won "won", award_show.id "awardId", show.id, show.name FROM show JOIN award_show ON show.id = award_show.show_id AND award_show.award_id = $1 ORDER BY award_show.id', [req.params.id]);
        res.jsonBody = {
            message: "Success",
            data: {
                id: resultAward.rows[0].id,
                name: resultAward.rows[0].name,
                year: resultAward.rows[0].year,
                type: resultAward.rows[0].type,
                shows: resultShow.rows
            }
        };

    }

    res.statusCode = 200;
}

export const deleteAward = async (req, res) => {
    const resultAward = await pool.query('DELETE FROM award WHERE id = $1', [req.params.id]);

    if (resultAward.rowCount === 0) {
        throw new NotFoundError("Award not found");
    }

    res.jsonBody = {
        message: "Success"
    };
    res.statusCode = 200;

}

export const createAward = async (req, res) => {
    let {name, year, type} = req.body;

    validateAwardName(name);
    name = name.trim();
    validateAwardType(type);
    validateAwardYear(year);
    year = year.trim();

    const resultAward = await pool.query('INSERT INTO award (name, type, year) VALUES ($1, $2, $3) RETURNING id', [name, type, year]);

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAward.rows[0].id,
            name,
            type,
            year
        }
    };
    res.statusCode = 201;
}

export const modifyAward = async (req, res) => {
    let {name, type, year} = req.body;

    validateShowName(name);
    name = name.trim();

    validateAwardType(type, true);
    if (type) {
        throw new APIError("Type cannot be modified", 'APIError', 400);
    }

    validateAwardYear(year);
    year = year.trim();

    const resultAward = await pool.query('UPDATE award SET name = $1, year = $2 WHERE id = $3 RETURNING id, type', [name, year, req.params.id]);

    if (resultAward.rows.length === 0) {
        throw new NotFoundError("Award not found");
    }

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAward.rows[0].id,
            name,
            type: resultAward.rows[0].type,
            year
        }
    };
    res.statusCode = 200;
}
