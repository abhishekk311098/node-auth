document.addEventListener("DOMContentLoaded", function () {
  // Authentication Endpoints
  addEndpoint(
    "authentication-section",
    "Register User",
    "Register a new user.",
    "POST /api/v1/auth/register",
    [
      "username (string)",
      "email (string)",
      "password (string)",
      "confirmPassword (string)",
    ],
    ["201: User registered successfully", "400: Bad request"]
  );
  addEndpoint(
    "authentication-section",
    "Login",
    "Login with username and password.",
    "POST /api/v1/auth/login",
    ["userName (string)", "password (string)"],
    ["200: Login successful", "401: Unauthorized"]
  );
  addEndpoint(
    "authentication-section",
    "Logout",
    "Logout the authenticated user.",
    "POST /api/v1/auth/logout",
    [],
    ["200: Logout successful"]
  );
  addEndpoint(
    "authentication-section",
    "Forgot Password",
    "Request to reset password.",
    "POST /api/v1/auth/forgot-password",
    ["email (string)"],
    ["200: Password reset request successful", "400: Bad request"]
  );
  addEndpoint(
    "authentication-section",
    "Reset Password",
    "Reset password with a token.",
    "POST /api/v1/auth/reset-password",
    ["token (string)", "password (string)","confirmPassword (string)"],
    ["200: Password reset successful", "400: Bad request"]
  );
  addEndpoint(
    "authentication-section",
    "Update Password",
    "Update user's password.",
    "POST /api/v1/auth/update-password",
    ["currentPassword (string)", "password (string)","confirmPassword (string)"],
    ["200: Password update successful", "401: Unauthorized"]
  );

  // Users Endpoints
  addEndpoint(
    "users-section",
    "Update User Details",
    "Update user details.",
    "Patch api/v1/users/",
    [
      "firstName (string)",
      "lastName (string)",
    ],
    ["200: User details updated successfully", "401: Unauthorized"]
  );

  // Students Endpoints
  addEndpoint(
    "students-section",
    "Add Student",
    "Add a new student.",
    "POST api/v1/students",
    [
      "firstName (string)",
      "lastName (string)",
      "userName (string)",
      "email (string)",
      "skills [string]",
      "courses [string]",
    ],
    ["200: Student added successfully", "400: Bad request"]
  );
  addEndpoint(
    "students-section",
    "Delete Student by ID",
    "Delete a student by ID.",
    "DELETE api/v1/students/:id",
    ["id (string)"],
    ["200: Student deleted successfully", "404: Student not found"]
  );
  addEndpoint(
    "students-section",
    "Get All Students",
    "Get a list of all students.",
    "GET api/v1/students",
    [],
    ["200: List of all students"]
  );
});

function addEndpoint(
  sectionId,
  title,
  description,
  url,
  parameters,
  responses
) {
  let section = document.getElementById(sectionId);

  let endpoint = document.createElement("div");
  endpoint.classList.add("endpoint");

  let endpointTitle = document.createElement("div");
  endpointTitle.classList.add("endpoint-title");
  endpointTitle.innerText = title;

  let endpointDescription = document.createElement("div");
  endpointDescription.classList.add("endpoint-description");
  endpointDescription.innerText = description;

  let endpointUrl = document.createElement("div");
  endpointUrl.classList.add("endpoint-url");
  endpointUrl.innerText = url;

  let parametersTitle = document.createElement("div");
  parametersTitle.classList.add("parameters-title");
  parametersTitle.innerText = "Parameters:";

  let responsesTitle = document.createElement("div");
  responsesTitle.classList.add("responses-title");
  responsesTitle.innerText = "Responses:";

  endpoint.appendChild(endpointTitle);
  endpoint.appendChild(endpointDescription);
  endpoint.appendChild(endpointUrl);
  endpoint.appendChild(parametersTitle);

  parameters.forEach(function (parameter) {
    let parameterElement = document.createElement("div");
    parameterElement.classList.add("parameter");
    parameterElement.innerText = "- " + parameter;
    endpoint.appendChild(parameterElement);
  });

  endpoint.appendChild(responsesTitle);

  responses.forEach(function (response) {
    let responseElement = document.createElement("div");
    responseElement.classList.add("response");
    responseElement.innerText = "- " + response;
    endpoint.appendChild(responseElement);
  });

  section.appendChild(endpoint);
}
