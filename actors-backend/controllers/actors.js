// dummy, de luat din database
const actors = [
    {id: 1, name: 'Robert Downey Jr.', age: 56, movies: ['Iron Man', 'Sherlock Holmes']},
    {id: 2, name: 'Chris Hemsworth', age: 38, movies: ['Thor', 'Extraction']}
];

export const getActors = async (req, res) => {
    res.jsonBody = {actors};
    res.statusCode = 200;
}