import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { parseString } from 'xml2js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/blazegraph-sparql', async (req, res) => {
  const query = req.query.query;
  const blazegraphUrl = 'http://localhost:9999/bigdata/sparql?query=' + encodeURIComponent(query);


  try {
    const response = await fetch(blazegraphUrl);
    console.log("here" + response.status)
    if (!response.ok) {
      console.error('Error fetching data from Blazegraph. Status:', response.status);
      res.status(response.status).send('Error fetching data from Blazegraph');
      return;
    }

    const xmlData = await response.text();
    console.log(xmlData)

    console.log(response)

    // Parse the XML data into JSON
    parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        res.status(500).send('Error parsing XML');
        return;
      }

      res.json(result); // Send the parsed JSON as the response
    });
  } catch (error) {
    console.error('Error fetching data from Blazegraph:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
