if (dtCurrent >= dtExpires) {
  console.log('Token expired');

  // Check if the token is expired. If expired it is refreshed.
  token = oauth2.accessToken.create(request.session.ticket);
  token.refresh(function (error, ticket) {
      saveTicket(request, ticket.token);
      return callback(!error);
  });
