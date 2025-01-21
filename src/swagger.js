const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'FocusTime',
    description: 'API Documentation for FocusTime Aplication',
  },
  baseDir: __dirname,
  filesPattern: './routes/*.js',
  swaggerUIPath: '/',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};

const setupSwagger = (app) => {
  expressJSDocSwagger(app)(options);
};

module.exports = setupSwagger;