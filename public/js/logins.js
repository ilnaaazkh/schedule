const baseUrl = "/api/auth/login";
$(document).ready(function () {
  $("#login-form").submit(onLogInSubmited);
});

async function onLogInSubmited(e) {
  e.preventDefault();

  const form = $("#login-form");
  const username = form.find("input[name='username']").val();
  const password = form.find("input[name='password']").val();

  const body = { username, password };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    document.cookie = `token=${data.token};path=/;max-age=${24 * 60 * 60}`;
    document.location = "/superadmin";
  } else {
    alert("Login failed");
  }
}
