using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MainWebGame {
    public class WebSocketsMiddleware {
        private readonly RequestDelegate _next;

        public WebSocketsMiddleware (RequestDelegate next) {
            _next = next;
        }

        public async Task Invoke (HttpContext httpContext) {
            var request = httpContext.Request;
            request.Query.TryGetValue ("access_token", out var accessTokens);
            var token = accessTokens.ToString ();
            // web sockets cannot pass headers so we must take the access token from query param and
            // add it to the header before authentication middleware runs
            if (!string.IsNullOrEmpty (token)) {
                request.Headers.Add ("Authorization", $"Bearer {token}");
            }
            await _next (httpContext);
        }
    }
}