const fs = require('fs');

function requestHandler(req, res) {
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('formValues.txt', 'utf8', (err, data) => {
            const savedValues = err ? '' : data;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <form action="/submit" method="POST">
                    <label>Name:</label>
                    <input type="text" name="username" required>
                    <button type="submit">Submit</button>
                    <p>${savedValues}</p>
                </form>
            `);
        });
    }
    else if (req.url === '/submit' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const username = formData.get('username') || '';

            fs.appendFile('formValues.txt', `${username}\n`, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error writing to file');
                    return;
                }

                res.writeHead(302, { Location: '/' });
                res.end();
            });
        });
    }
    else {
        res.writeHead(404);
        res.end('Page not found');
    }
}

const anotherFunction = () => {
    console.log("This is another function");
};

module.exports = {
    handler: requestHandler,
    testFunction: anotherFunction
};