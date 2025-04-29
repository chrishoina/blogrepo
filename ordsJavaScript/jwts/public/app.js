const loginButton = document.getElementById('login');
const output = document.getElementById('output');

// Load safe config from backend
const { clientId, tenantUrl } = await fetch('/config').then(r => r.json());
const authorizationEndpoint = `${tenantUrl}/oauth2/v1/authorize`;
const redirectUri = window.location.origin + '/callback';
const scope = 'audience01iam_groups';

loginButton.addEventListener('click', () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope
  });

  window.location = `${authorizationEndpoint}?${params.toString()}`;
});

// Handle redirect from Oracle IAM
(async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return;

  const response = await fetch('/exchange_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const tokenData = await response.json();

  if (tokenData.error) {
    output.textContent = "Token exchange error:\n" + JSON.stringify(tokenData, null, 2);
    return;
  }

  const accessToken = tokenData.access_token;

  const userInfo = await fetch('/user_info', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(r => r.json());

  output.textContent = JSON.stringify(userInfo.data, null, 2);
  window.history.replaceState({}, document.title, "/");
})();
