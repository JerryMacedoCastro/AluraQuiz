import data from '../../db.json';

const getData = (_request, response) => {
  return response.json(data);
};

export default getData;
