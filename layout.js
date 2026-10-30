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
        <a href="/logout">Logout</a>`
    : `<a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/login">Login</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Central City Library</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="top-bar">
    <a href="/" class="brand">Central City Library</a>
    <nav>
      ${links}
    </nav>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>Central City Library Membership Portal</p>
  </footer>
</body>
</html>`;
}

function homePage(user) {
  const action = user
    ? `<a class="button" href="/dashboard">Go to your dashboard</a>`
    : `<a class="button" href="/login">Member login</a>`;

  const content = `
    <section class="card">
      <h1>Welcome to Central City Library</h1>
      <p>Browse our membership services online. Registered students and staff can log in to view their borrowed books and library resources.</p>
      <p>${action}</p>
    </section>`;

  return layout("Home", content, user);
}

function aboutPage(user) {
  const content = `
    <section class="card">
      <h1>About the library</h1>
      <p>Central City Library serves students and staff with more than 50,000 books, journals and digital resources.</p>
      <p>Opening hours: Monday to Saturday, 9:00 AM to 7:00 PM.</p>
    </section>`;

  return layout("About", content, user);
}

function loginPage(message, error, username) {
  const notice = message ? `<p class="notice">${escapeHtml(message)}</p>` : "";
  const failure = error ? `<p class="error">${escapeHtml(error)}</p>` : "";

  const content = `
    <section class="card narrow">
      <h1>Member login</h1>
      ${notice}
      ${failure}
      <form method="post" action="/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" value="${escapeHtml(username || "")}" required autofocus>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <button type="submit">Log in</button>
      </form>
      <p class="hint">Demo accounts: student / library123 and staff / staff456</p>
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
    <section class="card">
      <h1>Welcome, ${escapeHtml(user.name)}</h1>
      <p>Role: <strong>${escapeHtml(user.role)}</strong></p>
      <p>Logged in at: ${escapeHtml(loginTime)}</p>
      <p>Dashboard visits this session: <strong>${visits}</strong></p>
    </section>
    <section class="card">
      <h2>Your borrowed books</h2>
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
    </section>`;

  return layout("Dashboard", content, user);
}

function notFoundPage(user) {
  const content = `
    <section class="card">
      <h1>404 - Page not found</h1>
      <p>The page you requested does not exist.</p>
      <p><a class="button" href="/">Back to home</a></p>
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