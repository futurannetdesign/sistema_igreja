class Auth {
  constructor() {
    this.baseURL = "http://localhost:3000/api";
    this.init();
  }

  init() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos");
      }

      if (!email.includes("@")) {
        throw new Error("Por favor, insira um email válido");
      }

      const response = await this.login(email, password);
      if (response.success) {
        this.setUserSession(response.data);
        this.redirectBasedOnRole(response.data.role);
      }
    } catch (error) {
      this.showError(
        error.message || "Erro ao fazer login. Verifique suas credenciais."
      );
    }
  }

  async login(email, password) {
    // Temporary admin credentials (REMOVE IN PRODUCTION)
    const defaultUsers = {
      "admin@igreja.com": {
        password: "Admin123",
        role: "admin",
        name: "Administrador",
      },
      "secretaria@igreja.com": {
        password: "Secretaria123",
        role: "secretary",
        name: "Secretária",
      },
      "pastor@igreja.com": {
        password: "Pastor123",
        role: "pastor",
        name: "Pastor",
      },
    };

    // Simulate API call
    return new Promise((resolve, reject) => {
      const user = defaultUsers[email];

      if (user && user.password === password) {
        resolve({
          success: true,
          data: {
            email: email,
            role: user.role,
            name: user.name,
            token: "dummy-token-" + user.role,
          },
        });
      } else {
        reject(
          new Error(
            "Email ou senha incorretos. Tente:\n\nAdmin:\nadmin@igreja.com / Admin123\n\nSecretária:\nsecretaria@igreja.com / Secretaria123\n\nPastor:\npastor@igreja.com / Pastor123"
          )
        );
      }
    });
  }

  redirectBasedOnRole(role) {
    const routes = {
      admin: "/pages/admin/admin.html",
      secretary: "/pages/secretary/secretary.html",
      pastor: "/pages/pastor/pastor.html",
    };

    window.location.href = routes[role] || "/";
  }

  setUserSession(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  }

  showError(message) {
    // Remove existing error message if any
    const existingError = document.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and show new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;

    const loginBox = document.querySelector(".login-box");
    loginBox.insertBefore(errorDiv, loginBox.firstChild);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorDiv.classList.add("fade-out");
      setTimeout(() => errorDiv.remove(), 500);
    }, 5000);
  }

  checkPermission(requiredRole) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const roleHierarchy = {
      admin: 3,
      pastor: 2,
      secretary: 1,
    };

    return (
      (roleHierarchy[user.role] || 0) >= (roleHierarchy[requiredRole] || 0)
    );
  }
}

const auth = new Auth();
