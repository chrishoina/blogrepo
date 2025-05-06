const loginButton = document.getElementById('login');

// There are several ways this can be acomplished. The focus shouldn't be on performance, or
// whether this is conformes purely to ESM. 
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

  // The "params" are sent to the IAM /oauth2/v1/authorize endpoint.
  window.location = `${authorizationEndpoint}?${params.toString()}`;
});

// Handling the redirect from Oracle IAM. RECALL, you'll need to set this redirect up in 
// the OAuth Configuration section for your Integrated Application (in IAM).
(async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) return;

  // Using this Authorization code, to retrieve a JWT from IAM.
  const response = await fetch('/exchange_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const tokenData = await response.json();

  if (tokenData.error) {
    console.log("Token exchange error:\n" + tokenData);
  } else {

    // You have the JWT. Next you'll issue a GET requst to the ORDS endpoint.
    const accessToken = tokenData.access_token;

    const ordsInfo = await fetch('/to_ords', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(r => r.json());

    // With the response in hand, do what you like with it. In this case, we've 
    // added some fancy styling to remove the login button, as we display on the screen
    // the results of the GET request.

    const textOnScreen = document.createElement('p');
          textOnScreen.textContent = `${ordsInfo.data}`;

          document.body.appendChild(textOnScreen);

          if (loginButton) {
            loginButton.classList.add('fade-out');
            setTimeout(() => loginButton.remove(), 500);
          }
  
    // output.textContent = JSON.stringify(userInfo.data, null, 2);
    // window.history.replaceState({}, document.title, "/");
  };
})();