function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title, content, user) {
  const links = user
    ? `<a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/logout" class="nav-button">Logout</a>`
    : `<a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/login" class="nav-button">Login</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Central City Library</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand">
        <span class="brand-mark">CCL</span>
        <span>Central City Library</span>
      </a>
      <nav>
        ${links}
      </nav>
    </div>
  </header>
  <main class="container">
    ${content}
  </main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>Central City Library Membership Portal</p>
      <p>Open Monday to Saturday, 9:00 AM to 7:00 PM</p>
    </div>
  </footer>
</body>
</html>`;
}

function homePage(user) {
  const buttons = user
    ? `<a class="button" href="/dashboard">Go to dashboard</a>
        <a class="button outline" href="/about">About the library</a>`
    : `<a class="button" href="/login">Member login</a>
        <a class="button outline" href="/about">About the library</a>`;

  const content = `
    <section class="hero">
      <p class="eyebrow">Membership portal</p>
      <h1>Your library, open anytime</h1>
      <p class="lead">Log in to see your borrowed books, due dates and member details in one place.</p>
      <div class="hero-actions">
        ${buttons}
      </div>
    </section>
    <section class="feature-grid">
      <article class="feature">
        <h3>Borrow and track</h3>
        <p>Keep an eye on every book you have and when it is due back.</p>
      </article>
      <article class="feature">
        <h3>Secure access</h3>
        <p>Your account is protected by a login session that ends when you log out.</p>
      </article>
      <article class="feature">
        <h3>For students and staff</h3>
        <p>One portal for every registered member of the college community.</p>
      </article>
    </section>`;

  return layout("Home", content, user);
}

function aboutPage(user) {
  const content = `
    <section class="page-title">
      <h1>About the library</h1>
      <p class="lead">Serving students and staff with books, journals and digital resources.</p>
    </section>
    <section class="stat-grid">
      <div class="stat">
        <span class="stat-number">50,000+</span>
        <span class="stat-label">Books and journals</span>
      </div>
      <div class="stat">
        <span class="stat-number">6 days</span>
        <span class="stat-label">Open every week</span>
      </div>
      <div class="stat">
        <span class="stat-number">9 AM - 7 PM</span>
        <span class="stat-label">Opening hours</span>
      </div>
    </section>
    <section class="card">
      <h2>Our mission</h2>
      <p>We make reading, research and study easy for every member, with friendly staff and a quiet space to learn.</p>
    </section>`;

  return layout("About", content, user);
}

function loginPage(message, error, username) {
  const notice = message ? `<p class="notice">${escapeHtml(message)}</p>` : "";
  const failure = error ? `<p class="error">${escapeHtml(error)}</p>` : "";

  const content = `
    <section class="login-wrap">
      <div class="login-card">
        <h1>Member login</h1>
        <p class="muted">Sign in to open your dashboard.</p>
        ${notice}
        ${failure}
        <form method="post" action="/login">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" value="${escapeHtml(username || "")}" required autofocus>

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>

          <button type="submit" class="full">Log in</button>
        </form>
        <div class="demo-box">
          <strong>Demo account</strong>
          <span>Username: student</span>
          <span>Password: library123</span>
        </div>
      </div>
    </section>`;

  return layout("Login", content, null);
}

function dashboardPage(user, books, visits, loginTime) {
  const rows = books
    .map(function (book) {
      return `
          <tr>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.due)}</td>
          </tr>`;
    })
    .join("");

  const content = `
    <section class="page-title">
      <h1>Welcome, ${escapeHtml(user.name)}</h1>
      <p class="lead">Here is a summary of your membership.</p>
    </section>
    <section class="stat-grid">
      <div class="stat">
        <span class="stat-number">${escapeHtml(user.username)}</span>
        <span class="stat-label">Logged in as</span>
      </div>
      <div class="stat">
        <span class="stat-number">${books.length}</span>
        <span class="stat-label">Books borrowed</span>
      </div>
      <div class="stat">
        <span class="stat-number">${visits}</span>
        <span class="stat-label">Dashboard visits this session</span>
      </div>
    </section>
    <section class="card">
      <h2>Your borrowed books</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
      <p class="muted small">Logged in at ${escapeHtml(loginTime)}</p>
    </section>`;

  return layout("Dashboard", content, user);
}

function notFoundPage(user) {
  const content = `
    <section class="hero">
      <p class="eyebrow">Error 404</p>
      <h1>Page not found</h1>
      <p class="lead">The page you requested does not exist.</p>
      <div class="hero-actions">
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