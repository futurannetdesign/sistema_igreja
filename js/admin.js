class AdminPanel {
  constructor() {
    this.currentSection = "dashboard";
    this.members = [];
    this.init();
  }

  init() {
    this.checkAdminAuth();
    this.setupEventListeners();
    this.loadDashboard();
  }

  checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      window.location.href = "/";
    }
  }

  setupEventListeners() {
    document
      .getElementById("logout")
      .addEventListener("click", () => this.handleLogout());

    // Menu navigation
    document.querySelectorAll(".menu a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (e.target.id !== "logout") {
          e.preventDefault();
          this.navigateToSection(e.target.getAttribute("href").substring(1));
        }
      });
    });
  }

  navigateToSection(section) {
    this.currentSection = section;
    const content = document.getElementById("dashboard-content");

    switch (section) {
      case "usuarios":
        this.loadUserManagement();
        break;
      case "permissoes":
        this.loadPermissions();
        break;
      case "membros":
        this.loadMembers();
        break;
      case "relatorios":
        this.loadReports();
        break;
      default:
        this.loadDashboard();
    }
  }

  async loadDashboard() {
    // Calcular estatísticas baseadas nos membros existentes
    const totalMembros = this.members.length;

    // Calcular membros novos este mês
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const membrosMes = this.members.filter((member) => {
      if (!member.registrationDate) return false;
      const dataRegistro = new Date(member.registrationDate);
      return (
        dataRegistro.getMonth() === mesAtual &&
        dataRegistro.getFullYear() === anoAtual
      );
    }).length;

    // Calcular total de batismos
    const totalBatismos = this.members.filter(
      (member) => member.baptismDate
    ).length;

    const dashboardContent = document.getElementById("dashboard-content");
    dashboardContent.innerHTML = `
        <h2>Dashboard</h2>
        <div class="stats-container">
            <div class="stat-card">
                <h3>Total de Membros</h3>
                <p class="stat-number">${totalMembros}</p>
            </div>
            <div class="stat-card">
                <h3>Novos este mês</h3>
                <p class="stat-number">${membrosMes}</p>
            </div>
            <div class="stat-card">
                <h3>Batismos</h3>
                <p class="stat-number">${totalBatismos}</p>
            </div>
        </div>
    `;
  }

  loadUserManagement() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
            <h2>Gerenciar Usuários</h2>
            <button class="btn-add" onclick="adminPanel.showAddUserForm()">Adicionar Novo Usuário</button>
            <div class="users-list">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Função</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                    </tbody>
                </table>
            </div>
        `;
    this.loadUsers();
  }

  async loadUsers() {
    const users = await this.getUsers();
    const tbody = document.getElementById("users-table-body");
    tbody.innerHTML = users
      .map(
        (user) => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="adminPanel.editUser('${user.id}')" class="btn-edit">Editar</button>
                    <button onclick="adminPanel.deleteUser('${user.id}')" class="btn-delete">Excluir</button>
                </td>
            </tr>
        `
      )
      .join("");
  }

  async deleteUser(userId) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      // Implementar lógica de exclusão
      alert("Usuário excluído com sucesso!");
      this.loadUsers();
    }
  }

  handleLogout() {
    localStorage.clear();
    window.location.href = "/index.html";
  }

  // Permissões baseadas em função
  static PERMISSIONS = {
    admin: ["read", "write", "delete", "manage_users", "manage_permissions"],
    secretary: ["read", "write"],
    pastor: ["read", "write", "manage_members"],
  };

  checkPermission(action) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userPermissions = AdminPanel.PERMISSIONS[user.role] || [];
    return userPermissions.includes(action);
  }

  showAddUserForm() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Adicionar Novo Usuário</h3>
                <form id="addUserForm">
                    <input type="text" placeholder="Nome" required>
                    <input type="email" placeholder="Email" required>
                    <select required>
                        <option value="">Selecione a função</option>
                        <option value="admin">Administrador</option>
                        <option value="secretary">Secretário(a)</option>
                        <option value="pastor">Pastor</option>
                    </select>
                    <input type="password" placeholder="Senha" required>
                    <button type="submit">Salvar</button>
                    <button type="button" onclick="this.parentElement.parentElement.remove()">Cancelar</button>
                </form>
            </div>
        `;
    document.body.appendChild(modal);
  }

  loadMembers() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
        <h2>Gerenciar Membros</h2>
        <button class="btn-add" onclick="adminPanel.showAddMemberForm()">Adicionar Novo Membro</button>
        <div class="members-list">
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Data Nascimento</th>
                        <th>Data Batismo</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="members-table-body">
                </tbody>
            </table>
        </div>
    `;
    this.loadMembersList();
  }

  showAddMemberForm() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content modal-small">
            <h3>Adicionar Novo Membro</h3>
            <form id="addMemberForm" onsubmit="return adminPanel.handleAddMember(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Foto:</label>
                        <input type="file" name="photo" accept="image/*">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nascimento:</label>
                        <input type="date" name="birthDate" required>
                    </div>
                    <div class="form-group">
                        <label>Batismo:</label>
                        <input type="date" name="baptismDate">
                    </div>
                </div>
                <div class="form-group">
                    <label>WhatsApp:</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-save">Salvar</button>
                    <button type="button" class="btn-cancel" onclick="this.closest('.modal').remove()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
  }

  async handleAddMember(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const memberData = Object.fromEntries(formData);

    // Dados a serem enviados para a API
    const newMember = {
      name: memberData.name,
      birthDate: memberData.birthDate,
      baptismDate: memberData.baptismDate || null,
      phone: memberData.phone,
      photo: "../../assets/avatar-placeholder.png",
    };

    try {
      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      if (!response.ok) throw new Error("Erro ao criar membro");
      alert("Membro adicionado com sucesso!");
      event.target.closest(".modal").remove();
      this.loadMembers();
      this.loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar membro");
    }
  }

  async loadMembersList() {
    const tbody = document.getElementById("members-table-body");
    tbody.innerHTML = this.members
      .map(
        (member) => `
        <tr>
            <td><img src="${member.photo}" alt="${
          member.name
        }" class="member-photo"></td>
            <td>${member.name}</td>
            <td>${this.formatDate(member.birthDate)}</td>
            <td>${this.formatDate(member.baptismDate)}</td>
            <td>${member.phone}</td>
            <td>
                <button onclick="adminPanel.editMember(${
                  member.id
                })" class="btn-edit">Editar</button>
                <button onclick="adminPanel.deleteMember(${
                  member.id
                })" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `
      )
      .join("");
  }

  editMember(memberId) {
    const member = this.getMemberById(memberId);
    if (!member) return;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content modal-small">
            <h3>Editar Membro</h3>
            <form onsubmit="return adminPanel.handleEditMember(event, ${memberId})">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome:</label>
                        <input type="text" name="name" value="${
                          member.name
                        }" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Data de Nascimento:</label>
                        <input type="date" name="birthDate" value="${
                          member.birthDate
                        }" required>
                    </div>
                    <div class="form-group">
                        <label>Data de Batismo:</label>
                        <input type="date" name="baptismDate" value="${
                          member.baptismDate || ""
                        }">
                    </div>
                </div>
                <div class="form-group">
                    <label>WhatsApp:</label>
                    <input type="tel" name="phone" value="${
                      member.phone
                    }" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-save">Atualizar</button>
                    <button type="button" class="btn-cancel" onclick="this.closest('.modal').remove()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
  }

  getMemberById(id) {
    return this.members.find((m) => m.id === parseInt(id)) || null;
  }

  deleteMember(memberId) {
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      const memberIndex = this.members.findIndex((m) => m.id === memberId);
      if (memberIndex !== -1) {
        this.members.splice(memberIndex, 1);
        this.saveMembersStorage(); // Atualiza o localStorage após a exclusão
        alert("Membro excluído com sucesso!");
        this.loadMembers();
      }
    }
  }

  loadReports() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
        <h2>Relatórios</h2>
        <div class="reports-container">
            <div class="report-card">
                <h3>Relatório de Membros</h3>
                <button onclick="adminPanel.generateReport('members')" class="btn-report">Gerar PDF</button>
            </div>
            <div class="report-card">
                <h3>Aniversariantes do Mês</h3>
                <button onclick="adminPanel.generateReport('birthdays')" class="btn-report">Gerar PDF</button>
            </div>
            <div class="report-card">
                <h3>Batismos do Ano</h3>
                <button onclick="adminPanel.generateReport('baptisms')" class="btn-report">Gerar PDF</button>
            </div>
        </div>
    `;
  }

  loadPermissions() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
        <h2>Gerenciar Permissões</h2>
        <div class="permissions-container">
            <div class="role-permissions">
                <h3>Administrador</h3>
                <ul class="permissions-list">
                    <li>
                        <label>
                            <input type="checkbox" checked disabled> Gerenciar Usuários
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" checked disabled> Gerenciar Membros
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" checked disabled> Gerar Relatórios
                        </label>
                    </li>
                </ul>
            </div>
            <div class="role-permissions">
                <h3>Secretário(a)</h3>
                <ul class="permissions-list">
                    <li>
                        <label>
                            <input type="checkbox" onchange="adminPanel.updatePermission('secretary', 'manage_members', this.checked)">
                            Gerenciar Membros
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" onchange="adminPanel.updatePermission('secretary', 'view_reports', this.checked)">
                            Visualizar Relatórios
                        </label>
                    </li>
                </ul>
            </div>
            <div class="role-permissions">
                <h3>Pastor</h3>
                <ul class="permissions-list">
                    <li>
                        <label>
                            <input type="checkbox" onchange="adminPanel.updatePermission('pastor', 'manage_members', this.checked)">
                            Gerenciar Membros
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" onchange="adminPanel.updatePermission('pastor', 'view_reports', this.checked)">
                            Visualizar Relatórios
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    `;
  }

  updatePermission(role, permission, value) {
    // Aqui você implementaria a lógica para salvar as permissões
    alert(
      `Permissão ${permission} ${value ? "concedida" : "removida"} para ${role}`
    );
  }

  formatDate(dateString) {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  generateReport(type) {
    alert(
      `Gerando relatório de ${type}... Esta função será implementada em breve.`
    );
  }

  saveMembersStorage() {
    localStorage.setItem("members", JSON.stringify(this.members));
  }

  async getMembers() {
    try {
      const response = await fetch("http://localhost:3000/api/members");
      if (!response.ok) throw new Error("Erro ao buscar membros");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

const adminPanel = new AdminPanel();
