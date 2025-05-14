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

  // Using this Authorization code, to retrieve a JWT from the IAM /oauth2/v1/token endpoint.
  const response = await fetch('/exchange_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const tokenData = await response.json();

  if (tokenData.error) {
    console.log("Token exchange error:\n" + tokenData);
  } else {

    // A GET request is issued to the ORDS endpoint via the Server.js backend.
    const accessToken = tokenData.access_token;

    const ordsInfo = await fetch('/to_ords', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(r => r.json());

    // With the response in hand, we display on the screen
    // the results of the GET request.

    const dbActual = document.createElement('p');
    const crtUsr = document.createElement('p');
    dbActual.innerHTML = `The current <code>SYSTIMESTAMP</code> for your database server is: <code>${ordsInfo.dbActual}</code>`;
    crtUsr.innerHTML = `You are currently logged in as the following user: <code>${ordsInfo.crtUser}</code>`
    document.body.appendChild(dbActual);
    document.body.appendChild(crtUsr);

      
      if (loginButton) {
        loginButton.classList.add('fade-out');
        setTimeout(() => loginButton.remove(), 500);
      };
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Home';
    backButton.style.color = 'blue'
    backButton.style.marginTop = '1rem';
    backButton.addEventListener('click', () => {
      window.location.href = '/';
    });
    document.body.appendChild(backButton);
    
  };
})();
