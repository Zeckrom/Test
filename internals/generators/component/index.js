/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const { lstatSync, readdirSync } = require('fs')
const { join, sep } = require('path')
const componentExists = require('../utils/componentExists');
const pagesPath = 'app/pages'
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);
const getDirectoriesName = dirs => dirs.map(dir => dir.split(sep).pop());
const Pages = getDirectoriesName(getDirectories(`./${pagesPath}`)).sort();
const SHARED = 'Shared';
Pages.unshift(SHARED);

module.exports = {
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'rawlist',
      name: 'page',
      choices: Pages,
      default: Pages.length > 0 ? Pages[0] : '',
      message: 'In wich pagesdo you wanna put this component',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const actions = [];
    if (data.page === SHARED) {
      actions.push(
        {
          type: 'add',
          path: '../../app/shared/components/{{properCase name}}/index.js',
          templateFile: './component/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/shared/components/{{properCase name}}/{{properCase name}}.jsx',
          templateFile: './component/comoponents.jsx.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/shared/components/{{properCase name}}/tests/index.test.js',
          templateFile: './component/test.js.hbs',
          abortOnFail: true,
        },
      )

      // Styles
      actions.push({
        type: 'add',
        path: '../../app/shared/components/{{properCase name}}/{{dashCase name}}.scss',
        templateFile: './container/styles.scss.hbs',
        abortOnFail: true,
      });
      // If the user wants i18n messages
      if (data.wantMessages) {
        actions.push({
          type: 'add',
          path: '../../app/shared/components/{{properCase name}}/messages.js',
          templateFile: './component/messages.js.hbs',
          abortOnFail: true,
        });
      }

      // If the user wants Loadable.js to load the component asynchronously
      if (data.wantLoadable) {
        actions.push({
          type: 'add',
          path: '../../app/shared/components/{{properCase name}}/Loadable.js',
          templateFile: './component/loadable.js.hbs',
          abortOnFail: true,
        });
      }
    } else {
      actions.push(
        {
          type: 'add',
          path: '../../app/pages/{{page}}/{{properCase name}}/index.js',
          templateFile: './component/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/pages/{{page}}/{{properCase name}}/{{properCase name}}.jsx',
          templateFile: './component/comoponents.jsx.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/pages/{{page}}/{{properCase name}}/tests/index.test.js',
          templateFile: './component/test.js.hbs',
          abortOnFail: true,
        },
      )
      actions.push({
        type: 'add',
        path: '../../app/pages/{{page}}/{{properCase name}}/{{dashCase name}}.scss',
        templateFile: './container/styles.scss.hbs',
        abortOnFail: true,
      });
      // If the user wants i18n messages
      if (data.wantMessages) {
        actions.push({
          type: 'add',
          path: '../../app/pages/{{page}}/{{properCase name}}/messages.js',
          templateFile: './component/messages.js.hbs',
          abortOnFail: true,
        });
      }

      // If the user wants Loadable.js to load the component asynchronously
      if (data.wantLoadable) {
        actions.push({
          type: 'add',
          path: '../../app/pages/{{page}}/{{properCase name}}/Loadable.js',
          templateFile: './component/loadable.js.hbs',
          abortOnFail: true,
        });
      }
    }



    if (data.page === SHARED) {
      actions.push({
        type: 'prettify',
        path: '/shared/components/',
      });
    } else {
      actions.push({
        type: 'prettify',
        path: `/pages/${data.page}`,
      });
    }
    return actions;
  },
};
