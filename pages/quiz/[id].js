/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

const QuizDaGalera = ({ externalDb }) => {
  return (
    <ThemeProvider theme={externalDb.theme}>
      <QuizScreen db={externalDb} />;
    </ThemeProvider>
  );
};

export async function getServerSideProps(context) {
  const [project, user] = context.query.id.split('___');
  const externalDb = await fetch(`https://${project}.${user}.vercel.app/api/db`)
    .then((serverResponse) => {
      if (serverResponse.ok) {
        return serverResponse.json();
      }

      throw new Error('Falha em buscar dados do servidor!');
    })
    .then((serverResponseObject) => {
      return serverResponseObject;
    })
    .catch((err) => {
      console.log(err.message);
    });
  console.log('external db ', externalDb);
  return {
    props: { externalDb },
  };
}

export default QuizDaGalera;
