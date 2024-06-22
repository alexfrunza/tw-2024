import {pool} from "../db.js";
import {toTitleCase} from "../utils/index.js";
import {NotFoundError} from "../utils/errors.js";
import {validateAwardName, validateAwardType, validateAwardYear, validateShowName} from "../utils/validations.js";

export const getAwards = async (req, res) => {
    const queryParams = new URLSearchParams(req.fullUrl.search);

    let queryStr = '';
    let resultAward = null;

    let limit = queryParams.get('limit');
    let offset = queryParams.get('offset');

    const data = {};
    const awards = [];

    if (limit && offset) {
        queryStr = 'SELECT DISTINCT award.name "name", award.id "id", award.year "year", award.type "type" FROM award ORDER BY award.id ASC LIMIT $1 OFFSET $2';
        resultAward = await pool.query(queryStr, [limit, offset]);

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

    res.jsonBody = {
        message: "Success",
        data: resultAward.rows[0]
    };
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

    validateAwardType(type);
    validateAwardYear(year);
    year = year.trim();

    const resultAward = await pool.query('UPDATE award SET name = $1, type = $2, year = $3 WHERE id = $4 RETURNING id', [name, type, year, req.params.id]);

    if (resultAward.rows.length === 0) {
        throw new NotFoundError("Award not found");
    }

    res.jsonBody = {
        message: "Success",
        data: {
            id: resultAward.rows[0].id,
            name,
            type,
            year
        }
    };
    res.statusCode = 200;
}
