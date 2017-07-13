function response(statusCode, body) {
  return {
    statusCode: statusCode,
    body: body,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
}

exports.succeed = (context, data) => {
  context.succeed(response(200, JSON.stringify(data)));
};

exports.error = (context, statusCode, errorMessage) => {
  var error = { code: statusCode, message: errorMessage };
  context.succeed(response(statusCode, JSON.stringify({ error: error })));
};
