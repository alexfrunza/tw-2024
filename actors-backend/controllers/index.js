import {parse} from "csv";
import {pool} from "../db.js";
import {createStringStream} from "../utils/index.js";
import {InvalidCsvError} from "../utils/errors.js";
import {validateActorName, validateAwardName, validateAwardYear, validateShowName} from "../utils/validations.js";

export const loadDatasetActorsDb = async (req, res) => {
    let actors = {};
    let awards = {};
    let shows = {};

    let line = 2;

    const parser = createStringStream(req.body)
        .pipe(parse({delimiter: ',', from_line: 2}));

    for await (const record of parser) {
        // Fields are in this order: year, category, nominee name, show, won
        if (record.length !== 5) {
            throw new InvalidCsvError("Invalid number of fields in CSV. The csv must have on the first line year,category,nominee_name,show_name,won_status. After that the rows must respect that structure.");
        }

        let [year, award, nominee, show, won] = record;

        validateAwardName(award);
        award = award.trim();
        validateAwardYear(year, true);
        year = year.trim();
        if (year === '') {
            year = "Unknown";
        }

        validateActorName(nominee, true);
        nominee = nominee.trim();

        validateShowName(show, true);
        show = show.trim();

        if (show === '' && nominee === '') {
            throw new InvalidCsvError("Show name and nominee name can't be both empty.");
        }

        if (show === '') {
            show = 'N/A';
        }

        won = (won === 'True');

        const awardLabel = `${award} ${year}`;

        if (awards[awardLabel] === undefined) {
            const result = await pool.query('SELECT id FROM award WHERE name = $1 AND year = $2', [award, year]);

            if (awards[awardLabel] === undefined && result.rows.length === 0) {
                let queryStr;

                if (nominee === '') {
                    queryStr = 'INSERT INTO award (name, year, type) VALUES ($1, $2, \'show\') RETURNING id'
                } else {
                    queryStr = 'INSERT INTO award (name, year, type) VALUES ($1, $2, \'actor\') RETURNING id'
                }

                const insertQuery = await pool.query(queryStr, [award, year]);

                awards[awardLabel] = {id: insertQuery.rows[0].id};
            } else {
                awards[awardLabel] = {id: result.rows[0].id};
            }
        }

        const resultShow = await pool.query('SELECT id FROM show WHERE name = $1', [show]);

        if (shows[show] === undefined && resultShow.rows.length === 0) {
            const insertQuery = await pool.query('INSERT INTO show (name) VALUES ($1) RETURNING id', [show]);
            shows[show] = {id: insertQuery.rows[0].id};
        } else {
            shows[show] = {id: resultShow.rows[0].id};
        }

        if (nominee === '') {
            const resultAwardShow = await pool.query('SELECT COUNT(*) FROM award_show WHERE award_id = $1 AND show_id = $2', [awards[awardLabel].id, shows[show].id]);

            if (resultAwardShow.rows[0].count === '0') {
                await pool.query('INSERT INTO award_show (award_id, show_id, won) VALUES ($1, $2, $3)', [awards[awardLabel].id, shows[show].id, won]);
            }
        } else {
            const resultActor = await pool.query('SELECT id FROM actor WHERE name = $1', [nominee]);

            if (actors[nominee] === undefined && resultActor.rows.length === 0) {
                const insertQuery = await pool.query('INSERT INTO actor (name) VALUES ($1) RETURNING id', [nominee]);
                actors[nominee] = {id: insertQuery.rows[0].id};
            } else {
                actors[nominee] = {id: resultActor.rows[0].id};
            }

            const resultAwardActor = await pool.query('SELECT COUNT(*) FROM award_actor WHERE award_id = $1 AND actor_id = $2 AND show_id = $3', [awards[awardLabel].id, actors[nominee].id, shows[show].id]);

            if (resultAwardActor.rows[0].count === '0') {
                await pool.query('INSERT INTO award_actor (award_id, actor_id, won, show_id) VALUES ($1, $2, $3, $4)', [awards[awardLabel].id, actors[nominee].id, won, shows[show].id]);
            }
        }
    }

    res.jsonBody = {message: "Success"};
    res.statusCode = 200;
}

export const exportDatasetActorsDb = async (req, res) => {
    const data = ["year,category,full_name,show,won"];

    function escape(str) {
        let addSurroundingQuotes = false;

        if (str.includes(',') || str.includes('"')) {
            addSurroundingQuotes = true;
        }

        if (str.includes('"')) {
            str = str.replace(/"/g, '""');
        }

        if (addSurroundingQuotes) {
            str = `"${str}"`;
        }

        return str;
    }

    const actorsAwards = await pool.query('SELECT award.year "year", award.name "category", actor.name "fullName", show.name "show", award_actor.won "won" FROM actor JOIN award_actor ON actor.id = award_actor.actor_id JOIN award ON award_actor.award_id = award.id JOIN show ON award_actor.show_id = show.id');
    actorsAwards.rows.forEach((row) => {
        row.year = escape(row.year);
        row.category = escape(row.category);
        row.fullName = escape(row.fullName);
        row.show = escape(row.show);

        data.push(`${row.year},${row.category},${row.fullName},${row.show},${row.won === true ? 'True' : 'False'}`);
    })

    const showsAwards = await pool.query('SELECT award.year "year", award.name "category", \'\' "fullName", show.name "show", award_show.won "won" FROM show JOIN award_show ON show.id = award_show.show_id JOIN award ON award_show.award_id = award.id');
    showsAwards.rows.forEach((row) => {
        row.year = escape(row.year);
        row.category = escape(row.category);
        row.fullName = escape(row.fullName);
        row.show = escape(row.show);

        data.push(`${row.year},${row.category},${row.fullName},${row.show},${row.won === true ? 'True' : 'False'}`);
    })

    res.sent = true;
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(data.join('\n'));
}
