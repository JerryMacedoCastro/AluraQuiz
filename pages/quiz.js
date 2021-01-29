/* eslint-disable react/prop-types */
import React from 'react';

import db from '../db.json';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>
      <Widget.Content>[Desafio do Loading]</Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestions, questionIndex, onSubmit }) {
  const questionId = `question_${questionIndex}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <form onSubmit={handleSubmit}>
          {question.alternatives.map((item, index) => {
            const alternativeId = `alternative_${index}`;
            return (
              <Widget.Topic as="label" htmlFor={alternativeId} key={item}>
                <input id={alternativeId} name={questionId} type="radio" />
                {item}
              </Widget.Topic>
            );
          })}
          <Button type="submit">Confirmar</Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  const handleSubmitQuiz = () => {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < db.questions.length) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  };

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            onSubmit={handleSubmitQuiz}
            question={question}
            totalQuestions={db.questions.length}
            questionIndex={questionIndex}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && (
          <div>Você acertou x questões</div>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
