function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Builds the sidebar links. The current page gets the "active" class.
function navLinks(title, user) {
  function link(href, label, name) {
    const active = title === name ? ' class="active"' : "";
    return `<a href="${href}"${active}>${label}</a>`;
  }

  if (user) {
    return `${link("/", "Home", "Home")}
        ${link("/about", "About", "About")}
        ${link("/dashboard", "Dashboard", "Dashboard")}
        <a href="/logout" class="nav-button">Log out</a>`;
  }

  return `${link("/", "Home", "Home")}
        ${link("/about", "About", "About")}
        <a href="/login" class="nav-button">Log in</a>`;
}

function layout(title, content, user) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Central City Library</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <a href="/" class="brand">
        <span class="brand-mark">CCL</span>
        <span class="brand-name">Central City Library</span>
      </a>
      <nav class="nav">
        ${navLinks(title, user)}
      </nav>
      <p class="sidebar-note">Open Monday to Saturday<br>9:00 AM to 7:00 PM</p>
    </aside>

    <div class="main-area">
      <main class="content">
        ${content}
      </main>
      <footer class="site-footer">
        <span>Central City Library Membership Portal</span>
        <span>Open Monday to Saturday, 9:00 AM to 7:00 PM</span>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

function homePage(user) {
  const buttons = user
    ? `<a class="button" href="/dashboard">Go to dashboard</a>
          <a class="button outline" href="/about">About the library</a>`
    : `<a class="button" href="/login">Member login</a>
          <a class="button outline" href="/about">About the library</a>`;

  const cardName = user ? escapeHtml(user.name) : "Your name here";
  const cardId = user ? escapeHtml(user.username) : "Log in to see it";
  const cardCount = user ? String(user.books.length) : "-";

  const content = `
    <section class="intro">
      <div>
        <h1>Your library, open anytime</h1>
        <p class="lead">Log in to see your borrowed books, due dates and member details in one place.</p>
        <div class="actions">
          ${buttons}
        </div>
      </div>

      <div class="member-card" aria-label="Sample member card">
        <p class="card-label">Library member card</p>
        <p class="card-name">${cardName}</p>
        <dl class="card-rows">
          <div class="card-row"><dt>Member ID</dt><dd>${cardId}</dd></div>
          <div class="card-row"><dt>Books out</dt><dd>${cardCount}</dd></div>
        </dl>
      </div>
    </section>

    <section class="points">
      <div class="point">
        <h3>Borrow and track</h3>
        <p>Keep an eye on every book you have and when it is due back.</p>
      </div>
      <div class="point">
        <h3>Secure access</h3>
        <p>Your account is protected by a login session that ends when you log out.</p>
      </div>
      <div class="point">
        <h3>For students and staff</h3>
        <p>One portal for every registered member of the college community.</p>
      </div>
    </section>`;

  return layout("Home", content, user);
}

function aboutPage(user) {
  const content = `
    <section class="page-head">
      <h1>About the library</h1>
      <p class="lead">Serving students and staff with books, journals and digital resources.</p>
    </section>

    <section class="facts">
      <div class="fact">
        <span class="fact-number">50,000+</span>
        <span class="fact-label">Books and journals</span>
      </div>
      <div class="fact">
        <span class="fact-number">6 days</span>
        <span class="fact-label">Open every week</span>
      </div>
      <div class="fact">
        <span class="fact-number">9 AM - 7 PM</span>
        <span class="fact-label">Opening hours</span>
      </div>
    </section>

    <section class="panel">
      <h2>Our mission</h2>
      <p>We make reading, research and study easy for every member, with friendly staff and a quiet space to learn.</p>
    </section>`;

  return layout("About", content, user);
}

function loginPage(message, error, username) {
  const notice = message ? `<p class="notice">${escapeHtml(message)}</p>` : "";
  const failure = error ? `<p class="error">${escapeHtml(error)}</p>` : "";

  const content = `
    <section class="login-panel">
      <h1>Member login</h1>
      <p class="muted">Sign in to open your dashboard.</p>
      ${notice}
      ${failure}
      <form method="post" action="/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" value="${escapeHtml(username || "")}" required autofocus>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <button type="submit" class="button full">Log in</button>
      </form>
    </section>`;

  return layout("Login", content, null);
}

function dashboardPage(user, books, visits, loginTime) {
  const slips = books.length
    ? books
        .map(function (book) {
          return `
        <li class="slip">
          <span class="slip-title">${escapeHtml(book.title)}</span>
          <span class="slip-due">Due ${escapeHtml(book.due)}</span>
        </li>`;
        })
        .join("")
    : `<li class="slip"><span class="slip-title">You have no borrowed books.</span></li>`;

  const content = `
    <section class="page-head">
      <h1>Welcome, ${escapeHtml(user.name)}</h1>
      <p class="lead">Here is a summary of your membership.</p>
    </section>

    <section class="dash-top">
      <div class="member-card">
        <p class="card-label">Library member card</p>
        <p class="card-name">${escapeHtml(user.name)}</p>
        <dl class="card-rows">
          <div class="card-row"><dt>Logged in as</dt><dd>${escapeHtml(user.username)}</dd></div>
          <div class="card-row"><dt>Logged in at</dt><dd>${escapeHtml(loginTime)}</dd></div>
        </dl>
      </div>

      <div class="figures">
        <div class="figure">
          <span class="figure-number">${books.length}</span>
          <span class="figure-label">Books borrowed</span>
        </div>
        <div class="figure">
          <span class="figure-number">${visits}</span>
          <span class="figure-label">Dashboard visits this session</span>
        </div>
      </div>
    </section>

    <section class="books">
      <h2>Your borrowed books</h2>
      <ul class="slips">${slips}
      </ul>
    </section>`;

  return layout("Dashboard", content, user);
}

function notFoundPage(user) {
  const content = `
    <section class="page-head">
      <h1>Page not found</h1>
      <p class="lead">The page you requested does not exist.</p>
      <div class="actions">
        <a class="button" href="/">Back to home</a>
      </div>
    </section>`;

  return layout("Page not found", content, user);
}

module.exports = {
  homePage,
  aboutPage,
  loginPage,
  dashboardPage,
  notFoundPage
};