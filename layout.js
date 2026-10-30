function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function navLink(href, label, key, active) {
  const current = key === active ? ' class="active"' : "";
  return `<a href="${href}"${current}>${label}</a>`;
}

function layout(title, content, user, active) {
  const links = [
    navLink("/", "Home", "home", active),
    navLink("/about", "About", "about", active)
  ];

  if (user) {
    links.push(navLink("/dashboard", "Dashboard", "dashboard", active));
    links.push('<a href="/logout" class="nav-button">Logout</a>');
  } else {
    links.push('<a href="/login" class="nav-button">Login</a>');
  }

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
        <span class="brand-icon">&#128214;</span>
        <span>Central City Library</span>
      </a>
      <nav class="site-nav">
        ${links.join("\n        ")}
      </nav>
    </div>
  </header>
  ${content}
  <footer class="site-footer">
    <div class="container">
      <p>Central City Library Membership Portal</p>
      <p class="footer-note">Open Monday to Saturday, 9:00 AM to 7:00 PM</p>
    </div>
  </footer>
</body>
</html>`;
}

function homePage(user) {
  const buttons = user
    ? '<a class="button button-gold" href="/dashboard">Go to your dashboard</a>'
    : `<a class="button button-gold" href="/login">Member login</a>
        <a class="button button-outline" href="/about">Learn more</a>`;

  const content = `
  <section class="hero">
    <div class="container">
      <p class="eyebrow">Membership portal</p>
      <h1>Your library, always open</h1>
      <p class="lead">Log in to see your borrowed books, due dates and member services, anytime and from any device.</p>
      <div class="hero-actions">
        ${buttons}
      </div>
    </div>
  </section>
  <main class="container">
    <h2 class="section-title">What you can do</h2>
    <div class="feature-grid">
      <article class="feature">
        <span class="feature-icon">&#128218;</span>
        <h3>Borrow books</h3>
        <p>Track every book you have borrowed and never miss a due date.</p>
      </article>
      <article class="feature">
        <span class="feature-icon">&#128187;</span>
        <h3>Digital resources</h3>
        <p>Access journals, e-books and research material from anywhere.</p>
      </article>
      <article class="feature">
        <span class="feature-icon">&#129681;</span>
        <h3>Study spaces</h3>
        <p>Quiet reading halls and group rooms are open to all members.</p>
      </article>
    </div>
  </main>`;

  return layout("Home", content, user, "home");
}

function aboutPage(user) {
  const content = `
  <section class="page-banner">
    <div class="container">
      <h1>About the library</h1>
      <p class="lead">Serving students and staff with knowledge since 1985.</p>
    </div>
  </section>
  <main class="container">
    <div class="two-column">
      <section class="panel">
        <h2>Our collection</h2>
        <p>Central City Library holds more than 50,000 books, journals and digital resources across every department.</p>
        <p>Members can borrow up to five books at a time, and loans can be tracked online from the dashboard.</p>
      </section>
      <section class="panel">
        <h2>Opening hours</h2>
        <ul class="info-list">
          <li><span>Monday to Friday</span><strong>9:00 AM - 7:00 PM</strong></li>
          <li><span>Saturday</span><strong>9:00 AM - 5:00 PM</strong></li>
          <li><span>Sunday</span><strong>Closed</strong></li>
        </ul>
      </section>
    </div>
  </main>`;

  return layout("About", content, user, "about");
}

function loginPage(message, error, username) {
  const notice = message ? `<p class="alert alert-info">${escapeHtml(message)}</p>` : "";
  const failure = error ? `<p class="alert alert-error">${escapeHtml(error)}</p>` : "";

  const content = `
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-icon">&#128273;</div>
      <h1>Member login</h1>
      <p class="muted">Sign in to view your library account.</p>
      ${notice}
      ${failure}
      <form method="post" action="/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" value="${escapeHtml(username || "")}" required autofocus>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <button type="submit" class="button button-primary button-full">Log in</button>
      </form>
      <div class="demo-box">
        <strong>Demo accounts</strong>
        <p>student / library123</p>
        <p>staff / staff456</p>
      </div>
    </section>
  </main>`;

  return layout("Login", content, null, "login");
}

function dashboardPage(user, books, visits, loginTime) {
  const rows = books
    .map(function (book) {
      return `
          <tr>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.due)}</td>
            <td><span class="badge">On loan</span></td>
          </tr>`;
    })
    .join("");

  const content = `
  <section class="page-banner">
    <div class="container banner-row">
      <div>
        <h1>Welcome, ${escapeHtml(user.name)}</h1>
        <p class="lead">Here is a summary of your library account.</p>
      </div>
      <span class="role-badge">${escapeHtml(user.role)}</span>
    </div>
  </section>
  <main class="container">
    <div class="stat-grid">
      <div class="stat">
        <span class="stat-number">${books.length}</span>
        <span class="stat-label">Books borrowed</span>
      </div>
      <div class="stat">
        <span class="stat-number">${visits}</span>
        <span class="stat-label">Dashboard visits this session</span>
      </div>
      <div class="stat">
        <span class="stat-text">${escapeHtml(loginTime)}</span>
        <span class="stat-label">Logged in at</span>
      </div>
    </div>
    <section class="panel">
      <h2>Your borrowed books</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>
    </section>
  </main>`;

  return layout("Dashboard", content, user, "dashboard");
}

function notFoundPage(user) {
  const content = `
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-icon">&#128269;</div>
      <h1>Page not found</h1>
      <p class="muted">The page you requested does not exist.</p>
      <a class="button button-primary" href="/">Back to home</a>
    </section>
  </main>`;

  return layout("Page not found", content, user, "");
}

module.exports = {
  homePage,
  aboutPage,
  loginPage,
  dashboardPage,
  notFoundPage
};