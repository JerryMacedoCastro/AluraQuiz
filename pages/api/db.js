import data from '../../db.json';

const getData = (request, response) => {
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS, PATCH, DELETE, POST, PUT'
  );
  return response.json(data);
};

export default getData;
