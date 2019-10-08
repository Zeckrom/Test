/**
 * Feature Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a fature (reducer, saga ...)',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'User',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A feature with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const actions = [];



    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    // Actions
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{lowerCase name}}/actions.js',
      templateFile: './container/actions.js.hbs',
      abortOnFail: true,
    });
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{lowerCase name}}/tests/actions.test.js',
      templateFile: './container/actions.test.js.hbs',
      abortOnFail: true,
    });

    // Constants
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{lowerCase name}}/constants.js',
      templateFile: './container/constants.js.hbs',
      abortOnFail: true,
    });


    // Selectors
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{lowerCase name}}/selectors.js',
      templateFile: './container/selectors.js.hbs',
      abortOnFail: true,
    });
    actions.push({
      type: 'add',
      path:
        '../../app/shared/redux/{{lowerCase name}}/tests/selectors.test.js',
      templateFile: './container/selectors.test.js.hbs',
      abortOnFail: true,
    });

    // Reducer
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{lowerCase name}}/reducer.js',
      templateFile: './container/reducer.js.hbs',
      abortOnFail: true,
    });
    actions.push({
      type: 'add',
      path: '../../app/shared/redux/{{properCase name}}/tests/reducer.test.js',
      templateFile: './container/reducer.test.js.hbs',
      abortOnFail: true,
    });


    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: '../../app/shared/redux/{{lowerCase name}}/saga.js',
        templateFile: './container/saga.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/shared/redux/{{lowerCase name}}/tests/saga.test.js',
        templateFile: './container/saga.test.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/shared/redux',
    });
    return actions;
  },
};
